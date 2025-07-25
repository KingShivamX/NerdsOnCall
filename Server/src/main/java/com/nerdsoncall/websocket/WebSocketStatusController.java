package com.nerdsoncall.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/websocket")
public class WebSocketStatusController {

    @Autowired
    private ApplicationContext applicationContext;

    @GetMapping("/status")
    public Map<String, Object> getWebSocketStatus() {
        Map<String, Object> status = new HashMap<>();

        // Check if WebSocketConfig is registered
        String[] webSocketConfigurers = applicationContext.getBeanNamesForType(WebSocketConfigurer.class);
        status.put("webSocketConfigurersCount", webSocketConfigurers.length);
        status.put("webSocketConfigurers", webSocketConfigurers);

        // Check if handlers are registered
        boolean signalingHandlerExists = applicationContext.containsBean("signalingHandler");
        boolean webRTCHandlerExists = applicationContext.containsBean("webRTCSignalingHandler");
        boolean tutoringSessionHandlerExists = applicationContext.containsBean("tutoringSessionHandler");

        status.put("signalingHandlerRegistered", signalingHandlerExists);
        status.put("webRTCHandlerRegistered", webRTCHandlerExists);
        status.put("tutoringSessionHandlerRegistered", tutoringSessionHandlerExists);

        return status;
    }
}