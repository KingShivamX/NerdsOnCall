package com.nerdsoncall.repository;

import com.nerdsoncall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'TUTOR' AND u.isOnline = true AND u.isActive = true")
    List<User> findOnlineTutors();
    
    @Query("SELECT u FROM User u WHERE u.role = 'TUTOR' AND u.isOnline = true AND u.isActive = true AND :subject MEMBER OF u.subjects")
    List<User> findOnlineTutorsBySubject(@Param("subject") User.Subject subject);
    
    @Query("SELECT u FROM User u WHERE u.role = 'TUTOR' AND u.isActive = true ORDER BY u.rating DESC")
    List<User> findTopRatedTutors();
    
    @Query("SELECT u FROM User u WHERE u.role = 'TUTOR' AND u.isActive = true AND :subject MEMBER OF u.subjects ORDER BY u.rating DESC")
    List<User> findTopRatedTutorsBySubject(@Param("subject") User.Subject subject);
} 