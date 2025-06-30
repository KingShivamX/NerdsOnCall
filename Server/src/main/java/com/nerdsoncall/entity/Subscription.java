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
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanType planType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false, precision = 10)
    private Double price;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    private String stripeSubscriptionId;
    private String stripeCustomerId;

    private Integer sessionsUsed = 0;
    private Integer sessionsLimit;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PlanType {
        BASIC(9.99, 5),
        STANDARD(19.99, 15),
        PREMIUM(39.99, -1); // -1 means unlimited

        private final double price;
        private final int sessionsLimit;

        PlanType(double price, int sessionsLimit) {
            this.price = price;
            this.sessionsLimit = sessionsLimit;
        }

        public double getPrice() { return price; }
        public int getSessionsLimit() { return sessionsLimit; }
    }

    public enum Status {
        ACTIVE, CANCELED, EXPIRED, PAST_DUE
    }
} 