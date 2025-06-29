# NerdsOnCall Backend API

Spring Boot REST API for the NerdsOnCall real-time doubt-solving platform.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [WebSocket Endpoints](#websocket-endpoints)
9. [Authentication](#authentication)
10. [Error Handling](#error-handling)
11. [Deployment](#deployment)

## Overview

This backend provides REST APIs for:

-   User authentication and management
-   Doubt creation and management
-   Real-time tutor matching
-   Video session management
-   Subscription and payment processing
-   Feedback and rating system
-   WebSocket communication for real-time features

## Tech Stack

-   **Framework**: Spring Boot 3.2.0
-   **Database**: PostgreSQL (via Supabase)
-   **Authentication**: JWT
-   **Real-time**: WebSocket + STOMP
-   **Payments**: Stripe
-   **Build Tool**: Maven
-   **Java Version**: 17

## Project Structure

```
src/main/java/com/nerdsoncall/
├── config/                 # Configuration classes
│   ├── SecurityConfig.java    # Spring Security configuration
│   └── WebSocketConfig.java   # WebSocket/STOMP configuration
├── controller/             # REST Controllers
│   ├── AuthController.java    # Authentication endpoints
│   ├── UserController.java    # User management
│   ├── DoubtController.java   # Doubt management
│   ├── SessionController.java # Session management
│   ├── SubscriptionController.java # Subscription management
│   ├── PaymentController.java     # Stripe webhooks
│   ├── FeedbackController.java    # Feedback system
│   ├── WebSocketController.java   # WebSocket handlers
│   └── HealthController.java      # Health check
├── dto/                    # Data Transfer Objects
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── RegisterRequest.java
│   ├── CreateDoubtRequest.java
│   ├── CreateSessionRequest.java
│   └── CreateFeedbackRequest.java
├── entity/                 # JPA Entities
│   ├── User.java          # User entity with roles
│   ├── Subscription.java  # Subscription plans
│   ├── Doubt.java         # Student doubts
│   ├── Session.java       # Tutoring sessions
│   ├── Feedback.java      # Rating system
│   └── Payout.java        # Tutor earnings
├── repository/             # JPA Repositories
│   ├── UserRepository.java
│   ├── SubscriptionRepository.java
│   ├── DoubtRepository.java
│   ├── SessionRepository.java
│   ├── FeedbackRepository.java
│   └── PayoutRepository.java
├── security/               # Security components
│   ├── JwtUtil.java           # JWT utility
│   ├── JwtAuthenticationFilter.java
│   └── JwtAuthenticationEntryPoint.java
├── service/                # Business Logic
│   ├── AuthService.java       # Authentication service
│   ├── UserService.java       # User management
│   ├── DoubtService.java      # Doubt management
│   ├── SessionService.java    # Session management
│   ├── SubscriptionService.java # Subscription logic
│   ├── PaymentService.java    # Stripe integration
│   └── FeedbackService.java   # Feedback system
└── NerdsOnCallApplication.java # Main application class
```

## Setup & Installation

### Prerequisites

-   Java 17 or higher
-   Maven 3.6+
-   PostgreSQL database (or Supabase account)
-   Stripe account for payments

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd Server
    ```

2. **Configure environment variables**
   Create a `.env` file in the root directory:

    ```env
    SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/your-db-name
    SPRING_DATASOURCE_USERNAME=your-db-username
    SPRING_DATASOURCE_PASSWORD=your-db-password
    JWT_SECRET=your-jwt-secret-key-minimum-32-characters
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_SERVICE_KEY=your-supabase-service-key
    STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
    STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
    ```

3. **Build the application**

    ```bash
    mvn clean package
    ```

4. **Run the application**

    ```bash
    java -jar target/backend.jar
    ```

    Or for development:

    ```bash
    mvn spring-boot:run
    ```

The application will start on `http://localhost:8080`

## Environment Variables

| Variable                     | Description                       | Required |
| ---------------------------- | --------------------------------- | -------- |
| `SPRING_DATASOURCE_URL`      | PostgreSQL database URL           | Yes      |
| `SPRING_DATASOURCE_USERNAME` | Database username                 | Yes      |
| `SPRING_DATASOURCE_PASSWORD` | Database password                 | Yes      |
| `JWT_SECRET`                 | JWT signing secret (min 32 chars) | Yes      |
| `SUPABASE_URL`               | Supabase project URL              | Yes      |
| `SUPABASE_SERVICE_KEY`       | Supabase service role key         | Yes      |
| `STRIPE_SECRET_KEY`          | Stripe secret key                 | Yes      |
| `STRIPE_WEBHOOK_SECRET`      | Stripe webhook secret             | Yes      |

## API Documentation

### Base URL

All API endpoints are prefixed with `/api`

### Authentication Endpoints

#### POST `/api/auth/register`

Register a new user (student or tutor)

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "phoneNumber": "+1234567890",
  "bio": "Experienced tutor",
  "subjects": ["MATHEMATICS", "PHYSICS"],
  "hourlyRate": 25.0
}
```

#### POST `/api/auth/login`

Authenticate user and get JWT token

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }
}
```

#### POST `/api/auth/logout`

Logout user (requires authentication)

#### GET `/api/auth/me`

Get current user information (requires authentication)

### User Management Endpoints

#### GET `/api/users/profile`

Get current user's profile (requires authentication)

#### PUT `/api/users/profile`

Update current user's profile (requires authentication)

#### GET `/api/users/tutors`

Get list of online tutors

-   Query param: `subject` (optional)

#### GET `/api/users/tutors/top-rated`

Get top-rated tutors

-   Query param: `subject` (optional)

#### GET `/api/users/{id}`

Get user by ID

#### PUT `/api/users/online-status`

Update online status (requires authentication)

-   Query param: `isOnline` (true/false)

### Doubt Management Endpoints

#### POST `/api/doubts`

Create a new doubt (students only, requires authentication)

**Request Body:**

```json
{
  "subject": "MATHEMATICS",
  "title": "Calculus Integration Problem",
  "description": "I need help with integration by parts",
  "priority": "MEDIUM",
  "attachments": ["https://example.com/image1.jpg"],
  "preferredTutorId": 2
}
```

#### GET `/api/doubts/my-doubts`

Get current user's doubts (requires authentication)

#### GET `/api/doubts/available`

Get available doubts for tutors (tutors only, requires authentication)

-   Query param: `subject` (optional)

#### GET `/api/doubts/preferred`

Get doubts where current tutor is preferred (tutors only, requires authentication)

#### GET `/api/doubts/{id}`

Get doubt by ID

#### PUT `/api/doubts/{id}/status`

Update doubt status

-   Query param: `status` (OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CANCELLED)

### Session Management Endpoints

#### POST `/api/sessions`

Create a new session (tutors only, requires authentication)

**Request Body:**

```json
{
  "doubtId": 1,
  "studentId": 1
}
```

#### GET `/api/sessions/my-sessions`

Get current user's sessions (requires authentication)

#### GET `/api/sessions/{id}`

Get session by ID

#### GET `/api/sessions/session/{sessionId}`

Get session by session ID

#### PUT `/api/sessions/{id}/end`

End a session (requires authentication)

#### PUT `/api/sessions/{id}/notes`

Update session notes

#### PUT `/api/sessions/{id}/canvas`

Update canvas data

### Subscription Management Endpoints

#### GET `/api/subscriptions/my-subscription`

Get current user's active subscription (requires authentication)

#### GET `/api/subscriptions/history`

Get subscription history (requires authentication)

#### POST `/api/subscriptions/checkout`

Create Stripe checkout session (students only, requires authentication)

-   Query params: `planType`, `successUrl`, `cancelUrl`

#### POST `/api/subscriptions/cancel/{id}`

Cancel subscription (requires authentication)

#### GET `/api/subscriptions/can-create-session`

Check if user can create a session (requires authentication)

### Feedback Endpoints

#### POST `/api/feedback`

Create feedback for a session (requires authentication)

**Request Body:**

```json
{
  "sessionId": 1,
  "rating": 5,
  "comment": "Excellent tutoring session!"
}
```

#### GET `/api/feedback/tutor/{tutorId}`

Get feedback for a specific tutor

#### GET `/api/feedback/my-feedback`

Get feedback created by current user (requires authentication)

### Payment Endpoints

#### POST `/api/stripe/webhook`

Stripe webhook endpoint for payment events

### Health Check

#### GET `/api/health`

Health check endpoint

## WebSocket Endpoints

### Connection

Connect to WebSocket at: `ws://localhost:8080/api/ws`

### Subscriptions

-   `/topic/tutor/{tutorId}` - Receive new doubts
-   `/topic/student/{studentId}` - Receive session updates
-   `/topic/session/{sessionId}/canvas` - Canvas updates
-   `/topic/session/{sessionId}/screen` - Screen share
-   `/topic/session/{sessionId}/webrtc` - WebRTC signaling

### Message Destinations

-   `/app/canvas/{sessionId}` - Send canvas updates
-   `/app/screen/{sessionId}` - Send screen share data
-   `/app/webrtc/{sessionId}` - Send WebRTC signaling

## Authentication

### JWT Token

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles

-   **STUDENT**: Can create doubts, join sessions, provide feedback
-   **TUTOR**: Can accept doubts, create sessions, receive payments
-   **ADMIN**: Full access to all resources

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message description",
  "timestamp": "2024-01-01T12:00:00",
  "path": "/api/endpoint"
}
```

### HTTP Status Codes

-   `200` - Success
-   `201` - Created
-   `400` - Bad Request
-   `401` - Unauthorized
-   `403` - Forbidden
-   `404` - Not Found
-   `500` - Internal Server Error

## Deployment

### Railway Deployment

1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically build and deploy

### Manual Deployment

1. Build the JAR file: `mvn clean package`
2. Run with: `java -jar target/backend.jar`
3. Ensure all environment variables are set

---

For any questions or issues, please refer to the main project documentation.
