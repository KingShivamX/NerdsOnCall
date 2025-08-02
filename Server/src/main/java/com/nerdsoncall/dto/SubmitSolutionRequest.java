package com.nerdsoncall.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SubmitSolutionRequest {
    @NotBlank(message = "Solution description is required")
    private String solutionDescription;
    
    @NotNull(message = "Video file is required")
    private MultipartFile videoFile;
}
