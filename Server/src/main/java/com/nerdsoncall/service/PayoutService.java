package com.nerdsoncall.service;

import com.nerdsoncall.entity.Payout;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.PayoutRepository;
import com.nerdsoncall.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.mail.SimpleMailMessage;

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
        System.out.println("---------------------------------------");
        System.out.println("Creating monthly payouts");
        System.out.println(LocalDate.now());
        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        LocalDateTime periodStart = lastMonth.withDayOfMonth(1).atStartOfDay();
        LocalDateTime periodEnd = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth()).atTime(23, 59, 59);

        List<User> tutors = sessionRepository.findTutorsWithCompletedSessionsInPeriod(Session.Status.COMPLETED, periodStart, periodEnd);

        for (User tutor : tutors) {
            boolean payoutExists = payoutRepository.existsByTutorAndPeriodStartAndPeriodEnd(tutor, periodStart, periodEnd);
            if (payoutExists) {
                continue; 
            }

            // Only consider sessions with payment_status = PENDING
            List<Session> unpaidSessions = sessionRepository.findCompletedUnpaidSessionsByTutorAndDateRange(tutor, periodStart, periodEnd);
            if (unpaidSessions.isEmpty()) {
                continue;
            }
            Double totalEarnings = unpaidSessions.stream().mapToDouble(s -> s.getTutorEarnings() != null ? s.getTutorEarnings().doubleValue() : 0.0).sum();
            if (totalEarnings <= 0) {
                continue;
            }

            // Track session IDs in payout
            String sessionIds = unpaidSessions.stream().map(s -> s.getId().toString()).reduce((a, b) -> a + "," + b).orElse("");

            Payout payout = new Payout();
            payout.setTutor(tutor);
            payout.setAmount(totalEarnings);
            payout.setPeriodStart(periodStart);
            payout.setPeriodEnd(periodEnd);
            payout.setStatus(Payout.Status.PENDING);
            payout.setDescription("Monthly payout for " + lastMonth.getMonth().name() + " " + lastMonth.getYear());
            payout.setSessionIds(sessionIds);
            payoutRepository.save(payout);
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
                    String[] sessionIdArr = payout.getSessionIds().split(",");
                    for (String sessionIdStr : sessionIdArr) {
                        try {
                            Long sessionId = Long.parseLong(sessionIdStr);
                            Session session = sessionRepository.findById(sessionId).orElse(null);
                            if (session != null) {
                                session.setPaymentStatus(Session.PaymentStatus.PAID);
                                sessionRepository.save(session);
                            }
                        } catch (Exception ignored) {}
                    }
                }

                // Send payout completion email to tutor
                String month = payout.getPeriodStart().getMonth().name() + " " + payout.getPeriodStart().getYear();
                String billingDate = payout.getPeriodEnd().toLocalDate().toString();
                emailService.sendMonthlyPayoutMail(
                    tutor.getEmail(),
                    tutor.getFirstName(),
                    payout.getAmount(),
                    month,
                    billingDate,
                    payout.getTransactionId()
                );
            } catch (Exception e) {
                payout.setStatus(Payout.Status.FAILED);
                payout.setDescription(payout.getDescription() + " - Failed: " + e.getMessage());
                payoutRepository.save(payout);
            }
        }
    }
} 