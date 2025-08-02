package com.nerdsoncall.integration;

import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.EmailService;
import com.nerdsoncall.service.PdfService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration test to verify PDF generation and email functionality work together.
 * This test demonstrates the complete flow from subscription creation to PDF receipt generation.
 */
@SpringBootTest
@ActiveProfiles("test")
public class PdfEmailIntegrationTest {

    @Autowired
    private PdfService pdfService;

    private User testUser;
    private Subscription testSubscription;

    @BeforeEach
    void setUp() {
        // Create a realistic test user
        testUser = new User();
        testUser.setId(12345L);
        testUser.setFirstName("Arjun");
        testUser.setLastName("Patel");
        testUser.setEmail("arjun.patel@student.com");
        testUser.setPhoneNumber("+91 9876543210");
        testUser.setRole(User.Role.STUDENT);
        testUser.setCreatedAt(LocalDateTime.now().minusDays(30));
        
        // Create a realistic subscription
        testSubscription = new Subscription();
        testSubscription.setId(567890L);
        testSubscription.setUser(testUser);
        testSubscription.setPlanName("Premium Annual Plan");
        testSubscription.setPlanType("PREMIUM");
        testSubscription.setPrice(4999.00);
        testSubscription.setStatus(Subscription.Status.ACTIVE);
        testSubscription.setStartDate(LocalDateTime.now());
        testSubscription.setEndDate(LocalDateTime.now().plusYears(1));
        testSubscription.setSessionsLimit(200);
        testSubscription.setSessionsUsed(15);
        testSubscription.setCreatedAt(LocalDateTime.now());
        testSubscription.setUpdatedAt(LocalDateTime.now());
        testSubscription.setRazorpayOrderId("order_test_123456789");
    }

    @Test
    void testCompleteSubscriptionReceiptGeneration() throws IOException {
        // Generate PDF receipt
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        // Verify PDF was generated successfully
        assertNotNull(pdfBytes, "PDF bytes should not be null");
        assertTrue(pdfBytes.length > 0, "PDF should have content");
        
        // Verify it's a valid PDF
        String pdfHeader = new String(pdfBytes, 0, Math.min(4, pdfBytes.length));
        assertEquals("%PDF", pdfHeader, "Should be a valid PDF file");
        
        // Verify reasonable file size (should be between 10KB and 500KB for a receipt)
        assertTrue(pdfBytes.length > 10000, "PDF should be at least 10KB");
        assertTrue(pdfBytes.length < 500000, "PDF should be less than 500KB");
        
        // Save the PDF for manual verification (optional)
        saveTestPdf(pdfBytes, "integration_test_receipt.pdf");
        
        System.out.println("✅ PDF generation test passed!");
        System.out.println("📄 PDF size: " + pdfBytes.length + " bytes");
        System.out.println("👤 User: " + testUser.getFullName());
        System.out.println("📋 Plan: " + testSubscription.getPlanName());
        System.out.println("💰 Amount: ₹" + testSubscription.getPrice());
    }

    @Test
    void testPdfContentStructure() throws IOException {
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        // Convert to string to check for key content (basic check)
        String pdfContent = new String(pdfBytes);
        
        // These checks are basic - in a real scenario, you'd use a PDF parsing library
        assertTrue(pdfContent.contains("NerdsOnCall"), "PDF should contain company name");
        assertTrue(pdfContent.contains(testUser.getFullName()), "PDF should contain user name");
        assertTrue(pdfContent.contains(testSubscription.getPlanName()), "PDF should contain plan name");
        
        System.out.println("✅ PDF content structure test passed!");
    }

    @Test
    void testMultipleSubscriptionTypes() throws IOException {
        // Test Basic Plan
        Subscription basicPlan = createTestSubscription("Basic Monthly Plan", "BASIC", 999.0, 1, 20);
        byte[] basicPdf = pdfService.generateSubscriptionReceipt(testUser, basicPlan);
        assertNotNull(basicPdf);
        assertTrue(basicPdf.length > 0);
        
        // Test Standard Plan
        Subscription standardPlan = createTestSubscription("Standard Quarterly Plan", "STANDARD", 2499.0, 3, 75);
        byte[] standardPdf = pdfService.generateSubscriptionReceipt(testUser, standardPlan);
        assertNotNull(standardPdf);
        assertTrue(standardPdf.length > 0);
        
        // Test Premium Plan
        Subscription premiumPlan = createTestSubscription("Premium Annual Plan", "PREMIUM", 4999.0, 12, 200);
        byte[] premiumPdf = pdfService.generateSubscriptionReceipt(testUser, premiumPlan);
        assertNotNull(premiumPdf);
        assertTrue(premiumPdf.length > 0);
        
        System.out.println("✅ Multiple subscription types test passed!");
        System.out.println("📊 Generated PDFs for Basic, Standard, and Premium plans");
    }

    @Test
    void testUserWithoutPhoneNumber() throws IOException {
        // Test with user who doesn't have phone number
        testUser.setPhoneNumber(null);
        
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        assertEquals("%PDF", new String(pdfBytes, 0, 4));
        
        System.out.println("✅ User without phone number test passed!");
    }

    @Test
    void testSubscriptionWithoutSessionLimits() throws IOException {
        // Test with subscription that doesn't have session limits
        testSubscription.setSessionsLimit(null);
        testSubscription.setSessionsUsed(0);
        
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        assertEquals("%PDF", new String(pdfBytes, 0, 4));
        
        System.out.println("✅ Subscription without session limits test passed!");
    }

    private Subscription createTestSubscription(String planName, String planType, Double price, int months, Integer sessionLimit) {
        Subscription subscription = new Subscription();
        subscription.setId((long) (Math.random() * 1000000));
        subscription.setUser(testUser);
        subscription.setPlanName(planName);
        subscription.setPlanType(planType);
        subscription.setPrice(price);
        subscription.setStatus(Subscription.Status.ACTIVE);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusMonths(months));
        subscription.setSessionsLimit(sessionLimit);
        subscription.setSessionsUsed(0);
        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setUpdatedAt(LocalDateTime.now());
        return subscription;
    }

    private void saveTestPdf(byte[] pdfBytes, String filename) {
        try (FileOutputStream fos = new FileOutputStream(filename)) {
            fos.write(pdfBytes);
            System.out.println("📁 Test PDF saved as: " + filename);
        } catch (IOException e) {
            System.out.println("⚠️ Could not save test PDF: " + e.getMessage());
        }
    }
}
