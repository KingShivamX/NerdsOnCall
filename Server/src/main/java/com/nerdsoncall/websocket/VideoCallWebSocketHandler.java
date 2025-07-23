package com.nerdsoncall.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class VideoCallWebSocketHandler implements WebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        try {
            // Extract userId from query parameters
            URI uri = session.getUri();
            if (uri != null && uri.getQuery() != null) {
                String query = uri.getQuery();
                
                String[] params = query.split("&");
                for (String param : params) {
                    String[] keyValue = param.split("=");
                    if (keyValue.length == 2 && "userId".equals(keyValue[0])) {
                        Long userId = Long.parseLong(keyValue[1]);
                        userSessions.put(userId, session);

                        // Send confirmation message to client
                        SignalingMessage confirmMessage = new SignalingMessage();
                        confirmMessage.setType("connection-confirmed");
                        confirmMessage.setFrom(-1L); // System message
                        confirmMessage.setTo(userId);
                        confirmMessage.setData("Connection established successfully");
                        confirmMessage.setTimestamp(System.currentTimeMillis());

                        String confirmJson = objectMapper.writeValueAsString(confirmMessage);
                        session.sendMessage(new TextMessage(confirmJson));
                        
                        break;
                    }
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message) throws Exception {
        try {
            if (message instanceof TextMessage) {
                String payload = ((TextMessage) message).getPayload();

                try {
                    SignalingMessage signalingMessage = objectMapper.readValue(payload, SignalingMessage.class);
                    handleSignalingMessage(session, signalingMessage);
                    
                } catch (Exception e) {
                    // Send error response to client
                    SignalingMessage errorResponse = new SignalingMessage();
                    errorResponse.setType("error");
                    errorResponse.setFrom(-1L);
                    errorResponse.setData("Invalid message format: " + e.getMessage());
                    errorResponse.setTimestamp(System.currentTimeMillis());
                    
                    String errorJson = objectMapper.writeValueAsString(errorResponse);
                    session.sendMessage(new TextMessage(errorJson));
                }
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void handleSignalingMessage(WebSocketSession senderSession, SignalingMessage message) throws IOException {
        try {
            System.out.println("📞 Handling signaling message: " + message.getType() + " from " + message.getFrom() + " to " + message.getTo());
            
            // Special handling for ICE candidates
            if ("ice-candidate".equals(message.getType())) {
                System.out.println("🧊 ICE CANDIDATE RECEIVED from user " + message.getFrom() + " for user " + message.getTo());
                System.out.println("🧊 Session ID: " + message.getSessionId());
                if (message.getData() != null) {
                    System.out.println("🧊 ICE candidate data present");
                } else {
                    System.out.println("🧊 WARNING: ICE candidate data is null!");
                }
            }
            
            Long targetUserId = message.getTo();

            // Handle system messages (like connection tests)
            if (targetUserId == -1) {
                System.out.println("📞 System message received: " + message.getType());
                return;
            }

            WebSocketSession targetSession = userSessions.get(targetUserId);
            System.out.println("📞 Target user " + targetUserId + " session exists: " + (targetSession != null));
            System.out.println("📞 Active user sessions: " + userSessions.keySet());

            if (targetSession != null && targetSession.isOpen()) {
                // Forward the message to the target user
                String messageJson = objectMapper.writeValueAsString(message);
                targetSession.sendMessage(new TextMessage(messageJson));
                
                if ("ice-candidate".equals(message.getType())) {
                    System.out.println("🧊 ICE candidate forwarded successfully to user " + targetUserId);
                } else {
                    System.out.println("📞 Message forwarded successfully to user " + targetUserId);
                }
                        
            } else {
                System.out.println("📞 Target user " + targetUserId + " not available or session closed");
                
                // Send error back to sender
                SignalingMessage errorMessage = new SignalingMessage();
                errorMessage.setType("error");
                errorMessage.setFrom(-1L); // System message
                errorMessage.setTo(message.getFrom());
                errorMessage.setData("Target user not available");
                errorMessage.setTimestamp(System.currentTimeMillis());

                String errorJson = objectMapper.writeValueAsString(errorMessage);
                senderSession.sendMessage(new TextMessage(errorJson));
            }
        } catch (Exception e) {
            System.err.println("📞 Error handling signaling message: " + e.getMessage());
            e.printStackTrace(); // Print stack trace for better debugging
            throw e;
        }
    }

    @Override
    public void handleTransportError(@NonNull WebSocketSession session, @NonNull Throwable exception) throws Exception {
        // Find user ID for this session
        Long userId = findUserIdBySession(session);
        // Handle transport error silently
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus closeStatus) throws Exception {
        try {
            // Remove user session
            Long disconnectedUserId = findUserIdBySession(session);
            
            if (disconnectedUserId != null) {
                userSessions.remove(disconnectedUserId);
            }
        } catch (Exception e) {
            // Handle silently
        }
    }
    
    /**
     * Helper method to find user ID by WebSocket session
     */
    private Long findUserIdBySession(WebSocketSession session) {
        for (Map.Entry<Long, WebSocketSession> entry : userSessions.entrySet()) {
            if (entry.getValue().equals(session)) {
                return entry.getKey();
            }
        }
        return null;
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}