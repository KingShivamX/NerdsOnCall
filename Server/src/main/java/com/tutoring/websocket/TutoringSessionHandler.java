package com.tutoring.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * WebSocket handler for tutoring session features like canvas sharing and screen sharing
 */
@Component
public class TutoringSessionHandler extends TextWebSocketHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(TutoringSessionHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Map of session subscriptions: sessionId -> set of WebSocketSessions
    private final Map<String, Set<WebSocketSession>> sessionSubscriptions = new ConcurrentHashMap<>();
    
    // Map of user sessions: userId -> WebSocketSession
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            // Extract userId from query parameters
            String query = session.getUri().getQuery();
            if (query != null && query.contains("userId=")) {
                String userId = query.split("userId=")[1].split("&")[0];
                logger.info("Tutoring session connection established for user: {}", userId);
                userSessions.put(userId, session);
            } else {
                logger.error("Tutoring session connection rejected: No userId provided");
                session.close(CloseStatus.BAD_DATA.withReason("No userId provided"));
            }
        } catch (Exception e) {
            logger.error("Error in tutoring session connection establishment", e);
            try {
                session.close(CloseStatus.SERVER_ERROR.withReason("Internal server error"));
            } catch (IOException ex) {
                logger.error("Error closing tutoring session", ex);
            }
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String payload = message.getPayload();
            logger.debug("Received tutoring session message: {}", payload);
            
            JsonNode jsonNode = objectMapper.readTree(payload);
            
            if (jsonNode.has("type")) {
                String type = jsonNode.get("type").asText();
                
                switch (type) {
                    case "subscribe":
                        handleSubscribe(session, jsonNode);
                        break;
                    case "unsubscribe":
                        handleUnsubscribe(session, jsonNode);
                        break;
                    case "canvas_update":
                        handleCanvasUpdate(session, jsonNode);
                        break;
                    case "screen_share":
                        handleScreenShare(session, jsonNode);
                        break;
                    default:
                        logger.warn("Unknown message type: {}", type);
                        sendErrorMessage(session, "Unknown message type");
                }
            } else {
                logger.warn("Invalid message format (missing type): {}", payload);
                sendErrorMessage(session, "Invalid message format");
            }
        } catch (Exception e) {
            logger.error("Error handling tutoring session message", e);
            sendErrorMessage(session, "Server error processing message");
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("Tutoring session connection closed: {}", status);
        
        // Find and remove user from all mappings
        String userId = findUserIdBySession(session);
        if (userId != null) {
            userSessions.remove(userId);
        }
        
        // Remove session from all subscriptions
        for (Map.Entry<String, Set<WebSocketSession>> entry : sessionSubscriptions.entrySet()) {
            entry.getValue().remove(session);
            
            // If no subscribers left, remove the subscription
            if (entry.getValue().isEmpty()) {
                sessionSubscriptions.remove(entry.getKey());
            }
        }
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        logger.error("Tutoring session transport error", exception);
        try {
            session.close(CloseStatus.SERVER_ERROR.withReason("Transport error"));
        } catch (IOException e) {
            logger.error("Error closing tutoring session after transport error", e);
        }
    }
    
    // Helper methods
    
    private void handleSubscribe(WebSocketSession session, JsonNode message) throws IOException {
        if (message.has("sessionId")) {
            String sessionId = message.get("sessionId").asText();
            
            // Add session to subscription list
            sessionSubscriptions.computeIfAbsent(sessionId, k -> new CopyOnWriteArraySet<>())
                              .add(session);
            
            logger.info("Client subscribed to session: {}", sessionId);
            
            // Confirm subscription
            ObjectNode confirmMsg = objectMapper.createObjectNode();
            confirmMsg.put("type", "subscribed");
            confirmMsg.put("sessionId", sessionId);
            session.sendMessage(new TextMessage(confirmMsg.toString()));
        } else {
            sendErrorMessage(session, "Invalid subscribe message format");
        }
    }
    
    private void handleUnsubscribe(WebSocketSession session, JsonNode message) throws IOException {
        if (message.has("sessionId")) {
            String sessionId = message.get("sessionId").asText();
            
            // Remove session from subscription list
            Set<WebSocketSession> subscribers = sessionSubscriptions.get(sessionId);
            if (subscribers != null) {
                subscribers.remove(session);
                
                // If no subscribers left, remove the subscription
                if (subscribers.isEmpty()) {
                    sessionSubscriptions.remove(sessionId);
                }
            }
            
            logger.info("Client unsubscribed from session: {}", sessionId);
            
            // Confirm unsubscription
            ObjectNode confirmMsg = objectMapper.createObjectNode();
            confirmMsg.put("type", "unsubscribed");
            confirmMsg.put("sessionId", sessionId);
            session.sendMessage(new TextMessage(confirmMsg.toString()));
        } else {
            sendErrorMessage(session, "Invalid unsubscribe message format");
        }
    }
    
    private void handleCanvasUpdate(WebSocketSession session, JsonNode message) {
        if (message.has("sessionId") && message.has("data") && message.has("userId")) {
            String sessionId = message.get("sessionId").asText();
            
            // Broadcast canvas update to all subscribers of this session
            broadcastToSession(sessionId, message);
        } else {
            try {
                sendErrorMessage(session, "Invalid canvas update message format");
            } catch (IOException e) {
                logger.error("Error sending error message", e);
            }
        }
    }
    
    private void handleScreenShare(WebSocketSession session, JsonNode message) {
        if (message.has("sessionId") && message.has("data") && message.has("userId")) {
            String sessionId = message.get("sessionId").asText();
            
            // Broadcast screen share update to all subscribers of this session
            broadcastToSession(sessionId, message);
        } else {
            try {
                sendErrorMessage(session, "Invalid screen share message format");
            } catch (IOException e) {
                logger.error("Error sending error message", e);
            }
        }
    }
    
    private void broadcastToSession(String sessionId, JsonNode message) {
        Set<WebSocketSession> subscribers = sessionSubscriptions.get(sessionId);
        
        if (subscribers != null && !subscribers.isEmpty()) {
            TextMessage textMessage = new TextMessage(message.toString());
            
            for (WebSocketSession subscriber : subscribers) {
                if (subscriber.isOpen()) {
                    try {
                        subscriber.sendMessage(textMessage);
                    } catch (IOException e) {
                        logger.error("Error broadcasting message to session subscriber", e);
                    }
                }
            }
        }
    }
    
    private String findUserIdBySession(WebSocketSession session) {
        for (Map.Entry<String, WebSocketSession> entry : userSessions.entrySet()) {
            if (entry.getValue().getId().equals(session.getId())) {
                return entry.getKey();
            }
        }
        return null;
    }
    
    private void sendErrorMessage(WebSocketSession session, String errorMessage) throws IOException {
        ObjectNode errorMsg = objectMapper.createObjectNode();
        errorMsg.put("type", "error");
        errorMsg.put("message", errorMessage);
        session.sendMessage(new TextMessage(errorMsg.toString()));
    }
}