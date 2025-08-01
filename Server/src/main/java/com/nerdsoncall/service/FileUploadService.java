package com.nerdsoncall.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap(
                    "resource_type", "auto",
                    "folder", "nerdsoncall"
                )
            );
            
            String secureUrl = (String) uploadResult.get("secure_url");
            logger.info("File uploaded successfully to Cloudinary: {}", secureUrl);
            return secureUrl;
        } catch (IOException e) {
            logger.error("Error uploading file to Cloudinary", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public String uploadBase64Image(String base64Image) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(base64Image, 
                ObjectUtils.asMap(
                    "resource_type", "image",
                    "folder", "nerdsoncall"
                )
            );
            
            String secureUrl = (String) uploadResult.get("secure_url");
            logger.info("Base64 image uploaded successfully to Cloudinary: {}", secureUrl);
            return secureUrl;
        } catch (IOException e) {
            logger.error("Error uploading base64 image to Cloudinary", e);
            throw new RuntimeException("Failed to upload base64 image", e);
        }
    }

    public boolean deleteFile(String publicId) {
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            logger.error("Error deleting file from Cloudinary", e);
            return false;
        }
    }
}