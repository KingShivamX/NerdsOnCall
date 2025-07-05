package com.nerdsoncall.service;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private DoubtService doubtService;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Session createSession(Long doubtId, Long tutorId) {
        Doubt doubt = doubtService.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));
        
        User tutor = userService.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        Session session = new Session();
        session.setStudent(doubt.getStudent());
        session.setTutor(tutor);
        session.setDoubt(doubt);
        session.setStartTime(LocalDateTime.now());
        session.setSessionId(UUID.randomUUID().toString());
        session.setRoomId("room_" + System.currentTimeMillis());
        session.setStatus(Session.Status.ACTIVE);

        // Update doubt status
        doubtService.updateDoubtStatus(doubtId, Doubt.Status.IN_PROGRESS);

        Session savedSession = sessionRepository.save(session);

        // Notify both student and tutor
        messagingTemplate.convertAndSend(
            "/topic/student/" + doubt.getStudent().getId(), 
            savedSession
        );
        messagingTemplate.convertAndSend(
            "/topic/tutor/" + tutorId, 
            savedSession
        );

        return savedSession;
    }

    public Session endSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setEndTime(LocalDateTime.now());
        session.setStatus(Session.Status.COMPLETED);

        // Calculate duration
        long minutes = ChronoUnit.MINUTES.between(session.getStartTime(), session.getEndTime());
        session.setDurationMinutes(minutes);

        // Calculate cost and tutor earnings
        BigDecimal cost = calculateSessionCost(session.getTutor().getHourlyRate(), minutes);
        BigDecimal tutorEarnings = cost.multiply(new BigDecimal("0.80")); // 80% to tutor, 20% platform fee

        session.setCost(cost);
        session.setTutorEarnings(tutorEarnings);

        // Update doubt status
        doubtService.updateDoubtStatus(session.getDoubt().getId(), Doubt.Status.RESOLVED);

        // Update tutor stats
        userService.incrementSessionCount(session.getTutor().getId());
        userService.updateTotalEarnings(session.getTutor().getId(), tutorEarnings.doubleValue());

        return sessionRepository.save(session);
    }

    public List<Session> getSessionsByUser(User user) {
        return sessionRepository.findByStudentOrTutorOrderByCreatedAtDesc(user);
    }

    public Optional<Session> findBySessionId(String sessionId) {
        return sessionRepository.findBySessionId(sessionId);
    }

    public Session updateSessionNotes(Long sessionId, String notes) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setSessionNotes(notes);
        return sessionRepository.save(session);
    }

    public Session updateCanvasData(Long sessionId, String canvasData) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setCanvasData(canvasData);
        return sessionRepository.save(session);
    }

    private BigDecimal calculateSessionCost(Double hourlyRate, long minutes) {
        if (hourlyRate == null || hourlyRate == 0) {
            hourlyRate = 25.0; // Default rate
        }
        return new BigDecimal(hourlyRate).multiply(new BigDecimal(minutes)).divide(new BigDecimal(60), 2, RoundingMode.HALF_UP);
    }

    public List<Session> getCompletedSessionsByTutorAndDateRange(User tutor, LocalDateTime startDate, LocalDateTime endDate) {
        return sessionRepository.findCompletedSessionsByTutorAndDateRange(tutor, startDate, endDate);
    }

    public void broadcastCanvasUpdate(String sessionId, String canvasData) {
        messagingTemplate.convertAndSend("/topic/session/" + sessionId + "/canvas", canvasData);
    }

    public void broadcastScreenShare(String sessionId, String screenData) {
        messagingTemplate.convertAndSend("/topic/session/" + sessionId + "/screen", screenData);
    }
} 