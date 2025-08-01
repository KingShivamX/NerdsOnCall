# NerdsOnCall

**Real‑Time Doubt‑Solving Platform**

A comprehensive platform connecting students and tutors through live video calls for instant doubt resolution. Built with Spring Boot backend and Next.js frontend.

---

## 🚀 Project Overview

NerdsOnCall is a real-time educational platform that connects students with tutors for instant doubt resolution through live video calls, interactive whiteboards, and screen sharing.

### Key Features

-   **Live Video Calls**: WebRTC-powered real-time communication
-   **Interactive Whiteboard**: Shared canvas for visual explanations
-   **Screen Sharing**: Full screen or window sharing capabilities
-   **Real-Time Matching**: Instant tutor-student connections
-   **Subscription Management**: Flexible billing plans via Stripe
-   **Session History**: Complete logs and feedback system

---

## 🏗 Architecture

### Backend (Spring Boot)

-   **Framework**: Spring Boot 3.2.0
-   **Database**: PostgreSQL (via Supabase)
-   **Authentication**: JWT
-   **Real-time**: WebSocket + STOMP
-   **Payments**: Stripe

### Frontend (Next.js)

-   **Framework**: Next.js 15.3.4 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4
-   **State Management**: React Context + TanStack Query v5
-   **Real-time**: Socket.IO Client
-   **Video Calls**: WebRTC

---

## 📁 Project Structure

```
NerdsOnCall/
├── Server/                    # Spring Boot Backend
│   ├── src/main/java/com/nerdsoncall/
│   │   ├── config/               # Configuration classes
│   │   ├── controller/           # REST Controllers
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── entity/               # JPA Entities
│   │   ├── repository/           # Data Repositories
│   │   ├── security/             # Security components
│   │   └── service/              # Business Logic
│   └── README_BACKEND.md         # Backend setup & API docs
├── Client/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   ├── components/           # React components
│   │   ├── context/              # React Context providers
│   │   ├── lib/                  # Utility libraries
│   │   └── types/                # TypeScript definitions
│   └── README_FRONTEND.md        # Frontend setup & component docs
└── README.md                  # This file
```

---

## 📚 Documentation

For detailed setup instructions, API documentation, and development guides:

-   **Backend**: See [Server/README_BACKEND.md](Server/README_BACKEND.md)
-   **Frontend**: See [Client/README_FRONTEND.md](Client/README_FRONTEND.md)

---

**Built with ❤️ for education and learning**
