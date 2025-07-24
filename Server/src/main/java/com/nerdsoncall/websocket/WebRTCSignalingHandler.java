package com.nerdsoncall.websocket;

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
import java.util.concurrent.ConcurrentHashMap;

/**
 * Extended WebSocket handler specifically for WebRTC signaling
 * This handler supports more advanced WebRTC signaling features
 */
@Component
public class WebRTCSignalingHandler extends TextWebSocketHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(WebRTCSignalingHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Store active sessions by userId
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    
    // Store session mappings (tutoring session ID -> participants)
    private final Map<String, Map<String, WebSocketSession>> tutoringSessionParticipants = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            // Extract userId from query parameters
            String query = session.getUri().getQuery();
            if (query != null && query.contains("userId=")) {
                String userId = query.split("userId=")[1].split("&")[0];
                logger.info("WebRTC signaling connection established for user: {}", userId);
                userSessions.put(userId, session);
                
                // Check if user is joining a specific tutoring session
                if (query.contains("sessionId=")) {
                    String tutoringSessionId = query.split("sessionId=")[1].split("&")[0];
                    addUserToTutoringSession(userId, tutoringSessionId, session);
                }
            } else {
                logger.error("WebRTC connection rejected: No userId provided");
                session.close(CloseStatus.BAD_DATA.withReason("No userId provided"));
            }
        } catch (Exception e) {
            logger.error("Error in WebRTC connection establishment", e);
            try {
                session.close(CloseStatus.SERVER_ERROR.withReason("Internal server error"));
            } catch (IOException ex) {
                logger.error("Error closing WebRTC session", ex);
            }
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String payload = message.getPayload();
            logger.debug("Received WebRTC message: {}", payload);
            
            JsonNode jsonNode = objectMapper.readTree(payload);
            
            if (jsonNode.has("type")) {
                String type = jsonNode.get("type").asText();
                
                switch (type) {
                    case "join":
                        handleJoinMessage(session, jsonNode);
                        break;
                    case "offer":
                    case "answer":
                    case "ice-candidate":
                        forwardSignalingMessage(session, jsonNode);
                        break;
                    case "leave":
                        handleLeaveMessage(session, jsonNode);
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
            logger.error("Error handling WebRTC message", e);
            sendErrorMessage(session, "Server error processing message");
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("WebRTC connection closed: {}", status);
        
        // Find and remove user from all mappings
        String userId = findUserIdBySession(session);
        if (userId != null) {
            userSessions.remove(userId);
            
            // Remove from all tutoring sessions
            for (Map.Entry<String, Map<String, WebSocketSession>> entry : tutoringSessionParticipants.entrySet()) {
                String sessionId = entry.getKey();
                Map<String, WebSocketSession> participants = entry.getValue();
                
                if (participants.containsKey(userId)) {
                    participants.remove(userId);
                    
                    // Notify other participants that this user has left
                    notifyParticipantLeft(sessionId, userId);
                    
                    // If no participants left, remove the session
                    if (participants.isEmpty()) {
                        tutoringSessionParticipants.remove(sessionId);
                    }
                }
            }
        }
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        logger.error("WebRTC transport error", exception);
        try {
            session.close(CloseStatus.SERVER_ERROR.withReason("Transport error"));
        } catch (IOException e) {
            logger.error("Error closing WebRTC session after transport error", e);
        }
    }
    
    // Helper methods
    
    private void handleJoinMessage(WebSocketSession session, JsonNode message) throws IOException {
        if (message.has("sessionId") && message.has("userId")) {
            String sessionId = message.get("sessionId").asText();
            String userId = message.get("userId").asText();
            
            addUserToTutoringSession(userId, sessionId, session);
            
            // Notify other participants that a new user has joined
            notifyParticipantJoined(sessionId, userId);
            
            // Send the list of existing participants to the new user
            sendParticipantsList(sessionId, userId);
        } else {
            sendErrorMessage(session, "Invalid join message format");
        }
    }
    
    private void handleLeaveMessage(WebSocketSession session, JsonNode message) throws IOException {
        if (message.has("sessionId") && message.has("userId")) {
            String sessionId = message.get("sessionId").asText();
            String userId = message.get("userId").asText();
            
            Map<String, WebSocketSession> participants = tutoringSessionParticipants.get(sessionId);
            if (participants != null) {
                participants.remove(userId);
                
                // Notify other participants that this user has left
                notifyParticipantLeft(sessionId, userId);
                
                // If no participants left, remove the session
                if (participants.isEmpty()) {
                    tutoringSessionParticipants.remove(sessionId);
                }
            }
        } else {
            sendErrorMessage(session, "Invalid leave message format");
        }
    }
    
    private void forwardSignalingMessage(WebSocketSession session, JsonNode message) throws IOException {
        if (message.has("to")) {
            String toUserId = message.get("to").asText();
            
            WebSocketSession recipientSession = userSessions.get(toUserId);
            if (recipientSession != null && recipientSession.isOpen()) {
                recipientSession.sendMessage(new TextMessage(message.toString()));
                logger.debug("WebRTC message forwarded to user: {}", toUserId);
            } else {
                logger.warn("WebRTC recipient not found or offline: {}", toUserId);
                
                // Send error back to sender
                ObjectNode errorMsg = objectMapper.createObjectNode();
                errorMsg.put("type", "error");
                errorMsg.put("message", "Recipient offline or not found");
                session.sendMessage(new TextMessage(errorMsg.toString()));
            }
        } else {
            sendErrorMessage(session, "Invalid message format (missing recipient)");
        }
    }
    
    private void addUserToTutoringSession(String userId, String sessionId, WebSocketSession session) {
        tutoringSessionParticipants.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                                  .put(userId, session);
        logger.info("User {} added to tutoring session {}", userId, sessionId);
    }
    
    private void notifyParticipantJoined(String sessionId, String userId) throws IOException {
        Map<String, WebSocketSession> participants = tutoringSessionParticipants.get(sessionId);
        if (participants != null) {
            ObjectNode joinMsg = objectMapper.createObjectNode();
            joinMsg.put("type", "user-joined");
            joinMsg.put("userId", userId);
            joinMsg.put("sessionId", sessionId);
            
            TextMessage textMessage = new TextMessage(joinMsg.toString());
            
            for (Map.Entry<String, WebSocketSession> entry : participants.entrySet()) {
                String participantId = entry.getKey();
                WebSocketSession participantSession = entry.getValue();
                
                // Don't send notification to the user who just joined
                if (!participantId.equals(userId) && participantSession.isOpen()) {
                    participantSession.sendMessage(textMessage);
                }
            }
        }
    }
    
    private void notifyParticipantLeft(String sessionId, String userId) {
        Map<String, WebSocketSession> participants = tutoringSessionParticipants.get(sessionId);
        if (participants != null) {
            ObjectNode leaveMsg = objectMapper.createObjectNode();
            leaveMsg.put("type", "user-left");
            leaveMsg.put("userId", userId);
            leaveMsg.put("sessionId", sessionId);
            
            TextMessage textMessage = new TextMessage(leaveMsg.toString());
            
            for (Map.Entry<String, WebSocketSession> entry : participants.entrySet()) {
                WebSocketSession participantSession = entry.getValue();
                
                if (participantSession.isOpen()) {
                    try {
                        participantSession.sendMessage(textMessage);
                    } catch (IOException e) {
                        logger.error("Error sending participant-left notification", e);
                    }
                }
            }
        }
    }
    
    private void sendParticipantsList(String sessionId, String toUserId) throws IOException {
        Map<String, WebSocketSession> participants = tutoringSessionParticipants.get(sessionId);
        if (participants != null) {
            WebSocketSession recipientSession = participants.get(toUserId);
            
            if (recipientSession != null && recipientSession.isOpen()) {
                ObjectNode participantsMsg = objectMapper.createObjectNode();
                participantsMsg.put("type", "participants-list");
                participantsMsg.put("sessionId", sessionId);
                
                // Add participants array
                var participantsArray = participantsMsg.putArray("participants");
                participants.keySet().stream()
                        .filter(id -> !id.equals(toUserId))
                        .forEach(id -> participantsArray.add(id));
                
                recipientSession.sendMessage(new TextMessage(participantsMsg.toString()));
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