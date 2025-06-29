"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./AuthContext"
import { WebSocketMessage } from "@/types"

interface WebSocketContextType {
    socket: Socket | null
    connected: boolean
    subscribeToTutorUpdates: (tutorId: number) => void
    subscribeToStudentUpdates: (studentId: number) => void
    subscribeToSessionUpdates: (sessionId: string) => void
    sendCanvasUpdate: (sessionId: string, canvasData: string) => void
    sendScreenShare: (sessionId: string, screenData: string) => void
    sendWebRTCSignal: (sessionId: string, signalData: any) => void
    unsubscribe: (channel: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth()
    const [socket, setSocket] = useState<Socket | null>(null)
    const [connected, setConnected] = useState(false)
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (isAuthenticated && user) {
            // Connect to WebSocket server
            const newSocket = io(
                process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
                    "http://localhost:8080",
                {
                    auth: {
                        token: localStorage.getItem("token"),
                        userId: user.id,
                    },
                    transports: ["websocket"],
                }
            )

            newSocket.on("connect", () => {
                console.log("WebSocket connected")
                setConnected(true)
            })

            newSocket.on("disconnect", () => {
                console.log("WebSocket disconnected")
                setConnected(false)
            })

            newSocket.on("error", (error) => {
                console.error("WebSocket error:", error)
            })

            socketRef.current = newSocket
            setSocket(newSocket)

            return () => {
                newSocket.disconnect()
                socketRef.current = null
                setSocket(null)
                setConnected(false)
            }
        }
    }, [isAuthenticated, user])

    const subscribeToTutorUpdates = (tutorId: number) => {
        if (socket) {
            socket.emit("subscribe", `tutor_${tutorId}`)
        }
    }

    const subscribeToStudentUpdates = (studentId: number) => {
        if (socket) {
            socket.emit("subscribe", `student_${studentId}`)
        }
    }

    const subscribeToSessionUpdates = (sessionId: string) => {
        if (socket) {
            socket.emit("subscribe", `session_${sessionId}`)
            socket.emit("subscribe", `session_${sessionId}_canvas`)
            socket.emit("subscribe", `session_${sessionId}_screen`)
            socket.emit("subscribe", `session_${sessionId}_webrtc`)
        }
    }

    const sendCanvasUpdate = (sessionId: string, canvasData: string) => {
        if (socket) {
            socket.emit("canvas_update", {
                sessionId,
                data: canvasData,
                userId: user?.id,
            })
        }
    }

    const sendScreenShare = (sessionId: string, screenData: string) => {
        if (socket) {
            socket.emit("screen_share", {
                sessionId,
                data: screenData,
                userId: user?.id,
            })
        }
    }

    const sendWebRTCSignal = (sessionId: string, signalData: any) => {
        if (socket) {
            socket.emit("webrtc_signal", {
                sessionId,
                signal: signalData,
                userId: user?.id,
            })
        }
    }

    const unsubscribe = (channel: string) => {
        if (socket) {
            socket.emit("unsubscribe", channel)
        }
    }

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                connected,
                subscribeToTutorUpdates,
                subscribeToStudentUpdates,
                subscribeToSessionUpdates,
                sendCanvasUpdate,
                sendScreenShare,
                sendWebRTCSignal,
                unsubscribe,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    )
}

export function useWebSocket() {
    const context = useContext(WebSocketContext)
    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocketProvider")
    }
    return context
}
