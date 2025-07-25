"use client"

import { ReactNode, useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { TutorCallNotification } from "@/components/VideoCall/TutorCallNotification"
import { IncomingCallNotification } from "@/components/VideoCall/IncomingCallNotification"

interface TutorCallProviderProps {
    children: ReactNode
}

export function TutorCallProvider({ children }: TutorCallProviderProps) {
    const { user } = useAuth()
    const [incomingCall, setIncomingCall] = useState<{
        isOpen: boolean
        callerName: string
        callerId: number
        sessionId: string
    }>({
        isOpen: false,
        callerName: "",
        callerId: 0,
        sessionId: "",
    })

    useEffect(() => {
        if (user?.role === "TUTOR") {
            // Listen for incoming video calls via WebSocket
            const serverUrl =
                process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") ||
                "ws://localhost:8080"
            const wsUrl = `${serverUrl}/ws/calls?userId=${user.id}`

            const socket = new WebSocket(wsUrl)

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.type === "incoming_call") {
                        setIncomingCall({
                            isOpen: true,
                            callerName: data.callerName,
                            callerId: data.callerId,
                            sessionId: data.sessionId,
                        })
                    }
                } catch (error) {
                    console.error("Error parsing call message:", error)
                }
            }

            return () => {
                socket.close()
            }
        }
    }, [user])

    const handleAcceptCall = () => {
        setIncomingCall((prev) => ({ ...prev, isOpen: false }))
        // The IncomingCallNotification component handles navigation
    }

    const handleDeclineCall = () => {
        setIncomingCall((prev) => ({ ...prev, isOpen: false }))
        // Could send decline message to caller here
    }

    return (
        <>
            {children}
            {/* Only render the notification components for tutors */}
            {user?.role === "TUTOR" && (
                <>
                    <TutorCallNotification />
                    <IncomingCallNotification
                        isOpen={incomingCall.isOpen}
                        onAccept={handleAcceptCall}
                        onDecline={handleDeclineCall}
                        callerName={incomingCall.callerName}
                        callerId={incomingCall.callerId}
                        sessionId={incomingCall.sessionId}
                    />
                </>
            )}
        </>
    )
}
