export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    role: "STUDENT" | "TUTOR" | "ADMIN"
    isActive: boolean
    isOnline: boolean
    profilePicture?: string
    phoneNumber?: string
    bio?: string
    subjects?: Subject[]
    rating?: number
    totalSessions?: number
    totalEarnings?: number
    hourlyRate?: number
    stripeAccountId?: string
    createdAt: string
    updatedAt: string
}

export type Subject =
    | "MATHEMATICS"
    | "PHYSICS"
    | "CHEMISTRY"
    | "BIOLOGY"
    | "COMPUTER_SCIENCE"
    | "ENGLISH"
    | "HISTORY"
    | "GEOGRAPHY"
    | "ECONOMICS"
    | "ACCOUNTING"
    | "STATISTICS"
    | "CALCULUS"
    | "ALGEBRA"
    | "GEOMETRY"
    | "TRIGONOMETRY"

export interface Doubt {
    id: number
    student: User
    subject: Subject
    title: string
    description: string
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED"
    attachments?: string[]
    preferredTutorId?: number
    createdAt: string
    updatedAt: string
}

export interface Session {
    id: number
    student: User
    tutor?: User
    doubt: Doubt
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "TIMEOUT"
    startTime: string
    endTime?: string
    durationMinutes?: number
    cost?: number
    tutorEarnings?: number
    sessionId: string
    roomId?: string
    sessionNotes?: string
    canvasData?: string
    recordingEnabled?: boolean
    recordingUrl?: string
    createdAt: string
    updatedAt: string
}

export interface Subscription {
    id: number
    user: User
    planType: "BASIC" | "STANDARD" | "PREMIUM"
    status: "ACTIVE" | "CANCELED" | "EXPIRED" | "PAST_DUE"
    price: number
    startDate: string
    endDate: string
    stripeSubscriptionId?: string
    stripeCustomerId?: string
    sessionsUsed: number
    sessionsLimit?: number
    createdAt: string
    updatedAt: string
}

export interface Feedback {
    id: number
    session: Session
    reviewer: User
    reviewee: User
    rating: number
    comment?: string
    type: "STUDENT_TO_TUTOR" | "TUTOR_TO_STUDENT"
    createdAt: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
    role: "STUDENT" | "TUTOR"
    phoneNumber?: string
    bio?: string
    subjects?: Subject[]
    hourlyRate?: number
}

export interface CreateDoubtRequest {
    subject: Subject
    title: string
    description: string
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    attachments?: string[]
    preferredTutorId?: number
}

export interface CreateSessionRequest {
    doubtId: number
    studentId: number
}

export interface CreateFeedbackRequest {
    sessionId: number
    rating: number
    comment?: string
}

export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface WebSocketMessage {
    type: string
    payload: any
    sessionId?: string
    userId?: number
}

export interface Plan {
    id: number;
    name: string;
    price: number;
    sessionsLimit: number;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
