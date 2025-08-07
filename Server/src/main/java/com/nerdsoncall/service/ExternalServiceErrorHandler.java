package com.nerdsoncall.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.Supplier;

/**
 * Comprehensive error handler for external service calls to prevent crashes
 * and provide graceful degradation when external services are unavailable.
 */
@Slf4j
@Service
public class ExternalServiceErrorHandler {

    private static final int DEFAULT_TIMEOUT_SECONDS = 30;
    private static final int DEFAULT_RETRY_ATTEMPTS = 3;
    private static final long DEFAULT_RETRY_DELAY_MS = 1000;

    /**
     * Execute external service call with comprehensive error handling and timeout
     */
    public <T> ServiceCallResult<T> executeWithErrorHandling(
            Supplier<T> serviceCall, 
            String serviceName) {
        return executeWithErrorHandling(serviceCall, serviceName, DEFAULT_TIMEOUT_SECONDS);
    }

    /**
     * Execute external service call with custom timeout
     */
    public <T> ServiceCallResult<T> executeWithErrorHandling(
            Supplier<T> serviceCall, 
            String serviceName, 
            int timeoutSeconds) {
        return executeWithErrorHandling(serviceCall, serviceName, timeoutSeconds, DEFAULT_RETRY_ATTEMPTS);
    }

    /**
     * Execute external service call with custom timeout and retry attempts
     */
    public <T> ServiceCallResult<T> executeWithErrorHandling(
            Supplier<T> serviceCall, 
            String serviceName, 
            int timeoutSeconds, 
            int retryAttempts) {
        
        LocalDateTime startTime = LocalDateTime.now();
        
        for (int attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.debug("Calling external service '{}' (attempt {}/{})", serviceName, attempt, retryAttempts);
                
                // Execute with timeout
                CompletableFuture<T> future = CompletableFuture.supplyAsync(serviceCall);
                T result = future.get(timeoutSeconds, TimeUnit.SECONDS);
                
                log.debug("External service '{}' call successful on attempt {}", serviceName, attempt);
                return ServiceCallResult.success(result, serviceName, startTime);
                
            } catch (TimeoutException e) {
                log.warn("Timeout calling external service '{}' (attempt {}/{}): {}s timeout exceeded", 
                    serviceName, attempt, retryAttempts, timeoutSeconds);
                
                if (attempt == retryAttempts) {
                    return ServiceCallResult.timeout(serviceName, startTime, timeoutSeconds);
                }
                
            } catch (Exception e) {
                Throwable cause = e.getCause() != null ? e.getCause() : e;
                
                if (cause instanceof ConnectException) {
                    log.warn("Connection failed to external service '{}' (attempt {}/{}): {}", 
                        serviceName, attempt, retryAttempts, cause.getMessage());
                    
                    if (attempt == retryAttempts) {
                        return ServiceCallResult.connectionError(serviceName, startTime, cause.getMessage());
                    }
                    
                } else if (cause instanceof SocketTimeoutException) {
                    log.warn("Socket timeout calling external service '{}' (attempt {}/{}): {}", 
                        serviceName, attempt, retryAttempts, cause.getMessage());
                    
                    if (attempt == retryAttempts) {
                        return ServiceCallResult.timeout(serviceName, startTime, timeoutSeconds);
                    }
                    
                } else if (cause instanceof UnknownHostException) {
                    log.error("Unknown host for external service '{}': {}", serviceName, cause.getMessage());
                    return ServiceCallResult.hostError(serviceName, startTime, cause.getMessage());
                    
                } else if (cause instanceof MailException) {
                    log.error("Mail service error for '{}' (attempt {}/{}): {}", 
                        serviceName, attempt, retryAttempts, cause.getMessage());
                    
                    if (attempt == retryAttempts) {
                        return ServiceCallResult.serviceError(serviceName, startTime, cause.getMessage());
                    }
                    
                } else {
                    log.error("Unexpected error calling external service '{}' (attempt {}/{}): {}", 
                        serviceName, attempt, retryAttempts, cause.getMessage(), cause);
                    
                    if (attempt == retryAttempts) {
                        return ServiceCallResult.unexpectedError(serviceName, startTime, cause.getMessage());
                    }
                }
            }
            
            // Wait before retry (except for the last attempt)
            if (attempt < retryAttempts) {
                try {
                    Thread.sleep(DEFAULT_RETRY_DELAY_MS * attempt); // Exponential backoff
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    log.warn("Interrupted while waiting to retry external service call");
                    return ServiceCallResult.interrupted(serviceName, startTime);
                }
            }
        }
        
