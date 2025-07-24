package com.nerdsoncall.repository;

import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    
    List<Session> findByStudent(User student);
    
    List<Session> findByTutor(User tutor);
    
    List<Session> findByStatus(Session.Status status);
    
    Optional<Session> findBySessionId(String sessionId);
    
    @Query("SELECT s FROM Session s WHERE s.student = :user OR s.tutor = :user ORDER BY s.createdAt DESC")
    List<Session> findByStudentOrTutorOrderByCreatedAtDesc(@Param("user") User user);
    
    @Query("SELECT s FROM Session s WHERE s.tutor = :tutor AND s.status = 'COMPLETED' AND s.startTime >= :startDate AND s.startTime <= :endDate")
    List<Session> findCompletedSessionsByTutorAndDateRange(@Param("tutor") User tutor, 
                                                          @Param("startDate") LocalDateTime startDate, 
                                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(s) FROM Session s WHERE s.tutor = :tutor AND s.status = 'COMPLETED'")
    Long countCompletedSessionsByTutor(@Param("tutor") User tutor);
    
    @Query("SELECT SUM(s.durationMinutes) FROM Session s WHERE s.tutor = :tutor AND s.status = 'COMPLETED'")
    Long sumDurationByTutor(@Param("tutor") User tutor);

    @Query("SELECT s.tutor FROM Session s WHERE s.status = :status AND s.endTime BETWEEN :start AND :end GROUP BY s.tutor")
    List<User> findTutorsWithCompletedSessionsInPeriod(@Param("status") Session.Status status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(s.tutorEarnings) FROM Session s WHERE s.tutor = :tutor AND s.status = :status AND s.endTime BETWEEN :start AND :end")
    Double sumTutorEarningsInPeriod(@Param("tutor") User tutor, @Param("status") Session.Status status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
} 