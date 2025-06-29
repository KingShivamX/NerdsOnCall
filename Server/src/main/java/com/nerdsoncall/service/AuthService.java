package com.nerdsoncall.service;

import com.nerdsoncall.entity.User;
import com.nerdsoncall.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update online status
        userService.updateOnlineStatus(user.getId(), true);

        return jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
    }

    public User register(User user) {
        return userService.createUser(user);
    }

    public void logout(String email) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userService.updateOnlineStatus(user.getId(), false);
    }
} 