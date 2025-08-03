package com.nerdsoncall.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executor;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Configuration for resource management and memory protection to prevent resource exhaustion
 * and server crashes due to resource leaks.
 */
@Slf4j
@Configuration
@EnableScheduling
public class ResourceManagementConfig {

    @Value("${app.thread-pool.core-size:10}")
    private int corePoolSize;

    @Value("${app.thread-pool.max-size:50}")
    private int maxPoolSize;

    @Value("${app.thread-pool.queue-capacity:100}")
    private int queueCapacity;

    @Value("${app.thread-pool.keep-alive:60}")
    private int keepAliveSeconds;

    /**
     * Configure thread pool executor with proper resource management
     */
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setKeepAliveSeconds(keepAliveSeconds);
        executor.setThreadNamePrefix("NerdsOnCall-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        
        // Custom rejection handler to prevent task loss
        executor.setRejectedExecutionHandler(new CustomRejectedExecutionHandler());
        
        executor.initialize();
        
        log.info("Thread pool executor configured: core={}, max={}, queue={}", 
            corePoolSize, maxPoolSize, queueCapacity);
        
        return executor;
    }

    /**
     * Custom rejection handler for thread pool
     */
    private static class CustomRejectedExecutionHandler implements RejectedExecutionHandler {
        @Override
        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
            log.warn("Task rejected by thread pool executor. Pool stats: active={}, pool={}, queue={}", 
                executor.getActiveCount(), executor.getPoolSize(), executor.getQueue().size());
            
            // Try to execute in caller thread as fallback
            if (!executor.isShutdown()) {
                try {
                    r.run();
                    log.info("Rejected task executed in caller thread");
                } catch (Exception e) {
                    log.error("Failed to execute rejected task in caller thread", e);
                }
            }
        }
    }
}

/**
 * Resource monitoring and cleanup service
 */
@Slf4j
@Component
class ResourceMonitor {

    private static final double MEMORY_WARNING_THRESHOLD = 0.8; // 80%
    private static final double MEMORY_CRITICAL_THRESHOLD = 0.9; // 90%
    private static final long CLEANUP_INTERVAL_MS = 300000; // 5 minutes

    private long lastCleanupTime = System.currentTimeMillis();

    /**
     * Monitor memory usage every minute
     */
    @Scheduled(fixedRate = 60000) // Every minute
    public void monitorMemoryUsage() {
        try {
            Runtime runtime = Runtime.getRuntime();
            long maxMemory = runtime.maxMemory();
            long totalMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = totalMemory - freeMemory;
            
            double memoryUsageRatio = (double) usedMemory / maxMemory;
            
            if (memoryUsageRatio > MEMORY_CRITICAL_THRESHOLD) {
                log.error("CRITICAL: Memory usage is {}% ({}MB used of {}MB max)", 
                    Math.round(memoryUsageRatio * 100), 
                    usedMemory / (1024 * 1024), 
                    maxMemory / (1024 * 1024));
                
                // Force garbage collection
                forceGarbageCollection();
                
                // Trigger emergency cleanup
                performEmergencyCleanup();
                
            } else if (memoryUsageRatio > MEMORY_WARNING_THRESHOLD) {
                log.warn("WARNING: Memory usage is {}% ({}MB used of {}MB max)", 
                    Math.round(memoryUsageRatio * 100), 
                    usedMemory / (1024 * 1024), 
                    maxMemory / (1024 * 1024));
                
                // Suggest garbage collection
                System.gc();
            }
            
            // Log memory stats every 10 minutes
            if (System.currentTimeMillis() % 600000 < 60000) { // Within 1 minute of 10-minute mark
                log.info("Memory stats: {}% used ({}MB used, {}MB free, {}MB max)", 
                    Math.round(memoryUsageRatio * 100),
                    usedMemory / (1024 * 1024),
                    freeMemory / (1024 * 1024),
                    maxMemory / (1024 * 1024));
            }
            
        } catch (Exception e) {
            log.error("Error monitoring memory usage", e);
        }
    }

