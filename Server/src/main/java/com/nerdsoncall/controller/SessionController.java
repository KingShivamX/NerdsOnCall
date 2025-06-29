package com.nerdsoncall.controller;

import com.nerdsoncall.dto.CreateSessionRequest;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.SessionService;
import com.nerdsoncall.service.SubscriptionService;
import com.nerdsoncall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<?> createSession(@Valid @RequestBody CreateSessionRequest request, Authentication authentication) {
        try {
            User tutor = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (tutor.getRole() != User.Role.TUTOR) {
                return ResponseEntity.badRequest().body("Only tutors can create sessions");
            }

            // Check if student has active subscription
            User student = userService.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            if (!subscriptionService.canUserCreateSession(student)) {
                return ResponseEntity.badRequest().body("Student doesn't have an active subscription or has exceeded session limits");
            }

            Session session = sessionService.createSession(request.getDoubtId(), tutor.getId());
            
            // Increment session usage for student
            subscriptionService.incrementSessionUsage(student);

            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create session: " + e.getMessage());
        }
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<?> getMySessions(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Session> sessions = sessionService.getSessionsByUser(user);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get sessions: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable Long id) {
        try {
            Session session = sessionService.findBySessionId(id.toString())
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get session: " + e.getMessage());
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionBySessionId(@PathVariable String sessionId) {
        try {
            Session session = sessionService.findBySessionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get session: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<?> endSession(@PathVariable Long id, Authentication authentication) {
        try {
            Session session = sessionService.endSession(id);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to end session: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<?> updateSessionNotes(@PathVariable Long id, @RequestBody String notes) {
        try {
            Session session = sessionService.updateSessionNotes(id, notes);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update session notes: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/canvas")
    public ResponseEntity<?> updateCanvasData(@PathVariable Long id, @RequestBody String canvasData) {
        try {
            Session session = sessionService.updateCanvasData(id, canvasData);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update canvas data: " + e.getMessage());
        }
    }
} 