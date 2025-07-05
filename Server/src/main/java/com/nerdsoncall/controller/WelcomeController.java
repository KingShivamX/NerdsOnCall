package com.nerdsoncall.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "NerdsOnCall Backend API");
        response.put("version", "1.0.0");
        response.put("status", "🚀 Running Successfully");
        response.put("timestamp", LocalDateTime.now());
        response.put("description", "Real-Time Doubt-Solving Platform Backend");
        
        Map<String, Object> endpoints = new HashMap<>();
        endpoints.put("health", "/health");
        endpoints.put("authentication", "/auth/*");
        endpoints.put("users", "/users/*");
        endpoints.put("sessions", "/sessions/*");
        endpoints.put("doubts", "/doubts/*");
        endpoints.put("subscriptions", "/subscriptions/*");
        endpoints.put("payments", "/payments/*");
        endpoints.put("feedback", "/feedback/*");
        endpoints.put("websocket", "/ws");
        
        response.put("available_endpoints", endpoints);
        response.put("api_base_url", "/");
        response.put("documentation", "Visit /health to check service status");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/welcome")
    public ResponseEntity<Map<String, Object>> welcome() {
        return getApiInfo();
    }
} 