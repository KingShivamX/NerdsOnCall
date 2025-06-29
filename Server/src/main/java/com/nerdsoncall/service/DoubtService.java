package com.nerdsoncall.service;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.DoubtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoubtService {

    @Autowired
    private DoubtRepository doubtRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Doubt createDoubt(Doubt doubt) {
        Doubt savedDoubt = doubtRepository.save(doubt);
        
        // Broadcast to online tutors
        broadcastDoubtToTutors(savedDoubt);
        
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

    public Doubt updateDoubtStatus(Long doubtId, Doubt.Status status) {
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));
        doubt.setStatus(status);
        return doubtRepository.save(doubt);
    }

    private void broadcastDoubtToTutors(Doubt doubt) {
        // Get online tutors for the subject
        List<User> onlineTutors = userService.findOnlineTutorsBySubject(doubt.getSubject());
        
        // Send to specific tutor if preferred
        if (doubt.getPreferredTutorId() != null) {
            messagingTemplate.convertAndSend("/topic/tutor/" + doubt.getPreferredTutorId(), doubt);
        } else {
            // Broadcast to all online tutors for the subject
            onlineTutors.forEach(tutor -> 
                messagingTemplate.convertAndSend("/topic/tutor/" + tutor.getId(), doubt)
            );
        }
    }

    public void notifyDoubtAccepted(Long doubtId, Long tutorId) {
        Optional<Doubt> doubtOpt = findById(doubtId);
        if (doubtOpt.isPresent()) {
            Doubt doubt = doubtOpt.get();
            // Notify student that doubt was accepted
            messagingTemplate.convertAndSend(
                "/topic/student/" + doubt.getStudent().getId(), 
                "Doubt accepted by tutor: " + tutorId
            );
        }
    }
} 