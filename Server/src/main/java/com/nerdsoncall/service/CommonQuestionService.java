package com.nerdsoncall.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nerdsoncall.dto.CreateQuestionRequest;
import com.nerdsoncall.dto.QuestionResponse;
import com.nerdsoncall.dto.SubmitSolutionRequest;
import com.nerdsoncall.entity.CommonQuestion;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.CommonQuestionRepository;
import com.nerdsoncall.repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j

@Service
@RequiredArgsConstructor
public class CommonQuestionService {

    private final CommonQuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    @Value("${app.video.max-size:10485760}") // 10MB default
    private long maxVideoSize;

    @Value("${app.video.allowed-types:video/mp4,video/webm,video/quicktime}")
    private String allowedVideoTypes;

    private void validateVideoFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Video file is required");
        }

        // Check file size
        if (file.getSize() > maxVideoSize) {
            String size = DataSize.ofBytes(maxVideoSize).toMegabytes() + "MB";
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, 
                "File size exceeds maximum allowed size of " + size);
        }

        // Check file type
        String contentType = file.getContentType();
        Set<String> allowedTypes = Arrays.stream(allowedVideoTypes.split(","))
                .map(String::trim)
                .collect(Collectors.toSet());

        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 
                "Invalid file type. Allowed types: " + allowedVideoTypes);
        }
    }

    private String uploadVideoToCloudinary(MultipartFile file) throws IOException {
        log.debug("Uploading video file to Cloudinary: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());
                
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "video",
                        "folder", "tutor_questions"
                )
        );
        
        String videoUrl = (String) uploadResult.get("secure_url");
        log.debug("Successfully uploaded video to: {}", videoUrl);
        
        return videoUrl;
    }

    @Transactional
    public QuestionResponse createQuestion(CreateQuestionRequest request, Long studentId) {
        log.info("Creating new question for student: {}", studentId);
        
        try {
            // Find student
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found with id: " + studentId));

            // Create and save question
            CommonQuestion question = new CommonQuestion();
            question.setStudent(student);
            question.setQuestionTitle(request.getTitle());
            question.setQuestionDescription(request.getDescription());
            question.setSubject(request.getSubject());
            question.setLikesCount(0);
            question.setStatus(CommonQuestion.QuestionStatus.PENDING);

            CommonQuestion savedQuestion = questionRepository.save(question);
            log.info("Created question with id: {}", savedQuestion.getId());
            
            return QuestionResponse.fromEntity(savedQuestion);
            
        } catch (ResponseStatusException e) {
            throw e; // Re-throw ResponseStatusException as is
        } catch (Exception e) {
            log.error("Error creating question", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create question");
        }
    }
    
    @Transactional
    public QuestionResponse submitSolution(Long questionId, SubmitSolutionRequest request, Long tutorId) {
        log.info("Submitting solution for question: {} by tutor: {}", questionId, tutorId);
        
        try {
            // Find question and tutor
            CommonQuestion question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId));
            
            User tutor = userRepository.findById(tutorId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor not found with id: " + tutorId));
            
            // Check if question is already resolved
            if (question.getStatus() == CommonQuestion.QuestionStatus.RESOLVED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This question is already resolved");
            }
            
            // Validate and upload video
            validateVideoFile(request.getVideoFile());
            String videoUrl = uploadVideoToCloudinary(request.getVideoFile());
            
            // Update question with solution
            question.setTutor(tutor);
            question.setSolutionDescription(request.getSolutionDescription());
            question.setVideoUrl(videoUrl);
            question.setStatus(CommonQuestion.QuestionStatus.RESOLVED);
            question.setResolvedAt(java.time.LocalDateTime.now());
            
            CommonQuestion updatedQuestion = questionRepository.save(question);
            log.info("Solution submitted for question: {}", questionId);
            
            return QuestionResponse.fromEntity(updatedQuestion);
            
        } catch (IOException e) {
            log.error("Error uploading video file", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload video file");
        } catch (ResponseStatusException e) {
            throw e; // Re-throw ResponseStatusException as is
        } catch (Exception e) {
            log.error("Error submitting solution", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to submit solution");
        }
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionResponse likeQuestion(Long questionId, Long userId) {
       
        log.info("Incrementing like count for question: {}", questionId);
        
        CommonQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId));
    
        
        question.setLikesCount(question.getLikesCount() + 1);
        CommonQuestion updatedQuestion = questionRepository.save(question);
        
        log.debug("Question {} like count updated to: {}", questionId, updatedQuestion.getLikesCount());
        return QuestionResponse.fromEntity(updatedQuestion);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByTutor(Long tutorId) {
        log.debug("Fetching questions for tutor: {}", tutorId);
        
        if (!userRepository.existsById(tutorId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor not found with id: " + tutorId);
        }
        
        return questionRepository.findByTutorIdOrderByCreatedAtDesc(tutorId).stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByStatus(String status) {
        log.debug("Fetching questions with status: {}", status);
        
        try {
            CommonQuestion.QuestionStatus questionStatus = CommonQuestion.QuestionStatus.valueOf(status.toUpperCase());
            return questionRepository.findByStatusOrderByCreatedAtDesc(questionStatus).stream()
                    .map(QuestionResponse::fromEntity)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value: " + status);
        }
    }
    
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByStudent(Long studentId) {
        log.debug("Fetching questions for student: {}", studentId);
        
        if (!userRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found with id: " + studentId);
        }
        
        return questionRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByStudentAndStatus(Long studentId, String status) {
        log.debug("Fetching questions for student: {} with status: {}", studentId, status);
        
        if (!userRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found with id: " + studentId);
        }
        
        try {
            CommonQuestion.QuestionStatus questionStatus = CommonQuestion.QuestionStatus.valueOf(status.toUpperCase());
            return questionRepository.findByStudentIdAndStatusOrderByCreatedAtDesc(studentId, questionStatus).stream()
                    .map(QuestionResponse::fromEntity)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value: " + status);
        }
    }
    
    @Transactional(readOnly = true)
    public List<QuestionResponse> searchQuestions(String title, String subject, String status) {
        log.debug("Searching questions with title: {}, subject: {}, status: {}", title, subject, status);
        
        CommonQuestion.QuestionStatus questionStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                questionStatus = CommonQuestion.QuestionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value: " + status);
            }
        }
        
        CommonQuestion.Subject subjectEnum = null;
        if (subject != null && !subject.isEmpty()) {
            try {
                subjectEnum = CommonQuestion.Subject.valueOf(subject.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid subject value: " + subject);
            }
        }
        
        List<CommonQuestion> questions;
        if (title != null && !title.isEmpty()) {
            if (subjectEnum != null && questionStatus != null) {
                questions = questionRepository.findByQuestionTitleContainingIgnoreCaseAndSubjectAndStatusOrderByCreatedAtDesc(
                    title, subjectEnum, questionStatus);
            } else if (subjectEnum != null) {
                questions = questionRepository.findByQuestionTitleContainingIgnoreCaseAndSubjectOrderByCreatedAtDesc(
                    title, subjectEnum);
            } else if (questionStatus != null) {
                questions = questionRepository.findByQuestionTitleContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(
                    title, questionStatus);
            } else {
                questions = questionRepository.findByQuestionTitleContainingIgnoreCaseOrderByCreatedAtDesc(title);
            }
        } else if (subjectEnum != null) {
            if (questionStatus != null) {
                questions = questionRepository.findBySubjectAndStatusOrderByCreatedAtDesc(subjectEnum, questionStatus);
            } else {
                questions = questionRepository.findBySubjectOrderByCreatedAtDesc(subjectEnum);
            }
        } else if (questionStatus != null) {
            questions = questionRepository.findByStatusOrderByCreatedAtDesc(questionStatus);
        } else {
            questions = questionRepository.findAllByOrderByCreatedAtDesc();
        }
        
        return questions.stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long id) {
        log.debug("Fetching question with id: {}", id);
        
        if (id == null) {
            throw new IllegalArgumentException("Question ID cannot be null");
        }
        
        CommonQuestion question = questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + id));
                
        return QuestionResponse.fromEntity(question);
    }
    
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsBySubject(String subject) {
        log.debug("Fetching questions for subject: {}", subject);
        
        if (subject == null || subject.trim().isEmpty()) {
            throw new IllegalArgumentException("Subject cannot be empty");
        }
        
        try {
            CommonQuestion.Subject subjectEnum = CommonQuestion.Subject.valueOf(subject.toUpperCase());
            return questionRepository.findBySubjectOrderByCreatedAtDesc(subjectEnum).stream()
                    .map(QuestionResponse::fromEntity)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid subject: " + subject);
        }
    }
}
