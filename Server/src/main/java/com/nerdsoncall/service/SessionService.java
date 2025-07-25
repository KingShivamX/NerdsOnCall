package com.nerdsoncall.service;

import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.repository.SessionRepository;
import com.nerdsoncall.repository.UserRepository;
import com.nerdsoncall.repository.DoubtRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoubtRepository doubtRepository;

    public Session createSession(Long studentId, Long tutorId, Long doubtId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));

        Session session = new Session();
        session.setStudent(student);
        session.setTutor(tutor);
        session.setDoubt(doubt);
        session.setStatus(Session.Status.PENDING);
        session.setStartTime(LocalDateTime.now());
        session.setSessionId("session_" + studentId + "_" + tutorId + "_" + System.currentTimeMillis());
        session.setRoomId("room_" + doubtId);

        return sessionRepository.save(session);
    }

    public Session startSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setStatus(Session.Status.ACTIVE);
        session.setStartTime(LocalDateTime.now());
        
        return sessionRepository.save(session);
    }

    public Session endSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setStatus(Session.Status.COMPLETED);
        session.setEndTime(LocalDateTime.now());
        
        // Calculate duration
        if (session.getStartTime() != null) {
            long duration = java.time.Duration.between(session.getStartTime(), session.getEndTime()).toMinutes();
            session.setDurationMinutes(duration);
        }
        
        return sessionRepository.save(session);
    }

    public List<Session> getSessionsByStudent(Long studentId) {
        return sessionRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<Session> getSessionsByTutor(Long tutorId) {
        return sessionRepository.findByTutorIdOrderByCreatedAtDesc(tutorId);
    }

    public Optional<Session> findById(Long id) {
        return sessionRepository.findById(id);
    }

    public Optional<Session> findByDoubtId(Long doubtId) {
        return sessionRepository.findByDoubtId(doubtId);
    }

    public Optional<Session> findBySessionId(String sessionId) {
        return sessionRepository.findBySessionId(sessionId);
    }
}