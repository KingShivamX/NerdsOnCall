package com.nerdsoncall.repository;

import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    Optional<Subscription> findByUserAndStatus(User user, Subscription.Status status);
    
    List<Subscription> findByUser(User user);
    
    Optional<Subscription> findByStripeSubscriptionId(String stripeSubscriptionId);
    
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.endDate < :now")
    List<Subscription> findExpiredSubscriptions(LocalDateTime now);
    
    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.status = 'ACTIVE'")
    Optional<Subscription> findActiveSubscriptionByUser(User user);
    
    List<Subscription> findByStatus(Subscription.Status status);
} 