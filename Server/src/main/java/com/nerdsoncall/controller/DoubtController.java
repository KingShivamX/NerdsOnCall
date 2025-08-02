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
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/doubts")
@CrossOrigin(origins = "*")
public class DoubtController {

    @Autowired
    private DoubtService doubtService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createDoubt(@Valid @RequestBody CreateDoubtRequest request,
            Authentication authentication) {
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
            doubt.setPriority(request.getPriorityEnum());
            doubt.setAttachments(request.getAttachments());
            doubt.setPreferredTutorId(request.getPreferredTutorId());

            Doubt savedDoubt = doubtService.createDoubt(doubt);
            return ResponseEntity.ok(savedDoubt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create doubt: " + e.getMessage());
        }
    }

    @GetMapping("/student")
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

    @GetMapping("/tutor")
    public ResponseEntity<?> getAvailableDoubts(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String priority,
            Authentication authentication) {
        try {
            User tutor = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (tutor.getRole() != User.Role.TUTOR) {
                return ResponseEntity.badRequest().body("Only tutors can view available doubts");
            }

            // Get all doubts for this tutor (both preferred and general)
            List<Doubt> doubts = doubtService.getAllDoubtsForTutor(tutor.getId());

            // // Apply filters if provided
            // if (subject != null && !subject.isEmpty()) {
            //     User.Subject subjectEnum = User.Subject.valueOf(subject.toUpperCase());
            //     doubts = doubts.stream()
            //             .filter(doubt -> doubt.getSubject() == subjectEnum)
            //             .toList();
            // }

            // if (status != null && !status.isEmpty()) {
            //     Doubt.Status statusEnum = Doubt.Status.valueOf(status.toUpperCase());
            //     doubts = doubts.stream()
            //             .filter(doubt -> doubt.getStatus() == statusEnum)
            //             .toList();
            // }

            // if (state != null && !state.isEmpty()) {
            //     Doubt.State stateEnum = Doubt.State.valueOf(state.toUpperCase());
            //     doubts = doubts.stream()
            //             .filter(doubt -> doubt.getState() == stateEnum)
            //             .toList();
            // }

            // if (priority != null && !priority.isEmpty()) {
            //     Doubt.Priority priorityEnum = Doubt.Priority.valueOf(priority.toUpperCase());
            //     doubts = doubts.stream()
            //             .filter(doubt -> doubt.getPriority() == priorityEnum)
            //             .toList();
            // }

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
            List<Doubt> doubts = doubtService.getAllDoubtsByPreferredTutor(tutor.getId());
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
    public ResponseEntity<?> updateDoubtStatus(@PathVariable Long id, @RequestParam String status, Authentication authentication) {
        try {
            System.out.println(id);
            System.out.println(status);
            Doubt.Status statusEnum = Doubt.Status.valueOf(status.toUpperCase());
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (statusEnum == Doubt.Status.ASSIGNED) {
                if (user.getRole() != User.Role.TUTOR) {
                    return ResponseEntity.badRequest().body("Only tutors can accept doubts");
                }
                Doubt updatedDoubt = doubtService.updateDoubtStatus(id, statusEnum, user);
                return ResponseEntity.ok(updatedDoubt);
            } else {
                Doubt updatedDoubt = doubtService.updateDoubtStatus(id, statusEnum, null);
                return ResponseEntity.ok(updatedDoubt);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update doubt status: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/solution")
    public ResponseEntity<?> submitSolution(
            @PathVariable Long id,
            @RequestPart("solutionDescription") String solutionDescription,
            @RequestPart(value = "videoFile", required = false) MultipartFile videoFile,
            Authentication authentication) {
        try {
            User tutor = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (tutor.getRole() != User.Role.TUTOR) {
                return ResponseEntity.badRequest().body("Only tutors can submit solutions");
            }

            Doubt updatedDoubt = doubtService.submitSolution(id, solutionDescription, videoFile, tutor);
            return ResponseEntity.ok(updatedDoubt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to submit solution: " + e.getMessage());
        }
    }


}