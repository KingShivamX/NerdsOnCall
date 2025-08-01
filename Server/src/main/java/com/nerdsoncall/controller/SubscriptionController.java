package com.nerdsoncall.controller;

import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.service.PaymentService;
import com.nerdsoncall.service.SubscriptionService;
import com.nerdsoncall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.nerdsoncall.entity.Plan;
import com.nerdsoncall.service.PlanService;
import java.util.List;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import java.util.Map;
import java.util.HashMap;

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

    @Autowired
    private PlanService planService;

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
    public ResponseEntity<?> createCheckoutOrder(
            @RequestParam Long planId,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != User.Role.STUDENT) {
                return ResponseEntity.badRequest().body("Only students can subscribe");
            }

            Plan plan = planService.getPlanEntity(planId)
                    .orElseThrow(() -> new RuntimeException("Plan not found"));

            // Convert USD to INR (matching frontend conversion)
            // Frontend uses: convertToINR(plan.price) = plan.price * 83
            double usdToInrRate = 83.0;
            double priceInINR = plan.getPrice() * usdToInrRate;
            
            // Amount in paise (Razorpay expects INR in paise)
            long amount = (long) (priceInINR * 100);
            String currency = "INR";
            String receipt = "receipt_" + user.getId() + "_" + System.currentTimeMillis();
            Order order = paymentService.createOrder(amount, currency, receipt);

            // Create a pending subscription linked to this order
            Subscription subscription = new Subscription();
            subscription.setUser(user);
            subscription.setStatus(Subscription.Status.PENDING);
            subscription.setPrice(priceInINR); // Store the converted INR price
            // Set start and end dates based on plan duration
            java.time.LocalDateTime startDate = java.time.LocalDateTime.now();
            java.time.LocalDateTime endDate;
            switch (plan.getDuration()) {
                case MONTHLY:
                    endDate = startDate.plusMonths(1);
                    break;
                case YEARLY:
                    endDate = startDate.plusYears(1);
                    break;
                case QUARTERLY:
                    endDate = startDate.plusMonths(3);
                    break;
                default:
                    endDate = startDate.plusMonths(1); // fallback
            }
            subscription.setStartDate(startDate);
            subscription.setEndDate(endDate);
            subscription.setSessionsLimit(plan.getSessionsLimit());
            subscription.setSessionsUsed(0);
            subscription.setPlanName(plan.getName());
            subscription.setStatus(Subscription.Status.ACTIVE);
            // Set planType based on duration
            String planType;
            switch (plan.getDuration()) {
                case MONTHLY:
                    planType = "BASIC";
                    break;
                case QUARTERLY:
                    planType = "STANDARD";
                    break;
                case YEARLY:
                    planType = "PREMIUM";
                    break;
                default:
                    planType = "BASIC";
            }
            subscription.setPlanType(planType);
            subscription.setRazorpayOrderId((String) order.get("id"));
            subscriptionService.saveSubscription(subscription);

            // Return order details needed for Razorpay checkout
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("key", paymentService.getRazorpayKeyId());
            response.put("name", plan.getName());
            response.put("description", plan.getDescription());
            response.put("userEmail", user.getEmail());
            response.put("planId", plan.getId());
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Failed to create Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create checkout order: " + e.getMessage());
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