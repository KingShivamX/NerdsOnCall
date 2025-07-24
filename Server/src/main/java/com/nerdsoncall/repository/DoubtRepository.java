package com.nerdsoncall.repository;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoubtRepository extends JpaRepository<Doubt, Long> {

    List<Doubt> findByStudent(User student);

    List<Doubt> findByStatus(Doubt.Status status);

    List<Doubt> findBySubject(User.Subject subject);

    List<Doubt> findBySubjectAndStatus(User.Subject subject, Doubt.Status status);

    @Query("SELECT d FROM Doubt d WHERE d.status = 'OPEN' ORDER BY d.priority DESC, d.createdAt ASC")
    List<Doubt> findOpenDoubtsOrderByPriorityAndCreatedAt();

    @Query("SELECT d FROM Doubt d WHERE d.subject = :subject AND d.status = 'OPEN' ORDER BY d.priority DESC, d.createdAt ASC")
    List<Doubt> findOpenDoubtsBySubjectOrderByPriorityAndCreatedAt(@Param("subject") User.Subject subject);

    @Query("SELECT d FROM Doubt d WHERE d.preferredTutorId = :tutorId AND d.status = 'OPEN'")
    List<Doubt> findOpenDoubtsByPreferredTutor(@Param("tutorId") Long tutorId);

    @Query("SELECT d FROM Doubt d WHERE d.acceptedTutor.id = :tutorId OR d.preferredTutorId = :tutorId")
    List<Doubt> findDoubtsByTutor(@Param("tutorId") Long tutorId);
}