package com.nerdsoncall.service;

import com.nerdsoncall.entity.Payout;
import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PdfServiceTest {

    private PdfService pdfService;
    private User testUser;
    private Subscription testSubscription;

    @BeforeEach
    void setUp() {
        pdfService = new PdfService();
        
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setPhoneNumber("+91 9876543210");
        testUser.setRole(User.Role.STUDENT);
        
        // Create test subscription
        testSubscription = new Subscription();
        testSubscription.setId(123456L);
        testSubscription.setUser(testUser);
        testSubscription.setPlanName("Premium Learning Plan");
        testSubscription.setPlanType("PREMIUM");
        testSubscription.setPrice(2999.00);
        testSubscription.setStatus(Subscription.Status.ACTIVE);
        testSubscription.setStartDate(LocalDateTime.now());
        testSubscription.setEndDate(LocalDateTime.now().plusYears(1));
        testSubscription.setSessionsLimit(100);
        testSubscription.setSessionsUsed(5);
        testSubscription.setCreatedAt(LocalDateTime.now());
        testSubscription.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testGenerateSubscriptionReceipt() throws IOException {
        // Generate PDF
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        // Verify PDF was generated
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        
        // Verify PDF header (PDF files start with %PDF)
        String pdfHeader = new String(pdfBytes, 0, 4);
        assertEquals("%PDF", pdfHeader);
        
        // Save PDF for manual inspection (optional - comment out in production)
        try (FileOutputStream fos = new FileOutputStream("test_receipt.pdf")) {
            fos.write(pdfBytes);
            System.out.println("Test PDF saved as test_receipt.pdf for manual inspection");
        } catch (IOException e) {
            System.out.println("Could not save test PDF file: " + e.getMessage());
        }
    }

    @Test
    void testGenerateReceiptWithMinimalData() throws IOException {
        // Test with minimal subscription data
        Subscription minimalSubscription = new Subscription();
        minimalSubscription.setId(1L);
        minimalSubscription.setUser(testUser);
        minimalSubscription.setPlanName("Basic Plan");
        minimalSubscription.setPlanType("BASIC");
        minimalSubscription.setPrice(999.00);
        minimalSubscription.setStatus(Subscription.Status.ACTIVE);
        minimalSubscription.setStartDate(LocalDateTime.now());
        minimalSubscription.setEndDate(LocalDateTime.now().plusMonths(1));
        minimalSubscription.setSessionsLimit(10);
        minimalSubscription.setSessionsUsed(0);
        
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, minimalSubscription);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        assertEquals("%PDF", new String(pdfBytes, 0, 4));
    }

    @Test
    void testGenerateReceiptWithNullSessionsLimit() throws IOException {
        // Test with null sessions limit
        testSubscription.setSessionsLimit(null);
        testSubscription.setSessionsUsed(0);
        
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        assertEquals("%PDF", new String(pdfBytes, 0, 4));
    }

    @Test
    void testGenerateReceiptWithUserWithoutPhone() throws IOException {
        // Test with user without phone number
        testUser.setPhoneNumber(null);
        
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        assertEquals("%PDF", new String(pdfBytes, 0, 4));
    }

    @Test
    void testPdfSizeIsReasonable() throws IOException {
        byte[] pdfBytes = pdfService.generateSubscriptionReceipt(testUser, testSubscription);
        
        // PDF should be reasonable size (not too small, not too large)
        assertTrue(pdfBytes.length > 1000, "PDF should be at least 1KB");
        assertTrue(pdfBytes.length < 1024 * 1024, "PDF should be less than 1MB");
    }

    @Test
    void testGenerateTutorPayoutReceipt() throws IOException {
        // Create test tutor
        User testTutor = new User();
        testTutor.setFirstName("John");
        testTutor.setLastName("Doe");
        testTutor.setEmail("john.doe@example.com");
        testTutor.setPhoneNumber("1234567890");
        testTutor.setTotalSessions(25);
        testTutor.setTotalEarnings(12500.0);
        testTutor.setHourlyRate(500.0);

        // Create test payout
        Payout testPayout = new Payout();
        testPayout.setId(1L);
        testPayout.setAmount(5000.0);
        testPayout.setTransactionId("TXN123456789");
        testPayout.setStatus(Payout.Status.COMPLETED);
        testPayout.setPeriodStart(LocalDateTime.of(2024, 1, 1, 0, 0));
        testPayout.setPeriodEnd(LocalDateTime.of(2024, 1, 31, 23, 59));
        testPayout.setDescription("Monthly payout for January 2024");

        // Generate PDF
        byte[] pdfBytes = pdfService.generateTutorPayoutReceipt(testTutor, testPayout);

        // Verify PDF was generated
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);

        // Verify PDF header (PDF files start with %PDF)
        String pdfHeader = new String(pdfBytes, 0, 4);
        assertEquals("%PDF", pdfHeader);

        // PDF should be reasonable size (not too small, not too large)
        assertTrue(pdfBytes.length > 1000, "PDF should be at least 1KB");
        assertTrue(pdfBytes.length < 1024 * 1024, "PDF should be less than 1MB");

        System.out.println("Tutor Payout PDF generated successfully with size: " + pdfBytes.length + " bytes");
    }
}
