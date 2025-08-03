package com.nerdsoncall.health;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.config.WebSocketConfigurer;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Service for performing comprehensive health checks on external services
 * and system components.
 */
@Slf4j
@Service
public class HealthCheckService {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    /**
     * Check external services health
     */
    public Map<String, Object> checkExternalServices() {
        Map<String, Object> externalHealth = new HashMap<>();
        externalHealth.put("timestamp", LocalDateTime.now());
        
        try {
            // Check email service
            Map<String, Object> emailHealth = checkEmailService();
            externalHealth.put("email", emailHealth);
            
            // Check payment service (if configured)
            Map<String, Object> paymentHealth = checkPaymentService();
            externalHealth.put("payment", paymentHealth);
            
            // Check file storage service
            Map<String, Object> storageHealth = checkStorageService();
            externalHealth.put("storage", storageHealth);
            
            // Determine overall external services status
            boolean allHealthy = isAllServicesHealthy(emailHealth, paymentHealth, storageHealth);
            externalHealth.put("status", allHealthy ? "UP" : "DEGRADED");
            
        } catch (Exception e) {
            log.error("Error checking external services", e);
            externalHealth.put("status", "DOWN");
            externalHealth.put("error", "External services check failed: " + e.getMessage());
        }
        
        return externalHealth;
    }

    /**
     * Check WebSocket health
     */
    public Map<String, Object> checkWebSocketHealth() {
        Map<String, Object> websocketHealth = new HashMap<>();
        websocketHealth.put("timestamp", LocalDateTime.now());
        
        try {
            // Check if WebSocket configurers are registered
            String[] webSocketConfigurers = applicationContext.getBeanNamesForType(WebSocketConfigurer.class);
            websocketHealth.put("configurers_count", webSocketConfigurers.length);
            
            // Check if handlers are registered
            boolean signalingHandlerExists = applicationContext.containsBean("signalingHandler");
            boolean webRTCHandlerExists = applicationContext.containsBean("webRTCSignalingHandler");
            boolean tutoringSessionHandlerExists = applicationContext.containsBean("tutoringSessionHandler");
            
            websocketHealth.put("signaling_handler", signalingHandlerExists ? "UP" : "DOWN");
            websocketHealth.put("webrtc_handler", webRTCHandlerExists ? "UP" : "DOWN");
            websocketHealth.put("tutoring_handler", tutoringSessionHandlerExists ? "UP" : "DOWN");
            
            boolean allHandlersUp = signalingHandlerExists && webRTCHandlerExists && tutoringSessionHandlerExists;
            websocketHealth.put("status", allHandlersUp ? "UP" : "DEGRADED");
            
            if (!allHandlersUp) {
                websocketHealth.put("warning", "Some WebSocket handlers are not registered");
            }
            
        } catch (Exception e) {
            log.error("Error checking WebSocket health", e);
            websocketHealth.put("status", "DOWN");
            websocketHealth.put("error", "WebSocket health check failed: " + e.getMessage());
        }
        
        return websocketHealth;
    }

    /**
     * Check email service health
     */
    private Map<String, Object> checkEmailService() {
        Map<String, Object> emailHealth = new HashMap<>();
        emailHealth.put("timestamp", LocalDateTime.now());
        
        try {
            if (mailSender == null) {
                emailHealth.put("status", "DOWN");
                emailHealth.put("error", "Email service not configured");
                return emailHealth;
            }
            
            // Try to test email connection with timeout
            CompletableFuture<Boolean> emailTest = CompletableFuture.supplyAsync(() -> {
                try {
                    // This is a basic check - in production you might want to send a test email
                    // or check SMTP connection more thoroughly
                    return mailSender != null;
                } catch (Exception e) {
                    log.debug("Email service test failed", e);
                    return false;
                }
            });
            
            Boolean isHealthy = emailTest.get(5, TimeUnit.SECONDS);
            
            if (isHealthy) {
                emailHealth.put("status", "UP");
                emailHealth.put("configured", true);
            } else {
                emailHealth.put("status", "DOWN");
                emailHealth.put("error", "Email service test failed");
            }
            
        } catch (Exception e) {
            log.error("Email service health check failed", e);
            emailHealth.put("status", "DOWN");
            emailHealth.put("error", "Email service check failed: " + e.getMessage());
        }
        
        return emailHealth;
    }

