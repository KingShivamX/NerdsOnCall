package com.nerdsoncall.service;

import com.nerdsoncall.entity.Subscription;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link SubscriptionService} — session limits & subscription validity.
 *
 * <p>These tests focus on business rules that gate video calls and doubt creation:
 * whether a user has an active plan, and whether they have sessions remaining.</p>
 *
 * <p><b>Key JUnit 5 assertions demonstrated:</b>
 * <ul>
 *   <li>{@code assertTrue / assertFalse} — boolean conditions</li>
 *   <li>{@code assertEquals} — exact value match</li>
 *   <li>{@code ArgumentCaptor} — capture what was passed to a mock for detailed inspection</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User student;
    private Subscription activeSubscription;

    @BeforeEach
    void setUp() {
        student = new User();
        student.setId(1L);
        student.setEmail("student@test.com");
        student.setRole(User.Role.STUDENT);

        activeSubscription = new Subscription();
        activeSubscription.setId(100L);
        activeSubscription.setUser(student);
        activeSubscription.setStatus(Subscription.Status.ACTIVE);
        activeSubscription.setPlanName("Standard Plan");
        activeSubscription.setPlanType("STANDARD");
        activeSubscription.setPrice(1999.0);
        activeSubscription.setStartDate(LocalDateTime.now().minusDays(1));
        activeSubscription.setEndDate(LocalDateTime.now().plusMonths(3));
        activeSubscription.setSessionsUsed(5);
        activeSubscription.setSessionsLimit(50);
    }

    // -------------------------------------------------------------------------
    // hasValidSubscription()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("hasValidSubscription — true when ACTIVE and within date range")
    void hasValidSubscription_activePlan_returnsTrue() {
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.of(activeSubscription));

        assertTrue(subscriptionService.hasValidSubscription(student));
    }

    @Test
    @DisplayName("hasValidSubscription — false when no subscription exists")
    void hasValidSubscription_noPlan_returnsFalse() {
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.empty());

        assertFalse(subscriptionService.hasValidSubscription(student));
    }

    @Test
    @DisplayName("hasValidSubscription — false when subscription is expired by date")
    void hasValidSubscription_expiredByDate_returnsFalse() {
        activeSubscription.setEndDate(LocalDateTime.now().minusDays(1));
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.of(activeSubscription));

        assertFalse(subscriptionService.hasValidSubscription(student));
    }

    // -------------------------------------------------------------------------
    // canUserCreateSession()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("canUserCreateSession — true when sessions remain")
    void canUserCreateSession_sessionsRemaining_returnsTrue() {
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.of(activeSubscription));

        assertTrue(subscriptionService.canUserCreateSession(student));
    }

    @Test
    @DisplayName("canUserCreateSession — false when session limit reached")
    void canUserCreateSession_limitReached_returnsFalse() {
        activeSubscription.setSessionsUsed(50);
        activeSubscription.setSessionsLimit(50);
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.of(activeSubscription));

        assertFalse(subscriptionService.canUserCreateSession(student));
    }

    @Test
    @DisplayName("canUserCreateSession — true with unlimited plan (limit = -1)")
    void canUserCreateSession_unlimitedPlan_returnsTrue() {
        activeSubscription.setSessionsUsed(999);
        activeSubscription.setSessionsLimit(-1);
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.of(activeSubscription));

        assertTrue(subscriptionService.canUserCreateSession(student));
    }

    // -------------------------------------------------------------------------
    // incrementSessionUsage() / decrementSessionUsage()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("incrementSessionUsage — bumps sessionsUsed by 1 and saves")
    void incrementSessionUsage_incrementsCounter() {
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.of(activeSubscription));

        subscriptionService.incrementSessionUsage(student);

        // ArgumentCaptor lets us inspect the exact object passed to save()
        ArgumentCaptor<Subscription> captor = ArgumentCaptor.forClass(Subscription.class);
        verify(subscriptionRepository).save(captor.capture());
        assertEquals(6, captor.getValue().getSessionsUsed());
    }

    @Test
    @DisplayName("decrementSessionUsage — does not go below zero")
    void decrementSessionUsage_atZero_doesNotDecrement() {
        activeSubscription.setSessionsUsed(0);
        when(subscriptionRepository.findActiveSubscriptionByUser(eq(student), any(LocalDateTime.class)))
                .thenReturn(Optional.of(activeSubscription));

        subscriptionService.decrementSessionUsage(student);

        verify(subscriptionRepository, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // processExpiredSubscriptions()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("processExpiredSubscriptions — marks expired subs as EXPIRED")
    void processExpiredSubscriptions_marksExpired() {
        Subscription expired = new Subscription();
        expired.setId(200L);
        expired.setUser(student);
        expired.setStatus(Subscription.Status.ACTIVE);
        expired.setEndDate(LocalDateTime.now().minusDays(5));

        when(subscriptionRepository.findExpiredSubscriptions(any(LocalDateTime.class)))
                .thenReturn(List.of(expired));

        subscriptionService.processExpiredSubscriptions();

        ArgumentCaptor<Subscription> captor = ArgumentCaptor.forClass(Subscription.class);
        verify(subscriptionRepository).save(captor.capture());
        assertEquals(Subscription.Status.EXPIRED, captor.getValue().getStatus());
    }
}
