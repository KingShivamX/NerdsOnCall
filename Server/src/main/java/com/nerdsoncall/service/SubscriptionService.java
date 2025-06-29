package com.nerdsoncall.service;

import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Subscription createSubscription(User user, Subscription.PlanType planType, String stripeSubscriptionId, String stripeCustomerId) {
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlanType(planType);
        subscription.setStatus(Subscription.Status.ACTIVE);
        subscription.setPrice(BigDecimal.valueOf(planType.getPrice()));
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusMonths(1));
        subscription.setStripeSubscriptionId(stripeSubscriptionId);
        subscription.setStripeCustomerId(stripeCustomerId);
        subscription.setSessionsLimit(planType.getSessionsLimit());

        return subscriptionRepository.save(subscription);
    }

    public Optional<Subscription> getActiveSubscription(User user) {
        return subscriptionRepository.findActiveSubscriptionByUser(user);
    }

    public List<Subscription> getSubscriptionsByUser(User user) {
        return subscriptionRepository.findByUser(user);
    }

    public boolean canUserCreateSession(User user) {
        Optional<Subscription> activeSubscription = getActiveSubscription(user);
        if (activeSubscription.isEmpty()) {
            return false;
        }

        Subscription subscription = activeSubscription.get();
        
        // Check if subscription is still active
        if (subscription.getStatus() != Subscription.Status.ACTIVE) {
            return false;
        }

        // Check if within date range
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(subscription.getStartDate()) || now.isAfter(subscription.getEndDate())) {
            return false;
        }

        // Check session limits (unlimited if limit is -1)
        if (subscription.getSessionsLimit() != -1) {
            return subscription.getSessionsUsed() < subscription.getSessionsLimit();
        }

        return true;
    }

    public void incrementSessionUsage(User user) {
        Optional<Subscription> activeSubscription = getActiveSubscription(user);
        if (activeSubscription.isPresent()) {
            Subscription subscription = activeSubscription.get();
            subscription.setSessionsUsed(subscription.getSessionsUsed() + 1);
            subscriptionRepository.save(subscription);
        }
    }

    public Subscription updateSubscriptionStatus(String stripeSubscriptionId, Subscription.Status status) {
        Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        subscription.setStatus(status);
        return subscriptionRepository.save(subscription);
    }

    public List<Subscription> getExpiredSubscriptions() {
        return subscriptionRepository.findExpiredSubscriptions(LocalDateTime.now());
    }

    public void processExpiredSubscriptions() {
        List<Subscription> expiredSubscriptions = getExpiredSubscriptions();
        expiredSubscriptions.forEach(subscription -> {
            subscription.setStatus(Subscription.Status.EXPIRED);
            subscriptionRepository.save(subscription);
        });
    }

    public Subscription cancelSubscription(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        subscription.setStatus(Subscription.Status.CANCELED);
        return subscriptionRepository.save(subscription);
    }
} 