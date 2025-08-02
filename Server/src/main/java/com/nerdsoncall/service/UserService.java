package com.nerdsoncall.service;

import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
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
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public List<User> findAllTutors() {
        return userRepository.findAllTutors();
    }

    public List<User> findTutorsBySubject(User.Subject subject) {
        return userRepository.findTutorsBySubject(subject);
    }

    public List<User> findOnlineTutors() {
        return userRepository.findOnlineTutors();
    }

    public List<User> findOnlineTutorsBySubject(User.Subject subject) {
        return userRepository.findOnlineTutorsBySubject(subject);
    }

    public List<User> findTopRatedTutors() {
        return userRepository.findTopRatedTutors();
    }

    public List<User> findTopRatedTutorsBySubject(User.Subject subject) {
        return userRepository.findTopRatedTutorsBySubject(subject);
    }

    public User updateOnlineStatus(Long userId, boolean isOnline) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsOnline(isOnline);
        return userRepository.save(user);
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