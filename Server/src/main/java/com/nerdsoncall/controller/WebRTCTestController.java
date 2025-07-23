package com.nerdsoncall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/webrtc")
public class WebRTCTestController {

    @Autowired
    private ApplicationContext applicationContext;

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        
        // Check if handlers are registered
        boolean signalingHandlerExists = applicationContext.containsBean("signalingHandler");
        boolean webRTCHandlerExists = applicationContext.containsBean("webRTCSignalingHandler");
        boolean tutoringSessionHandlerExists = applicationContext.containsBean("tutoringSessionHandler");
        
        status.put("signalingHandlerRegistered", signalingHandlerExists);
        status.put("webRTCHandlerRegistered", webRTCHandlerExists);
        status.put("tutoringSessionHandlerRegistered", tutoringSessionHandlerExists);
        
        // Add server info
        status.put("serverTime", System.currentTimeMillis());
        status.put("status", "running");
        
        return status;
    }
}