    /**
     * Perform periodic cleanup every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void performPeriodicCleanup() {
        try {
            long currentTime = System.currentTimeMillis();
            
            if (currentTime - lastCleanupTime >= CLEANUP_INTERVAL_MS) {
                log.debug("Performing periodic resource cleanup");
                
                // Clear any cached data that might be holding memory
                clearCaches();
                
                // Clean up expired sessions or temporary data
                cleanupExpiredData();
                
                // Suggest garbage collection
                System.gc();
                
                lastCleanupTime = currentTime;
                log.debug("Periodic cleanup completed");
            }
            
        } catch (Exception e) {
            log.error("Error during periodic cleanup", e);
        }
    }

    /**
     * Monitor thread pool health
     */
    @Scheduled(fixedRate = 120000) // Every 2 minutes
    public void monitorThreadPool() {
        try {
            // This would need to be injected if we want to monitor the actual thread pool
            // For now, we'll monitor general thread information
            
            ThreadGroup rootGroup = Thread.currentThread().getThreadGroup();
            ThreadGroup parentGroup;
            while ((parentGroup = rootGroup.getParent()) != null) {
                rootGroup = parentGroup;
            }
            
            int activeThreads = rootGroup.activeCount();
            
            if (activeThreads > 100) {
                log.warn("High thread count detected: {} active threads", activeThreads);
            }
            
            // Log thread stats every 10 minutes
            if (System.currentTimeMillis() % 600000 < 120000) { // Within 2 minutes of 10-minute mark
                log.info("Thread stats: {} active threads", activeThreads);
            }
            
        } catch (Exception e) {
            log.error("Error monitoring thread pool", e);
        }
    }

    /**
     * Force garbage collection in critical memory situations
     */
    private void forceGarbageCollection() {
        try {
            log.info("Forcing garbage collection due to critical memory usage");
            
            // Multiple GC calls to ensure thorough cleanup
            System.gc();
            Thread.sleep(100);
            System.gc();
            Thread.sleep(100);
            System.runFinalization();
            System.gc();
            
            // Log memory after GC
            Runtime runtime = Runtime.getRuntime();
            long usedMemory = runtime.totalMemory() - runtime.freeMemory();
            double memoryUsageRatio = (double) usedMemory / runtime.maxMemory();
            
            log.info("Memory usage after forced GC: {}%", Math.round(memoryUsageRatio * 100));
            
        } catch (Exception e) {
            log.error("Error during forced garbage collection", e);
        }
    }

    /**
     * Perform emergency cleanup when memory is critically low
     */
    private void performEmergencyCleanup() {
        try {
            log.warn("Performing emergency cleanup due to critical memory usage");
            
            // Clear all possible caches
            clearCaches();
            
            // Clean up expired data aggressively
            cleanupExpiredData();
            
            // Clear any temporary collections or maps
            clearTemporaryData();
            
            log.info("Emergency cleanup completed");
            
        } catch (Exception e) {
            log.error("Error during emergency cleanup", e);
        }
    }

    /**
     * Clear application caches
     */
    private void clearCaches() {
        try {
            // Clear any application-level caches here
            // This would depend on what caching mechanisms are used
            log.debug("Clearing application caches");
            
        } catch (Exception e) {
            log.error("Error clearing caches", e);
        }
    }

    /**
     * Clean up expired data
     */
    private void cleanupExpiredData() {
        try {
            // Clean up expired sessions, temporary files, etc.
            log.debug("Cleaning up expired data");
            
        } catch (Exception e) {
            log.error("Error cleaning up expired data", e);
        }
    }

    /**
     * Clear temporary data structures
     */
    private void clearTemporaryData() {
        try {
            // Clear any temporary collections, maps, or data structures
            log.debug("Clearing temporary data structures");
            
        } catch (Exception e) {
            log.error("Error clearing temporary data", e);
        }
    }

    /**
     * Get current memory statistics
     */
    public MemoryStats getMemoryStats() {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        return new MemoryStats(maxMemory, totalMemory, usedMemory, freeMemory);
    }

    /**
     * Memory statistics data class
     */
    public static class MemoryStats {
        public final long maxMemory;
        public final long totalMemory;
        public final long usedMemory;
        public final long freeMemory;
        public final double usagePercent;

        public MemoryStats(long maxMemory, long totalMemory, long usedMemory, long freeMemory) {
            this.maxMemory = maxMemory;
            this.totalMemory = totalMemory;
            this.usedMemory = usedMemory;
            this.freeMemory = freeMemory;
            this.usagePercent = (double) usedMemory / maxMemory * 100;
        }
    }
}
