package com.tutoring.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    @Bean
    public SignalingHandler signalingHandler() {
        return new SignalingHandler();
    }
    
    @Bean
    public WebRTCSignalingHandler webRTCSignalingHandler() {
        return new WebRTCSignalingHandler();
    }
    
    @Bean
    public TutoringSessionHandler tutoringSessionHandler() {
        return new TutoringSessionHandler();
    }
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Basic signaling endpoint
        registry.addHandler(signalingHandler(), "/ws")
               .setAllowedOrigins("*"); // In production, restrict to your frontend domain
        
        // WebRTC specific signaling endpoint
        registry.addHandler(webRTCSignalingHandler(), "/ws/webrtc")
               .setAllowedOrigins("*");
        
        // Tutoring session endpoint for canvas and screen sharing
        registry.addHandler(tutoringSessionHandler(), "/ws/session")
               .setAllowedOrigins("*");
    }
}