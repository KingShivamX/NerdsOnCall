"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { Phone, PhoneOff } from "lucide-react"
import { VideoCallModal } from "./VideoCallModal"

interface TutorCallNotificationProps {
    onCallReceived?: (studentId: number, studentName: string) => void
}

export function TutorCallNotification({ onCallReceived }: TutorCallNotificationProps) {
    const { user } = useAuth()
    const [isConnected, setIsConnected] = useState(false)
    const [incomingCall, setIncomingCall] = useState<{
        studentId: number;
        studentName: string;
        sessionId: string;
    } | null>(null)
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)
    const [logs, setLogs] = useState<string[]>([])

    const socketRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Add a log entry
    const addLog = (message: string) => {
        console.log(message)
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`])
    }

    // Connect to the signaling server when component mounts
    useEffect(() => {
        if (user?.role === 'TUTOR') {
            connectToSignalingServer()
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            disconnectFromSignalingServer()
        }
    }, [user])

    // Connect to the signaling server
    const connectToSignalingServer = () => {
        try {
            if (!user || user.role !== 'TUTOR') return

            // Connect to WebSocket
            const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8080'
            const wsUrl = `${serverUrl}/ws/webrtc?userId=${user.id}`

            addLog(`Connecting to ${wsUrl}`)

            socketRef.current = new WebSocket(wsUrl)

            socketRef.current.onopen = () => {
                addLog('WebSocket connection established')
                setIsConnected(true)

                // Update tutor's online status in the database
                updateOnlineStatus(true)
            }

            socketRef.current.onmessage = handleWebSocketMessage

            socketRef.current.onclose = () => {
                addLog('WebSocket connection closed')
                setIsConnected(false)

                // Update tutor's online status in the database
                updateOnlineStatus(false)

                // Try to reconnect after a delay
                reconnectTimeoutRef.current = setTimeout(() => {
                    addLog('Attempting to reconnect...')
                    connectToSignalingServer()
                }, 5000)
            }

            socketRef.current.onerror = (error) => {
                addLog(`WebSocket error: ${error}`)
                setIsConnected(false)
            }
        } catch (error: any) {
            addLog(`Error: ${error.message}`)
        }
    }

    // Disconnect from the signaling server
    const disconnectFromSignalingServer = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close()
        }
        socketRef.current = null
        setIsConnected(false)

        // Update tutor's online status in the database
        updateOnlineStatus(false)
    }

    // Update tutor's online status in the database
    const updateOnlineStatus = async (isOnline: boolean) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/online-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ isOnline })
            })
        } catch (error) {
            console.error('Failed to update online status:', error)
        }
    }

    // Handle WebSocket messages
    const handleWebSocketMessage = (event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data)
            addLog(`Received message: ${message.type}`)

            switch (message.type) {
                case 'offer':
                    handleIncomingCall(message)
                    break
                case 'user-joined':
                    addLog(`User ${message.userId} joined the session`)
                    break
                case 'user-left':
                    addLog(`User ${message.userId} left the session`)
                    break
                case 'participants-list':
                    addLog(`Participants in session: ${JSON.stringify(message.participants)}`)
                    break
                case 'error':
                    addLog(`Error from server: ${message.message}`)
                    break
            }
        } catch (error: any) {
            addLog(`Error parsing message: ${error.message}`)
        }
    }

    // Handle incoming call
    const handleIncomingCall = async (message: any) => {
        try {
            // Extract student information from the message
            const studentId = parseInt(message.from)
            const sessionId = message.sessionId

            console.log(studentId);
            console.log(sessionId);

            // Fetch student details
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch student details')
            }

            const studentData = await response.json()
            const studentName = `${studentData.firstName} ${studentData.lastName}`

            // Set incoming call data
            setIncomingCall({
                studentId,
                studentName,
                sessionId
            })

            // Notify with a toast
            toast(`Incoming call from ${studentName}`, {
                duration: 10000,
                icon: '📞',
            })

            // Optional callback
            if (onCallReceived) {
                onCallReceived(studentId, studentName)
            }

        } catch (error: any) {
            addLog(`Error handling incoming call: ${error.message}`)
        }
    }

    // Accept the call
    const acceptCall = () => {
        if (incomingCall) {
            setIsCallModalOpen(true)
        }
    }

    // Reject the call
    const rejectCall = () => {
        if (incomingCall && socketRef.current) {
            // Send rejection message
            socketRef.current.send(JSON.stringify({
                type: 'call-rejected',
                to: incomingCall.studentId.toString(),
                from: user?.id.toString(),
                sessionId: incomingCall.sessionId
            }))

            // Clear incoming call
            setIncomingCall(null)
        }
    }

    // Handle call ended
    const handleCallEnded = () => {
        setIsCallModalOpen(false)
        setIncomingCall(null)
    }

    if (!user || user.role !== 'TUTOR') {
        return null
    }

    return (
        <>
            {/* Incoming Call Dialog */}
            <Dialog open={!!incomingCall && !isCallModalOpen} onOpenChange={(open) => {
                if (!open) rejectCall()
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Incoming Call</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center py-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Phone className="h-8 w-8 text-primary" />
                        </div>

                        <p className="text-lg font-medium mb-1">
                            {incomingCall?.studentName} is calling you
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Do you want to accept this call?
                        </p>
                    </div>

                    <DialogFooter className="flex sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={rejectCall}
                            className="flex-1 sm:flex-none"
                        >
                            <PhoneOff className="mr-2 h-4 w-4" />
                            Decline
                        </Button>
                        <Button
                            type="button"
                            onClick={acceptCall}
                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                        >
                            <Phone className="mr-2 h-4 w-4" />
                            Accept
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Video Call Modal */}
            {incomingCall && isCallModalOpen && (
                <VideoCallModal
                    isOpen={isCallModalOpen}
                    onClose={handleCallEnded}
                    tutorId={incomingCall.studentId}
                    tutorName={incomingCall.studentName}
                    sessionId={incomingCall.sessionId}
                    isIncomingCall={true}
                    existingSocket={socketRef.current}
                />
            )}

            {/* Connection Status Indicator (can be shown in the UI if needed) */}
            <div className="hidden">
                Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
                <div className="text-xs">
                    {logs.slice(-5).map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>
            </div>
        </>
    )
}