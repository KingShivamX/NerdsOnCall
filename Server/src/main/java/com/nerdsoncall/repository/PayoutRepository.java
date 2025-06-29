package com.nerdsoncall.repository;

import com.nerdsoncall.entity.Payout;
import com.nerdsoncall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long> {
    
    List<Payout> findByTutor(User tutor);
    
    List<Payout> findByStatus(Payout.Status status);
    
    @Query("SELECT p FROM Payout p WHERE p.tutor = :tutor ORDER BY p.createdAt DESC")
    List<Payout> findByTutorOrderByCreatedAtDesc(@Param("tutor") User tutor);
    
    @Query("SELECT p FROM Payout p WHERE p.tutor = :tutor AND p.periodStart >= :startDate AND p.periodEnd <= :endDate")
    List<Payout> findByTutorAndPeriod(@Param("tutor") User tutor, 
                                     @Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payout p WHERE p.tutor = :tutor AND p.status = 'COMPLETED'")
    Double findTotalEarningsByTutor(@Param("tutor") User tutor);
} 