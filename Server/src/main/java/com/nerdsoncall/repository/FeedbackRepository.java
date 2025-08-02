package com.nerdsoncall.repository;

import com.nerdsoncall.entity.Feedback;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findBySession(Session session);
    
    List<Feedback> findByReviewee(User reviewee);
    
    List<Feedback> findByReviewer(User reviewer);
    
    Optional<Feedback> findBySessionAndType(Session session, Feedback.Type type);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.reviewee = :tutor AND f.type = 'STUDENT_TO_TUTOR'")
    Double findAverageRatingForTutor(@Param("tutor") User tutor);
    
    @Query("SELECT f FROM Feedback f WHERE f.reviewee = :tutor AND f.type = 'STUDENT_TO_TUTOR' ORDER BY f.createdAt DESC")
    List<Feedback> findTutorFeedbackOrderByCreatedAtDesc(@Param("tutor") User tutor);
} 