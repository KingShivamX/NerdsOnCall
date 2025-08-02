package com.nerdsoncall.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "common_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id")
    private User tutor;
    
    @Column(name = "question_title", nullable = false)
    private String questionTitle;
    
    @Column(name = "question_description", nullable = false, columnDefinition = "TEXT")
    private String questionDescription;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Subject subject;
    
    @Column(name = "solution_description", columnDefinition = "TEXT")
    private String solutionDescription;
    
    @Column(name = "video_url", columnDefinition = "TEXT")
    private String videoUrl;

    @ElementCollection
    @CollectionTable(name = "question_images", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> imageUrls = new ArrayList<>();

    @Column(name = "likes_count", nullable = false)
    private Integer likesCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus status = QuestionStatus.PENDING;
    
    public enum QuestionStatus {
        PENDING, RESOLVED
    }
    
    public enum Subject {
        MATHEMATICS, PHYSICS, CHEMISTRY, BIOLOGY, COMPUTER_SCIENCE,
        ENGLISH, HISTORY, GEOGRAPHY, ECONOMICS, ACCOUNTING,
        STATISTICS, CALCULUS, ALGEBRA, GEOMETRY, TRIGONOMETRY
    }
}
