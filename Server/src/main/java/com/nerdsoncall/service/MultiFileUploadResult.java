package com.nerdsoncall.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Result class for multiple file uploads
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MultiFileUploadResult {
    private List<FileUploadResult> results = new ArrayList<>();
    private int successCount = 0;
    private int errorCount = 0;
    private String overallErrorMessage;
    private LocalDateTime timestamp = LocalDateTime.now();

    public void addResult(FileUploadResult result) {
        results.add(result);
        if (result.isSuccess()) {
            successCount++;
        } else {
            errorCount++;
        }
    }

    public static MultiFileUploadResult error(String errorMessage) {
        MultiFileUploadResult result = new MultiFileUploadResult();
        result.overallErrorMessage = errorMessage;
        return result;
    }

    public boolean isOverallSuccess() {
        return errorCount == 0 && successCount > 0;
    }

    public boolean hasPartialSuccess() {
        return successCount > 0 && errorCount > 0;
    }
}
