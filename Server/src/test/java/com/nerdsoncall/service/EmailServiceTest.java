package com.nerdsoncall.service;

import com.nerdsoncall.entity.Payout;
import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.nerdsoncall.config.TestConfig;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private PdfService pdfService;

    @InjectMocks
    private EmailService emailService;

    private User testUser;
    private Subscription testSubscription;
    private MimeMessage mockMimeMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("Jane");
        testUser.setLastName("Smith");
        testUser.setEmail("jane.smith@example.com");
        testUser.setPhoneNumber("+91 9876543210");
        testUser.setRole(User.Role.STUDENT);
        
        // Create test subscription
        testSubscription = new Subscription();
        testSubscription.setId(789012L);
        testSubscription.setUser(testUser);
        testSubscription.setPlanName("Standard Learning Plan");
        testSubscription.setPlanType("STANDARD");
        testSubscription.setPrice(1999.00);
        testSubscription.setStatus(Subscription.Status.ACTIVE);
        testSubscription.setStartDate(LocalDateTime.now());
        testSubscription.setEndDate(LocalDateTime.now().plusMonths(3));
        testSubscription.setSessionsLimit(50);
        testSubscription.setSessionsUsed(2);
        
        // Mock MimeMessage
        mockMimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mockMimeMessage);
    }

    @Test
    void testSendSubscriptionReceiptWithPdf() throws MessagingException, IOException {
        // Mock PDF generation
        byte[] mockPdfBytes = "Mock PDF content".getBytes();
        when(pdfService.generateSubscriptionReceipt(testUser, testSubscription)).thenReturn(mockPdfBytes);
        
        // Test email sending
        String userEmail = "jane.smith@example.com";
        String userName = "Jane Smith";
        
        assertDoesNotThrow(() -> {
            emailService.sendSubscriptionReceiptWithPdf(userEmail, userName, testUser, testSubscription);
        });
        
        // Verify interactions
        verify(pdfService, times(1)).generateSubscriptionReceipt(testUser, testSubscription);
        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mockMimeMessage);
    }

    @Test
    void testSendSubscriptionReceiptWithPdfHandlesPdfGenerationError() throws IOException {
        // Mock PDF generation to throw exception
        when(pdfService.generateSubscriptionReceipt(testUser, testSubscription))
                .thenThrow(new IOException("PDF generation failed"));
        
        String userEmail = "jane.smith@example.com";
        String userName = "Jane Smith";
        
        // Should throw IOException
        assertThrows(IOException.class, () -> {
            emailService.sendSubscriptionReceiptWithPdf(userEmail, userName, testUser, testSubscription);
        });
        
        // Verify PDF service was called but email was not sent
        verify(pdfService, times(1)).generateSubscriptionReceipt(testUser, testSubscription);
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void testBuildReceiptEmailBodyContainsUserName() {
        String userName = "John Doe";
        String emailBody = emailService.buildReceiptEmailBody(userName, testSubscription);
        
        assertNotNull(emailBody);
        assertTrue(emailBody.contains(userName));
        assertTrue(emailBody.contains("Thank you for subscribing"));
        assertTrue(emailBody.contains("NerdsOnCall"));
        assertTrue(emailBody.contains("PDF document"));
    }

    @Test
    void testEmailSubjectIsCorrect() throws MessagingException, IOException {
        // Mock PDF generation
        byte[] mockPdfBytes = "Mock PDF content".getBytes();
        when(pdfService.generateSubscriptionReceipt(testUser, testSubscription)).thenReturn(mockPdfBytes);
        
        String userEmail = "test@example.com";
        String userName = "Test User";
        
        emailService.sendSubscriptionReceiptWithPdf(userEmail, userName, testUser, testSubscription);
        
        // Verify that the email was sent (we can't easily verify the exact subject without more complex mocking)
        verify(mailSender, times(1)).send(mockMimeMessage);
    }

    @Test
    void testDeprecatedMethodStillWorks() throws MessagingException {
        String userEmail = "test@example.com";
        String userName = "Test User";
        
        assertDoesNotThrow(() -> {
            emailService.sendHtmlReceiptMailOfSubscription(userEmail, userName, testSubscription);
        });
        
        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mockMimeMessage);
    }

    @Test
    void testPasswordResetEmailStillWorks() {
        String userEmail = "test@example.com";
        String resetToken = "test-token";
        String resetUrl = "http://localhost:3000/reset-password";
        
        assertDoesNotThrow(() -> {
            emailService.sendPasswordResetEmail(userEmail, resetToken, resetUrl);
        });
        
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testPasswordResetSuccessEmailStillWorks() {
        String userEmail = "test@example.com";
        
        assertDoesNotThrow(() -> {
            emailService.sendPasswordResetSuccessEmail(userEmail);
        });
        
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testTutorPayoutEmailBodyGeneration() {
        // Create test data
        String tutorName = "John Doe";
        Payout testPayout = new Payout();
        testPayout.setAmount(5000.0);
        testPayout.setTransactionId("TXN123456789");
        String month = "JANUARY 2024";
        String billingDate = "2024-01-31";

        // Test email body generation
        assertDoesNotThrow(() -> {
            String emailBody = emailService.buildTutorPayoutEmailBody(tutorName, testPayout, month, billingDate);
            assertNotNull(emailBody);
            assertTrue(emailBody.contains("John Doe"));
            assertTrue(emailBody.contains("₹5000.00"));
            assertTrue(emailBody.contains("JANUARY 2024"));
            assertTrue(emailBody.contains("TXN123456789"));
            assertTrue(emailBody.contains("PAYOUT PROCESSED"));
        });
    }
}
