package com.nerdsoncall.dto;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateDoubtRequest {
    @NotNull(message = "Subject is required")
    private User.Subject subject;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String priority = "MEDIUM";

    private List<String> attachments;

    private Long preferredTutorId;
    
    public Doubt.Priority getPriorityEnum() {
        try {
            return Doubt.Priority.valueOf(priority.toUpperCase());
        } catch (Exception e) {
            return Doubt.Priority.MEDIUM;
        }
    }
} 