package com.nerdsoncall.dto;

import com.nerdsoncall.entity.CommonQuestion.Subject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateQuestionRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Subject is required")
    private Subject subject;
}
