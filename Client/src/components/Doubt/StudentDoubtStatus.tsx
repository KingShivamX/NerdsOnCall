"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useWebSocket } from "@/context/WebSocketContext"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface StudentDoubtStatusProps {
    currentDoubt?: any
    tutorName?: string
    onDoubtStatusChange?: (status: string, data?: any) => void
}

export function StudentDoubtStatus({
    currentDoubt,
    tutorName,
    onDoubtStatusChange
}: StudentDoubtStatusProps) {
    const { user } = useAuth()
    const { doubtSocket } = useWebSocket()
    const router = useRouter()

    useEffect(() => {
        if (currentDoubt && doubtSocket && user?.role === "STUDENT") {
            doubtSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log("Student received WebSocket message:", data)

                    if (data.type === "doubt_accepted" && data.doubtId === currentDoubt.id) {
                        const resolvedTutorName = data.tutorName || tutorName || "Tutor"
                        toast.success(`🎉 ${resolvedTutorName} accepted your doubt! You can now start a video call.`)
                        
                        if (onDoubtStatusChange) {
                            onDoubtStatusChange('accepted', {
                                tutorId: data.tutorId,
                                tutorName: resolvedTutorName,
                                doubtId: currentDoubt.id,
                                doubt: currentDoubt
                            })
                        }
                    } else if (data.type === "doubt_rejected" && data.doubtId === currentDoubt.id) {
                        const rejectedTutorName = data.tutorName || tutorName || "Tutor"
                        toast.error(`${rejectedTutorName} declined your doubt request`)
                        if (onDoubtStatusChange) {
                            onDoubtStatusChange('rejected')
                        }
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error)
                }
            }
        }
    }, [doubtSocket, user, currentDoubt, tutorName, onDoubtStatusChange, router])

    // This component now only handles WebSocket messages, no UI rendering
    return null
}