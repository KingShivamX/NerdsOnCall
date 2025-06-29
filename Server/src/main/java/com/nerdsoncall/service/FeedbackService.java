package com.nerdsoncall.service;

import com.nerdsoncall.entity.Feedback;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserService userService;

    public Feedback createFeedback(Session session, User reviewer, User reviewee, Integer rating, String comment, Feedback.Type type) {
        // Check if feedback already exists
        Optional<Feedback> existingFeedback = feedbackRepository.findBySessionAndType(session, type);
        if (existingFeedback.isPresent()) {
            throw new RuntimeException("Feedback already exists for this session");
        }

        Feedback feedback = new Feedback();
        feedback.setSession(session);
        feedback.setReviewer(reviewer);
        feedback.setReviewee(reviewee);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setType(type);

        Feedback savedFeedback = feedbackRepository.save(feedback);

        // Update tutor rating if this is student-to-tutor feedback
        if (type == Feedback.Type.STUDENT_TO_TUTOR) {
            updateTutorRating(reviewee.getId());
        }

        return savedFeedback;
    }

    public List<Feedback> getFeedbackForTutor(User tutor) {
        return feedbackRepository.findTutorFeedbackOrderByCreatedAtDesc(tutor);
    }

    public List<Feedback> getFeedbackForSession(Session session) {
        return feedbackRepository.findBySession(session);
    }

    public List<Feedback> getFeedbackByReviewer(User reviewer) {
        return feedbackRepository.findByReviewer(reviewer);
    }

    private void updateTutorRating(Long tutorId) {
        User tutor = userService.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        Double averageRating = feedbackRepository.findAverageRatingForTutor(tutor);
        if (averageRating != null) {
            userService.updateUserRating(tutorId, averageRating);
        }
    }

    public boolean canUserProvideFeedback(Session session, User user, Feedback.Type type) {
        // Check if user is part of the session
        boolean isParticipant = session.getStudent().getId().equals(user.getId()) || 
                               session.getTutor().getId().equals(user.getId());
        
        if (!isParticipant) {
            return false;
        }

        // Check if session is completed
        if (session.getStatus() != Session.Status.COMPLETED) {
            return false;
        }

        // Check if feedback type matches user role
        if (type == Feedback.Type.STUDENT_TO_TUTOR && !session.getStudent().getId().equals(user.getId())) {
            return false;
        }
        
        if (type == Feedback.Type.TUTOR_TO_STUDENT && !session.getTutor().getId().equals(user.getId())) {
            return false;
        }

        // Check if feedback already exists
        Optional<Feedback> existingFeedback = feedbackRepository.findBySessionAndType(session, type);
        return existingFeedback.isEmpty();
    }
} 