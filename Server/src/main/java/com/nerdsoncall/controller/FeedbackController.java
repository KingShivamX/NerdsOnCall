package com.nerdsoncall.controller;

import com.nerdsoncall.dto.CreateFeedbackRequest;
import com.nerdsoncall.entity.Feedback;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.FeedbackService;
import com.nerdsoncall.service.SessionService;
import com.nerdsoncall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<?> createFeedback(@Valid @RequestBody CreateFeedbackRequest request, Authentication authentication) {
        try {
            User reviewer = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Session session = sessionService.findBySessionId(request.getSessionId().toString())
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            User reviewee;
            Feedback.Type type;

            if (reviewer.getRole() == User.Role.STUDENT) {
                reviewee = session.getTutor();
                type = Feedback.Type.STUDENT_TO_TUTOR;
            } else {
                reviewee = session.getStudent();
                type = Feedback.Type.TUTOR_TO_STUDENT;
            }

            if (!feedbackService.canUserProvideFeedback(session, reviewer, type)) {
                return ResponseEntity.badRequest().body("Cannot provide feedback for this session");
            }

            Feedback feedback = feedbackService.createFeedback(
                    session, reviewer, reviewee, request.getRating(), request.getComment(), type
            );

            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create feedback: " + e.getMessage());
        }
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<?> getTutorFeedback(@PathVariable Long tutorId) {
        try {
            User tutor = userService.findById(tutorId)
                    .orElseThrow(() -> new RuntimeException("Tutor not found"));

            List<Feedback> feedback = feedbackService.getFeedbackForTutor(tutor);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get tutor feedback: " + e.getMessage());
        }
    }

    @GetMapping("/my-feedback")
    public ResponseEntity<?> getMyFeedback(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Feedback> feedback = feedbackService.getFeedbackByReviewer(user);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get feedback: " + e.getMessage());
        }
    }
} 