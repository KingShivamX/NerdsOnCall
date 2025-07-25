"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useWebSocket } from "@/context/WebSocketContext"
import { VideoCallModal } from "@/components/VideoCall/VideoCallModal"
import toast from "react-hot-toast"

interface StudentDoubtStatusProps {
    currentDoubt?: any
    onDoubtAccepted?: (doubt: any) => void
}

export function StudentDoubtStatus({
    currentDoubt,
    onDoubtAccepted,
}: StudentDoubtStatusProps) {
    const { user } = useAuth()
    const { doubtSocket } = useWebSocket()
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)
    const [acceptedDoubt, setAcceptedDoubt] = useState<any>(null)
    const [tutorDetails, setTutorDetails] = useState<any>(null)

    useEffect(() => {
        if (doubtSocket && user?.role === "STUDENT") {
            doubtSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log("Student received WebSocket message:", data)

                    if (data.type === "doubt_accepted") {
                        handleDoubtAccepted(data)
                    } else if (data.type === "doubt_rejected") {
                        handleDoubtRejected(data)
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error)
                }
            }
        }
    }, [doubtSocket, user])

    const handleDoubtAccepted = (data: any) => {
        toast.success(
            `${data.tutorName} accepted your doubt! Starting video call...`
        )

        setAcceptedDoubt({
            id: data.doubtId,
            tutorId: data.tutorId,
            tutorName: data.tutorName,
        })

        // Auto-start video call
        setIsCallModalOpen(true)

        if (onDoubtAccepted) {
            onDoubtAccepted(data)
        }
    }

    const handleDoubtRejected = (data: any) => {
        toast.error(`${data.tutorName} declined your doubt request`)
    }

    if (!user || user.role !== "STUDENT") {
        return null
    }

    return (
        <>
            {/* Video Call Modal */}
            {acceptedDoubt && (
                <VideoCallModal
                    isOpen={isCallModalOpen}
                    onClose={() => setIsCallModalOpen(false)}
                    tutorId={acceptedDoubt.tutorId}
                    tutorName={acceptedDoubt.tutorName}
                    sessionId={`doubt_${acceptedDoubt.id}`}
                />
            )}
        </>
    )
}
