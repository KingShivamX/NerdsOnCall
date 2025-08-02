package com.nerdsoncall.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PlanResponse {
    private Long id;
    private String name;
    private Double price;
    private Integer sessionsLimit;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String duration;
} 