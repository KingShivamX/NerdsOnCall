package com.nerdsoncall.controller;

import com.nerdsoncall.dto.CreateDoubtRequest;
import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.DoubtService;
import com.nerdsoncall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/doubts")
@CrossOrigin(origins = "*")
public class DoubtController {

    @Autowired
    private DoubtService doubtService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createDoubt(@Valid @RequestBody CreateDoubtRequest request, Authentication authentication) {
        try {
            User student = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (student.getRole() != User.Role.STUDENT) {
                return ResponseEntity.badRequest().body("Only students can create doubts");
            }

            Doubt doubt = new Doubt();
            doubt.setStudent(student);
            doubt.setSubject(request.getSubject());
            doubt.setTitle(request.getTitle());
            doubt.setDescription(request.getDescription());
            doubt.setPriority(request.getPriority());
            doubt.setAttachments(request.getAttachments());
            doubt.setPreferredTutorId(request.getPreferredTutorId());

            Doubt savedDoubt = doubtService.createDoubt(doubt);
            return ResponseEntity.ok(savedDoubt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create doubt: " + e.getMessage());
        }
    }

    @GetMapping("/my-doubts")
    public ResponseEntity<?> getMyDoubts(Authentication authentication) {
        try {
            User student = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Doubt> doubts = doubtService.getDoubtsByStudent(student);
            return ResponseEntity.ok(doubts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get doubts: " + e.getMessage());
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableDoubts(@RequestParam(required = false) String subject, Authentication authentication) {
        try {
            User tutor = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (tutor.getRole() != User.Role.TUTOR) {
                return ResponseEntity.badRequest().body("Only tutors can view available doubts");
            }

            List<Doubt> doubts;
            if (subject != null) {
                User.Subject subjectEnum = User.Subject.valueOf(subject.toUpperCase());
                doubts = doubtService.getOpenDoubtsBySubject(subjectEnum);
            } else {
                doubts = doubtService.getOpenDoubts();
            }

            return ResponseEntity.ok(doubts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get available doubts: " + e.getMessage());
        }
    }

    @GetMapping("/preferred")
    public ResponseEntity<?> getPreferredDoubts(Authentication authentication) {
        try {
            User tutor = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (tutor.getRole() != User.Role.TUTOR) {
                return ResponseEntity.badRequest().body("Only tutors can view preferred doubts");
            }

            List<Doubt> doubts = doubtService.getOpenDoubtsByPreferredTutor(tutor.getId());
            return ResponseEntity.ok(doubts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get preferred doubts: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoubtById(@PathVariable Long id) {
        try {
            Doubt doubt = doubtService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doubt not found"));
            return ResponseEntity.ok(doubt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get doubt: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDoubtStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Doubt.Status statusEnum = Doubt.Status.valueOf(status.toUpperCase());
            Doubt updatedDoubt = doubtService.updateDoubtStatus(id, statusEnum);
            return ResponseEntity.ok(updatedDoubt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update doubt status: " + e.getMessage());
        }
    }
} 