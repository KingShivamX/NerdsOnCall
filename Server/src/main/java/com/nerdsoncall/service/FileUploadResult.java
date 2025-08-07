package com.nerdsoncall.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Result classes for file upload operations with comprehensive error information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResult {
    private boolean success;
    private String filename;
    private String filePath;
    private long fileSize;
    private String errorMessage;
    private LocalDateTime timestamp;

    public static FileUploadResult success(String filename, String filePath, long fileSize) {
        return new FileUploadResult(true, filename, filePath, fileSize, null, LocalDateTime.now());
    }

    public static FileUploadResult error(String errorMessage) {
        return new FileUploadResult(false, null, null, 0, errorMessage, LocalDateTime.now());
    }
}
