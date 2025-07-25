package com.nerdsoncall.repository;

import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
    
    @Query("SELECT s FROM Session s WHERE s.student.id = :studentId ORDER BY s.createdAt DESC")
    List<Session> findByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);
    
    @Query("SELECT s FROM Session s WHERE s.tutor.id = :tutorId ORDER BY s.createdAt DESC")
    List<Session> findByTutorIdOrderByCreatedAtDesc(@Param("tutorId") Long tutorId);
    
    @Query("SELECT s FROM Session s WHERE s.doubt.id = :doubtId")
    Optional<Session> findByDoubtId(@Param("doubtId") Long doubtId);

    @Query("SELECT s FROM Session s WHERE s.status = :status AND s.paymentStatus = :paymentStatus AND s.startTime BETWEEN :periodStart AND :periodEnd")
    List<Session> findAllCompletedUnpaidSessionsInPeriod(@Param("status") Session.Status status,
                                                         @Param("paymentStatus") Session.PaymentStatus paymentStatus,
                                                         @Param("periodStart") LocalDateTime periodStart,
                                                         @Param("periodEnd") LocalDateTime periodEnd);

    @Query("SELECT s FROM Session s WHERE s.tutor = :tutor AND s.status = 'COMPLETED' AND s.paymentStatus = 'PENDING' AND s.startTime >= :startDate AND s.startTime <= :endDate")
    List<Session> findCompletedUnpaidSessionsByTutorAndDateRange(@Param("tutor") User tutor, 
                                                                @Param("startDate") LocalDateTime startDate, 
                                                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(s.tutorEarnings) FROM Session s WHERE s.tutor = :tutor AND s.status = 'COMPLETED' AND s.paymentStatus = 'PENDING' AND s.endTime BETWEEN :start AND :end")
    Double sumTutorEarningsOfUnpaidSessionsInPeriod(@Param("tutor") User tutor, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Modifying
    @Query("UPDATE Session s SET s.paymentStatus = :paymentStatus WHERE s.id IN :sessionIds")
    void updatePaymentStatusForSessions(@Param("sessionIds") List<Long> sessionIds,
                                        @Param("paymentStatus") Session.PaymentStatus paymentStatus);
} 