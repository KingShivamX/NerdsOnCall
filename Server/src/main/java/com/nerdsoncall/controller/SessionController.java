package com.nerdsoncall.controller;

import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.SessionService;
import com.nerdsoncall.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createSession(@RequestParam Long tutorId, @RequestParam Long doubtId,
            Authentication authentication) {
        try {
            User student = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (student.getRole() != User.Role.STUDENT) {
                return ResponseEntity.badRequest().body("Only students can create sessions");
            }

            Session session = sessionService.createSession(student.getId(), tutorId, doubtId);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create session: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<?> startSession(@PathVariable Long id) {
        try {
            Session session = sessionService.startSession(id);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to start session: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<?> endSession(@PathVariable Long id) {
        try {
            Session session = sessionService.endSession(id);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to end session: " + e.getMessage());
        }
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<?> getMySessions(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Session> sessions;
            if (user.getRole() == User.Role.STUDENT) {
                sessions = sessionService.getSessionsByStudent(user.getId());
            } else if (user.getRole() == User.Role.TUTOR) {
                sessions = sessionService.getSessionsByTutor(user.getId());
            } else {
                return ResponseEntity.badRequest().body("Invalid user role");
            }

            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get sessions: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable Long id) {
        try {
            Session session = sessionService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get session: " + e.getMessage());
        }
    }

    @GetMapping("/doubt/{doubtId}")
    public ResponseEntity<?> getSessionByDoubtId(@PathVariable Long doubtId) {
        try {
            Session session = sessionService.findByDoubtId(doubtId)
                    .orElse(null);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get session: " + e.getMessage());
        }
    }
}