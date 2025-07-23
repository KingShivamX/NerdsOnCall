package com.nerdsoncall.websocket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SignalingHandler extends TextWebSocketHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(SignalingHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Store active sessions by userId
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            // Extract userId from query parameters
            String query = session.getUri().getQuery();
            if (query != null && query.contains("userId=")) {
                String userId = query.split("userId=")[1].split("&")[0];
                logger.info("WebSocket connection established for user: {}", userId);
                sessions.put(userId, session);
            } else {
                logger.error("WebSocket connection rejected: No userId provided");
                session.close(CloseStatus.BAD_DATA.withReason("No userId provided"));
            }
        } catch (Exception e) {
            logger.error("Error in WebSocket connection establishment", e);
            try {
                session.close(CloseStatus.SERVER_ERROR.withReason("Internal server error"));
            } catch (IOException ex) {
                logger.error("Error closing WebSocket session", ex);
            }
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String payload = message.getPayload();
            logger.debug("Received message: {}", payload);
            
            JsonNode jsonNode = objectMapper.readTree(payload);
            
            // Check if message contains required fields
            if (jsonNode.has("to") && jsonNode.has("type")) {
                String toUserId = jsonNode.get("to").asText();
                
                // Forward message to intended recipient
                if (sessions.containsKey(toUserId)) {
                    WebSocketSession recipientSession = sessions.get(toUserId);
                    if (recipientSession.isOpen()) {
                        recipientSession.sendMessage(new TextMessage(payload));
                        logger.debug("Message forwarded to user: {}", toUserId);
                    } else {
                        logger.warn("Recipient session is closed for user: {}", toUserId);
                        sessions.remove(toUserId);
                    }
                } else {
                    logger.warn("Recipient not found or offline: {}", toUserId);
                    // Optionally send back a message to sender that recipient is offline
                    session.sendMessage(new TextMessage("{\"type\":\"error\",\"message\":\"Recipient offline or not found\"}"));
                }
            } else {
                logger.warn("Invalid message format: {}", payload);
                session.sendMessage(new TextMessage("{\"type\":\"error\",\"message\":\"Invalid message format\"}"));
            }
        } catch (Exception e) {
            logger.error("Error handling WebSocket message", e);
            session.sendMessage(new TextMessage("{\"type\":\"error\",\"message\":\"Server error processing message\"}"));
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("WebSocket connection closed: {}", status);
        
        // Remove session from active sessions
        sessions.values().removeIf(s -> s.getId().equals(session.getId()));
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        logger.error("WebSocket transport error", exception);
        try {
            session.close(CloseStatus.SERVER_ERROR.withReason("Transport error"));
        } catch (IOException e) {
            logger.error("Error closing WebSocket session after transport error", e);
        }
    }
}