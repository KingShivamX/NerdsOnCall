package com.nerdsoncall.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.JDBCConnectionException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mail.MailException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.transaction.TransactionException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

/**
 * Global exception handler to catch all unhandled exceptions and prevent server crashes.
 * This handler ensures that no exception goes unhandled and provides meaningful error responses.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==================== AUTHENTICATION & AUTHORIZATION EXCEPTIONS ====================

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        log.warn("Authentication failed: {}", ex.getMessage());
        
        String message = "Authentication failed";
        if (ex instanceof BadCredentialsException) {
            message = "Invalid email or password";
        } else if (ex instanceof DisabledException) {
            message = "Account is disabled";
        } else if (ex instanceof LockedException) {
            message = "Account is locked";
        }
        
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "AUTHENTICATION_FAILED", message, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.warn("Access denied: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.FORBIDDEN, "ACCESS_DENIED", 
            "You don't have permission to access this resource", request);
    }

    // ==================== VALIDATION EXCEPTIONS ====================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        log.warn("Validation failed: {}", ex.getMessage());
        
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("VALIDATION_FAILED")
            .message("Validation failed for one or more fields")
            .path(getPath(request))
            .fieldErrors(fieldErrors)
            .build();
            
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex, WebRequest request) {
        log.warn("Constraint violation: {}", ex.getMessage());
        
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        Map<String, String> fieldErrors = violations.stream()
            .collect(Collectors.toMap(
                violation -> violation.getPropertyPath().toString(),
                ConstraintViolation::getMessage,
                (existing, replacement) -> existing
            ));
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("CONSTRAINT_VIOLATION")
            .message("Validation constraints violated")
            .path(getPath(request))
            .fieldErrors(fieldErrors)
            .build();
            
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindException(BindException ex, WebRequest request) {
        log.warn("Binding failed: {}", ex.getMessage());
        
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            if (error instanceof FieldError) {
                String fieldName = ((FieldError) error).getField();
                String errorMessage = error.getDefaultMessage();
                fieldErrors.put(fieldName, errorMessage);
            }
        });
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("BINDING_FAILED")
            .message("Request binding failed")
            .path(getPath(request))
            .fieldErrors(fieldErrors)
            .build();
            
        return ResponseEntity.badRequest().body(errorResponse);
    }

    // ==================== HTTP & REQUEST EXCEPTIONS ====================

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, WebRequest request) {
        log.warn("Malformed JSON request: {}", ex.getMessage());
        
        String message = "Malformed JSON request";
        if (ex.getCause() instanceof InvalidFormatException) {
            InvalidFormatException cause = (InvalidFormatException) ex.getCause();
            message = String.format("Invalid value '%s' for field '%s'", 
                cause.getValue(), cause.getPath().get(0).getFieldName());
        } else if (ex.getCause() instanceof MismatchedInputException) {
            message = "Required request body is missing or invalid";
        } else if (ex.getCause() instanceof JsonMappingException) {
            message = "JSON mapping error: " + ex.getCause().getMessage();
        }
        
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "MALFORMED_JSON", message, request);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException ex, WebRequest request) {
        log.warn("Missing request parameter: {}", ex.getMessage());
        
        String message = String.format("Required parameter '%s' is missing", ex.getParameterName());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "MISSING_PARAMETER", message, request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        log.warn("Type mismatch for parameter: {}", ex.getMessage());
        
        String message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s", 
            ex.getValue(), ex.getName(), ex.getRequiredType().getSimpleName());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "TYPE_MISMATCH", message, request);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex, WebRequest request) {
        log.warn("Method not supported: {}", ex.getMessage());
        
        String message = String.format("HTTP method '%s' is not supported for this endpoint. Supported methods: %s", 
            ex.getMethod(), String.join(", ", ex.getSupportedMethods()));
        return buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, "METHOD_NOT_SUPPORTED", message, request);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpMediaTypeNotSupportedException(
            HttpMediaTypeNotSupportedException ex, WebRequest request) {
        log.warn("Media type not supported: {}", ex.getMessage());

        String message = String.format("Media type '%s' is not supported. Supported types: %s",
            ex.getContentType(), ex.getSupportedMediaTypes());
        return buildErrorResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "MEDIA_TYPE_NOT_SUPPORTED", message, request);
    }

    // ==================== FILE UPLOAD EXCEPTIONS ====================

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException ex, WebRequest request) {
        log.warn("File upload size exceeded: {}", ex.getMessage());

        String message = "File size exceeds the maximum allowed limit";
        return buildErrorResponse(HttpStatus.PAYLOAD_TOO_LARGE, "FILE_SIZE_EXCEEDED", message, request);
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ErrorResponse> handleMultipartException(MultipartException ex, WebRequest request) {
        log.warn("Multipart request error: {}", ex.getMessage());

        String message = "Error processing file upload";
        if (ex.getCause() instanceof MaxUploadSizeExceededException) {
            message = "File size exceeds the maximum allowed limit";
        }

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "MULTIPART_ERROR", message, request);
    }

    // ==================== DATABASE EXCEPTIONS ====================

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(DataAccessException ex, WebRequest request) {
        log.error("Database access error: {}", ex.getMessage(), ex);

        String message = "Database operation failed";
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String errorCode = "DATABASE_ERROR";

        if (ex instanceof DataIntegrityViolationException) {
            message = "Data integrity violation - this operation would violate database constraints";
            status = HttpStatus.CONFLICT;
            errorCode = "DATA_INTEGRITY_VIOLATION";
        } else if (ex instanceof EmptyResultDataAccessException) {
            message = "Requested resource not found";
            status = HttpStatus.NOT_FOUND;
            errorCode = "RESOURCE_NOT_FOUND";
        }

        return buildErrorResponse(status, errorCode, message, request);
    }

    @ExceptionHandler(PersistenceException.class)
    public ResponseEntity<ErrorResponse> handlePersistenceException(PersistenceException ex, WebRequest request) {
        log.error("Persistence error: {}", ex.getMessage(), ex);

        String message = "Database persistence error";
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (ex.getCause() instanceof org.hibernate.exception.ConstraintViolationException) {
            message = "Database constraint violation";
            status = HttpStatus.CONFLICT;
        }

        return buildErrorResponse(status, "PERSISTENCE_ERROR", message, request);
    }

    @ExceptionHandler(JDBCConnectionException.class)
    public ResponseEntity<ErrorResponse> handleJDBCConnectionException(JDBCConnectionException ex, WebRequest request) {
        log.error("Database connection error: {}", ex.getMessage(), ex);

        return buildErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, "DATABASE_CONNECTION_ERROR",
            "Database connection failed - please try again later", request);
    }

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ErrorResponse> handleSQLException(SQLException ex, WebRequest request) {
        log.error("SQL error: {}", ex.getMessage(), ex);

        String message = "Database operation failed";
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        // Handle specific SQL error codes
        switch (ex.getSQLState()) {
            case "23000": // Integrity constraint violation
            case "23505": // Unique violation
                message = "Data already exists or violates database constraints";
                status = HttpStatus.CONFLICT;
                break;
            case "08000": // Connection exception
            case "08001": // Unable to connect
                message = "Database connection failed";
                status = HttpStatus.SERVICE_UNAVAILABLE;
                break;
            case "42000": // Syntax error or access rule violation
                message = "Database query error";
                break;
        }

        return buildErrorResponse(status, "SQL_ERROR", message, request);
    }

    @ExceptionHandler(TransactionException.class)
    public ResponseEntity<ErrorResponse> handleTransactionException(TransactionException ex, WebRequest request) {
        log.error("Transaction error: {}", ex.getMessage(), ex);

        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "TRANSACTION_ERROR",
            "Database transaction failed", request);
    }

    // ==================== ENTITY & BUSINESS LOGIC EXCEPTIONS ====================

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex, WebRequest request) {
        log.warn("Entity not found: {}", ex.getMessage());

        return buildErrorResponse(HttpStatus.NOT_FOUND, "ENTITY_NOT_FOUND",
            "Requested resource not found", request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
        log.warn("Response status exception: {}", ex.getMessage());

        return buildErrorResponse(ex.getStatusCode(), "RESPONSE_STATUS_ERROR", ex.getReason(), request);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, WebRequest request) {
        log.error("Runtime exception: {}", ex.getMessage(), ex);

        // Handle specific runtime exceptions with better messages
        String message = ex.getMessage();
        if (message == null || message.isEmpty()) {
            message = "An unexpected error occurred";
        }

        // Check for common business logic exceptions
        if (message.contains("User not found")) {
            return buildErrorResponse(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", message, request);
        } else if (message.contains("Session not found")) {
            return buildErrorResponse(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", message, request);
        } else if (message.contains("Email already exists")) {
            return buildErrorResponse(HttpStatus.CONFLICT, "EMAIL_EXISTS", message, request);
        } else if (message.contains("session limit")) {
            return buildErrorResponse(HttpStatus.FORBIDDEN, "SESSION_LIMIT_EXCEEDED", message, request);
        }

        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "RUNTIME_ERROR", message, request);
    }

    // ==================== EXTERNAL SERVICE EXCEPTIONS ====================

    @ExceptionHandler(MailException.class)
    public ResponseEntity<ErrorResponse> handleMailException(MailException ex, WebRequest request) {
        log.error("Email service error: {}", ex.getMessage(), ex);

        return buildErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, "EMAIL_SERVICE_ERROR",
            "Email service is temporarily unavailable", request);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(IOException ex, WebRequest request) {
        log.error("IO error: {}", ex.getMessage(), ex);

        String message = "File operation failed";
        if (ex.getMessage().contains("upload")) {
            message = "File upload failed";
        } else if (ex.getMessage().contains("download")) {
            message = "File download failed";
        }

        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "IO_ERROR", message, request);
    }

    @ExceptionHandler(TimeoutException.class)
    public ResponseEntity<ErrorResponse> handleTimeoutException(TimeoutException ex, WebRequest request) {
        log.error("Timeout error: {}", ex.getMessage(), ex);

        return buildErrorResponse(HttpStatus.REQUEST_TIMEOUT, "TIMEOUT_ERROR",
            "Request timed out - please try again", request);
    }

    // ==================== CATCH-ALL EXCEPTION HANDLER ====================

    /**
     * This is the ultimate fallback handler that catches ANY exception that wasn't handled above.
     * This ensures the server never crashes due to unhandled exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        log.error("Unhandled exception caught by global handler: {}", ex.getMessage(), ex);

        // Log the full stack trace for debugging
        log.error("Full stack trace:", ex);

        // Don't expose internal error details to clients in production
        String message = "An unexpected error occurred. Please try again later.";

        // In development, you might want to include more details
        if (log.isDebugEnabled()) {
            message = "Internal server error: " + ex.getMessage();
        }

        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", message, request);
    }

    // ==================== HELPER METHODS ====================

    private ResponseEntity<ErrorResponse> buildErrorResponse(HttpStatus status, String error, String message, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(status.value())
            .error(error)
            .message(message)
            .path(getPath(request))
            .build();

        return ResponseEntity.status(status).body(errorResponse);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(org.springframework.http.HttpStatusCode status, String error, String message, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(status.value())
            .error(error)
            .message(message)
            .path(getPath(request))
            .build();

        return ResponseEntity.status(status).body(errorResponse);
    }

    private String getPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }
}
