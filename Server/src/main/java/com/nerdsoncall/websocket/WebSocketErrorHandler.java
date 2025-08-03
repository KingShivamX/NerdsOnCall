package com.nerdsoncall.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Utility class for handling WebSocket errors and providing robust error handling
 * across all WebSocket handlers in the application.
 */
@Slf4j
public class WebSocketErrorHandler {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final long RETRY_DELAY_MS = 1000;
    
    // Track error counts per session to prevent spam
    private static final ConcurrentHashMap<String, AtomicInteger> sessionErrorCounts = new ConcurrentHashMap<>();
    private static final int MAX_ERRORS_PER_SESSION = 10;
    
    /**
     * Safely close a WebSocket session with proper error handling
     */
    public static void closeSessionSafely(WebSocketSession session, CloseStatus status, String reason) {
        if (session == null) {
            log.warn("Attempted to close null WebSocket session");
            return;
        }
        
        try {
            if (session.isOpen()) {
                CloseStatus closeStatus = reason != null ? status.withReason(reason) : status;
                session.close(closeStatus);
                log.debug("WebSocket session closed: {} - {}", session.getId(), reason);
            } else {
                log.debug("WebSocket session already closed: {}", session.getId());
            }
        } catch (IOException e) {
            log.error("Error closing WebSocket session {}: {}", session.getId(), e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error closing WebSocket session {}: {}", session.getId(), e.getMessage(), e);
        }
    }
    
    /**
     * Safely send a message to a WebSocket session with retry logic
     */
    public static boolean sendMessageSafely(WebSocketSession session, String message) {
        return sendMessageSafely(session, message, MAX_RETRY_ATTEMPTS);
    }
    
    /**
     * Safely send a message to a WebSocket session with specified retry attempts
     */
    public static boolean sendMessageSafely(WebSocketSession session, String message, int maxRetries) {
        if (session == null) {
            log.warn("Attempted to send message to null WebSocket session");
            return false;
        }
        
        if (message == null || message.isEmpty()) {
            log.warn("Attempted to send null or empty message");
            return false;
        }
        
        if (!session.isOpen()) {
            log.debug("Cannot send message to closed WebSocket session: {}", session.getId());
            return false;
        }
        
        // Check if session has exceeded error limit
        String sessionId = session.getId();
        AtomicInteger errorCount = sessionErrorCounts.get(sessionId);
        if (errorCount != null && errorCount.get() >= MAX_ERRORS_PER_SESSION) {
            log.warn("Session {} has exceeded maximum error count, closing connection", sessionId);
            closeSessionSafely(session, CloseStatus.POLICY_VIOLATION, "Too many errors");
            return false;
        }
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                session.sendMessage(new TextMessage(message));
                log.debug("Message sent successfully to session {} on attempt {}", sessionId, attempt);
                return true;
                
            } catch (IOException e) {
                log.warn("IO error sending message to session {} (attempt {}): {}", 
                    sessionId, attempt, e.getMessage());
                
                if (attempt == maxRetries) {
                    log.error("Failed to send message after {} attempts, closing session {}", 
                        maxRetries, sessionId);
                    incrementErrorCount(sessionId);
                    closeSessionSafely(session, CloseStatus.SERVER_ERROR, "Message send failed");
                    return false;
                }
                
                // Wait before retry
                try {
                    Thread.sleep(RETRY_DELAY_MS * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    log.warn("Interrupted while waiting to retry message send");
                    return false;
                }
                
            } catch (Exception e) {
                log.error("Unexpected error sending message to session {} (attempt {}): {}", 
                    sessionId, attempt, e.getMessage(), e);
                incrementErrorCount(sessionId);
                closeSessionSafely(session, CloseStatus.SERVER_ERROR, "Unexpected error");
                return false;
            }
        }
        
        return false;
    }
    
    /**
     * Send an error message to a WebSocket client
     */
    public static void sendErrorMessage(WebSocketSession session, String errorCode, String errorMessage) {
        if (session == null || !session.isOpen()) {
            return;
        }
        
        try {
            ObjectNode errorResponse = objectMapper.createObjectNode();
            errorResponse.put("type", "error");
            errorResponse.put("errorCode", errorCode);
            errorResponse.put("message", errorMessage);
            errorResponse.put("timestamp", System.currentTimeMillis());
            
            sendMessageSafely(session, errorResponse.toString());
            
        } catch (Exception e) {
            log.error("Error creating error message for session {}: {}", session.getId(), e.getMessage());
        }
    }
    
    /**
     * Extract parameter value from query string safely
     */
    public static String extractParameterFromQuery(String query, String paramName) {
        if (query == null || paramName == null) {
            return null;
        }
        
        try {
            String searchPattern = paramName + "=";
            int startIndex = query.indexOf(searchPattern);
            if (startIndex == -1) {
                return null;
            }
            
            startIndex += searchPattern.length();
            int endIndex = query.indexOf("&", startIndex);
            if (endIndex == -1) {
                endIndex = query.length();
            }
            
            String value = query.substring(startIndex, endIndex);
            return value.trim().isEmpty() ? null : value.trim();
            
        } catch (Exception e) {
            log.error("Error extracting parameter {} from query {}: {}", paramName, query, e.getMessage());
            return null;
        }
    }
    
    /**
     * Validate JSON message structure
     */
    public static boolean isValidJsonMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return false;
        }
        
        try {
            objectMapper.readTree(message);
            return true;
        } catch (Exception e) {
            log.debug("Invalid JSON message: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Increment error count for a session
     */
    private static void incrementErrorCount(String sessionId) {
        sessionErrorCounts.computeIfAbsent(sessionId, k -> new AtomicInteger(0)).incrementAndGet();
    }
    
    /**
     * Reset error count for a session (call when session closes)
     */
    public static void resetErrorCount(String sessionId) {
        sessionErrorCounts.remove(sessionId);
    }
    
    /**
     * Handle WebSocket transport error
     */
    public static void handleTransportError(WebSocketSession session, Throwable exception) {
        if (session == null) {
            log.error("Transport error with null session: {}", exception.getMessage());
            return;
        }
        
        String sessionId = session.getId();
        log.error("WebSocket transport error for session {}: {}", sessionId, exception.getMessage(), exception);
        
        incrementErrorCount(sessionId);
        
        // Send error notification to client if session is still open
        if (session.isOpen()) {
            sendErrorMessage(session, "TRANSPORT_ERROR", "Connection error occurred");
            closeSessionSafely(session, CloseStatus.SERVER_ERROR, "Transport error");
        }
    }
    
    /**
     * Send connection confirmation to client
     */
    public static void sendConnectionConfirmation(WebSocketSession session, String userId) {
        try {
            ObjectNode confirmation = objectMapper.createObjectNode();
            confirmation.put("type", "connection_confirmed");
            confirmation.put("userId", userId);
            confirmation.put("sessionId", session.getId());
            confirmation.put("timestamp", System.currentTimeMillis());
            
            sendMessageSafely(session, confirmation.toString());
            
        } catch (Exception e) {
            log.error("Error sending connection confirmation to session {}: {}", session.getId(), e.getMessage());
        }
    }
}
