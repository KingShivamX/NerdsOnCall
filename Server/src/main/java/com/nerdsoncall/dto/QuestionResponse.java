package com.nerdsoncall.dto;

import com.nerdsoncall.entity.CommonQuestion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long tutorId;
    private String tutorName;
    private String questionTitle;
    private String questionDescription;
    private String subject;
    private String solutionDescription;
    private String videoUrl;
    private List<String> imageUrls;
    private Integer likesCount;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String status;
    
    public static QuestionResponse fromEntity(CommonQuestion question) {
        QuestionResponseBuilder builder = QuestionResponse.builder()
                .id(question.getId())
                .studentId(question.getStudent().getId())
                .studentName(question.getStudent().getFullName())
                .questionTitle(question.getQuestionTitle())
                .questionDescription(question.getQuestionDescription())
                .subject(question.getSubject().name())
                .solutionDescription(question.getSolutionDescription())
                .videoUrl(question.getVideoUrl())
                .imageUrls(question.getImageUrls())
                .likesCount(question.getLikesCount())
                .createdAt(question.getCreatedAt())
                .resolvedAt(question.getResolvedAt())
                .status(question.getStatus().name());
                
        if (question.getTutor() != null) {
            builder.tutorId(question.getTutor().getId())
                   .tutorName(question.getTutor().getFullName());
        }
        
        return builder.build();
    }
}
