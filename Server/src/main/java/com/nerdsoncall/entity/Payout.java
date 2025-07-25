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
@Table(name = "payouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;

    @Column(nullable = false, precision = 10)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(nullable = false)
    private LocalDateTime periodStart;

    @Column(nullable = false)
    private LocalDateTime periodEnd;

    private String transactionId; // Generic field for the payment gateway's ID

    // Option 1: Comma-separated session IDs (simple, not normalized)
    private String sessionIds;

    @Lob
    private String description;

    private String failureReason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Status {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
} 