package com.nerdsoncall.service;

import com.nerdsoncall.entity.Payout;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.PayoutRepository;
import com.nerdsoncall.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
public class PayoutService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private RazorpayPayoutService razorpayPayoutService;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void createMonthlyPayouts() {
        try {
            System.out.println("---------------------------------------");
            System.out.println("Creating monthly payouts");
            System.out.println(LocalDate.now());
            // Payouts for the current month
            YearMonth currentMonth = YearMonth.now();
            LocalDateTime periodStart = currentMonth.atDay(1).atStartOfDay();
            LocalDateTime periodEnd = currentMonth.atEndOfMonth().atTime(23, 59, 59);

            // 1. Fetch all completed sessions with pending payments for the current month in one query
            List<Session> allUnpaidSessions = sessionRepository.findAllCompletedUnpaidSessionsInPeriod(Session.Status.COMPLETED, Session.PaymentStatus.PENDING, periodStart, periodEnd);

            // 2. Group sessions by tutor in memory
            Map<User, List<Session>> sessionsByTutor = allUnpaidSessions.stream()
                    .collect(Collectors.groupingBy(Session::getTutor));

            // 3. Create a payout for each tutor
            for (Map.Entry<User, List<Session>> entry : sessionsByTutor.entrySet()) {
                User tutor = entry.getKey();
                List<Session> unpaidSessions = entry.getValue();

                boolean payoutExists = payoutRepository.existsByTutorAndPeriodStartAndPeriodEnd(tutor, periodStart, periodEnd);
                if (payoutExists) {
                    continue;
                }

                Double totalEarnings = unpaidSessions.stream().mapToDouble(s -> s.getTutorEarnings() != null ? s.getTutorEarnings().doubleValue() : 0.0).sum();
                if (totalEarnings <= 0) {
                    continue;
                }

                // Track session IDs in payout
                String sessionIds = unpaidSessions.stream().map(s -> s.getId().toString()).collect(Collectors.joining(","));
                System.out.println("Creating payout for " + tutor.getFirstName() + " for " + totalEarnings + " for " + sessionIds);
                Payout payout = new Payout();
                payout.setTutor(tutor);
                payout.setAmount(totalEarnings);
                payout.setPeriodStart(periodStart);
                payout.setPeriodEnd(periodEnd);
                payout.setStatus(Payout.Status.PENDING);
                payout.setDescription("Monthly payout for " + currentMonth.getMonth().name() + " " + currentMonth.getYear());
                payout.setSessionIds(sessionIds);
                payoutRepository.save(payout);
            }
        } catch (Exception e) {
            System.err.println("Error creating monthly payouts: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create monthly payouts: " + e.getMessage());
        }
    }

    @Transactional
    public void executePendingPayouts() {
        System.out.println("---------------------------------------");
        System.out.println("Executing pending payouts");
        System.out.println(LocalDate.now());
        List<Payout> pendingPayouts = payoutRepository.findByStatus(Payout.Status.PENDING);
        for (Payout payout : pendingPayouts) {
            try {
                payout.setStatus(Payout.Status.PROCESSING);
                payoutRepository.save(payout);

                User tutor = payout.getTutor();
                // Commented out Razorpay logic for dummy payout
                // if (tutor.getRazorpayContactId() == null) {
                //     String contactId = razorpayPayoutService.createContact(tutor);
                //     tutor.setRazorpayContactId(contactId);
                // }
                // String fundAccountId = razorpayPayoutService.createFundAccount(tutor);
                // String transactionId = razorpayPayoutService.processPayout(payout, fundAccountId);
                // payout.setTransactionId(transactionId);

                // Use dummy transactionId
                payout.setTransactionId("DUMMY-TRX-" + System.currentTimeMillis());
                payout.setStatus(Payout.Status.COMPLETED);
                payoutRepository.save(payout);

                // Mark all sessions in this payout as PAID
                if (payout.getSessionIds() != null && !payout.getSessionIds().isEmpty()) {
                    List<Long> sessionIds = Arrays.stream(payout.getSessionIds().split(","))
                            .map(Long::parseLong)
                            .collect(Collectors.toList());

                    // Batch update session statuses
                    sessionRepository.updatePaymentStatusForSessions(sessionIds, Session.PaymentStatus.PAID);
                }

                // Send payout completion email with PDF receipt to tutor
                emailService.sendMonthlyPayoutMailWithPdf(tutor, payout);
            } catch (Exception e) {
                payout.setStatus(Payout.Status.FAILED);
                payout.setDescription(payout.getDescription() + " - Failed: " + e.getMessage());
                payoutRepository.save(payout);
            }
        }
    }
} 
