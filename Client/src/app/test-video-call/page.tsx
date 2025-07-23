"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useVideoCall } from "@/context/VideoCallContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestVideoCallPage() {
    const { user } = useAuth()
    const { callState, websocket, initiateCall, acceptCall, rejectCall, endCall } = useVideoCall()
    const [testTutorId, setTestTutorId] = useState(2) // Assuming tutor has ID 2

    useEffect(() => {
        console.log('Test page - User:', user)
        console.log('Test page - WebSocket connected:', websocket?.isConnected())
        console.log('Test page - Call state:', callState)
    }, [user, websocket, callState])

    const handleTestCall = async () => {
        console.log('Initiating test call to tutor ID:', testTutorId)
        await initiateCall(testTutorId, "Test Tutor")
    }

    const handleAcceptCall = async () => {
        console.log('Accepting incoming call')
        await acceptCall()
    }

    const handleRejectCall = () => {
        console.log('Rejecting incoming call')
        rejectCall()
    }

    const handleEndCall = () => {
        console.log('Ending call')
        endCall()
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to test video calls</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Video Call Test Page</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </CardContent>
                    </Card>

                    {/* WebSocket Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>WebSocket Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Connected:</strong> {websocket?.isConnected() ? '✅ Yes' : '❌ No'}</p>
                            <p><strong>WebSocket Object:</strong> {websocket ? '✅ Initialized' : '❌ Not initialized'}</p>
                        </CardContent>
                    </Card>

                    {/* Call State */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Call State</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>In Call:</strong> {callState.isInCall ? '✅ Yes' : '❌ No'}</p>
                            <p><strong>Incoming Call:</strong> {callState.isIncomingCall ? '✅ Yes' : '❌ No'}</p>
                            <p><strong>Outgoing Call:</strong> {callState.isOutgoingCall ? '✅ Yes' : '❌ No'}</p>
                            <p><strong>Caller ID:</strong> {callState.callerId || 'None'}</p>
                            <p><strong>Caller Name:</strong> {callState.callerName || 'None'}</p>
                            <p><strong>Callee ID:</strong> {callState.calleeId || 'None'}</p>
                            <p><strong>Callee Name:</strong> {callState.calleeName || 'None'}</p>
                            <p><strong>Session ID:</strong> {callState.sessionId || 'None'}</p>
                        </CardContent>
                    </Card>

                    {/* Test Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Target Tutor ID:
                                </label>
                                <input
                                    type="number"
                                    value={testTutorId}
                                    onChange={(e) => setTestTutorId(parseInt(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Button 
                                    onClick={handleTestCall}
                                    disabled={callState.isOutgoingCall || callState.isInCall}
                                    className="w-full"
                                >
                                    {callState.isOutgoingCall ? 'Calling...' : 'Start Test Call'}
                                </Button>
                                
                                {callState.isIncomingCall && (
                                    <div className="space-y-2">
                                        <Button 
                                            onClick={handleAcceptCall}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            Accept Incoming Call
                                        </Button>
                                        <Button 
                                            onClick={handleRejectCall}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Reject Incoming Call
                                        </Button>
                                    </div>
                                )}
                                
                                {(callState.isInCall || callState.isOutgoingCall) && (
                                    <Button 
                                        onClick={handleEndCall}
                                        variant="outline"
                                        className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                    >
                                        End Call
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Debug Log */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Debug Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-100 p-4 rounded text-sm font-mono">
                            <p>Open browser console to see detailed logs</p>
                            <p>WebSocket URL: {process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws'}</p>
                            <p>Current timestamp: {new Date().toISOString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}