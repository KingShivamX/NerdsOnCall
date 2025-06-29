package com.nerdsoncall.controller;

import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody User updateData, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            User updatedUser = userService.updateUserProfile(user.getId(), updateData);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }

    @GetMapping("/tutors")
    public ResponseEntity<?> getOnlineTutors(@RequestParam(required = false) String subject) {
        try {
            List<User> tutors;
            if (subject != null) {
                User.Subject subjectEnum = User.Subject.valueOf(subject.toUpperCase());
                tutors = userService.findOnlineTutorsBySubject(subjectEnum);
            } else {
                tutors = userService.findOnlineTutors();
            }
            return ResponseEntity.ok(tutors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get tutors: " + e.getMessage());
        }
    }

    @GetMapping("/tutors/top-rated")
    public ResponseEntity<?> getTopRatedTutors(@RequestParam(required = false) String subject) {
        try {
            List<User> tutors;
            if (subject != null) {
                User.Subject subjectEnum = User.Subject.valueOf(subject.toUpperCase());
                tutors = userService.findTopRatedTutorsBySubject(subjectEnum);
            } else {
                tutors = userService.findTopRatedTutors();
            }
            return ResponseEntity.ok(tutors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get top rated tutors: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get user: " + e.getMessage());
        }
    }

    @PutMapping("/online-status")
    public ResponseEntity<?> updateOnlineStatus(@RequestParam boolean isOnline, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            User updatedUser = userService.updateOnlineStatus(user.getId(), isOnline);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update online status: " + e.getMessage());
        }
    }
} 