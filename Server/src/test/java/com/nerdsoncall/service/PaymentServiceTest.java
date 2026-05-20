package com.nerdsoncall.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link PaymentService#verifyOrder} — Razorpay payment signature verification.
 *
 * <p>We test {@code verifyOrder} without calling the real Razorpay API.
 * The secret key is injected via {@code ReflectionTestUtils} so {@code @PostConstruct}
 * (which creates a real RazorpayClient) never runs.</p>
 *
 * <p><b>Why this matters:</b> After a user pays, the frontend sends orderId + paymentId +
 * signature to the backend. {@code verifyOrder} uses HMAC-SHA256 to confirm the payment
 * is genuine before activating a subscription.</p>
 */
class PaymentServiceTest {

    private PaymentService paymentService;

    private static final String TEST_SECRET = "test_razorpay_secret_key_for_unit_tests";

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService();
        // Inject secret directly — skips @PostConstruct / real Razorpay client
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", TEST_SECRET);
        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "rzp_test_key_id");
    }

    @Test
    @DisplayName("verifyOrder — accepts a correctly signed payment")
    void verifyOrder_validSignature_returnsTrue() throws Exception {
        String orderId = "order_NOC123456";
        String paymentId = "pay_NOC789012";
        String validSignature = computeHmacSha256(orderId + "|" + paymentId, TEST_SECRET);

        assertTrue(paymentService.verifyOrder(orderId, paymentId, validSignature));
    }

    @Test
    @DisplayName("verifyOrder — rejects a tampered / wrong signature")
    void verifyOrder_invalidSignature_returnsFalse() {
        assertFalse(paymentService.verifyOrder("order_abc", "pay_xyz", "definitely_wrong_signature"));
    }

    @Test
    @DisplayName("verifyOrder — rejects empty signature")
    void verifyOrder_emptySignature_returnsFalse() {
        assertFalse(paymentService.verifyOrder("order_abc", "pay_xyz", ""));
    }

    @Test
    @DisplayName("getRazorpayKeyId — returns configured key id")
    void getRazorpayKeyId_returnsConfiguredValue() {
        assertEquals("rzp_test_key_id", paymentService.getRazorpayKeyId());
    }

    /**
     * Helper: computes HMAC-SHA256 hex digest (same algorithm as PaymentService).
     * Used to generate a valid signature for the positive test case.
     */
    private String computeHmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(keySpec);
        byte[] hash = mac.doFinal(data.getBytes());
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
