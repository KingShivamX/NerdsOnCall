"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface VideoCallModalProps {
    isOpen: boolean
    onClose: () => void
    tutorId: number
    tutorName: string
    sessionId?: string
    isIncomingCall?: boolean
    existingSocket?: WebSocket | null
}

export function VideoCallModal({
    isOpen,
    onClose,
    tutorId,
    tutorName,
    sessionId,
    isIncomingCall = false,
    existingSocket = null,
}: VideoCallModalProps) {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isOpen) {
            // Generate session ID if not provided
            const callSessionId =
                sessionId ||
                `tutor_${tutorId}_student_${user?.id}_${Date.now()}`

            // Close the modal
            onClose()

            // Navigate to the full-page video call
            router.push(
                `/video-call/${callSessionId}?tutorId=${tutorId}&tutorName=${encodeURIComponent(
                    tutorName
                )}`
            )
        }
    }, [isOpen, sessionId, tutorId, tutorName, user?.id, onClose, router])

    // This component no longer renders anything - it just redirects
    return null
}
