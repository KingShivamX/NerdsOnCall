package com.nerdsoncall.health;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Comprehensive health check controller to monitor system health and detect issues
 * before they cause crashes.
 */
@Slf4j
@RestController
@RequestMapping("/health")
public class HealthCheckController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private HealthCheckService healthCheckService;

    /**
     * Basic health check endpoint
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        try {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "UP");
            health.put("timestamp", LocalDateTime.now());
            health.put("service", "NerdsOnCall Backend");
            health.put("version", "1.0.0");
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            log.error("Error in basic health check", e);
            Map<String, Object> health = new HashMap<>();
            health.put("status", "DOWN");
            health.put("timestamp", LocalDateTime.now());
            health.put("error", "Health check failed");
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }
    }

    /**
     * Detailed health check with all system components
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        try {
            Map<String, Object> health = new HashMap<>();
            health.put("timestamp", LocalDateTime.now());
            health.put("service", "NerdsOnCall Backend");
            
            // Check database connectivity
            Map<String, Object> dbHealth = checkDatabaseHealth();
            health.put("database", dbHealth);
            
            // Check memory usage
            Map<String, Object> memoryHealth = checkMemoryHealth();
            health.put("memory", memoryHealth);
            
            // Check disk space
            Map<String, Object> diskHealth = checkDiskHealth();
            health.put("disk", diskHealth);
            
            // Check external services
            Map<String, Object> externalHealth = healthCheckService.checkExternalServices();
            health.put("external_services", externalHealth);
            
            // Check WebSocket status
            Map<String, Object> websocketHealth = healthCheckService.checkWebSocketHealth();
            health.put("websocket", websocketHealth);
            
            // Determine overall status
            boolean allHealthy = isAllHealthy(dbHealth, memoryHealth, diskHealth, externalHealth, websocketHealth);
            health.put("status", allHealthy ? "UP" : "DEGRADED");
            
            HttpStatus status = allHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
            return ResponseEntity.status(status).body(health);
            
        } catch (Exception e) {
            log.error("Error in detailed health check", e);
            Map<String, Object> health = new HashMap<>();
            health.put("status", "DOWN");
            health.put("timestamp", LocalDateTime.now());
            health.put("error", "Detailed health check failed: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }
    }

    /**
     * Database-specific health check
     */
    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        try {
            Map<String, Object> dbHealth = checkDatabaseHealth();
            HttpStatus status = "UP".equals(dbHealth.get("status")) ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
            return ResponseEntity.status(status).body(dbHealth);
            
        } catch (Exception e) {
            log.error("Error in database health check", e);
            Map<String, Object> health = new HashMap<>();
            health.put("status", "DOWN");
            health.put("error", "Database health check failed");
            health.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }
    }

    /**
     * Memory usage health check
     */
    @GetMapping("/memory")
    public ResponseEntity<Map<String, Object>> memoryHealth() {
        try {
            Map<String, Object> memoryHealth = checkMemoryHealth();
            HttpStatus status = "UP".equals(memoryHealth.get("status")) ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
            return ResponseEntity.status(status).body(memoryHealth);
            
        } catch (Exception e) {
            log.error("Error in memory health check", e);
            Map<String, Object> health = new HashMap<>();
            health.put("status", "DOWN");
            health.put("error", "Memory health check failed");
            health.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }
    }

    /**
     * Check database connectivity and performance
     */
    private Map<String, Object> checkDatabaseHealth() {
        Map<String, Object> dbHealth = new HashMap<>();
        dbHealth.put("timestamp", LocalDateTime.now());
        
        try {
            long startTime = System.currentTimeMillis();
            
            try (Connection connection = dataSource.getConnection()) {
                if (connection.isValid(5)) { // 5 second timeout
                    long responseTime = System.currentTimeMillis() - startTime;
                    
                    dbHealth.put("status", "UP");
                    dbHealth.put("response_time_ms", responseTime);
                    dbHealth.put("connection_valid", true);
                    
                    if (responseTime > 1000) {
                        dbHealth.put("warning", "Slow database response time");
                    }
                } else {
                    dbHealth.put("status", "DOWN");
                    dbHealth.put("error", "Database connection is not valid");
                }
            }
            
        } catch (SQLException e) {
            log.error("Database health check failed", e);
            dbHealth.put("status", "DOWN");
            dbHealth.put("error", "Database connection failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error in database health check", e);
            dbHealth.put("status", "DOWN");
            dbHealth.put("error", "Unexpected database error: " + e.getMessage());
        }
        
        return dbHealth;
    }

    /**
     * Check memory usage
     */
    private Map<String, Object> checkMemoryHealth() {
        Map<String, Object> memoryHealth = new HashMap<>();
        memoryHealth.put("timestamp", LocalDateTime.now());
        
        try {
            Runtime runtime = Runtime.getRuntime();
            long maxMemory = runtime.maxMemory();
            long totalMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = totalMemory - freeMemory;
            
            double memoryUsagePercent = (double) usedMemory / maxMemory * 100;
            
            memoryHealth.put("max_memory_mb", maxMemory / (1024 * 1024));
            memoryHealth.put("total_memory_mb", totalMemory / (1024 * 1024));
            memoryHealth.put("used_memory_mb", usedMemory / (1024 * 1024));
            memoryHealth.put("free_memory_mb", freeMemory / (1024 * 1024));
            memoryHealth.put("usage_percent", Math.round(memoryUsagePercent * 100.0) / 100.0);
            
            if (memoryUsagePercent > 90) {
                memoryHealth.put("status", "CRITICAL");
                memoryHealth.put("warning", "Memory usage is critically high");
            } else if (memoryUsagePercent > 80) {
                memoryHealth.put("status", "WARNING");
                memoryHealth.put("warning", "Memory usage is high");
            } else {
                memoryHealth.put("status", "UP");
            }
            
        } catch (Exception e) {
            log.error("Memory health check failed", e);
            memoryHealth.put("status", "DOWN");
            memoryHealth.put("error", "Memory check failed: " + e.getMessage());
        }
        
        return memoryHealth;
    }

    /**
     * Check disk space
     */
    private Map<String, Object> checkDiskHealth() {
        Map<String, Object> diskHealth = new HashMap<>();
        diskHealth.put("timestamp", LocalDateTime.now());
        
        try {
            java.io.File root = new java.io.File("/");
            long totalSpace = root.getTotalSpace();
            long freeSpace = root.getFreeSpace();
            long usedSpace = totalSpace - freeSpace;
            
            double diskUsagePercent = (double) usedSpace / totalSpace * 100;
            
            diskHealth.put("total_space_gb", totalSpace / (1024 * 1024 * 1024));
            diskHealth.put("free_space_gb", freeSpace / (1024 * 1024 * 1024));
            diskHealth.put("used_space_gb", usedSpace / (1024 * 1024 * 1024));
            diskHealth.put("usage_percent", Math.round(diskUsagePercent * 100.0) / 100.0);
            
            if (diskUsagePercent > 95) {
                diskHealth.put("status", "CRITICAL");
                diskHealth.put("warning", "Disk space is critically low");
            } else if (diskUsagePercent > 85) {
                diskHealth.put("status", "WARNING");
                diskHealth.put("warning", "Disk space is low");
            } else {
                diskHealth.put("status", "UP");
            }
            
        } catch (Exception e) {
            log.error("Disk health check failed", e);
            diskHealth.put("status", "DOWN");
            diskHealth.put("error", "Disk check failed: " + e.getMessage());
        }
        
        return diskHealth;
    }

    /**
     * Determine if all health checks are passing
     */
    private boolean isAllHealthy(Map<String, Object>... healthChecks) {
        for (Map<String, Object> health : healthChecks) {
            String status = (String) health.get("status");
            if (!"UP".equals(status)) {
                return false;
            }
        }
        return true;
    }
}
