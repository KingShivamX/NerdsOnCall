package com.nerdsoncall.service;

import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.repository.SessionRepository;
import com.nerdsoncall.repository.UserRepository;
import com.nerdsoncall.repository.DoubtRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
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

    @PersistenceContext
    private EntityManager entityManager;

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

    // Create session for direct video call (new approach)
    public Session createCallSession(Long studentId, Long tutorId, String callSessionId) {
        try {
            System.out.println("Creating call session - StudentId: " + studentId + ", TutorId: " + tutorId + ", SessionId: " + callSessionId);
            
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
            
            User tutor = userRepository.findById(tutorId)
                    .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));

            // Check if session already exists
            Optional<Session> existingSession = sessionRepository.findBySessionId(callSessionId);
            if (existingSession.isPresent()) {
                System.out.println("Session already exists with ID: " + callSessionId);
                return existingSession.get();
            }

            Session session = new Session();
            session.setStudent(student);
            session.setTutor(tutor);
            session.setDoubt(null); // No doubt required for direct calls
            session.setStatus(Session.Status.PENDING);
            session.setStartTime(LocalDateTime.now()); // Set placeholder time for DB constraint
            session.setActualStartTime(null); // Will be set when call actually starts
            session.setSessionId(callSessionId);
            session.setRoomId("room_" + callSessionId);

            // Initialize financial fields
            session.setCost(java.math.BigDecimal.ZERO);
            session.setTutorEarnings(java.math.BigDecimal.ZERO);
            session.setAmount(0.0);
            session.setCommission(0.0);
            session.setDurationMinutes(0L);

            System.out.println("💾 Saving session to database...");
            System.out.println("Session details: Student=" + student.getId() + ", Tutor=" + tutor.getId() + ", Doubt=null, SessionId=" + callSessionId);

            Session savedSession = sessionRepository.save(session);
            System.out.println("Call session created successfully with ID: " + savedSession.getId());
            return savedSession;
            
        } catch (Exception e) {
            System.err.println("Error creating call session: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create call session: " + e.getMessage());
        }
    }

    // Start call session by sessionId
    public Session startCallSession(String sessionId) {
        try {
            System.out.println("Starting call session with ID: " + sessionId);
            
            Session session = sessionRepository.findBySessionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with ID: " + sessionId));
            
            if (session.getStatus() == Session.Status.ACTIVE) {
                System.out.println("Session is already active: " + sessionId);
                return session;
            }

            session.setStatus(Session.Status.ACTIVE);
            session.setActualStartTime(LocalDateTime.now()); // Set actual call start time
            System.out.println("Setting actual start time: " + session.getActualStartTime());
            
            Session savedSession = sessionRepository.save(session);
            System.out.println("Call session started successfully: " + sessionId + " at " + savedSession.getStartTime());
            return savedSession;
            
        } catch (Exception e) {
            System.err.println("Error starting call session: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to start call session: " + e.getMessage());
        }
    }

    // End call session by sessionId with earnings calculation
    public Session endCallSession(String sessionId) {
        try {
            System.out.println("Ending call session with ID: " + sessionId);
            
            Session session = sessionRepository.findBySessionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with ID: " + sessionId));
            
            if (session.getStatus() == Session.Status.COMPLETED) {
                System.out.println("Session is already completed: " + sessionId);
                return session;
            }
            
            session.setStatus(Session.Status.COMPLETED);
            session.setEndTime(LocalDateTime.now());
            
            // Calculate duration and earnings using actualStartTime
            if (session.getActualStartTime() != null) {
                long durationMinutes = java.time.Duration.between(session.getActualStartTime(), session.getEndTime()).toMinutes();
                session.setDurationMinutes(durationMinutes);

                System.out.println("Session duration: " + durationMinutes + " minutes (from " + session.getActualStartTime() + " to " + session.getEndTime() + ")");

                // Calculate earnings: 50 per hour (50/60 per minute)
                double hourlyRate = 50.0;
                double totalCost = (durationMinutes / 60.0) * hourlyRate;
                session.setCost(java.math.BigDecimal.valueOf(totalCost));

                // Tutor gets 80% of the cost (20% platform commission)
                double tutorEarnings = totalCost * 0.8;
                double commission = totalCost * 0.2;

                session.setTutorEarnings(java.math.BigDecimal.valueOf(tutorEarnings));
                session.setAmount(totalCost);
                session.setCommission(commission);

                System.out.println("Calculated earnings - Total: $" + totalCost + ", Tutor: $" + tutorEarnings + ", Commission: $" + commission);
            } else {
                System.out.println("Warning: Session has no actual start time, cannot calculate earnings");
                // Set zero values
                session.setDurationMinutes(0L);
                session.setCost(java.math.BigDecimal.ZERO);
                session.setTutorEarnings(java.math.BigDecimal.ZERO);
                session.setAmount(0.0);
                session.setCommission(0.0);
            }
            
            Session savedSession = sessionRepository.save(session);
            System.out.println("Call session ended successfully: " + sessionId + " at " + savedSession.getEndTime());
            return savedSession;
            
        } catch (Exception e) {
            System.err.println("Error ending call session: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to end call session: " + e.getMessage());
        }
    }

    // Get total session count for health check
    public long getSessionCount() {
        return sessionRepository.count();
    }

    // Update database schema to add actual_start_time column and make doubt_id nullable
    @Transactional
    public void updateDatabaseSchema() {
        try {
            System.out.println("🔧 Starting database schema update...");

            // Make doubt_id nullable for direct call sessions
            System.out.println("Making doubt_id nullable...");
            try {
                entityManager.createNativeQuery("ALTER TABLE sessions ALTER COLUMN doubt_id DROP NOT NULL").executeUpdate();
                System.out.println("✅ doubt_id is now nullable");
            } catch (Exception e) {
                // If already nullable, just log
                System.out.println("ℹ️ doubt_id might already be nullable: " + e.getMessage());
            }

            // Add actual_start_time column if it doesn't exist
            System.out.println("Adding actual_start_time column...");
            try {
                entityManager.createNativeQuery("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS actual_start_time TIMESTAMP").executeUpdate();
                System.out.println("✅ actual_start_time column added");
            } catch (Exception e) {
                System.out.println("ℹ️ actual_start_time column might already exist: " + e.getMessage());
            }

            System.out.println("✅ Database schema update completed successfully");
        } catch (Exception e) {
            System.err.println("❌ Error updating database schema: " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception, allow app to continue
        }
    }
}