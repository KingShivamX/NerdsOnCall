package com.nerdsoncall.validation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;
import java.util.List;
import java.util.ArrayList;

/**
 * Comprehensive input validation and sanitization utility to prevent malformed data crashes
 * and security vulnerabilities.
 */
@Slf4j
@Component
public class InputValidator {

    // Email validation pattern (RFC 5322 compliant)
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    // Phone number pattern (international format)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[+]?[1-9]\\d{1,14}$"
    );

    // Name pattern (letters, spaces, hyphens, apostrophes)
    private static final Pattern NAME_PATTERN = Pattern.compile(
        "^[a-zA-Z\\s\\-']{1,50}$"
    );

    // Password pattern (at least 8 chars, 1 uppercase, 1 lowercase, 1 digit)
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$"
    );

    // SQL injection patterns to detect
    private static final Pattern[] SQL_INJECTION_PATTERNS = {
        Pattern.compile("('|(\\-\\-)|(;)|(\\|)|(\\*)|(%))", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(union|select|insert|update|delete|drop|create|alter|exec|execute)", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(script|javascript|vbscript|onload|onerror|onclick)", Pattern.CASE_INSENSITIVE)
    };

    // XSS patterns to detect
    private static final Pattern[] XSS_PATTERNS = {
        Pattern.compile("<script[^>]*>.*?</script>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL),
        Pattern.compile("<iframe[^>]*>.*?</iframe>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL),
        Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),
        Pattern.compile("on\\w+\\s*=", Pattern.CASE_INSENSITIVE)
    };

    /**
     * Validate and sanitize email address
     */
    public ValidationResult validateEmail(String email) {
        if (email == null) {
            return ValidationResult.invalid("Email cannot be null");
        }

        String sanitized = sanitizeString(email).toLowerCase().trim();
        
        if (sanitized.isEmpty()) {
            return ValidationResult.invalid("Email cannot be empty");
        }

        if (sanitized.length() > 254) {
            return ValidationResult.invalid("Email is too long (max 254 characters)");
        }

        if (!EMAIL_PATTERN.matcher(sanitized).matches()) {
            return ValidationResult.invalid("Invalid email format");
        }

        return ValidationResult.valid(sanitized);
    }

    /**
     * Validate and sanitize phone number
     */
    public ValidationResult validatePhoneNumber(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return ValidationResult.valid(null); // Phone is optional
        }

        String sanitized = phone.replaceAll("[\\s\\-\\(\\)]", "");
        
        if (!PHONE_PATTERN.matcher(sanitized).matches()) {
            return ValidationResult.invalid("Invalid phone number format");
        }

        return ValidationResult.valid(sanitized);
    }

    /**
     * Validate and sanitize name (first name, last name)
     */
    public ValidationResult validateName(String name, String fieldName) {
        if (name == null) {
            return ValidationResult.invalid(fieldName + " cannot be null");
        }

        String sanitized = sanitizeString(name).trim();
        
        if (sanitized.isEmpty()) {
            return ValidationResult.invalid(fieldName + " cannot be empty");
        }

        if (sanitized.length() > 50) {
            return ValidationResult.invalid(fieldName + " is too long (max 50 characters)");
        }

        if (!NAME_PATTERN.matcher(sanitized).matches()) {
            return ValidationResult.invalid(fieldName + " contains invalid characters");
        }

        return ValidationResult.valid(sanitized);
    }

    /**
     * Validate password strength
     */
    public ValidationResult validatePassword(String password) {
        if (password == null) {
            return ValidationResult.invalid("Password cannot be null");
        }

        if (password.length() < 8) {
            return ValidationResult.invalid("Password must be at least 8 characters long");
        }

        if (password.length() > 128) {
            return ValidationResult.invalid("Password is too long (max 128 characters)");
        }

        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return ValidationResult.invalid("Password must contain at least one uppercase letter, one lowercase letter, and one digit");
        }

        return ValidationResult.valid(password);
    }

    /**
     * Validate and sanitize general text input
     */
    public ValidationResult validateText(String text, String fieldName, int maxLength) {
        if (text == null) {
            return ValidationResult.valid(null);
        }

        String sanitized = sanitizeString(text).trim();
        
        if (sanitized.length() > maxLength) {
            return ValidationResult.invalid(fieldName + " is too long (max " + maxLength + " characters)");
        }

        return ValidationResult.valid(sanitized);
    }

    /**
     * Validate numeric ID
     */
    public ValidationResult validateId(Long id, String fieldName) {
        if (id == null) {
            return ValidationResult.invalid(fieldName + " cannot be null");
        }

        if (id <= 0) {
            return ValidationResult.invalid(fieldName + " must be positive");
        }

        return ValidationResult.valid(id);
    }

    /**
     * Validate rating value
     */
    public ValidationResult validateRating(Double rating) {
        if (rating == null) {
            return ValidationResult.invalid("Rating cannot be null");
        }

        if (rating < 0 || rating > 5) {
            return ValidationResult.invalid("Rating must be between 0 and 5");
        }

        return ValidationResult.valid(rating);
    }

    /**
     * Sanitize string input to prevent XSS and SQL injection
     */
    public String sanitizeString(String input) {
        if (input == null) {
            return null;
        }

        String sanitized = input;

        // Remove null bytes
        sanitized = sanitized.replace("\0", "");

        // Remove control characters except tab, newline, and carriage return
        sanitized = sanitized.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");

        // HTML encode dangerous characters
        sanitized = sanitized.replace("&", "&amp;")
                            .replace("<", "&lt;")
                            .replace(">", "&gt;")
                            .replace("\"", "&quot;")
                            .replace("'", "&#x27;")
                            .replace("/", "&#x2F;");

        return sanitized;
    }

    /**
     * Check for potential SQL injection attempts
     */
    public boolean containsSqlInjection(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }

        for (Pattern pattern : SQL_INJECTION_PATTERNS) {
            if (pattern.matcher(input).find()) {
                log.warn("Potential SQL injection detected: {}", input);
                return true;
            }
        }

        return false;
    }

    /**
     * Check for potential XSS attempts
     */
    public boolean containsXss(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }

        for (Pattern pattern : XSS_PATTERNS) {
            if (pattern.matcher(input).find()) {
                log.warn("Potential XSS detected: {}", input);
                return true;
            }
        }

        return false;
    }

    /**
     * Comprehensive security validation
     */
    public ValidationResult validateSecurity(String input, String fieldName) {
        if (input == null) {
            return ValidationResult.valid(null);
        }

        if (containsSqlInjection(input)) {
            return ValidationResult.invalid(fieldName + " contains potentially dangerous content");
        }

        if (containsXss(input)) {
            return ValidationResult.invalid(fieldName + " contains potentially dangerous content");
        }

        return ValidationResult.valid(sanitizeString(input));
    }

    /**
     * Validation result class
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String errorMessage;
        private final Object sanitizedValue;

        private ValidationResult(boolean valid, String errorMessage, Object sanitizedValue) {
            this.valid = valid;
            this.errorMessage = errorMessage;
            this.sanitizedValue = sanitizedValue;
        }

        public static ValidationResult valid(Object sanitizedValue) {
            return new ValidationResult(true, null, sanitizedValue);
        }

        public static ValidationResult invalid(String errorMessage) {
            return new ValidationResult(false, errorMessage, null);
        }

        public boolean isValid() {
            return valid;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        @SuppressWarnings("unchecked")
        public <T> T getSanitizedValue() {
            return (T) sanitizedValue;
        }
    }
}
