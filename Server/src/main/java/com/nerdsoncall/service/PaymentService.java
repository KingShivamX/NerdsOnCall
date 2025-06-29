package com.nerdsoncall.service;

import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public Customer createCustomer(User user) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(user.getEmail())
                .setName(user.getFirstName() + " " + user.getLastName())
                .build();

        return Customer.create(params);
    }

    public Session createCheckoutSession(User user, Subscription.PlanType planType, String successUrl, String cancelUrl) throws StripeException {
        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .setCustomerEmail(user.getEmail());

        // Add price based on plan type
        String priceId = getPriceIdForPlan(planType);
        paramsBuilder.addLineItem(
                SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build()
        );

        // Add metadata
        paramsBuilder.putMetadata("user_id", user.getId().toString());
        paramsBuilder.putMetadata("plan_type", planType.name());

        return Session.create(paramsBuilder.build());
    }

    public PaymentIntent createPaymentIntent(User user, long amount, String currency) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .putMetadata("user_id", user.getId().toString())
                .build();

        return PaymentIntent.create(params);
    }

    private String getPriceIdForPlan(Subscription.PlanType planType) {
        // These should be configured in Stripe Dashboard and stored in environment variables
        Map<Subscription.PlanType, String> priceIds = new HashMap<>();
        priceIds.put(Subscription.PlanType.BASIC, "price_basic_monthly");
        priceIds.put(Subscription.PlanType.STANDARD, "price_standard_monthly");
        priceIds.put(Subscription.PlanType.PREMIUM, "price_premium_monthly");
        
        return priceIds.get(planType);
    }

    public void processWebhook(String payload, String sigHeader) {
        // Webhook processing logic for Stripe events
        // This would handle events like subscription created, updated, cancelled, etc.
    }
} 