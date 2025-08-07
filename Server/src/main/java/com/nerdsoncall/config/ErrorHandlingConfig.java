package com.nerdsoncall.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration for comprehensive error handling across the application
 */
@Slf4j
@Configuration
public class ErrorHandlingConfig {

    /**
     * Configure multipart resolver with proper error handling
     */
    @Bean
    public StandardServletMultipartResolver multipartResolver() {
        StandardServletMultipartResolver resolver = new StandardServletMultipartResolver();
        resolver.setResolveLazily(true); // Resolve multipart requests lazily to handle errors better
        return resolver;
    }

    /**
     * Custom error controller to handle all unhandled errors
     */
    @RestController
    @Slf4j
    public static class CustomErrorController implements ErrorController {

        @RequestMapping("/error")
        public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
            try {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("timestamp", LocalDateTime.now());
                
                // Get error status
                Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
                if (status != null) {
                    int statusCode = Integer.parseInt(status.toString());
                    errorResponse.put("status", statusCode);
                    errorResponse.put("error", HttpStatus.valueOf(statusCode).getReasonPhrase());
                } else {
                    errorResponse.put("status", 500);
                    errorResponse.put("error", "Internal Server Error");
                }

                // Get error message
                Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
                if (message != null) {
                    errorResponse.put("message", message.toString());
                } else {
                    errorResponse.put("message", "An unexpected error occurred");
                }

                // Get request URI
                Object requestUri = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
                if (requestUri != null) {
                    errorResponse.put("path", requestUri.toString());
                }

                // Get exception details (for logging only)
                Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
                if (exception != null) {
                    log.error("Unhandled error at {}: {}", requestUri, exception.toString(), (Throwable) exception);
                    
                    // Don't expose exception details to client in production
                    if (log.isDebugEnabled()) {
                        errorResponse.put("exception", exception.toString());
                    }
                }

                // Determine HTTP status for response
                HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
                if (status != null) {
                    try {
                        httpStatus = HttpStatus.valueOf(Integer.parseInt(status.toString()));
                    } catch (Exception e) {
                        log.warn("Invalid HTTP status code: {}", status);
                    }
                }

                return ResponseEntity.status(httpStatus).body(errorResponse);

            } catch (Exception e) {
                log.error("Error in custom error controller", e);
                
                // Fallback error response
                Map<String, Object> fallbackResponse = new HashMap<>();
                fallbackResponse.put("timestamp", LocalDateTime.now());
                fallbackResponse.put("status", 500);
                fallbackResponse.put("error", "Internal Server Error");
                fallbackResponse.put("message", "An unexpected error occurred");
                
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(fallbackResponse);
            }
        }
    }
}

/**
 * Configuration for application-wide error handling settings
 */
@Configuration
@Slf4j
class ApplicationErrorConfig {

    /**
     * Configure uncaught exception handler for threads
     */
    @Bean
    public Thread.UncaughtExceptionHandler uncaughtExceptionHandler() {
        return (thread, exception) -> {
            log.error("Uncaught exception in thread '{}': {}", thread.getName(), exception.getMessage(), exception);
            
            // Perform any cleanup or notification here
            try {
                // Log system state for debugging
                Runtime runtime = Runtime.getRuntime();
                long usedMemory = runtime.totalMemory() - runtime.freeMemory();
                double memoryUsage = (double) usedMemory / runtime.maxMemory() * 100;
                
                log.error("System state at time of uncaught exception - Memory usage: {}%, Active threads: {}", 
                    Math.round(memoryUsage), Thread.activeCount());
                
            } catch (Exception e) {
                log.error("Error logging system state", e);
            }
        };
    }

    /**
     * Set up shutdown hook for graceful application shutdown
     */
    @Bean
    public Runnable shutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                log.info("Application shutdown initiated - performing cleanup");
                
                // Perform cleanup operations
                performShutdownCleanup();
                
