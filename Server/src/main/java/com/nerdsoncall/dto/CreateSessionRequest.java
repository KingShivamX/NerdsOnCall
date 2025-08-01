package com.nerdsoncall.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateSessionRequest {
    @NotNull(message = "Doubt ID is required")
    private Long doubtId;

    @NotNull(message = "Student ID is required")
    private Long studentId;
} 