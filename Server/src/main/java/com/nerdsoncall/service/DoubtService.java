package com.nerdsoncall.service;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.DoubtRepository;
import com.nerdsoncall.websocket.DoubtNotificationHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoubtService {

    @Autowired
    private DoubtRepository doubtRepository;

    @Autowired
    private DoubtNotificationHandler doubtNotificationHandler;

    @Autowired
    private SessionService sessionService;

    public Doubt createDoubt(Doubt doubt) {
        Doubt savedDoubt = doubtRepository.save(doubt);

        // Broadcast to online tutors using WebSocket
        // Using try-catch to prevent any WebSocket errors from affecting the main flow
        try {
            doubtNotificationHandler.broadcastDoubtToTutors(savedDoubt);
        } catch (Exception e) {
            // Log the error but don't fail the doubt creation
            System.err.println("Error broadcasting doubt: " + e.getMessage());
        }

        return savedDoubt;
    }

    public List<Doubt> getDoubtsByStudent(User student) {
        return doubtRepository.findByStudent(student);
    }

    public List<Doubt> getOpenDoubts() {
        return doubtRepository.findOpenDoubtsOrderByPriorityAndCreatedAt();
    }

    public List<Doubt> getOpenDoubtsBySubject(User.Subject subject) {
        return doubtRepository.findOpenDoubtsBySubjectOrderByPriorityAndCreatedAt(subject);
    }

    public List<Doubt> getOpenDoubtsByPreferredTutor(Long tutorId) {
        return doubtRepository.findOpenDoubtsByPreferredTutor(tutorId);
    }

    public Optional<Doubt> findById(Long id) {
        return doubtRepository.findById(id);
    }

    public List<Doubt> getAllDoubtsForTutor(Long tutorId) {
        // Return all open doubts and those with preferredTutorId matching this tutor
        return doubtRepository.findAllOpenOrPreferredForTutor(tutorId);
    }

    public Doubt updateDoubtStatus(Long doubtId, Doubt.Status status, User tutor) {
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));

        // Update status and assign tutor
        doubt.setStatus(status);
        if (status == Doubt.Status.ASSIGNED && tutor != null) {
            doubt.setAcceptedTutor(tutor);
            try {
                sessionService.createSession(doubt.getStudent().getId(), tutor.getId(), doubtId);
            } catch (Exception e) {
                System.err.println("Error creating session for doubt: " + e.getMessage());
            }
        }
        return doubtRepository.save(doubt);
    }
}