    /**
     * Check payment service health
     */
    private Map<String, Object> checkPaymentService() {
        Map<String, Object> paymentHealth = new HashMap<>();
        paymentHealth.put("timestamp", LocalDateTime.now());
        
        try {
            // Check if payment service beans are configured
            boolean razorpayConfigured = checkEnvironmentVariable("RAZORPAY_KEY_ID") && 
                                       checkEnvironmentVariable("RAZORPAY_KEY_SECRET");
            
            paymentHealth.put("razorpay_configured", razorpayConfigured);
            
            if (razorpayConfigured) {
                paymentHealth.put("status", "UP");
                paymentHealth.put("provider", "Razorpay");
            } else {
                paymentHealth.put("status", "DOWN");
                paymentHealth.put("error", "Payment service not properly configured");
            }
            
        } catch (Exception e) {
            log.error("Payment service health check failed", e);
            paymentHealth.put("status", "DOWN");
            paymentHealth.put("error", "Payment service check failed: " + e.getMessage());
        }
        
        return paymentHealth;
    }

    /**
     * Check storage service health
     */
    private Map<String, Object> checkStorageService() {
        Map<String, Object> storageHealth = new HashMap<>();
        storageHealth.put("timestamp", LocalDateTime.now());
        
        try {
            // Check if Cloudinary is configured
            boolean cloudinaryConfigured = checkEnvironmentVariable("CLOUDINARY_URL") ||
                                         (checkEnvironmentVariable("CLOUDINARY_CLOUD_NAME") &&
                                          checkEnvironmentVariable("CLOUDINARY_API_KEY") &&
                                          checkEnvironmentVariable("CLOUDINARY_API_SECRET"));
            
            storageHealth.put("cloudinary_configured", cloudinaryConfigured);
            
            if (cloudinaryConfigured) {
                storageHealth.put("status", "UP");
                storageHealth.put("provider", "Cloudinary");
            } else {
                storageHealth.put("status", "DOWN");
                storageHealth.put("error", "Storage service not properly configured");
            }
            
        } catch (Exception e) {
            log.error("Storage service health check failed", e);
            storageHealth.put("status", "DOWN");
            storageHealth.put("error", "Storage service check failed: " + e.getMessage());
        }
        
        return storageHealth;
    }

    /**
     * Check if environment variable is set and not empty
     */
    private boolean checkEnvironmentVariable(String varName) {
        try {
            String value = System.getenv(varName);
            return value != null && !value.trim().isEmpty();
        } catch (Exception e) {
            log.debug("Error checking environment variable {}: {}", varName, e.getMessage());
            return false;
        }
    }

    /**
     * Check if all services are healthy
     */
    private boolean isAllServicesHealthy(Map<String, Object>... services) {
        for (Map<String, Object> service : services) {
            String status = (String) service.get("status");
            if (!"UP".equals(status)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get system information
     */
    public Map<String, Object> getSystemInfo() {
        Map<String, Object> systemInfo = new HashMap<>();
        
        try {
            systemInfo.put("timestamp", LocalDateTime.now());
            systemInfo.put("java_version", System.getProperty("java.version"));
            systemInfo.put("java_vendor", System.getProperty("java.vendor"));
            systemInfo.put("os_name", System.getProperty("os.name"));
            systemInfo.put("os_version", System.getProperty("os.version"));
            systemInfo.put("os_arch", System.getProperty("os.arch"));
            systemInfo.put("available_processors", Runtime.getRuntime().availableProcessors());
            
            // Spring Boot info
            systemInfo.put("spring_profiles", System.getProperty("spring.profiles.active", "default"));
            
            // Application info
            systemInfo.put("application_name", "NerdsOnCall Backend");
            systemInfo.put("application_version", "1.0.0");
            
        } catch (Exception e) {
            log.error("Error getting system info", e);
            systemInfo.put("error", "Failed to get system info: " + e.getMessage());
        }
        
        return systemInfo;
    }

    /**
     * Perform a comprehensive system health check
     */
    public Map<String, Object> performComprehensiveHealthCheck() {
        Map<String, Object> healthCheck = new HashMap<>();
        
        try {
            healthCheck.put("timestamp", LocalDateTime.now());
            healthCheck.put("system_info", getSystemInfo());
            healthCheck.put("external_services", checkExternalServices());
            healthCheck.put("websocket", checkWebSocketHealth());
            
            // Overall status
            Map<String, Object> externalServices = (Map<String, Object>) healthCheck.get("external_services");
            Map<String, Object> websocket = (Map<String, Object>) healthCheck.get("websocket");
            
            boolean overallHealthy = "UP".equals(externalServices.get("status")) && 
                                   "UP".equals(websocket.get("status"));
            
            healthCheck.put("overall_status", overallHealthy ? "HEALTHY" : "DEGRADED");
            
        } catch (Exception e) {
            log.error("Error performing comprehensive health check", e);
            healthCheck.put("overall_status", "UNHEALTHY");
            healthCheck.put("error", "Comprehensive health check failed: " + e.getMessage());
        }
        
        return healthCheck;
    }
}
