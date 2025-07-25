"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useWebSocket } from "@/context/WebSocketContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/Navbar"

export default function TestWebSocketPage() {
    const { user } = useAuth()
    const { doubtSocket, connected, sendDoubtMessage } = useWebSocket()
    const [messages, setMessages] = useState<string[]>([])
    const [connectionStatus, setConnectionStatus] = useState("Disconnected")

    useEffect(() => {
        if (doubtSocket) {
            setConnectionStatus(
                doubtSocket.readyState === WebSocket.OPEN
                    ? "Connected"
                    : "Connecting"
            )

            doubtSocket.onopen = () => {
                setConnectionStatus("Connected")
                addMessage("WebSocket connected")
            }

            doubtSocket.onclose = () => {
                setConnectionStatus("Disconnected")
                addMessage("WebSocket disconnected")
            }

            doubtSocket.onmessage = (event) => {
                addMessage(`Received: ${event.data}`)
            }

            doubtSocket.onerror = (error) => {
                addMessage(`Error: ${error}`)
            }
        }
    }, [doubtSocket])

    const addMessage = (message: string) => {
        setMessages((prev) => [
            ...prev,
            `${new Date().toLocaleTimeString()} - ${message}`,
        ])
    }

    const sendTestMessage = () => {
        if (doubtSocket && doubtSocket.readyState === WebSocket.OPEN) {
            const testMessage = {
                type: "test",
                message: "Hello from client",
                userId: user?.id,
                timestamp: new Date().toISOString(),
            }
            sendDoubtMessage(testMessage)
            addMessage(`Sent: ${JSON.stringify(testMessage)}`)
        } else {
            addMessage("Cannot send message - WebSocket not connected")
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to test WebSocket connection.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-20 pb-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            WebSocket Test
                        </h1>
                        <p className="text-slate-600">
                            Test the WebSocket connection for real-time doubt
                            notifications
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Connection Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Connection Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            connectionStatus === "Connected"
                                                ? "bg-green-500"
                                                : connectionStatus ===
                                                  "Connecting"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                    />
                                    <span className="font-medium">
                                        {connectionStatus}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div>
                                        <strong>User:</strong> {user.firstName}{" "}
                                        {user.lastName}
                                    </div>
                                    <div>
                                        <strong>Role:</strong> {user.role}
                                    </div>
                                    <div>
                                        <strong>User ID:</strong> {user.id}
                                    </div>
                                </div>

                                <Button
                                    onClick={sendTestMessage}
                                    disabled={connectionStatus !== "Connected"}
                                    className="w-full"
                                >
                                    Send Test Message
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Message Log */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Message Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 overflow-y-auto bg-slate-100 p-3 rounded border font-mono text-xs">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className="mb-1 break-words"
                                        >
                                            {message}
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="text-slate-500 italic">
                                            No messages yet...
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMessages([])}
                                    className="mt-2"
                                >
                                    Clear Log
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Instructions */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Testing Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <strong>For Tutors:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    <li>
                                        You should automatically connect to the
                                        doubt notification WebSocket
                                    </li>
                                    <li>
                                        When students submit doubts, you'll
                                        receive real-time notifications
                                    </li>
                                    <li>
                                        Test by having a student submit a doubt
                                        request
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <strong>For Students:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    <li>
                                        You should connect to receive doubt
                                        status updates
                                    </li>
                                    <li>
                                        When tutors accept/reject your doubts,
                                        you'll get notifications
                                    </li>
                                    <li>
                                        Video calls will auto-start when doubts
                                        are accepted
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
