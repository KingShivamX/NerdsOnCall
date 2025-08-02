/**
 * Utility functions for converting technical error messages into user-friendly messages
 */

export interface ErrorResponse {
    response?: {
        status?: number
        data?: any
    }
    message?: string
    code?: string
}

/**
 * Converts technical error messages into user-friendly messages
 * @param error - The error object from API calls or other operations
 * @param context - Optional context for more specific error messages
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(
    error: ErrorResponse,
    context?: "auth" | "video-call" | "chat" | "general"
): string {
    // Handle network errors
    if (!error.response && error.message) {
        if (
            error.message.includes("Network Error") ||
            error.message.includes("ERR_NETWORK")
        ) {
            return "Unable to connect to the server. Please check your internet connection and try again."
        }
        if (error.message.includes("timeout")) {
            return "The request timed out. Please try again."
        }
    }

    // Handle HTTP status codes
    const status = error.response?.status
    const serverMessage = error.response?.data?.message

    switch (status) {
        case 400:
            if (context === "auth") {
                if (
                    serverMessage &&
                    serverMessage.toLowerCase().includes("email")
                ) {
                    return "Please enter a valid email address."
                }
                if (
                    serverMessage &&
                    serverMessage.toLowerCase().includes("password")
                ) {
                    return "Please check your password and try again."
                }
                return "Please check your information and try again."
            }
            return (
                serverMessage ||
                "Invalid request. Please check your input and try again."
            )

        case 401:
            if (context === "auth") {
                return "Invalid email or password. Please try again."
            }
            return "Your session has expired. Please log in again."

        case 403:
            return "You don't have permission to perform this action."

        case 404:
            if (context === "video-call") {
                return "The session you're looking for was not found."
            }
            return "The requested resource was not found."

        case 409:
            return "This action conflicts with existing data. Please refresh and try again."

        case 413:
            return "The file you're trying to upload is too large. Please choose a smaller file."

        case 422:
            return (
                serverMessage ||
                "The information provided is not valid. Please check and try again."
            )

        case 429:
            return "Too many requests. Please wait a moment and try again."

        case 500:
            if (context === "chat") {
                return "AI assistant is temporarily unavailable. Please try again in a few moments."
            }
            return "Something went wrong on our end. Please try again in a few moments."

        case 502:
        case 503:
        case 504:
            if (context === "chat") {
                return "AI assistant is temporarily unavailable. Please try again in a few moments."
            }
            return "The service is temporarily unavailable. Please try again in a few moments."

        default:
            // For unknown status codes, provide a generic message
            if (status && status >= 400) {
                if (context === "chat") {
                    return "Unable to get response from AI assistant. Please try again."
                }
                return "Something went wrong. Please try again."
            }
    }

    // Handle specific error patterns
    if (error.message) {
        const message = error.message.toLowerCase()

        if (message.includes("request failed with status code")) {
            return "Something went wrong. Please try again."
        }

        if (message.includes("network error")) {
            return "Unable to connect to the server. Please check your internet connection."
        }

        if (message.includes("timeout")) {
            return "The request timed out. Please try again."
        }

        if (message.includes("cors")) {
            return "Connection error. Please refresh the page and try again."
        }
    }

    // Fallback to server message if it's user-friendly, otherwise generic message
    if (
        serverMessage &&
        typeof serverMessage === "string" &&
        !serverMessage.includes("status code")
    ) {
        return serverMessage
    }

    return "Something went wrong. Please try again."
}

/**
 * Converts WebSocket error messages into user-friendly messages
 * @param message - The WebSocket error message
 * @returns User-friendly error message
 */
export function getWebSocketErrorMessage(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (
        lowerMessage.includes("recipient offline") ||
        lowerMessage.includes("user not connected")
    ) {
        return "The other user is not connected yet. Please wait..."
    }

    if (
        lowerMessage.includes("connection failed") ||
        lowerMessage.includes("websocket")
    ) {
        return "Connection lost. Trying to reconnect..."
    }

    if (
        lowerMessage.includes("permission denied") ||
        lowerMessage.includes("unauthorized")
    ) {
        return "You don't have permission to perform this action."
    }

    if (
        lowerMessage.includes("session not found") ||
        lowerMessage.includes("invalid session")
    ) {
        return "The session is no longer available."
    }

    if (lowerMessage.includes("timeout")) {
        return "Connection timed out. Please try again."
    }

    // Don't show technical WebSocket errors to users
    return "Connection error. Please try again."
}

/**
 * Sanitizes console log messages to remove sensitive information
 * @param message - The message to sanitize
 * @returns Sanitized message safe for console logging
 */
export function sanitizeLogMessage(message: string): string {
    // Remove session IDs (pattern: tutor_123_student_456_789)
    const sessionIdPattern = /tutor_\d+_student_\d+_\d+/g
    let sanitized = message.replace(sessionIdPattern, "SESSION_ID_HIDDEN")

    // Remove other potential sensitive patterns
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    sanitized = sanitized.replace(emailPattern, "EMAIL_HIDDEN")

    // Remove JWT tokens (basic pattern)
    const jwtPattern =
        /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g
    sanitized = sanitized.replace(jwtPattern, "TOKEN_HIDDEN")

    return sanitized
}
