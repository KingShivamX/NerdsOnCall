package com.nerdsoncall.controller;

import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.PaymentService;
import com.nerdsoncall.service.SubscriptionService;
import com.nerdsoncall.service.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/my-subscription")
    public ResponseEntity<?> getMySubscription(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            java.util.Optional<Subscription> subscription = subscriptionService.getActiveSubscription(user);
            if (subscription.isPresent()) {
                return ResponseEntity.ok(subscription.get());
            } else {
                return ResponseEntity.ok("No active subscription");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get subscription: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getSubscriptionHistory(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Subscription> subscriptions = subscriptionService.getSubscriptionsByUser(user);
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get subscription history: " + e.getMessage());
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> createCheckoutSession(
            @RequestParam String planType,
            @RequestParam String successUrl,
            @RequestParam String cancelUrl,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != User.Role.STUDENT) {
                return ResponseEntity.badRequest().body("Only students can subscribe");
            }

            Subscription.PlanType plan = Subscription.PlanType.valueOf(planType.toUpperCase());
            Session session = paymentService.createCheckoutSession(user, plan, successUrl, cancelUrl);

            return ResponseEntity.ok(session.getUrl());
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Failed to create checkout session: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create checkout session: " + e.getMessage());
        }
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelSubscription(@PathVariable Long id, Authentication authentication) {
        try {
            Subscription cancelledSubscription = subscriptionService.cancelSubscription(id);
            return ResponseEntity.ok(cancelledSubscription);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to cancel subscription: " + e.getMessage());
        }
    }

    @GetMapping("/can-create-session")
    public ResponseEntity<?> canCreateSession(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean canCreate = subscriptionService.canUserCreateSession(user);
            return ResponseEntity.ok(canCreate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to check session eligibility: " + e.getMessage());
        }
    }
} 