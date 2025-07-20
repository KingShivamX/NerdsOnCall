package com.nerdsoncall.controller;

import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserService userService;

    @GetMapping("/auth")
    public ResponseEntity<?> testAuth(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body("Not authenticated");
        }

        User user = userService.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Authentication successful");
        response.put("user", user.getEmail());
        response.put("role", user.getRole());
        response.put("authenticated", true);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/public")
    public ResponseEntity<?> testPublic() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Public endpoint accessible");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}