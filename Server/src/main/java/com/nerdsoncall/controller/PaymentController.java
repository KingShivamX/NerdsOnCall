package com.nerdsoncall.controller;

import com.nerdsoncall.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.entity.Plan;
import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.service.UserService;
import com.nerdsoncall.service.PlanService;
import com.nerdsoncall.service.SubscriptionService;
import com.nerdsoncall.service.EmailService;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private UserService userService;
    @Autowired
    private PlanService planService;
    @Autowired
    private SubscriptionService subscriptionService;
    @Autowired
    private EmailService emailService;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyRazorpayPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature,
            @RequestParam Long planId,
            @RequestParam String userEmail) {

                System.out.println("hieee");
                System.out.println(orderId);
                System.out.println(paymentId);
                System.out.println(signature);
                System.out.println(planId);
                System.out.println(userEmail);
        boolean isValid = paymentService.verifyOrder(orderId, paymentId, signature);
        // boolean isValid = true;
        if (isValid) {
            // Find subscription by orderId
            Subscription subscription = subscriptionService.findByRazorpayOrderId(orderId).orElse(null);
            if (subscription == null) {
                return ResponseEntity.badRequest().body("Subscription not found for this order");
            }
            
            // Activate subscription
            subscription.setStatus(Subscription.Status.ACTIVE);
            subscription.setStartDate(java.time.LocalDateTime.now());
            // Set endDate based on planType
            java.time.LocalDateTime newEndDate;
            switch (subscription.getPlanType()) {
                case "BASIC":
                    newEndDate = subscription.getStartDate().plusMonths(1);
                    break;
                case "STANDARD":
                    newEndDate = subscription.getStartDate().plusMonths(3);
                    break;
                case "PREMIUM":
                    newEndDate = subscription.getStartDate().plusYears(1);
                    break;
                default:
                    newEndDate = subscription.getStartDate().plusMonths(1);
            }
            subscription.setEndDate(newEndDate);
            subscriptionService.saveSubscription(subscription);
            // Send subscription receipt email with PDF attachment
            userService.findByEmail(userEmail).ifPresent(user -> {
                String userName = user.getFirstName() + (user.getLastName() != null ? (" " + user.getLastName()) : "");
                try {
                    emailService.sendSubscriptionReceiptWithPdf(
                        userEmail,
                        userName,
                        user,
                        subscription
                    );
                } catch (jakarta.mail.MessagingException | java.io.IOException e) {
                    System.err.println("Failed to send subscription receipt email with PDF: " + e.getMessage());
                    e.printStackTrace();
                }
            });
            return ResponseEntity.ok(subscription);
        } else {
            return ResponseEntity.badRequest().body("Payment verification failed");
        }
    }
} 