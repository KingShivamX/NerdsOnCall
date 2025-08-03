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
    
    Optional<Subscription> findByRazorpayOrderId(String razorpayOrderId);
    
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.endDate < :now")
    List<Subscription> findExpiredSubscriptions(LocalDateTime now);
    
    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.status = 'ACTIVE' AND s.endDate > :now")
    Optional<Subscription> findActiveSubscriptionByUser(User user, LocalDateTime now);

    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.status = 'ACTIVE'")
    Optional<Subscription> findActiveSubscriptionByUserIgnoreDate(User user);

    List<Subscription> findByStatus(Subscription.Status status);

    @Query("SELECT s FROM Subscription s WHERE s.status = 'EXPIRED' AND s.endDate < :cutoffDate")
    List<Subscription> findExpiredSubscriptionsOlderThan(LocalDateTime cutoffDate);
} 