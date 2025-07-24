package com.nerdsoncall.scheduler;

import com.nerdsoncall.service.PayoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PayoutScheduler {

    @Autowired
    private PayoutService payoutService;

    // Runs at 2 AM on the 1st day of every month
    @Scheduled(cron = "0 0 2 1 * ?")
    public void processMonthlyPayouts() {
        payoutService.createMonthlyPayouts();
        payoutService.executePendingPayouts();
    }
} 