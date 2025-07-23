package com.nerdsoncall.dto;

import lombok.Data;

@Data
public class UpdatePlanRequest {
    private String name;
    private Double price;
    private Integer sessionsLimit;
    private String description;
    private Boolean isActive;
} 