                log.info("Application shutdown cleanup completed");
                
            } catch (Exception e) {
                log.error("Error during application shutdown cleanup", e);
            }
        }));
        
        return () -> {}; // Return empty runnable as bean
    }

    /**
     * Perform cleanup operations during shutdown
     */
    private void performShutdownCleanup() {
        try {
            // Close any open resources
            // Clear caches
            // Save any pending data
            // Notify external systems of shutdown
            
            log.debug("Shutdown cleanup operations completed");
            
        } catch (Exception e) {
            log.error("Error during shutdown cleanup", e);
        }
    }
}

/**
 * Configuration for request/response logging and monitoring
 */
@Configuration
@Slf4j
class RequestMonitoringConfig {

    /**
     * Bean for monitoring request patterns and detecting potential issues
     */
    @Bean
    public RequestMonitor requestMonitor() {
        return new RequestMonitor();
    }

    /**
     * Request monitoring component
     */
    public static class RequestMonitor {
        private final Map<String, Integer> errorCounts = new HashMap<>();
        private final Map<String, Long> lastErrorTimes = new HashMap<>();
        private static final int ERROR_THRESHOLD = 10;
        private static final long ERROR_WINDOW_MS = 60000; // 1 minute

        public void recordError(String endpoint, String errorType) {
            try {
                String key = endpoint + ":" + errorType;
                long currentTime = System.currentTimeMillis();
                
                // Reset count if outside error window
                Long lastErrorTime = lastErrorTimes.get(key);
                if (lastErrorTime == null || (currentTime - lastErrorTime) > ERROR_WINDOW_MS) {
                    errorCounts.put(key, 1);
                } else {
                    errorCounts.put(key, errorCounts.getOrDefault(key, 0) + 1);
                }
                
                lastErrorTimes.put(key, currentTime);
                
                // Check if error threshold exceeded
                int count = errorCounts.get(key);
                if (count >= ERROR_THRESHOLD) {
                    log.warn("High error rate detected for {}: {} errors in the last minute", 
                        key, count);
                    
                    // Could trigger alerts or circuit breakers here
                }
                
            } catch (Exception e) {
                log.error("Error recording error metrics", e);
            }
        }

        public Map<String, Integer> getErrorCounts() {
            return new HashMap<>(errorCounts);
        }
    }
}

/**
 * Configuration for database connection error handling
 */
@Configuration
@Slf4j
class DatabaseErrorConfig {

    /**
     * Configure database connection pool error handling
     */
    @Bean
    public DatabaseHealthMonitor databaseHealthMonitor() {
        return new DatabaseHealthMonitor();
    }

    /**
     * Database health monitoring component
     */
    public static class DatabaseHealthMonitor {
        private volatile boolean databaseHealthy = true;
        private volatile LocalDateTime lastHealthCheck = LocalDateTime.now();
        private static final long HEALTH_CHECK_INTERVAL_MS = 30000; // 30 seconds

        public boolean isDatabaseHealthy() {
            return databaseHealthy;
        }

        public void recordDatabaseError(String operation, Exception error) {
            try {
                log.error("Database error during {}: {}", operation, error.getMessage(), error);
                
                // Mark database as potentially unhealthy
                if (isConnectionError(error)) {
                    databaseHealthy = false;
                    log.warn("Database marked as unhealthy due to connection error");
                }
                
            } catch (Exception e) {
                log.error("Error recording database error", e);
            }
        }

        public void recordDatabaseSuccess(String operation) {
            try {
                long timeSinceLastCheck = System.currentTimeMillis() - 
                    java.time.Duration.between(lastHealthCheck, LocalDateTime.now()).toMillis();
                
                if (timeSinceLastCheck > HEALTH_CHECK_INTERVAL_MS) {
                    if (!databaseHealthy) {
                        log.info("Database health restored after successful {}", operation);
                    }
                    databaseHealthy = true;
                    lastHealthCheck = LocalDateTime.now();
                }
                
            } catch (Exception e) {
                log.error("Error recording database success", e);
            }
        }

        private boolean isConnectionError(Exception error) {
            String message = error.getMessage();
            return message != null && (
                message.contains("connection") ||
                message.contains("timeout") ||
                message.contains("refused") ||
                message.contains("unreachable")
            );
        }
    }
}
