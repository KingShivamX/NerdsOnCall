"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useVideoCall } from "@/context/VideoCallContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, PhoneOff, Users } from "lucide-react"

export default function VideoCallTest() {
    const { user } = useAuth()
    const { callState, websocket, initiateCall, acceptCall, rejectCall } = useVideoCall()
    const [testTutorId, setTestTutorId] = useState<number>(1)
    const [connectionStatus, setConnectionStatus] = useState<string>("Checking...")

    useEffect(() => {
        if (websocket) {
            const checkConnection = () => {
                const isConnected = websocket.isConnected()
                setConnectionStatus(isConnected ? "Connected" : "Disconnected")
            }
            
            checkConnection()
            const interval = setInterval(checkConnection, 1000)
            return () => clearInterval(interval)
        }
    }, [websocket])

    const handleTestCall = async () => {
        if (user && user.role === "STUDENT") {
            console.log("Testing call from student to tutor...")
            await initiateCall(testTutorId, "Test Tutor")
        }
    }

    const handleAcceptTest = () => {
        console.log("Accepting test call...")
        acceptCall()
    }

    const handleRejectTest = () => {
        console.log("Rejecting test call...")
        rejectCall()
    }

    if (!user) {
        return <div>Please log in to test video calls</div>
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Video Call Test
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Connection Status */}
                <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm font-medium text-slate-700">WebSocket Status</div>
                    <div className={`text-sm ${connectionStatus === "Connected" ? "text-green-600" : "text-red-600"}`}>
                        {connectionStatus}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        User ID: {user.id} | Role: {user.role}
                    </div>
                </div>

                {/* Call State */}
                <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm font-medium text-slate-700">Call State</div>
                    <div className="text-xs text-slate-600 mt-1">
                        <div>In Call: {callState.isInCall ? "Yes" : "No"}</div>
                        <div>Incoming Call: {callState.isIncomingCall ? "Yes" : "No"}</div>
                        <div>Outgoing Call: {callState.isOutgoingCall ? "Yes" : "No"}</div>
                        {callState.callerId && <div>Caller ID: {callState.callerId}</div>}
                        {callState.callerName && <div>Caller Name: {callState.callerName}</div>}
                        {callState.sessionId && <div>Session ID: {callState.sessionId}</div>}
                    </div>
                </div>

                {/* Test Controls */}
                <div className="space-y-2">
                    {user.role === "STUDENT" && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-slate-700">Student Test</div>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    value={testTutorId}
                                    onChange={(e) => setTestTutorId(Number(e.target.value))}
                                    placeholder="Tutor ID"
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                                />
                                <Button
                                    onClick={handleTestCall}
                                    disabled={callState.isOutgoingCall || callState.isInCall}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Phone className="h-4 w-4 mr-1" />
                                    Call
                                </Button>
                            </div>
                        </div>
                    )}

                    {user.role === "TUTOR" && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-slate-700">Tutor Test</div>
                            {callState.isIncomingCall ? (
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={handleRejectTest}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                    >
                                        <PhoneOff className="h-4 w-4 mr-1" />
                                        Decline
                                    </Button>
                                    <Button
                                        onClick={handleAcceptTest}
                                        size="sm"
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <Phone className="h-4 w-4 mr-1" />
                                        Accept
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500 text-center py-4">
                                    Waiting for incoming calls...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Debug Info */}
                <details className="text-xs">
                    <summary className="cursor-pointer text-slate-600">Debug Info</summary>
                    <pre className="mt-2 p-2 bg-slate-100 rounded text-xs overflow-auto">
                        {JSON.stringify(callState, null, 2)}
                    </pre>
                </details>
            </CardContent>
        </Card>
    )
}