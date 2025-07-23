"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useVideoCall } from "@/context/VideoCallContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestWebSocketConnectionPage() {
    const { user } = useAuth()
    const { websocket, callState } = useVideoCall()
    const [connectionStatus, setConnectionStatus] = useState<string>('Checking...')
    const [testResults, setTestResults] = useState<string[]>([])

    useEffect(() => {
        const checkConnection = () => {
            if (!user) {
                setConnectionStatus('❌ No user logged in')
                return
            }

            if (!websocket) {
                setConnectionStatus('❌ WebSocket not initialized')
                return
            }

            if (!websocket.isConnected()) {
                setConnectionStatus('❌ WebSocket not connected')
                return
            }

            setConnectionStatus('✅ WebSocket connected')
        }

        checkConnection()
        const interval = setInterval(checkConnection, 1000)
        return () => clearInterval(interval)
    }, [user, websocket])

    const addTestResult = (result: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
    }

    const testSendMessage = () => {
        if (!websocket || !user) {
            addTestResult('❌ Cannot send test message - WebSocket or user not available')
            return
        }

        if (!websocket.isConnected()) {
            addTestResult('❌ Cannot send test message - WebSocket not connected')
            return
        }

        // Send a test call request to yourself (will show "user not found" but tests the connection)
        const testTargetId = user.id === 1 ? 2 : 1 // Send to user 1 if you're user 2, or vice versa
        
        const testMessage = {
            type: 'call-request' as const,
            from: user.id,
            to: testTargetId,
            data: { callerName: `${user.firstName} ${user.lastName}` },
            sessionId: `test_${Date.now()}`,
            timestamp: Date.now()
        }

        try {
            websocket.sendCallRequest(testTargetId, testMessage.sessionId, testMessage.data.callerName)
            addTestResult(`✅ Test message sent to user ${testTargetId}`)
            addTestResult(`Note: If user ${testTargetId} is not online, you'll see "Target user not connected"`)
        } catch (error) {
            addTestResult(`❌ Error sending test message: ${error}`)
        }
    }

    const clearResults = () => {
        setTestResults([])
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to test WebSocket connection</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">WebSocket Connection Test</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Connection Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Connection Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>User:</strong> {user.firstName} {user.lastName} (ID: {user.id})</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>WebSocket Status:</strong> {connectionStatus}</p>
                                <p><strong>WebSocket Object:</strong> {websocket ? '✅ Exists' : '❌ Not found'}</p>
                                {websocket && (
                                    <p><strong>Ready State:</strong> {websocket.isConnected() ? 'OPEN (1)' : 'NOT OPEN'}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Call State */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Call State</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>In Call:</strong> {callState.isInCall ? '✅' : '❌'}</p>
                                <p><strong>Incoming Call:</strong> {callState.isIncomingCall ? '✅' : '❌'}</p>
                                <p><strong>Outgoing Call:</strong> {callState.isOutgoingCall ? '✅' : '❌'}</p>
                                <p><strong>Caller ID:</strong> {callState.callerId || 'None'}</p>
                                <p><strong>Caller Name:</strong> {callState.callerName || 'None'}</p>
                                <p><strong>Session ID:</strong> {callState.sessionId || 'None'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Test Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                onClick={testSendMessage}
                                disabled={!websocket || !websocket.isConnected()}
                                className="w-full"
                            >
                                Send Test Message
                            </Button>
                            
                            <Button 
                                onClick={clearResults}
                                variant="outline"
                                className="w-full"
                            >
                                Clear Test Results
                            </Button>

                            <div className="text-sm text-slate-600">
                                <p>This will send a test call request to another user ID.</p>
                                <p>If the target user is not online, you'll see "Target user not connected".</p>
                                <p>Check the browser console and server logs for the message flow.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Test Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
                                {testResults.length === 0 ? (
                                    <p className="text-slate-500">No test results yet</p>
                                ) : (
                                    <div className="space-y-1">
                                        {testResults.map((result, index) => (
                                            <div key={index} className="text-sm font-mono">
                                                {result}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Instructions */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Testing Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p><strong>1.</strong> Make sure you're logged in as either a student or tutor</p>
                            <p><strong>2.</strong> Check that the WebSocket status shows "✅ WebSocket connected"</p>
                            <p><strong>3.</strong> Click "Send Test Message" to test the connection</p>
                            <p><strong>4.</strong> Open browser console (F12) to see detailed logs</p>
                            <p><strong>5.</strong> Check server logs to see if the message was received</p>
                            <p><strong>6.</strong> If everything works here, try the actual video call flow</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}