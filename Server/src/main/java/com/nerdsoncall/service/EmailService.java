package com.nerdsoncall.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetToken, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request - NerdsOnCall");
        message.setText(
            "Hello,\n\n" +
            "You have requested to reset your password for your NerdsOnCall account.\n\n" +
            "Please click the following link to reset your password:\n" +
            resetUrl + "?token=" + resetToken + "\n\n" +
            "This link will expire in 1 hour.\n\n" +
            "If you did not request this password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "NerdsOnCall Team"
        );
        
        mailSender.send(message);
    }

    public void sendPasswordResetSuccessEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Successful - NerdsOnCall");
        message.setText(
            "Hello,\n\n" +
            "Your password has been successfully reset for your NerdsOnCall account.\n\n" +
            "If you did not perform this action, please contact our support team immediately.\n\n" +
            "Best regards,\n" +
            "NerdsOnCall Team"
        );
        
        mailSender.send(message);
    }
} 