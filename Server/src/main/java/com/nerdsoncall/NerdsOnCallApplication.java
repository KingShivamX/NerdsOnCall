package com.nerdsoncall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.beans.factory.annotation.Autowired;
import com.nerdsoncall.service.SessionService;
import org.springframework.stereotype.Component;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class NerdsOnCallApplication {
    public static void main(String[] args) {
        // Load environment variables from .env file
        SpringApplication application = new SpringApplication(NerdsOnCallApplication.class);
        application.run(args);
    }
}

@Component
class DatabaseSchemaUpdater {
    @Autowired
    private SessionService sessionService;

    @EventListener(ApplicationReadyEvent.class)
    public void updateDatabaseSchema() {
        // Update database schema on startup
        sessionService.updateDatabaseSchema();
    }
}