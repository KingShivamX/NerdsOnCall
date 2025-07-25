"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useWebSocket } from "@/context/WebSocketContext"
import { useRouter } from "next/navigation"
import { IncomingCallModal } from "./IncomingCallModal"
import toast from "react-hot-toast"

interface StudentCallNotificationProps {
    // This component doesn't need any props - it's a global listener
}

export function StudentCallNotification({}: StudentCallNotificationProps) {
    const { user } = useAuth()
    const { doubtSocket } = useWebSocket()
    const router = useRouter()
    
    // State for incoming call handling
    const [incomingCall, setIncomingCall] = useState<{
        callerId: string;
        callerName: string;
        sessionId: string;
    } | null>(null)
    const [showIncomingCallModal, setShowIncomingCallModal] = useState(false)

    useEffect(() => {
        if (doubtSocket && user?.role === "STUDENT") {
            const handleWebSocketMessage = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log("StudentCallNotification: Received WebSocket message:", data)

                    if (data.type === "incoming_call" && data.to === user?.id.toString()) {
                        console.log("StudentCallNotification: Received incoming call from:", data.callerName)
                        
                        // Show incoming call notification popup
                        setIncomingCall({
                            callerId: data.from,
                            callerName: data.callerName,
                            sessionId: data.sessionId
                        })
                        setShowIncomingCallModal(true)
                        
                        toast.success(`📞 Incoming call from ${data.callerName}`)
                    } else if (data.type === "call_accepted" && data.to === user?.id.toString()) {
                        console.log("StudentCallNotification: Call accepted by:", data.accepterName)
                        toast.success(`${data.accepterName} accepted your call!`)
                        
                        // Navigate to video call page
                        router.push(`/video-call/${data.sessionId}?role=student&tutorId=${data.from}&tutorName=${encodeURIComponent(data.accepterName)}`)
                    } else if (data.type === "call_declined" && data.to === user?.id.toString()) {
                        console.log("StudentCallNotification: Call declined by:", data.declinerName)
                        toast.error(`${data.declinerName} declined your call`)
                    }
                } catch (error) {
                    console.error("StudentCallNotification: Error parsing WebSocket message:", error)
                }
            }

            // Store the original handler to avoid conflicts
            const originalHandler = doubtSocket.onmessage
            
            // Create a combined handler if there's already one
            if (originalHandler) {
                doubtSocket.onmessage = (event) => {
                    handleWebSocketMessage(event)
                    if (originalHandler !== handleWebSocketMessage) {
                        originalHandler(event)
                    }
                }
            } else {
                doubtSocket.onmessage = handleWebSocketMessage
            }
            
            return () => {
                // Only remove our handler if it's still there
                if (doubtSocket.onmessage === handleWebSocketMessage || 
                    (doubtSocket.onmessage && doubtSocket.onmessage.toString().includes('handleWebSocketMessage'))) {
                    doubtSocket.onmessage = originalHandler
                }
            }
        }
    }, [doubtSocket, user, router])

    // Handle accepting incoming call from tutor
    const handleAcceptIncomingCall = () => {
        if (incomingCall && doubtSocket) {
            // Send call accepted response
            const acceptResponse = {
                type: "call_accepted",
                to: incomingCall.callerId,
                from: user?.id.toString(),
                responderName: `${user?.firstName} ${user?.lastName}`,
                sessionId: incomingCall.sessionId
            }
            
            console.log("StudentCallNotification: Sending call accepted response:", acceptResponse)
            doubtSocket.send(JSON.stringify(acceptResponse))
            
            // Close the modal
            setShowIncomingCallModal(false)
            setIncomingCall(null)
            
            // Navigate to video call page
            router.push(`/video-call/${incomingCall.sessionId}?role=student&tutorId=${incomingCall.callerId}&tutorName=${encodeURIComponent(incomingCall.callerName)}`)
            
            toast.success("Call accepted! Joining video call...")
        }
    }

    // Handle declining incoming call from tutor
    const handleDeclineIncomingCall = () => {
        if (incomingCall && doubtSocket) {
            // Send call declined response
            const declineResponse = {
                type: "call_declined",
                to: incomingCall.callerId,
                from: user?.id.toString(),
                responderName: `${user?.firstName} ${user?.lastName}`,
                sessionId: incomingCall.sessionId
            }
            
            console.log("StudentCallNotification: Sending call declined response:", declineResponse)
            doubtSocket.send(JSON.stringify(declineResponse))
            
            // Close the modal
            setShowIncomingCallModal(false)
            setIncomingCall(null)
            
            toast.error("Call declined")
        }
    }

    if (!user || user.role !== "STUDENT") {
        return null
    }

    return (
        <>
            {/* Incoming Call Modal */}
            {incomingCall && (
                <IncomingCallModal
                    isOpen={showIncomingCallModal}
                    callerName={incomingCall.callerName}
                    callerId={incomingCall.callerId}
                    sessionId={incomingCall.sessionId}
                    onAccept={handleAcceptIncomingCall}
                    onDecline={handleDeclineIncomingCall}
                />
            )}
        </>
    )
}