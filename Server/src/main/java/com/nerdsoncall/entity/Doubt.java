package com.nerdsoncall.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "doubts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doubt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private User.Subject subject;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @ManyToOne
    @JoinColumn(name = "accepted_tutor_id")
    private User acceptedTutor; // Tutor who accepted this doubt

    @ElementCollection
    private List<String> attachments; // URLs to uploaded files/images

    private Long preferredTutorId; // If student wants specific tutor

    @Column(columnDefinition = "TEXT")
    private String solutionDescription; // Solution provided by tutor

    @Column(columnDefinition = "TEXT")
    private String videoUrl; // Solution video URL

    private LocalDateTime resolvedAt; // When the doubt was resolved

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum Status {
        OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CANCELLED
    }


}