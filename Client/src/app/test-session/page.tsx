"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

export default function TestSessionPage() {
    const { user } = useAuth()
    const [sessionId, setSessionId] = useState("tutor_2_student_1_1753471371742")
    const [tutorId, setTutorId] = useState("2")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionData, setSessionData] = useState<any>(null)
    const [healthStatus, setHealthStatus] = useState<string>("")

    const createTestSession = async () => {
        if (!sessionId || !tutorId) {
            toast.error("Please fill in session ID and tutor ID")
            return
        }

        setIsLoading(true)
        try {
            console.log("Creating test session...")
            const response = await api.post(`/api/sessions/call?tutorId=${tutorId}&sessionId=${sessionId}`)
            console.log("Session created:", response.data)
            setSessionData(response.data)
            toast.success("Test session created successfully!")
        } catch (error: any) {
            console.error("Error creating session:", error)
            console.error("Error details:", error.response?.data)
            toast.error(`Failed to create session: ${error.response?.data || error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const startTestSession = async () => {
        if (!sessionId) {
            toast.error("Please create a session first")
            return
        }

        setIsLoading(true)
        try {
            console.log("Starting test session...")
            const response = await api.put(`/api/sessions/call/${sessionId}/start`)
            console.log("Session started:", response.data)
            setSessionData(response.data)
            toast.success("Test session started! Timer is running...")
        } catch (error) {
            console.error("Error starting session:", error)
            toast.error("Failed to start session")
        } finally {
            setIsLoading(false)
        }
    }

    const endTestSession = async () => {
        if (!sessionId) {
            toast.error("Please create a session first")
            return
        }

        setIsLoading(true)
        try {
            console.log("Ending test session...")
            const response = await api.put(`/api/sessions/call/${sessionId}/end`)
            console.log("Session ended:", response.data)
            setSessionData(response.data)
            
            if (response.data.durationMinutes && response.data.tutorEarnings) {
                const duration = response.data.durationMinutes
                const earnings = response.data.tutorEarnings
                const cost = response.data.cost
                
                toast.success(
                    `Session completed! Duration: ${duration} min, Cost: $${cost}, Tutor Earnings: $${earnings}`,
                    { duration: 8000 }
                )
            } else {
                toast.success("Session ended successfully!")
            }
        } catch (error) {
            console.error("Error ending session:", error)
            toast.error("Failed to end session")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSessionData = async () => {
        if (!sessionData?.id) {
            toast.error("No session to fetch")
            return
        }

        setIsLoading(true)
        try {
            console.log("Fetching session data...")
            const response = await api.get(`/api/sessions/${sessionData.id}`)
            console.log("Session data:", response.data)
            setSessionData(response.data)
            toast.success("Session data refreshed!")
        } catch (error) {
            console.error("Error fetching session:", error)
            toast.error("Failed to fetch session data")
        } finally {
            setIsLoading(false)
        }
    }

    const checkHealth = async () => {
        setIsLoading(true)
        try {
            console.log("Checking session service health...")
            const response = await api.get("/api/sessions/health")
            console.log("Health check response:", response.data)
            setHealthStatus(response.data)
            toast.success("Session service is healthy!")
        } catch (error: any) {
            console.error("Health check failed:", error)
            setHealthStatus(`Health check failed: ${error.response?.data || error.message}`)
            toast.error("Session service health check failed")
        } finally {
            setIsLoading(false)
        }
    }

    const testSessionIdParsing = () => {
        const sessionIdMatch = sessionId.match(/tutor_(\d+)_student_(\d+)_\d+/)
        if (sessionIdMatch) {
            const extractedTutorId = parseInt(sessionIdMatch[1])
            const extractedStudentId = parseInt(sessionIdMatch[2])
            console.log("Extracted from sessionId:", { extractedTutorId, extractedStudentId })
            toast.success(`Parsed sessionId: Tutor ID ${extractedTutorId}, Student ID ${extractedStudentId}`)
        } else {
            console.log("SessionId doesn't match expected pattern")
            toast.error("SessionId doesn't match expected pattern")
        }
    }

    const updateSchema = async () => {
        setIsLoading(true)
        try {
            console.log("Updating database schema...")
            const response = await api.post("/api/sessions/update-schema")
            console.log("Schema update response:", response.data)
            toast.success("Database schema updated successfully!")
        } catch (error: any) {
            console.error("Schema update failed:", error)
            toast.error(`Schema update failed: ${error.response?.data || error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const testDashboard = async () => {
        setIsLoading(true)
        try {
            console.log("Testing dashboard API...")
            const response = await api.get("/api/dashboard/student")
            console.log("Dashboard response:", response.data)

            // Show detailed results
            const data = response.data
            const summary = `
Dashboard API Success!
- Sessions Attended: ${data.sessionsAttended}
- Hours Learned: ${data.hoursLearned}
- Active Sessions: ${data.activeSessions}
- Open Questions: ${data.openQuestions}
- Favorite Tutors: ${data.favoriteTutors}
- Total Cost: $${data.totalCost}
- Recent Activities: ${data.recentActivities?.length || 0}
            `
            console.log(summary)
            toast.success("Dashboard API working! Check console for details.")
        } catch (error: any) {
            console.error("Dashboard test failed:", error)
            console.error("Error details:", error.response)
            toast.error(`Dashboard test failed: ${error.response?.data || error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to test session functionality.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Session Duration & Earnings Test
                    </h1>
                    <p className="text-slate-600">
                        Test session creation, duration tracking, and earnings calculation
                    </p>
                </div>

                {/* Test Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Session Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Session ID (e.g., test_session_123)"
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                            />
                            <Input
                                placeholder="Tutor ID (e.g., 1)"
                                value={tutorId}
                                onChange={(e) => setTutorId(e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Button
                                    onClick={updateSchema}
                                    disabled={isLoading}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    🔧 Update DB Schema (Fix doubt_id constraint)
                                </Button>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    onClick={checkHealth}
                                    disabled={isLoading}
                                    variant="secondary"
                                >
                                    Check Health
                                </Button>
                                <Button
                                    onClick={testSessionIdParsing}
                                    disabled={isLoading || !sessionId}
                                    variant="secondary"
                                >
                                    Test SessionId Parsing
                                </Button>
                                <Button
                                    onClick={testDashboard}
                                    disabled={isLoading}
                                    variant="secondary"
                                >
                                    Test Dashboard API
                                </Button>
                            </div>
                        </div>

                            <Button
                                onClick={createTestSession}
                                disabled={isLoading || !sessionId || !tutorId}
                            >
                                1. Create Session
                            </Button>
                            <Button
                                onClick={startTestSession}
                                disabled={isLoading || !sessionId}
                                variant="outline"
                            >
                                2. Start Session
                            </Button>
                            <Button
                                onClick={endTestSession}
                                disabled={isLoading || !sessionId}
                                variant="outline"
                            >
                                3. End Session
                            </Button>
                            <Button
                                onClick={fetchSessionData}
                                disabled={isLoading || !sessionData?.id}
                                variant="outline"
                            >
                                Refresh Data
                            </Button>
                        </div>
                        
                        <div className="text-sm text-slate-600">
                            <p><strong>Instructions:</strong></p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li><strong className="text-red-600">FIRST TIME:</strong> Click "Update DB Schema" to fix database constraints</li>
                                <li>Enter a unique session ID and tutor ID</li>
                                <li>Create the session (sets up database record)</li>
                                <li>Start the session (begins timer)</li>
                                <li>Wait a few seconds/minutes</li>
                                <li>End the session (calculates duration and earnings at $50/hour)</li>
                            </ol>
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-700 font-semibold">⚠️ IMPORTANT:</p>
                                <p className="text-red-600 text-xs">If you get "null value in column doubt_id" error, click "Update DB Schema" first!</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Health Status */}
                {healthStatus && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Session Service Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{healthStatus}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Session Data Display */}
                {sessionData && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Session Data
                                <Badge variant={sessionData.status === "COMPLETED" ? "default" : "secondary"}>
                                    {sessionData.status}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>ID:</strong> {sessionData.id}</div>
                                <div><strong>Session ID:</strong> {sessionData.sessionId}</div>
                                <div><strong>Status:</strong> {sessionData.status}</div>
                                <div><strong>Payment Status:</strong> {sessionData.paymentStatus}</div>
                                <div><strong>Created Time:</strong> {sessionData.startTime ? new Date(sessionData.startTime).toLocaleString() : "Not set"}</div>
                                <div><strong>Actual Start Time:</strong> {sessionData.actualStartTime ? new Date(sessionData.actualStartTime).toLocaleString() : "Call not started"}</div>
                                <div><strong>End Time:</strong> {sessionData.endTime ? new Date(sessionData.endTime).toLocaleString() : "Not ended"}</div>
                                <div><strong>Duration:</strong> {sessionData.durationMinutes ? `${sessionData.durationMinutes} minutes` : "Not calculated"}</div>
                                <div><strong>Total Cost:</strong> {sessionData.cost ? `$${sessionData.cost}` : "Not calculated"}</div>
                                <div><strong>Tutor Earnings:</strong> {sessionData.tutorEarnings ? `$${sessionData.tutorEarnings}` : "Not calculated"}</div>
                                <div><strong>Platform Commission:</strong> {sessionData.commission ? `$${sessionData.commission}` : "Not calculated"}</div>
                            </div>
                            
                            {sessionData.durationMinutes && sessionData.cost && (
                                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-semibold text-green-800 mb-2">Earnings Breakdown:</h4>
                                    <div className="text-sm text-green-700 space-y-1">
                                        <div>Duration: {sessionData.durationMinutes} minutes ({(sessionData.durationMinutes / 60).toFixed(2)} hours)</div>
                                        <div>Rate: $50/hour</div>
                                        <div>Total Cost: ${sessionData.cost}</div>
                                        <div>Tutor Earnings (80%): ${sessionData.tutorEarnings}</div>
                                        <div>Platform Commission (20%): ${sessionData.commission}</div>
                                        {sessionData.actualStartTime && sessionData.endTime && (
                                            <div className="mt-2 pt-2 border-t border-green-200">
                                                <div>Call Duration: {new Date(sessionData.actualStartTime).toLocaleTimeString()} - {new Date(sessionData.endTime).toLocaleTimeString()}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
