"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "./AuthContext"

interface WebSocketContextType {
    webrtcSocket: WebSocket | null
    connectWebRTCSocket: (sessionId: string) => WebSocket | null
    sendWebRTCMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [webrtcSocket, setWebrtcSocket] = useState<WebSocket | null>(null)
    const webrtcSocketRef = useRef<WebSocket | null>(null)



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



    const sendWebRTCMessage = (message: any) => {
        if (webrtcSocketRef.current?.readyState === WebSocket.OPEN) {
            webrtcSocketRef.current.send(JSON.stringify(message))
        }
    }

    useEffect(() => {
        return () => {
            if (webrtcSocketRef.current) {
                webrtcSocketRef.current.close()
            }
        }
    }, [])

    return (
        <WebSocketContext.Provider
            value={{
                webrtcSocket,
                connectWebRTCSocket,
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
