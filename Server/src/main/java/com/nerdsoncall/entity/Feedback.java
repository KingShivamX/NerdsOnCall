package com.nerdsoncall.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer; // Student or Tutor giving feedback

    @ManyToOne
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee; // Student or Tutor receiving feedback

    @Column(nullable = false)
    private Integer rating; // 1-5 stars

    @Lob
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum Type {
        STUDENT_TO_TUTOR, TUTOR_TO_STUDENT
    }
} 