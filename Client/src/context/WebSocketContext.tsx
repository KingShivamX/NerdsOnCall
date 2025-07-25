"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "./AuthContext"

interface WebSocketContextType {
    doubtSocket: WebSocket | null
    webrtcSocket: WebSocket | null
    connected: boolean
    connectDoubtSocket: () => void
    connectWebRTCSocket: (sessionId: string) => WebSocket | null
    sendDoubtMessage: (message: any) => void
    sendWebRTCMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [doubtSocket, setDoubtSocket] = useState<WebSocket | null>(null)
    const [webrtcSocket, setWebrtcSocket] = useState<WebSocket | null>(null)
    const [connected, setConnected] = useState(false)
    const doubtSocketRef = useRef<WebSocket | null>(null)
    const webrtcSocketRef = useRef<WebSocket | null>(null)

    const connectDoubtSocket = () => {
        if (!user || doubtSocketRef.current?.readyState === WebSocket.OPEN)
            return

        try {
            const serverUrl =
                process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") ||
                "ws://localhost:8080"
            const wsUrl = `${serverUrl}/ws/doubts?userId=${user.id}`

            const socket = new WebSocket(wsUrl)

            socket.onopen = () => {
                console.log("Doubt WebSocket connected")
                setConnected(true)
            }

            socket.onclose = () => {
                console.log("Doubt WebSocket disconnected")
                setConnected(false)
                // Auto-reconnect after 5 seconds
                setTimeout(connectDoubtSocket, 5000)
            }

            socket.onerror = (error) => {
                console.error("Doubt WebSocket error:", error)
            }

            doubtSocketRef.current = socket
            setDoubtSocket(socket)
        } catch (error) {
            console.error("Error connecting to doubt WebSocket:", error)
        }
    }

    const connectWebRTCSocket = (sessionId: string): WebSocket | null => {
        try {
            const serverUrl =
                process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") ||
                "ws://localhost:8080"
            const wsUrl = `${serverUrl}/ws/webrtc?userId=${user?.id}&sessionId=${sessionId}`

            const socket = new WebSocket(wsUrl)
            webrtcSocketRef.current = socket
            setWebrtcSocket(socket)

            return socket
        } catch (error) {
            console.error("Error connecting to WebRTC WebSocket:", error)
            return null
        }
    }

    const sendDoubtMessage = (message: any) => {
        if (doubtSocketRef.current?.readyState === WebSocket.OPEN) {
            doubtSocketRef.current.send(JSON.stringify(message))
        }
    }

    const sendWebRTCMessage = (message: any) => {
        if (webrtcSocketRef.current?.readyState === WebSocket.OPEN) {
            webrtcSocketRef.current.send(JSON.stringify(message))
        }
    }

    useEffect(() => {
        if (user) {
            connectDoubtSocket()
        }

        return () => {
            if (doubtSocketRef.current) {
                doubtSocketRef.current.close()
            }
            if (webrtcSocketRef.current) {
                webrtcSocketRef.current.close()
            }
        }
    }, [user])

    return (
        <WebSocketContext.Provider
            value={{
                doubtSocket,
                webrtcSocket,
                connected,
                connectDoubtSocket,
                connectWebRTCSocket,
                sendDoubtMessage,
                sendWebRTCMessage,
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
