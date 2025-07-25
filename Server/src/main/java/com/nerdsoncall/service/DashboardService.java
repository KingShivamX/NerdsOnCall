package com.nerdsoncall.service;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.entity.Session;
import com.nerdsoncall.entity.User;
import com.nerdsoncall.repository.DoubtRepository;
import com.nerdsoncall.repository.SessionRepository;
import com.nerdsoncall.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private DoubtRepository doubtRepository;

    @Autowired
    private UserRepository userRepository;

    // Get student dashboard statistics
    public Map<String, Object> getStudentDashboardStats(Long studentId) {
        try {
            System.out.println("📊 Fetching dashboard stats for student ID: " + studentId);
            
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Map<String, Object> stats = new HashMap<>();
            
            // Get all sessions for the student
            List<Session> allSessions = sessionRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
            System.out.println("Found " + allSessions.size() + " total sessions for student");
            
            // Sessions attended (completed sessions)
            List<Session> completedSessions = allSessions.stream()
                    .filter(session -> session.getStatus() == Session.Status.COMPLETED)
                    .collect(Collectors.toList());
            
            int sessionsAttended = completedSessions.size();
            System.out.println("Completed sessions: " + sessionsAttended);
            
            // Hours learned (sum of duration from completed sessions)
            long totalMinutes = completedSessions.stream()
                    .mapToLong(session -> session.getDurationMinutes() != null ? session.getDurationMinutes() : 0)
                    .sum();
            double hoursLearned = totalMinutes / 60.0;
            System.out.println("Total learning time: " + totalMinutes + " minutes (" + hoursLearned + " hours)");
            
            // Active sessions (pending or active status)
            long activeSessions = allSessions.stream()
                    .filter(session -> session.getStatus() == Session.Status.PENDING || 
                                     session.getStatus() == Session.Status.ACTIVE)
                    .count();
            
            // Open questions (doubts that are not resolved) - with error handling
            long openQuestions = 0;
            try {
                List<Doubt> studentDoubts = doubtRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
                openQuestions = studentDoubts.stream()
                        .filter(doubt -> doubt.getStatus() != Doubt.Status.RESOLVED)
                        .count();
                System.out.println("Open questions: " + openQuestions);
            } catch (Exception e) {
                System.err.println("Error fetching doubts for open questions: " + e.getMessage());
                // Try fallback method using the student object we already have
                try {
                    List<Doubt> fallbackDoubts = doubtRepository.findByStudent(student);
                    openQuestions = fallbackDoubts.stream()
                            .filter(doubt -> doubt.getStatus() != Doubt.Status.RESOLVED)
                            .count();
                    System.out.println("Used fallback method, open questions: " + openQuestions);
                } catch (Exception fallbackError) {
                    System.err.println("Fallback method also failed: " + fallbackError.getMessage());
                    // Continue with openQuestions = 0
                }
            }
            
            // Favorite tutors (count unique tutors from completed sessions)
            long favoriteTutors = completedSessions.stream()
                    .filter(session -> session.getTutor() != null)
                    .map(session -> session.getTutor().getId())
                    .distinct()
                    .count();
            
            // Recent activities (last 5 sessions and doubts)
            List<Map<String, Object>> recentActivities = getRecentActivities(studentId);
            
            // Build response
            stats.put("sessionsAttended", sessionsAttended);
            stats.put("hoursLearned", Math.round(hoursLearned * 10.0) / 10.0); // Round to 1 decimal
            stats.put("activeSessions", activeSessions);
            stats.put("openQuestions", openQuestions);
            stats.put("favoriteTutors", favoriteTutors);
            stats.put("recentActivities", recentActivities);
            stats.put("totalCost", calculateTotalCost(completedSessions));
            
            System.out.println("✅ Dashboard stats calculated successfully");
            return stats;
            
        } catch (Exception e) {
            System.err.println("❌ Error fetching dashboard stats: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch dashboard stats: " + e.getMessage());
        }
    }
    
    // Get recent activities for student
    private List<Map<String, Object>> getRecentActivities(Long studentId) {
        try {
            System.out.println("📋 Fetching recent activities for student: " + studentId);

            // Get student object once for fallback use
            User student = userRepository.findById(studentId).orElse(null);

            // Get recent sessions
            List<Session> recentSessions = sessionRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                    .stream()
                    .limit(3)
                    .collect(Collectors.toList());
            System.out.println("Found " + recentSessions.size() + " recent sessions");

            // Get recent doubts - with error handling and fallback
            List<Doubt> recentDoubts;
            try {
                recentDoubts = doubtRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                        .stream()
                        .limit(2)
                        .collect(Collectors.toList());
                System.out.println("Found " + recentDoubts.size() + " recent doubts");
            } catch (Exception e) {
                System.err.println("Error fetching recent doubts: " + e.getMessage());
                // Try fallback method using the student object we already have
                try {
                    if (student != null) {
                        recentDoubts = doubtRepository.findByStudent(student)
                                .stream()
                                .limit(2)
                                .collect(Collectors.toList());
                        System.out.println("Used fallback method for recent doubts: " + recentDoubts.size());
                    } else {
                        recentDoubts = List.of();
                    }
                } catch (Exception fallbackError) {
                    System.err.println("Fallback method for doubts also failed: " + fallbackError.getMessage());
                    recentDoubts = List.of(); // Return empty list if both methods fail
                }
            }
            
            List<Map<String, Object>> activities = recentSessions.stream()
                    .map(this::sessionToActivity)
                    .collect(Collectors.toList());
            
            activities.addAll(recentDoubts.stream()
                    .map(this::doubtToActivity)
                    .collect(Collectors.toList()));
            
            // Sort by timestamp (most recent first)
            activities.sort((a, b) -> {
                LocalDateTime timeA = (LocalDateTime) a.get("timestamp");
                LocalDateTime timeB = (LocalDateTime) b.get("timestamp");
                return timeB.compareTo(timeA);
            });
            
            return activities.stream().limit(5).collect(Collectors.toList());
            
        } catch (Exception e) {
            System.err.println("Error fetching recent activities: " + e.getMessage());
            return List.of(); // Return empty list on error
        }
    }
    
    // Convert session to activity format
    private Map<String, Object> sessionToActivity(Session session) {
        Map<String, Object> activity = new HashMap<>();
        
        String title = "Session";
        String subtitle = "Learning session";
        String icon = "Video";
        String color = "text-slate-600";
        String bg = "bg-slate-100";
        
        if (session.getStatus() == Session.Status.COMPLETED) {
            title = "Session Completed";
            color = "text-emerald-600";
            bg = "bg-emerald-100";
            if (session.getTutor() != null) {
                subtitle = "With " + session.getTutor().getFirstName() + " " + session.getTutor().getLastName();
            }
            if (session.getDurationMinutes() != null && session.getDurationMinutes() > 0) {
                subtitle += " (" + session.getDurationMinutes() + " min)";
            }
        } else if (session.getStatus() == Session.Status.ACTIVE) {
            title = "Session In Progress";
            color = "text-blue-600";
            bg = "bg-blue-100";
        } else if (session.getStatus() == Session.Status.PENDING) {
            title = "Session Scheduled";
            color = "text-amber-600";
            bg = "bg-amber-100";
        }
        
        activity.put("title", title);
        activity.put("subtitle", subtitle);
        activity.put("time", getTimeAgo(session.getCreatedAt()));
        activity.put("icon", icon);
        activity.put("color", color);
        activity.put("bg", bg);
        activity.put("timestamp", session.getCreatedAt());
        
        return activity;
    }
    
    // Convert doubt to activity format
    private Map<String, Object> doubtToActivity(Doubt doubt) {
        Map<String, Object> activity = new HashMap<>();
        
        String title = "Question Posted";
        String subtitle = doubt.getTitle();
        String icon = "BookOpen";
        String color = "text-slate-600";
        String bg = "bg-slate-100";
        
        if (doubt.getStatus() == Doubt.Status.RESOLVED) {
            title = "Question Resolved";
            color = "text-emerald-600";
            bg = "bg-emerald-100";
        } else if (doubt.getStatus() == Doubt.Status.IN_PROGRESS) {
            title = "Question In Progress";
            color = "text-blue-600";
            bg = "bg-blue-100";
        }
        
        activity.put("title", title);
        activity.put("subtitle", subtitle.length() > 50 ? subtitle.substring(0, 50) + "..." : subtitle);
        activity.put("time", getTimeAgo(doubt.getCreatedAt()));
        activity.put("icon", icon);
        activity.put("color", color);
        activity.put("bg", bg);
        activity.put("timestamp", doubt.getCreatedAt());
        
        return activity;
    }
    
    // Calculate total cost spent by student
    private double calculateTotalCost(List<Session> completedSessions) {
        return completedSessions.stream()
                .filter(session -> session.getCost() != null)
                .mapToDouble(session -> session.getCost().doubleValue())
                .sum();
    }
    
    // Helper method to get "time ago" string
    private String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Unknown";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(dateTime, now).toMinutes();
        
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " minutes ago";
        
        long hours = minutes / 60;
        if (hours < 24) return hours + " hours ago";
        
        long days = hours / 24;
        if (days < 7) return days + " days ago";
        
        long weeks = days / 7;
        if (weeks < 4) return weeks + " weeks ago";
        
        return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
    }
}
