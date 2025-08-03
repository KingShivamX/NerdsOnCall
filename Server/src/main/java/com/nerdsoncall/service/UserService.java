package com.nerdsoncall.service;

import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new UsernameNotFoundException("Email cannot be null or empty");
            }

            User user = userRepository.findByEmail(email.trim().toLowerCase())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    user.getIsActive(),
                    true,
                    true,
                    true,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        } catch (DataAccessException e) {
            log.error("Database error while loading user by username: {}", email, e);
            throw new UsernameNotFoundException("Database error occurred while loading user", e);
        } catch (Exception e) {
            log.error("Unexpected error while loading user by username: {}", email, e);
            throw new UsernameNotFoundException("Unexpected error occurred while loading user", e);
        }
    }

    @Transactional
    public User createUser(User user) {
        try {
            if (user == null) {
                throw new IllegalArgumentException("User cannot be null");
            }

            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("Email cannot be null or empty");
            }

            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password cannot be null or empty");
            }

            String normalizedEmail = user.getEmail().trim().toLowerCase();
            user.setEmail(normalizedEmail);

            if (userRepository.existsByEmail(normalizedEmail)) {
                throw new DataIntegrityViolationException("Email already exists: " + normalizedEmail);
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            log.info("User created successfully with email: {}", normalizedEmail);
            return savedUser;

        } catch (DataIntegrityViolationException e) {
            log.warn("Data integrity violation while creating user: {}", e.getMessage());
            throw e; // Re-throw to be handled by global exception handler
        } catch (DataAccessException e) {
            log.error("Database error while creating user: {}", user.getEmail(), e);
            throw new RuntimeException("Database error occurred while creating user", e);
        } catch (Exception e) {
            log.error("Unexpected error while creating user: {}", user.getEmail(), e);
            throw new RuntimeException("Unexpected error occurred while creating user", e);
        }
    }

    public Optional<User> findByEmail(String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return Optional.empty();
            }

            return userRepository.findByEmail(email.trim().toLowerCase());
        } catch (DataAccessException e) {
            log.error("Database error while finding user by email: {}", email, e);
            throw new RuntimeException("Database error occurred while finding user", e);
        } catch (Exception e) {
            log.error("Unexpected error while finding user by email: {}", email, e);
            throw new RuntimeException("Unexpected error occurred while finding user", e);
        }
    }

    @Transactional
    public User updateUser(User user) {
        try {
            if (user == null) {
                throw new IllegalArgumentException("User cannot be null");
            }

            if (user.getId() == null) {
                throw new IllegalArgumentException("User ID cannot be null for update");
            }

            // Verify user exists before updating
            if (!userRepository.existsById(user.getId())) {
                throw new RuntimeException("User not found with ID: " + user.getId());
            }

            User updatedUser = userRepository.save(user);
            log.info("User updated successfully with ID: {}", user.getId());
            return updatedUser;

        } catch (DataAccessException e) {
            log.error("Database error while updating user: {}", user.getId(), e);
            throw new RuntimeException("Database error occurred while updating user", e);
        } catch (Exception e) {
            log.error("Unexpected error while updating user: {}", user.getId(), e);
            throw new RuntimeException("Unexpected error occurred while updating user", e);
        }
    }

    public List<User> findAllTutors() {
        try {
            return userRepository.findAllTutors();
        } catch (DataAccessException e) {
            log.error("Database error while finding all tutors", e);
            throw new RuntimeException("Database error occurred while finding tutors", e);
        } catch (Exception e) {
            log.error("Unexpected error while finding all tutors", e);
            throw new RuntimeException("Unexpected error occurred while finding tutors", e);
        }
    }

    public List<User> findTutorsBySubject(User.Subject subject) {
        try {
            if (subject == null) {
                throw new IllegalArgumentException("Subject cannot be null");
            }

            return userRepository.findTutorsBySubject(subject);
        } catch (DataAccessException e) {
            log.error("Database error while finding tutors by subject: {}", subject, e);
            throw new RuntimeException("Database error occurred while finding tutors by subject", e);
        } catch (Exception e) {
            log.error("Unexpected error while finding tutors by subject: {}", subject, e);
            throw new RuntimeException("Unexpected error occurred while finding tutors by subject", e);
        }
    }

    public List<User> findOnlineTutors() {
        try {
            return userRepository.findOnlineTutors();
        } catch (DataAccessException e) {
            log.error("Database error while finding online tutors", e);
            throw new RuntimeException("Database error occurred while finding online tutors", e);
        } catch (Exception e) {
            log.error("Unexpected error while finding online tutors", e);
            throw new RuntimeException("Unexpected error occurred while finding online tutors", e);
        }
    }

    public List<User> findOnlineTutorsBySubject(User.Subject subject) {
        try {
            if (subject == null) {
                throw new IllegalArgumentException("Subject cannot be null");
            }

            return userRepository.findOnlineTutorsBySubject(subject);
        } catch (DataAccessException e) {
            log.error("Database error while finding online tutors by subject: {}", subject, e);
            throw new RuntimeException("Database error occurred while finding online tutors by subject", e);
        } catch (Exception e) {
            log.error("Unexpected error while finding online tutors by subject: {}", subject, e);
            throw new RuntimeException("Unexpected error occurred while finding online tutors by subject", e);
        }
    }

    public List<User> findTopRatedTutors() {
        try {
            return userRepository.findTopRatedTutors();
        } catch (DataAccessException e) {
            log.error("Database error while finding top rated tutors", e);
            throw new RuntimeException("Database error occurred while finding top rated tutors", e);
        } catch (Exception e) {
            log.error("Unexpected error while finding top rated tutors", e);
            throw new RuntimeException("Unexpected error occurred while finding top rated tutors", e);
        }
    }

    public List<User> findTopRatedTutorsBySubject(User.Subject subject) {
        try {
            if (subject == null) {
                throw new IllegalArgumentException("Subject cannot be null");
            }

            return userRepository.findTopRatedTutorsBySubject(subject);
        } catch (DataAccessException e) {
            log.error("Database error while finding top rated tutors by subject: {}", subject, e);
            throw new RuntimeException("Database error occurred while finding top rated tutors by subject", e);
        } catch (Exception e) {
            log.error("Unexpected error while finding top rated tutors by subject: {}", subject, e);
            throw new RuntimeException("Unexpected error occurred while finding top rated tutors by subject", e);
        }
    }

    @Transactional
    public User updateOnlineStatus(Long userId, boolean isOnline) {
        try {
            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            user.setIsOnline(isOnline);
            User updatedUser = userRepository.save(user);
            log.debug("Updated online status for user {}: {}", userId, isOnline);
            return updatedUser;

        } catch (DataAccessException e) {
            log.error("Database error while updating online status for user: {}", userId, e);
            throw new RuntimeException("Database error occurred while updating online status", e);
        } catch (Exception e) {
            log.error("Unexpected error while updating online status for user: {}", userId, e);
            throw new RuntimeException("Unexpected error occurred while updating online status", e);
        }
    }

    public User updateUserProfile(Long userId, User updateData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updateData.getFirstName() != null) user.setFirstName(updateData.getFirstName());
        if (updateData.getLastName() != null) user.setLastName(updateData.getLastName());
        if (updateData.getPhoneNumber() != null) user.setPhoneNumber(updateData.getPhoneNumber());
        if (updateData.getProfilePicture() != null) user.setProfilePicture(updateData.getProfilePicture());
        if (updateData.getBio() != null) user.setBio(updateData.getBio());
        if (updateData.getSubjects() != null) user.setSubjects(updateData.getSubjects());
        if (updateData.getHourlyRate() != null) user.setHourlyRate(updateData.getHourlyRate());
        
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public void updateUserRating(Long tutorId, Double newRating) {
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        tutor.setRating(newRating);
        userRepository.save(tutor);
    }

    public void incrementSessionCount(Long tutorId) {
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        tutor.setTotalSessions(tutor.getTotalSessions() + 1);
        userRepository.save(tutor);
    }

    public void updateTotalEarnings(Long tutorId, Double earnings) {
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        tutor.setTotalEarnings(tutor.getTotalEarnings() + earnings);
        userRepository.save(tutor);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByResetToken(String resetToken) {
        return userRepository.findByResetToken(resetToken);
    }
} 