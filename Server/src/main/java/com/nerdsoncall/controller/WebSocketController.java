package com.nerdsoncall.controller;

import com.nerdsoncall.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private SessionService sessionService;

    @MessageMapping("/canvas/{sessionId}")
    public void handleCanvasUpdate(@DestinationVariable String sessionId, @Payload String canvasData) {
        // Broadcast canvas update to all participants in the session
        sessionService.broadcastCanvasUpdate(sessionId, canvasData);
    }

    @MessageMapping("/screen/{sessionId}")
    public void handleScreenShare(@DestinationVariable String sessionId, @Payload String screenData) {
        // Broadcast screen share data to all participants in the session
        sessionService.broadcastScreenShare(sessionId, screenData);
    }

    @MessageMapping("/webrtc/{sessionId}")
    public void handleWebRTCSignaling(@DestinationVariable String sessionId, @Payload String signalData) {
        // Relay WebRTC signaling data
        messagingTemplate.convertAndSend("/topic/session/" + sessionId + "/webrtc", signalData);
    }
} 