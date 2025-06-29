package com.nerdsoncall.dto;

import com.nerdsoncall.entity.User;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private User user;
} 