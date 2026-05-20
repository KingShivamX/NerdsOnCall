package com.nerdsoncall.service;

import com.nerdsoncall.entity.User;
import com.nerdsoncall.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthService} — authentication & password-reset flows.
 *
 * <p><b>JUnit 5 annotations used here:</b>
 * <ul>
 *   <li>{@code @ExtendWith(MockitoExtension.class)} — wires Mockito into JUnit 5 (replaces old @RunWith)</li>
 *   <li>{@code @Mock} — creates a fake dependency (no real DB / email / JWT)</li>
 *   <li>{@code @InjectMocks} — creates the real AuthService and injects the mocks</li>
 *   <li>{@code @BeforeEach} — runs before every {@code @Test} to reset shared test data</li>
 *   <li>{@code @DisplayName} — human-readable name shown in test reports</li>
 * </ul>
 *
 * <p><b>Mockito patterns used here:</b>
 * <ul>
 *   <li>{@code when(...).thenReturn(...)} — stub a method call</li>
 *   <li>{@code verify(...)} — assert a mock was called (and how many times)</li>
 *   <li>{@code never()} — assert a mock was NOT called</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private TutorStatusService tutorStatusService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User studentUser;
    private User tutorUser;

    @BeforeEach
    void setUp() {
        // ReflectionTestUtils sets @Value fields without loading Spring context
        ReflectionTestUtils.setField(authService, "frontendUrl", "http://localhost:3000");

        studentUser = new User();
        studentUser.setId(1L);
        studentUser.setEmail("student@test.com");
        studentUser.setPassword("hashedPassword");
        studentUser.setFirstName("Test");
        studentUser.setLastName("Student");
        studentUser.setRole(User.Role.STUDENT);

        tutorUser = new User();
        tutorUser.setId(2L);
        tutorUser.setEmail("tutor@test.com");
        tutorUser.setPassword("hashedPassword");
        tutorUser.setFirstName("Test");
        tutorUser.setLastName("Tutor");
        tutorUser.setRole(User.Role.TUTOR);
    }

    // -------------------------------------------------------------------------
    // login()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("login — returns JWT when credentials are valid")
    void login_success_returnsJwtToken() {
        // Arrange: stub what the service will call
        when(userService.findByEmail("student@test.com")).thenReturn(Optional.of(studentUser));
        when(jwtUtil.generateToken("student@test.com", 1L, "STUDENT")).thenReturn("mock-jwt-token");

        // Act: call the method under test
        String token = authService.login("student@test.com", "password123");

        // Assert: JUnit 5 assertions
        assertNotNull(token);
        assertEquals("mock-jwt-token", token);

        // Verify: authentication was attempted and JWT was generated
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtil).generateToken("student@test.com", 1L, "STUDENT");
    }

    @Test
    @DisplayName("login — throws when user not found after authentication")
    void login_userNotFound_throwsException() {
        when(userService.findByEmail("ghost@test.com")).thenReturn(Optional.empty());

        // assertThrows — JUnit 5 way to test expected exceptions
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authService.login("ghost@test.com", "password123")
        );
        assertEquals("User not found", ex.getMessage());
    }

    // -------------------------------------------------------------------------
    // logout()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("logout — student sets offline via UserService")
    void logout_student_updatesOnlineStatus() {
        when(userService.findByEmail("student@test.com")).thenReturn(Optional.of(studentUser));

        authService.logout("student@test.com");

        verify(userService).updateOnlineStatus(1L, false);
        verify(tutorStatusService, never()).setTutorOnline(anyLong(), anyBoolean());
    }

    @Test
    @DisplayName("logout — tutor sets offline via TutorStatusService")
    void logout_tutor_setsTutorOffline() {
        when(userService.findByEmail("tutor@test.com")).thenReturn(Optional.of(tutorUser));

        authService.logout("tutor@test.com");

        verify(tutorStatusService).setTutorOnline(2L, false);
        verify(userService, never()).updateOnlineStatus(anyLong(), anyBoolean());
    }

    // -------------------------------------------------------------------------
    // forgotPassword()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("forgotPassword — saves reset token and sends email for existing user")
    void forgotPassword_existingUser_savesTokenAndSendsEmail() {
        when(userService.findByEmail("student@test.com")).thenReturn(Optional.of(studentUser));

        authService.forgotPassword("student@test.com");

        // User should be saved with a reset token set
        verify(userService).saveUser(argThat(user ->
                user.getResetToken() != null && user.getResetTokenExpiry() != null
        ));
        verify(emailService).sendPasswordResetEmail(
                eq("student@test.com"),
                anyString(),
                eq("http://localhost:3000/reset-password")
        );
    }

    @Test
    @DisplayName("forgotPassword — silently ignores unknown email (security: no user enumeration)")
    void forgotPassword_unknownEmail_doesNothing() {
        when(userService.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        // assertDoesNotThrow — method should complete without error
        assertDoesNotThrow(() -> authService.forgotPassword("unknown@test.com"));

        verify(userService, never()).saveUser(any());
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString(), anyString());
    }

    // -------------------------------------------------------------------------
    // resetPassword() & validateResetToken()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("resetPassword — succeeds with valid, non-expired token")
    void resetPassword_validToken_returnsTrue() {
        studentUser.setResetToken("valid-token");
        studentUser.setResetTokenExpiry(LocalDateTime.now().plusHours(1));

        when(userService.findByResetToken("valid-token")).thenReturn(Optional.of(studentUser));
        when(passwordEncoder.encode("NewPassword1!")).thenReturn("encoded-new-password");

        boolean result = authService.resetPassword("valid-token", "NewPassword1!");

        assertTrue(result);
        verify(userService).saveUser(argThat(user ->
                user.getResetToken() == null && user.getResetTokenExpiry() == null
        ));
        verify(emailService).sendPasswordResetSuccessEmail("student@test.com");
    }

    @Test
    @DisplayName("resetPassword — fails when token is expired")
    void resetPassword_expiredToken_returnsFalse() {
        studentUser.setResetToken("expired-token");
        studentUser.setResetTokenExpiry(LocalDateTime.now().minusHours(1));

        when(userService.findByResetToken("expired-token")).thenReturn(Optional.of(studentUser));

        assertFalse(authService.resetPassword("expired-token", "NewPassword1!"));
        verify(userService, never()).saveUser(any());
    }

    @Test
    @DisplayName("validateResetToken — returns true for valid token, false for unknown")
    void validateResetToken_checksExpiry() {
        studentUser.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        when(userService.findByResetToken("good-token")).thenReturn(Optional.of(studentUser));
        when(userService.findByResetToken("bad-token")).thenReturn(Optional.empty());

        assertTrue(authService.validateResetToken("good-token"));
        assertFalse(authService.validateResetToken("bad-token"));
    }
}