        return ServiceCallResult.maxRetriesExceeded(serviceName, startTime, retryAttempts);
    }

    /**
     * Execute external service call asynchronously with error handling
     */
    public <T> CompletableFuture<ServiceCallResult<T>> executeAsync(
            Supplier<T> serviceCall, 
            String serviceName) {
        
        return CompletableFuture.supplyAsync(() -> 
            executeWithErrorHandling(serviceCall, serviceName));
    }

    /**
     * Check if external service is available
     */
    public ServiceCallResult<Boolean> checkServiceAvailability(
            Supplier<Boolean> healthCheck, 
            String serviceName) {
        
        return executeWithErrorHandling(healthCheck, serviceName + "_health_check", 10, 1);
    }

    /**
     * Result class for external service calls
     */
    public static class ServiceCallResult<T> {
        private final boolean success;
        private final T result;
        private final String serviceName;
        private final LocalDateTime startTime;
        private final LocalDateTime endTime;
        private final String errorType;
        private final String errorMessage;
        private final long durationMs;

        private ServiceCallResult(boolean success, T result, String serviceName, 
                                LocalDateTime startTime, String errorType, String errorMessage) {
            this.success = success;
            this.result = result;
            this.serviceName = serviceName;
            this.startTime = startTime;
            this.endTime = LocalDateTime.now();
            this.errorType = errorType;
            this.errorMessage = errorMessage;
            this.durationMs = java.time.Duration.between(startTime, endTime).toMillis();
        }

        public static <T> ServiceCallResult<T> success(T result, String serviceName, LocalDateTime startTime) {
            return new ServiceCallResult<>(true, result, serviceName, startTime, null, null);
        }

        public static <T> ServiceCallResult<T> timeout(String serviceName, LocalDateTime startTime, int timeoutSeconds) {
            return new ServiceCallResult<>(false, null, serviceName, startTime, "TIMEOUT", 
                "Service call timed out after " + timeoutSeconds + " seconds");
        }

        public static <T> ServiceCallResult<T> connectionError(String serviceName, LocalDateTime startTime, String message) {
            return new ServiceCallResult<>(false, null, serviceName, startTime, "CONNECTION_ERROR", 
                "Connection failed: " + message);
        }

        public static <T> ServiceCallResult<T> hostError(String serviceName, LocalDateTime startTime, String message) {
            return new ServiceCallResult<>(false, null, serviceName, startTime, "HOST_ERROR", 
                "Host resolution failed: " + message);
        }

        public static <T> ServiceCallResult<T> serviceError(String serviceName, LocalDateTime startTime, String message) {
            return new ServiceCallResult<>(false, null, serviceName, startTime, "SERVICE_ERROR", 
                "Service error: " + message);
        }

        public static <T> ServiceCallResult<T> unexpectedError(String serviceName, LocalDateTime startTime, String message) {
            return new ServiceCallResult<>(false, null, serviceName, startTime, "UNEXPECTED_ERROR", 
                "Unexpected error: " + message);
        }

        public static <T> ServiceCallResult<T> interrupted(String serviceName, LocalDateTime startTime) {
            return new ServiceCallResult<>(false, null, serviceName, startTime, "INTERRUPTED", 
                "Service call was interrupted");
        }

        public static <T> ServiceCallResult<T> maxRetriesExceeded(String serviceName, LocalDateTime startTime, int maxRetries) {
            return new ServiceCallResult<>(false, null, serviceName, startTime, "MAX_RETRIES_EXCEEDED", 
                "Maximum retry attempts (" + maxRetries + ") exceeded");
        }

        // Getters
        public boolean isSuccess() { return success; }
        public T getResult() { return result; }
        public String getServiceName() { return serviceName; }
        public LocalDateTime getStartTime() { return startTime; }
        public LocalDateTime getEndTime() { return endTime; }
        public String getErrorType() { return errorType; }
        public String getErrorMessage() { return errorMessage; }
        public long getDurationMs() { return durationMs; }

        public boolean isTimeout() { return "TIMEOUT".equals(errorType); }
        public boolean isConnectionError() { return "CONNECTION_ERROR".equals(errorType); }
        public boolean isServiceError() { return "SERVICE_ERROR".equals(errorType); }
        public boolean isHostError() { return "HOST_ERROR".equals(errorType); }

        /**
         * Get user-friendly error message
         */
        public String getUserFriendlyMessage() {
            if (success) {
                return "Operation completed successfully";
            }

            switch (errorType) {
                case "TIMEOUT":
                    return "The service is taking too long to respond. Please try again later.";
                case "CONNECTION_ERROR":
                    return "Unable to connect to the service. Please check your internet connection and try again.";
                case "HOST_ERROR":
                    return "Service is temporarily unavailable. Please try again later.";
                case "SERVICE_ERROR":
                    return "The service encountered an error. Please try again later.";
                case "INTERRUPTED":
                    return "Operation was cancelled. Please try again.";
                case "MAX_RETRIES_EXCEEDED":
                    return "Service is currently unavailable after multiple attempts. Please try again later.";
                default:
                    return "An unexpected error occurred. Please try again later.";
            }
        }
    }
}
