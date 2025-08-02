package com.nerdsoncall.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePlanRequest {
    @NotBlank(message = "Plan name is required")
    private String name;

    @NotNull(message = "Price is required")
    private Double price;

    @NotNull(message = "Sessions limit is required")
    private Integer sessionsLimit;

    private String description;

    private Boolean isActive = true;

    private String duration;
} 