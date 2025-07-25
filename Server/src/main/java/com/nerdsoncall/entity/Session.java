package com.nerdsoncall.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;

    @ManyToOne
    @JoinColumn(name = "doubt_id", nullable = false)
    private Doubt doubt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long durationMinutes = 0L;

    @Column(precision = 10, scale = 2)
    private BigDecimal cost = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal tutorEarnings = BigDecimal.ZERO;

    private String sessionId; // Unique session identifier for WebRTC
    private String roomId; // Video call room ID

    @Lob
    private String sessionNotes;

    @Lob
    private String canvasData; // JSON data for canvas drawings

    private Boolean recordingEnabled = false;
    private String recordingUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(precision = 10)
    private Double amount;

    @Column(precision = 10)
    private Double commission;

    public enum Status {
        PENDING, ACTIVE, COMPLETED, CANCELLED, TIMEOUT
    }

    public enum PaymentStatus {
        PAID, PENDING, PROCESSING, FAILED
    }
} 