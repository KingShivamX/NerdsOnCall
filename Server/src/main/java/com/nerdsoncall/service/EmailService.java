package com.nerdsoncall.service;

import com.nerdsoncall.entity.Subscription;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    public String buildReceiptEmailBody(String userName, Subscription subscription) {
        return """
        <html>
        <body style=\"font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;\">
            <div style=\"max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">
                <h2 style=\"color: #4F46E5;\">🎉 Thank you for subscribing to NerdsOnCall!</h2>
                <p>Hi %s,</p>
                <p>Your subscription was successful. Below are your receipt details:</p>
                <hr>
                <p><strong>Receipt ID:</strong> %d</p>
                <p><strong>Plan Name:</strong> %s</p>
                <p><strong>Price:</strong> $%.2f</p>
                <p><strong>Status:</strong> %s</p>
                <p><strong>Start Date:</strong> %s</p>
                <p><strong>End Date:</strong> %s</p>
                <hr>
                <p><strong>NerdsOnCall</strong> is a real-time doubt-solving platform that connects students with tutors via live video calls, interactive whiteboards, and screen sharing. We’re thrilled to have you on board!</p>
                <p>If you have any questions, feel free to reply to this email.</p>
                <p style=\"margin-top: 20px;\">With 💡, <br>The NerdsOnCall Team</p>
            </div>
        </body>
        </html>
        """.formatted(
            userName,
            subscription.getId(),
            subscription.getPlanName(),
            subscription.getPrice(),
            subscription.getStatus(),
            subscription.getStartDate().toLocalDate(),
            subscription.getEndDate().toLocalDate()
        );
    }

    public void sendHtmlReceiptMailOfSubscription(String to, String userName, Subscription subscription) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject("Subscription Receipt - NerdsOnCall");
        helper.setText(buildReceiptEmailBody(userName, subscription), true);
        mailSender.send(message);
    }

    public void sendMonthlyPayoutMail(String to, String tutorName, double amount, String month, String billingDate, String transactionId) throws MessagingException {
        String subject = "Payout Processed - NerdsOnCall";
        String body = """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #4F46E5;">💰 Your Monthly Payout Has Been Processed</h2>
                    <p>Hi %s,</p>
                    <p>We're pleased to inform you that your monthly payout for <strong>%s</strong> has been successfully processed.</p>
                    <hr>
                    <p><strong>Amount:</strong> $%.2f</p>
                    <p><strong>Billing Date:</strong> %s</p>
                    <p><strong>Transaction ID:</strong> %s</p>
                    <hr>
                    <p>Thank you for your valuable contributions to the NerdsOnCall community.</p>
                    <p style="margin-top: 20px;">Warm regards, <br>The NerdsOnCall Team</p>
                </div>
            </body>
            </html>
            """.formatted(tutorName, month, amount, billingDate, transactionId);
    
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // true = HTML
    
        mailSender.send(message);
    }
    
} 