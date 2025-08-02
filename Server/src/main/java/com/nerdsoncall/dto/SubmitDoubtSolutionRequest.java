package com.nerdsoncall.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubmitDoubtSolutionRequest {
    @NotBlank(message = "Solution description is required")
    private String solutionDescription;
    
    private String videoUrl; // Optional video solution
}
