package com.nerdsoncall.controller;

import com.nerdsoncall.dto.CreateQuestionRequest;
import com.nerdsoncall.dto.QuestionResponse;
import com.nerdsoncall.dto.SubmitSolutionRequest;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.CommonQuestionService;
import com.nerdsoncall.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class CommonQuestionController {

    private final CommonQuestionService questionService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request,
            Authentication authentication
    ) {
        try {
            // Get authenticated student
            User student = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // Check if user is a student
            if (student.getRole() != User.Role.STUDENT) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only students can post questions");
            }

            QuestionResponse response = questionService.createQuestion(request, student.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating question");
        }
    }

    @PostMapping("/{id}/solution")
    public ResponseEntity<QuestionResponse> submitSolution(
            @PathVariable Long id,
            @RequestPart("solutionDescription") String solutionDescription,
            @RequestPart("videoFile") MultipartFile videoFile,
            Authentication authentication
    ) {
        try {
            // Get authenticated tutor
            User tutor = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // Check if user is a tutor
            if (tutor.getRole() != User.Role.TUTOR) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only tutors can submit solutions");
            }

            SubmitSolutionRequest request = new SubmitSolutionRequest();
            request.setSolutionDescription(solutionDescription);
            request.setVideoFile(videoFile);

            QuestionResponse response = questionService.submitSolution(id, request, tutor.getId());
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error submitting solution");
        }
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAllQuestions(
            @RequestParam(required = false) String status
    ) {
        try {
            List<QuestionResponse> questions;
            if (status != null && !status.isEmpty()) {
                questions = questionService.getQuestionsByStatus(status);
            } else {
                questions = questionService.getAllQuestions();
            }
            return ResponseEntity.ok(questions);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving questions");
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<QuestionResponse> likeQuestion(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            // Get authenticated user (can be student or tutor)
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            QuestionResponse response = questionService.likeQuestion(id, user.getId());
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error liking question");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<QuestionResponse>> searchQuestions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String status
    ) {
        try {
            List<QuestionResponse> questions = questionService.searchQuestions(title, subject, status);
            return ResponseEntity.ok(questions);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error searching questions");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(
            @PathVariable Long id
    ) {
        try {
            QuestionResponse question = questionService.getQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving question");
        }
    }

    @GetMapping("/my-questions")
    public ResponseEntity<List<QuestionResponse>> getMyQuestions(
            Authentication authentication,
            @RequestParam(required = false) String status
    ) {
        try {
            // Get authenticated student
            User student = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // Check if user is a student
            if (student.getRole() != User.Role.STUDENT) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only students can access their questions");
            }

            List<QuestionResponse> questions;
            if (status != null && !status.isEmpty()) {
                questions = questionService.getQuestionsByStudentAndStatus(student.getId(), status);
            } else {
                questions = questionService.getQuestionsByStudent(student.getId());
            }
            return ResponseEntity.ok(questions);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving your questions");
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByStudent(
            @PathVariable Long studentId,
            @RequestParam(required = false) String status
    ) {
        try {
            List<QuestionResponse> questions;
            if (status != null && !status.isEmpty()) {
                questions = questionService.getQuestionsByStudentAndStatus(studentId, status);
            } else {
                questions = questionService.getQuestionsByStudent(studentId);
            }
            return ResponseEntity.ok(questions);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving student's questions");
        }
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByTutor(@PathVariable Long tutorId) {
        List<QuestionResponse> questions = questionService.getQuestionsByTutor(tutorId);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsBySubject(@PathVariable String subject) {
        List<QuestionResponse> questions = questionService.getQuestionsBySubject(subject);
        return ResponseEntity.ok(questions);
    }
}
