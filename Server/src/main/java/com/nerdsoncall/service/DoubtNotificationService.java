package com.nerdsoncall.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.websocket.DoubtNotificationHandler;

@Service
public class DoubtNotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(DoubtNotificationService.class);
    
    @Autowired
    private DoubtNotificationHandler doubtNotificationHandler;
    
    /**
     * Broadcast a doubt to all online tutors with matching subject
     */
    public void broadcastDoubtToTutors(Doubt doubt) {
        try {
            doubtNotificationHandler.broadcastDoubtToTutors(doubt);
        } catch (Exception e) {
            logger.error("Error broadcasting doubt to tutors", e);
        }
    }
    
    /**
     * Send a doubt notification to a specific tutor
     */
    public void sendDoubtNotification(Long tutorId, Doubt doubt) {
        try {
            doubtNotificationHandler.sendDoubtNotification(tutorId, doubt);
        } catch (Exception e) {
            logger.error("Error sending doubt notification to tutor: {}", tutorId, e);
        }
    }
}