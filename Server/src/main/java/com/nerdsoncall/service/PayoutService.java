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

@Service
public class PayoutService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private RazorpayPayoutService razorpayPayoutService;

    @Transactional
    public void createMonthlyPayouts() {
        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        LocalDateTime periodStart = lastMonth.withDayOfMonth(1).atStartOfDay();
        LocalDateTime periodEnd = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth()).atTime(23, 59, 59);

        List<User> tutors = sessionRepository.findTutorsWithCompletedSessionsInPeriod(Session.Status.COMPLETED, periodStart, periodEnd);

        for (User tutor : tutors) {
            boolean payoutExists = payoutRepository.existsByTutorAndPeriodStartAndPeriodEnd(tutor, periodStart, periodEnd);
            if (payoutExists) {
                continue; 
            }

            Double totalEarnings = sessionRepository.sumTutorEarningsInPeriod(tutor, Session.Status.COMPLETED, periodStart, periodEnd);
            if (totalEarnings == null || totalEarnings <= 0) {
                continue;
            }

            Payout payout = new Payout();
            payout.setTutor(tutor);
            payout.setAmount(totalEarnings);
            payout.setPeriodStart(periodStart);
            payout.setPeriodEnd(periodEnd);
            payout.setStatus(Payout.Status.PENDING);
            payout.setDescription("Monthly payout for " + lastMonth.getMonth().name() + " " + lastMonth.getYear());
            payoutRepository.save(payout);
        }
    }

    @Transactional
    public void executePendingPayouts() {
        List<Payout> pendingPayouts = payoutRepository.findByStatus(Payout.Status.PENDING);
        for (Payout payout : pendingPayouts) {
            try {
                payout.setStatus(Payout.Status.PROCESSING);
                payoutRepository.save(payout);

                User tutor = payout.getTutor();
                if (tutor.getRazorpayContactId() == null) {
                    String contactId = razorpayPayoutService.createContact(tutor);
                    tutor.setRazorpayContactId(contactId);
                    // You might need to save the user entity here if changes are not cascaded
                }

                // In a real app, you would have a more robust way to manage fund accounts
                String fundAccountId = razorpayPayoutService.createFundAccount(tutor);

                String transactionId = razorpayPayoutService.processPayout(payout, fundAccountId);
                payout.setTransactionId(transactionId);
                payout.setStatus(Payout.Status.COMPLETED);
                payoutRepository.save(payout);
            } catch (Exception e) {
                payout.setStatus(Payout.Status.FAILED);
                payout.setDescription(payout.getDescription() + " - Failed: " + e.getMessage());
                payoutRepository.save(payout);
            }
        }
    }
} 