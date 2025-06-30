package com.nerdsoncall.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Arrays;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "NerdsOnCall Backend API");
        response.put("version", "1.0.0");
        response.put("status", "🚀 Running Successfully");
        response.put("timestamp", LocalDateTime.now());
        response.put("description", "Real-Time Doubt-Solving Platform Backend");
        
        Map<String, Object> endpoints = new HashMap<>();
        endpoints.put("health", "/api/health");
        endpoints.put("authentication", "/api/auth/*");
        endpoints.put("users", "/api/users/*");
        endpoints.put("sessions", "/api/sessions/*");
        endpoints.put("doubts", "/api/doubts/*");
        endpoints.put("subscriptions", "/api/subscriptions/*");
        endpoints.put("payments", "/api/payments/*");
        endpoints.put("feedback", "/api/feedback/*");
        endpoints.put("websocket", "/api/ws");
        
        response.put("available_endpoints", endpoints);
        response.put("api_base_url", "/api");
        response.put("documentation", "Visit /api/health to check service status");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/welcome")
    public ResponseEntity<Map<String, Object>> welcomeApi() {
        return welcome();
    }
} 