# NerdsOnCall

**Real-Time Doubt-Solving Platform**

A comprehensive platform connecting students and tutors through live video calls for instant doubt resolution. Built with Spring Boot backend and Next.js frontend.

## Project Overview

NerdsOnCall is a real-time educational platform that connects students with tutors for instant doubt resolution through live video calls, interactive whiteboards, and screen sharing capabilities.

### Key Features

-   **Live Video Calls**: WebRTC-powered real-time communication
-   **Interactive Whiteboard**: Shared canvas for visual explanations
-   **Screen Sharing**: Full screen or window sharing capabilities
-   **Real-Time Matching**: Instant tutor-student connections
-   **Subscription Management**: Flexible billing plans via Stripe
-   **Session History**: Complete logs and feedback system
-   **WebSocket Communication**: Real-time updates and signaling

## Architecture

### Backend (Spring Boot)

-   **Framework**: Spring Boot 3.2.0
-   **Database**: PostgreSQL (via Supabase)
-   **Authentication**: JWT-based authentication
-   **Real-time**: WebSocket + STOMP protocol
-   **Payments**: Stripe integration
-   **WebRTC Signaling**: Custom WebSocket handlers

### Frontend (Next.js)

-   **Framework**: Next.js 15.3.4 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4
-   **State Management**: React Context + TanStack Query v5
-   **Real-time**: Socket.IO Client
-   **Video Calls**: WebRTC with Simple Peer
-   **Payments**: Stripe.js integration

### Prerequisites

-   Java 17+
-   Node.js 18+
-   PostgreSQL database
-   Stripe account for payments

### Backend Setup

1. Navigate to `Server/` directory
2. Configure `application.yml` with database and Stripe credentials
3. Run `mvn spring-boot:run`
4. Server starts on `http://localhost:8080`

### Frontend Setup

1. Navigate to `Client/` directory
2. Install dependencies: `npm install`
3. Configure environment variables in `.env.local`
4. Run development server: `npm run dev`
5. Application available at `http://localhost:3000`

Built for education and learning
