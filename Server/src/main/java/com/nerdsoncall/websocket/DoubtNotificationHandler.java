package com.nerdsoncall.websocket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.DoubtStatusService;
import com.nerdsoncall.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class DoubtNotificationHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(DoubtNotificationHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private DoubtStatusService doubtStatusService;

    @Autowired
    private UserService userService;

    // Store active sessions by userId
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            // Extract userId from query parameters
            if (session.getUri() != null) {
                String query = session.getUri().getQuery();
                if (query != null && query.contains("userId=")) {
                    String userId = query.split("userId=")[1].split("&")[0];
                    logger.info("Doubt notification WebSocket connection established for user: {}", userId);
                    sessions.put(userId, session);
                } else {
                    logger.error("WebSocket connection rejected: No userId provided");
                    session.close(CloseStatus.BAD_DATA.withReason("No userId provided"));
                }
            } else {
                logger.error("WebSocket connection rejected: No URI available");
                session.close(CloseStatus.BAD_DATA.withReason("No URI available"));
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

            // Handle different message types
            if (jsonNode.has("type")) {
                String type = jsonNode.get("type").asText();

                switch (type) {
                    case "accept_doubt":
                        handleAcceptDoubt(jsonNode);
                        break;
                    case "reject_doubt":
                        handleRejectDoubt(jsonNode);
                        break;
                    default:
                        logger.warn("Unknown message type: {}", type);
                }
            }
        } catch (Exception e) {
            logger.error("Error handling WebSocket message", e);
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

    private void handleAcceptDoubt(JsonNode jsonNode) {
        try {
            Long doubtId = jsonNode.get("doubtId").asLong();
            Long tutorId = jsonNode.get("tutorId").asLong();

            // Update doubt status
            doubtStatusService.updateDoubtStatus(doubtId, Doubt.Status.ASSIGNED);

            // Notify student
            Doubt doubt = doubtStatusService.findById(doubtId).orElse(null);
            if (doubt != null) {
                notifyStudent(doubt.getStudent().getId(), doubtId, tutorId, "accepted");
            }
        } catch (Exception e) {
            logger.error("Error handling accept doubt", e);
        }
    }

    private void handleRejectDoubt(JsonNode jsonNode) {
        try {
            Long doubtId = jsonNode.get("doubtId").asLong();
            Long tutorId = jsonNode.get("tutorId").asLong();

            // Update doubt status
            doubtStatusService.updateDoubtStatus(doubtId, Doubt.Status.CANCELLED);

            // Notify student
            Doubt doubt = doubtStatusService.findById(doubtId).orElse(null);
            if (doubt != null) {
                notifyStudent(doubt.getStudent().getId(), doubtId, tutorId, "rejected");
            }
        } catch (Exception e) {
            logger.error("Error handling reject doubt", e);
        }
    }

    private void notifyStudent(Long studentId, Long doubtId, Long tutorId, String action) {
        try {
            WebSocketSession studentSession = sessions.get(studentId.toString());
            if (studentSession != null && studentSession.isOpen()) {
                ObjectNode notification = objectMapper.createObjectNode();
                notification.put("type", "doubt_" + action);
                notification.put("doubtId", doubtId);
                notification.put("tutorId", tutorId);

                User tutor = userService.findById(tutorId).orElse(null);
                if (tutor != null) {
                    notification.put("tutorName", tutor.getFirstName() + " " + tutor.getLastName());
                }

                studentSession.sendMessage(new TextMessage(notification.toString()));
            }
        } catch (Exception e) {
            logger.error("Error notifying student", e);
        }
    }

    /**
     * Send a doubt notification to a specific tutor
     */
    public void sendDoubtNotification(Long tutorId, Doubt doubt) {
        try {
            WebSocketSession tutorSession = sessions.get(tutorId.toString());
            if (tutorSession != null && tutorSession.isOpen()) {
                ObjectNode notification = objectMapper.createObjectNode();
                notification.put("type", "new_doubt");

                // Convert doubt to JSON
                JsonNode doubtJson = objectMapper.valueToTree(doubt);
                notification.set("doubt", doubtJson);

                tutorSession.sendMessage(new TextMessage(notification.toString()));
                logger.info("Sent doubt notification to tutor: {}", tutorId);
            }
        } catch (Exception e) {
            logger.error("Error sending doubt notification", e);
        }
    }

    /**
     * Broadcast a doubt to tutors
     */
    public void broadcastDoubtToTutors(Doubt doubt) {
        try {
            logger.info("Broadcasting doubt {} to {} active sessions", doubt.getId(), sessions.size());
            logger.info("Doubt preferred tutor ID: {}", doubt.getPreferredTutorId());
            
            // If there's a preferred tutor, send only to them
            if (doubt.getPreferredTutorId() != null) {
                logger.info("Sending doubt to preferred tutor: {}", doubt.getPreferredTutorId());
                
                // Check if the preferred tutor is online
                WebSocketSession preferredTutorSession = sessions.get(doubt.getPreferredTutorId().toString());
                if (preferredTutorSession != null && preferredTutorSession.isOpen()) {
                    sendDoubtNotification(doubt.getPreferredTutorId(), doubt);
                    logger.info("Successfully sent doubt to preferred tutor: {}", doubt.getPreferredTutorId());
                } else {
                    logger.warn("Preferred tutor {} is not online, broadcasting to all tutors", doubt.getPreferredTutorId());
                    // If preferred tutor is not online, broadcast to all tutors
                    broadcastToAllTutors(doubt);
                }
                return;
            }

            // If no preferred tutor, send to all online tutors
            logger.info("No preferred tutor, broadcasting to all online tutors");
            broadcastToAllTutors(doubt);
        } catch (Exception e) {
            logger.error("Error broadcasting doubt", e);
        }
    }
    
    private void broadcastToAllTutors(Doubt doubt) {
        int sentCount = 0;
        for (Map.Entry<String, WebSocketSession> entry : sessions.entrySet()) {
            try {
                Long tutorId = Long.parseLong(entry.getKey());
                User tutor = userService.findById(tutorId).orElse(null);

                if (tutor != null && tutor.getRole() == User.Role.TUTOR) {
                    logger.info("Sending doubt to tutor: {} ({})", tutorId, tutor.getFirstName());
                    sendDoubtNotification(tutorId, doubt);
                    sentCount++;
                }
            } catch (NumberFormatException e) {
                logger.error("Invalid user ID in session map: {}", entry.getKey());
            }
        }
        logger.info("Sent doubt notification to {} tutors", sentCount);
    }
}