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
        // Get doubts that are either accepted by this tutor or specifically requested
        // for this tutor
        return doubtRepository.findDoubtsByTutor(tutorId);
    }

    public Doubt updateDoubtStatus(Long doubtId, Doubt.Status status) {
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));

        // Update status
        doubt.setStatus(status);

        // Update state based on status
        if (status == Doubt.Status.ASSIGNED) {
            doubt.setState(Doubt.State.ACCEPTED);
        } else if (status == Doubt.Status.CANCELLED) {
            doubt.setState(Doubt.State.REJECTED);
        }

        return doubtRepository.save(doubt);
    }
}