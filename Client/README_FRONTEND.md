# NerdsOnCall Frontend

Modern Next.js frontend for the NerdsOnCall real-time doubt-solving platform.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [Components Documentation](#components-documentation)
7. [Pages & Routing](#pages--routing)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [WebSocket Integration](#websocket-integration)
11. [Development](#development)
12. [Deployment](#deployment)

## Overview

This frontend application provides:

-   Modern, responsive UI with Tailwind CSS
-   Real-time video calls with WebRTC
-   Interactive whiteboard/canvas
-   Screen sharing capabilities
-   WebSocket-based real-time communication
-   Stripe payment integration
-   Authentication and authorization
-   Role-based interfaces (Student/Tutor/Admin)

## Tech Stack

-   **Framework**: Next.js 15.3.4 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: React Context + React Query
-   **API Client**: Axios
-   **Real-time**: Socket.IO Client
-   **Video Calls**: WebRTC + Simple Peer
-   **Payments**: Stripe.js
-   **Notifications**: React Hot Toast
-   **Icons**: Lucide React

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── globals.css                # Global styles and Tailwind imports
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Home/landing page
│   ├── loading.tsx                # Global loading component
│   ├── auth/                      # Authentication pages
│   │   ├── login/page.tsx            # Login page
│   │   ├── register/page.tsx         # Registration page
│   │   └── layout.tsx                # Auth layout
│   ├── dashboard/                 # Dashboard pages
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── layout.tsx                # Dashboard layout
│   │   ├── doubts/                   # Doubt management
│   │   ├── sessions/                 # Session management
│   │   ├── tutors/                   # Tutor discovery
│   │   ├── profile/                  # User profile
│   │   └── subscription/             # Subscription management
│   ├── session/                   # Video session interface
│   │   └── [sessionId]/page.tsx      # Live session page
│   └── tutor/                     # Tutor-specific pages
│       ├── dashboard/                # Tutor dashboard
│       └── earnings/                 # Earnings & payouts
├── components/                    # Reusable React components
│   ├── ui/                          # Base UI components
│   │   ├── Button.tsx                  # Reusable button component
│   │   ├── Input.tsx                   # Form input component
│   │   ├── Card.tsx                    # Card container component
│   │   ├── Modal.tsx                   # Modal/dialog component
│   │   ├── Badge.tsx                   # Status badge component
│   │   ├── Avatar.tsx                  # User avatar component
│   │   ├── Spinner.tsx                 # Loading spinner
│   │   └── Toast.tsx                   # Toast notification component
│   ├── layout/                      # Layout components
│   │   ├── Navbar.tsx                  # Main navigation bar
│   │   ├── Sidebar.tsx                 # Dashboard sidebar
│   │   ├── Footer.tsx                  # Footer component
│   │   └── Header.tsx                  # Page header component
│   ├── auth/                        # Authentication components
│   │   ├── LoginForm.tsx               # Login form
│   │   ├── RegisterForm.tsx            # Registration form
│   │   ├── ProtectedRoute.tsx          # Route protection wrapper
│   │   └── RoleGuard.tsx               # Role-based access control
│   ├── dashboard/                   # Dashboard components
│   │   ├── DashboardStats.tsx          # Statistics cards
│   │   ├── RecentActivity.tsx          # Recent activity feed
│   │   ├── QuickActions.tsx            # Quick action buttons
│   │   └── NotificationCenter.tsx      # Notification management
│   ├── doubts/                      # Doubt-related components
│   │   ├── DoubtCard.tsx               # Individual doubt display
│   │   ├── DoubtList.tsx               # List of doubts
│   │   ├── CreateDoubtForm.tsx         # Form to create new doubt
│   │   ├── DoubtFilters.tsx            # Filtering options
│   │   └── DoubtDetails.tsx            # Detailed doubt view
│   ├── tutors/                      # Tutor components
│   │   ├── TutorCard.tsx               # Individual tutor display
│   │   ├── TutorList.tsx               # List of tutors
│   │   ├── TutorProfile.tsx            # Tutor profile view
│   │   ├── TutorFilters.tsx            # Tutor filtering
│   │   └── TutorRating.tsx             # Rating display/input
│   ├── sessions/                    # Session components
│   │   ├── SessionCard.tsx             # Session summary card
│   │   ├── SessionList.tsx             # List of sessions
│   │   ├── VideoCall.tsx               # Video call interface
│   │   ├── Canvas.tsx                  # Interactive whiteboard
│   │   ├── ScreenShare.tsx             # Screen sharing component
│   │   ├── SessionControls.tsx         # Call controls (mute, video, etc.)
│   │   ├── ParticipantsList.tsx        # Session participants
│   │   └── SessionChat.tsx             # In-session chat
│   ├── payments/                    # Payment components
│   │   ├── SubscriptionPlans.tsx       # Subscription plan selection
│   │   ├── PaymentForm.tsx             # Payment form
│   │   ├── BillingHistory.tsx          # Payment history
│   │   └── PaymentSuccess.tsx          # Payment confirmation
│   ├── feedback/                    # Feedback components
│   │   ├── FeedbackForm.tsx            # Feedback submission form
│   │   ├── FeedbackList.tsx            # List of feedback
│   │   ├── RatingStars.tsx             # Star rating component
│   │   └── FeedbackCard.tsx            # Individual feedback display
│   ├── landing/                     # Landing page components
│   │   ├── Hero.tsx                    # Hero section
│   │   ├── Features.tsx                # Features showcase
│   │   ├── HowItWorks.tsx              # Process explanation
│   │   ├── Pricing.tsx                 # Pricing plans
│   │   ├── Testimonials.tsx            # User testimonials
│   │   └── CTA.tsx                     # Call-to-action sections
│   └── providers.tsx                # Context providers wrapper
├── context/                       # React Context providers
│   ├── AuthContext.tsx               # Authentication state management
│   └── WebSocketContext.tsx          # WebSocket connection management
├── hooks/                         # Custom React hooks
│   ├── useAuth.ts                    # Authentication hook
│   ├── useWebSocket.ts               # WebSocket hook
│   ├── useLocalStorage.ts            # Local storage hook
│   ├── useMediaDevices.ts            # Camera/microphone access
│   ├── useWebRTC.ts                  # WebRTC connection hook
│   ├── useCanvas.ts                  # Canvas drawing hook
│   └── useScreenShare.ts             # Screen sharing hook
├── lib/                           # Utility libraries
│   ├── api.ts                        # API client and endpoints
│   ├── utils.ts                      # Utility functions
│   ├── webrtc.ts                     # WebRTC utilities
│   ├── canvas.ts                     # Canvas drawing utilities
│   └── validation.ts                # Form validation schemas
├── types/                         # TypeScript type definitions
│   └── index.ts                      # All type definitions
└── constants/                     # Application constants
    ├── subjects.ts                   # Subject categories
    ├── routes.ts                     # Route definitions
    └── config.ts                     # App configuration
```

## Setup & Installation

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   Backend API running (see Server README)

### Installation Steps

1. **Navigate to Client directory**

    ```bash
    cd Client
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**
   Create `.env.local` file:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
    ```

4. **Run development server**

    ```bash
    npm run dev
    ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## Environment Variables

| Variable                             | Description            | Required |
| ------------------------------------ | ---------------------- | -------- |
| `NEXT_PUBLIC_API_URL`                | Backend API base URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase project URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase anonymous key | Yes      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes      |

## Components Documentation

### UI Components (`components/ui/`)

#### Button.tsx

**Purpose**: Reusable button component with variants and sizes
**Props**:

-   `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
-   `size`: 'sm' | 'md' | 'lg'
-   `loading`: boolean
-   `disabled`: boolean

#### Input.tsx

**Purpose**: Form input component with validation states
**Props**:

-   `type`: HTML input type
-   `error`: string (error message)
-   `label`: string
-   `placeholder`: string

#### Card.tsx

**Purpose**: Container component for content sections
**Props**:

-   `children`: ReactNode
-   `className`: string
-   `hover`: boolean (hover effects)

#### Modal.tsx

**Purpose**: Modal dialog component for overlays
**Props**:

-   `isOpen`: boolean
-   `onClose`: function
-   `title`: string
-   `children`: ReactNode

### Layout Components (`components/layout/`)

#### Navbar.tsx

**Purpose**: Main navigation with user menu and authentication state
**Features**:

-   Responsive design
-   User avatar and dropdown
-   Authentication status
-   Role-based navigation items

#### Sidebar.tsx

**Purpose**: Dashboard sidebar navigation
**Features**:

-   Collapsible design
-   Role-based menu items
-   Active route highlighting
-   Quick actions

#### Footer.tsx

**Purpose**: Site footer with links and information
**Features**:

-   Company information
-   Navigation links
-   Social media links
-   Legal links

### Authentication Components (`components/auth/`)

#### LoginForm.tsx

**Purpose**: User login form with validation
**Features**:

-   Email/password validation
-   Error handling
-   Loading states
-   Remember me option

#### RegisterForm.tsx

**Purpose**: User registration with role selection
**Features**:

-   Multi-step form for tutors
-   Subject selection for tutors
-   Form validation
-   Terms acceptance

#### ProtectedRoute.tsx

**Purpose**: Wrapper component for protected pages
**Features**:

-   Authentication check
-   Role verification
-   Redirect handling
-   Loading states

### Dashboard Components (`components/dashboard/`)

#### DashboardStats.tsx

**Purpose**: Statistics cards for dashboard overview
**Features**:

-   Key metrics display
-   Charts and graphs
-   Real-time updates
-   Role-specific stats

#### RecentActivity.tsx

**Purpose**: Activity feed for recent actions
**Features**:

-   Chronological activity list
-   Activity type icons
-   Relative timestamps
-   Pagination

### Doubt Components (`components/doubts/`)

#### CreateDoubtForm.tsx

**Purpose**: Form for creating new doubts
**Features**:

-   Subject selection
-   File attachments
-   Priority setting
-   Tutor preference

#### DoubtCard.tsx

**Purpose**: Display individual doubt information
**Features**:

-   Doubt details
-   Status indicators
-   Action buttons
-   Time stamps

#### DoubtList.tsx

**Purpose**: List/grid view of doubts
**Features**:

-   Filtering options
-   Sorting capabilities
-   Pagination
-   Search functionality

### Session Components (`components/sessions/`)

#### VideoCall.tsx

**Purpose**: Video calling interface using WebRTC
**Features**:

-   Peer-to-peer video
-   Audio controls
-   Video quality settings
-   Connection status

#### Canvas.tsx

**Purpose**: Interactive whiteboard for collaboration
**Features**:

-   Drawing tools
-   Shape tools
-   Text tools
-   Real-time sync
-   Undo/redo
-   Clear canvas

#### ScreenShare.tsx

**Purpose**: Screen sharing functionality
**Features**:

-   Screen capture
-   Application sharing
-   Permission handling
-   Quality controls

#### SessionControls.tsx

**Purpose**: Call control buttons and settings
**Features**:

-   Mute/unmute audio
-   Enable/disable video
-   Screen share toggle
-   End call button
-   Settings menu

### Payment Components (`components/payments/`)

#### SubscriptionPlans.tsx

**Purpose**: Display and select subscription plans
**Features**:

-   Plan comparison
-   Feature lists
-   Pricing display
-   Current plan indicator

#### PaymentForm.tsx

**Purpose**: Stripe payment form integration
**Features**:

-   Secure card input
-   Payment validation
-   Loading states
-   Error handling

## Pages & Routing

### Authentication Pages

-   `/auth/login` - User login
-   `/auth/register` - User registration

### Dashboard Pages

-   `/dashboard` - Main dashboard
-   `/dashboard/doubts` - Doubt management
-   `/dashboard/sessions` - Session history
-   `/dashboard/tutors` - Tutor discovery
-   `/dashboard/profile` - User profile
-   `/dashboard/subscription` - Subscription management

### Session Pages

-   `/session/[sessionId]` - Live video session

### Tutor Pages

-   `/tutor/dashboard` - Tutor dashboard
-   `/tutor/earnings` - Earnings and payouts

## State Management

### AuthContext

**Purpose**: Manages user authentication state
**State**:

-   `user`: Current user object
-   `loading`: Authentication loading state
-   `isAuthenticated`: Boolean authentication status

**Methods**:

-   `login(email, password)`: User login
-   `logout()`: User logout
-   `updateUser(userData)`: Update user data

### WebSocketContext

**Purpose**: Manages WebSocket connections and real-time updates
**State**:

-   `socket`: Socket.IO instance
-   `connected`: Connection status

**Methods**:

-   `subscribeToTutorUpdates(tutorId)`: Subscribe to tutor updates
-   `subscribeToStudentUpdates(studentId)`: Subscribe to student updates
-   `subscribeToSessionUpdates(sessionId)`: Subscribe to session updates
-   `sendCanvasUpdate()`: Send canvas drawing data
-   `sendScreenShare()`: Send screen share data

## API Integration

All API calls are centralized in `lib/api.ts` with the following modules:

### authApi

-   `login(credentials)`: User authentication
-   `register(userData)`: User registration
-   `logout()`: User logout
-   `getCurrentUser()`: Get current user data

### userApi

-   `getProfile()`: Get user profile
-   `updateProfile(data)`: Update user profile
-   `getOnlineTutors()`: Get online tutors
-   `updateOnlineStatus()`: Update online status

### doubtApi

-   `createDoubt(data)`: Create new doubt
-   `getMyDoubts()`: Get user's doubts
-   `getAvailableDoubts()`: Get available doubts for tutors

### sessionApi

-   `createSession(data)`: Create new session
-   `getMySessions()`: Get user's sessions
-   `endSession(id)`: End active session

## WebSocket Integration

Real-time features are implemented using Socket.IO:

### Connection Management

-   Automatic connection on authentication
-   Reconnection handling
-   Error handling

### Event Subscriptions

-   Tutor doubt notifications
-   Student session updates
-   Canvas drawing sync
-   Screen share streaming
-   WebRTC signaling

### Broadcasting

-   Canvas updates to session participants
-   Screen share data
-   WebRTC signals for video calls

## Development

### Code Style

-   TypeScript for type safety
-   ESLint for code quality
-   Prettier for formatting
-   Tailwind CSS for styling

### Component Guidelines

-   Use functional components with hooks
-   Implement proper TypeScript types
-   Follow naming conventions
-   Include proper error boundaries

### State Management Rules

-   Use React Context for global state
-   React Query for server state
-   Local state for component-specific data
-   Avoid prop drilling

### Testing

```bash
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Linting & Formatting

```bash
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run format      # Format with Prettier
```

## Deployment

### Vercel Deployment (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments
4. Custom domain setup (optional)

### Manual Deployment

```bash
npm run build       # Build production version
npm start          # Start production server
```

### Environment Setup

Ensure all environment variables are configured:

-   API endpoints
-   Supabase configuration
-   Stripe keys
-   WebSocket URLs

### Performance Optimizations

-   Image optimization with Next.js Image component
-   Code splitting with dynamic imports
-   Bundle analysis with `@next/bundle-analyzer`
-   Caching strategies for API calls

## Folder Structure Best Practices

### Component Organization

-   Group by feature/domain
-   Separate UI components from business logic
-   Use index files for clean imports
-   Follow single responsibility principle

### File Naming

-   PascalCase for components
-   camelCase for utilities and hooks
-   kebab-case for pages and routes
-   Descriptive names that indicate purpose

### Import Structure

```typescript
// External libraries
import React from 'react'
import { NextPage } from 'next'

// Internal components
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

// Types
import { User } from '@/types'

// Utilities
import { formatDate } from '@/lib/utils'
```

---

This frontend provides a modern, scalable architecture for the NerdsOnCall platform with real-time capabilities, responsive design, and comprehensive user experience features.
