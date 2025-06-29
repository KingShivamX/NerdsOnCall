# NerdsOnCall

**Real‑Time Doubt‑Solving Platform**

A comprehensive platform connecting students and tutors through live video calls for instant doubt resolution. Built with Spring Boot backend and Next.js frontend.

---

## 🚀 Quick Start

### Prerequisites

-   Java 17+
-   Node.js 18+
-   PostgreSQL (or Supabase account)
-   Stripe account for payments

### Backend Setup (Spring Boot)

1. **Navigate to Server directory**

    ```bash
    cd Server
    ```

2. **Configure environment variables**
   Create a `.env` file in the Server directory:

    ```env
    SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres
    SPRING_DATASOURCE_USERNAME=postgres.qspiiyqnrftjoclwhhcw
    SPRING_DATASOURCE_PASSWORD=your-database-password
    JWT_SECRET=your-jwt-secret-key-minimum-32-characters
    SUPABASE_URL=https://qspiiyqnrftjoclwhhcw.supabase.co
    SUPABASE_SERVICE_KEY=your-supabase-service-key
    STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
    STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
    ```

3. **Build and run**

    ```bash
    mvn clean package
    java -jar target/backend.jar
    ```

    The backend will start on `http://localhost:8080`

### Frontend Setup (Next.js with Modern Tailwind CSS)

1. **Navigate to Client directory**

    ```bash
    cd Client
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**
   Create a `.env.local` file in the Client directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    NEXT_PUBLIC_SUPABASE_URL=https://qspiiyqnrftjoclwhhcw.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcGlpeXFucmZ0am9jbHdoaGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzI3OTMsImV4cCI6MjA2NjgwODc5M30.fA_2xDX_ZddghRNRKULw2ZyJcLXFmrKMlM9TTFfpRKg
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
    ```

4. **Run development server**

    ```bash
    npm run dev
    ```

    The frontend will start on `http://localhost:3000`

### ✨ **Modern Tailwind CSS v4**

This project uses the latest **Tailwind CSS v4** with:

-   ⚡ **Single `@import "tailwindcss"`** in CSS (no more `@tailwind` directives)
-   🚫 **No separate `tailwind.config.js` or `postcss.config.js`** files needed
-   🎨 **Built-in CSS variables** for theming
-   🔥 **Faster builds** and better performance

---

## 📋 Features

### Core Features

-   **Subject-Based Doubts**: Students select topics (Math, Physics, etc.) to categorize requests
-   **Live Tutor Matching**: Broadcast queries to online tutors; first acceptance connects
-   **Direct Tutor Invite**: Students can request a specific tutor
-   **Video & Audio Calls**: WebRTC-powered low-latency communication
-   **Interactive Canvas**: Real-time shared whiteboard for annotations and drawings
-   **Screen Sharing**: Users share full screen or specific windows
-   **Real‑Time Notifications**: WebSocket alerts for doubt raised and acceptance

### Business Features

-   **Subscription Plans**: Monthly billing via Stripe (Basic, Standard, Premium)
-   **Per‑Minute Payouts**: Automated tutor earnings based on session duration
-   **Ratings & Feedback**: Post-session reviews to maintain quality
-   **Session History**: Detailed logs and transcripts for students and tutors

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
-   **Styling**: Tailwind CSS v4 (Modern @import syntax)
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
│   ├── pom.xml                   # Maven dependencies
│   └── README_BACKEND.md         # Backend documentation
├── Client/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   ├── components/           # React components
│   │   ├── context/              # React Context providers
│   │   ├── lib/                  # Utility libraries
│   │   └── types/                # TypeScript definitions
│   ├── package.json              # npm dependencies
│   └── FRONTEND_README.md        # Frontend documentation
└── README.md                  # This file
```

---

## 🔗 API Endpoints

### Authentication

-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `POST /api/auth/logout` - User logout
-   `GET /api/auth/me` - Get current user

### User Management

-   `GET /api/users/profile` - Get user profile
-   `PUT /api/users/profile` - Update user profile
-   `GET /api/users/tutors` - Get online tutors
-   `PUT /api/users/online-status` - Update online status

### Doubt Management

-   `POST /api/doubts` - Create new doubt
-   `GET /api/doubts/my-doubts` - Get user's doubts
-   `GET /api/doubts/available` - Get available doubts (tutors)
-   `PUT /api/doubts/{id}/status` - Update doubt status

### Session Management

-   `POST /api/sessions` - Create new session
-   `GET /api/sessions/my-sessions` - Get user's sessions
-   `PUT /api/sessions/{id}/end` - End session
-   `PUT /api/sessions/{id}/canvas` - Update canvas data

### Subscriptions & Payments

-   `GET /api/subscriptions/my-subscription` - Get active subscription
-   `POST /api/subscriptions/checkout` - Create Stripe checkout
-   `POST /api/stripe/webhook` - Stripe webhook handler

---

## 💡 Usage Workflow

1. **User Registration**: Students and tutors sign up with role selection
2. **Subscription**: Students choose and pay for a monthly plan
3. **Doubt Creation**: Students post questions with subject categorization
4. **Tutor Matching**: System broadcasts to online tutors; first to accept gets connected
5. **Live Session**: Video call with interactive whiteboard and screen sharing
6. **Session Completion**: Automatic billing, earnings calculation, and feedback collection

---

## 🛠 Development

### Backend Development

```bash
cd Server
mvn spring-boot:run    # Run in development mode
mvn test              # Run tests
mvn clean package     # Build JAR
```

### Frontend Development

```bash
cd Client
npm run dev           # Start development server
npm run build         # Build for production
npm run lint          # Run ESLint
npm run type-check    # TypeScript checking
```

---

## 🚀 Deployment

### Backend (Railway/Heroku)

1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `mvn clean package`
4. Set start command: `java -jar target/backend.jar`

### Frontend (Vercel)

1. Connect GitHub repository
2. Configure environment variables
3. Enable automatic deployments
4. Custom domain setup (optional)

---

## 📚 Documentation

-   [Backend API Documentation](Server/README_BACKEND.md)
-   [Frontend Component Guide](Client/FRONTEND_README.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 📞 Support

For support and questions:

-   Email: support@nerdsoncall.com
-   Documentation: See individual README files in Server/ and Client/ directories

---

**Built with ❤️ for education and learning**
