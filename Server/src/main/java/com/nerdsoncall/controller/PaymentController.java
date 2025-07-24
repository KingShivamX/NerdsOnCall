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

    @PostMapping("/verify")
    public ResponseEntity<?> verifyRazorpayPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature,
            @RequestParam Long planId,
            @RequestParam String userEmail) {
        boolean isValid = paymentService.verifyOrder(orderId, paymentId, signature);
        if (isValid) {
            // Find user and plan
            User user = userService.findByEmail(userEmail).orElse(null);
            Plan plan = planService.getPlanEntity(planId).orElse(null);
            if (user == null || plan == null) {
                return ResponseEntity.badRequest().body("User or plan not found");
            }
            // Create subscription with plan details
            Subscription subscription = new Subscription();
            subscription.setUser(user);
            subscription.setStatus(Subscription.Status.ACTIVE);
            subscription.setPrice(plan.getPrice());
            subscription.setStartDate(java.time.LocalDateTime.now());
            subscription.setEndDate(java.time.LocalDateTime.now().plusMonths(1));
            subscription.setSessionsLimit(plan.getSessionsLimit());
            subscription.setSessionsUsed(0);
            subscription.setPlanName(plan.getName());
            subscriptionService.saveSubscription(subscription);
            return ResponseEntity.ok(subscription);
        } else {
            return ResponseEntity.badRequest().body("Payment verification failed");
        }
    }
} 