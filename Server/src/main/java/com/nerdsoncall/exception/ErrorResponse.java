package com.nerdsoncall.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standardized error response structure for all API errors.
 * This ensures consistent error responses across the entire application.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    /**
     * Timestamp when the error occurred
     */
    private LocalDateTime timestamp;
    
    /**
     * HTTP status code
     */
    private int status;
    
    /**
     * Error code for programmatic handling
     */
    private String error;
    
    /**
     * Human-readable error message
     */
    private String message;
    
    /**
     * Request path where the error occurred
     */
    private String path;
    
    /**
     * Field-specific validation errors (for validation failures)
     */
    private Map<String, String> fieldErrors;
    
    /**
     * Additional error details (optional)
     */
    private Map<String, Object> details;
    
    /**
     * Trace ID for debugging (optional)
     */
    private String traceId;
}
