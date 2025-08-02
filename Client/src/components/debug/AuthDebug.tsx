"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthDebug() {
    const [debugInfo, setDebugInfo] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const testAuth = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            console.log("Token from localStorage:", token)

            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]))
                    console.log("Token payload:", payload)

                    const now = Math.floor(Date.now() / 1000)
                    console.log(
                        "Token expires at:",
                        payload.exp,
                        "Current time:",
                        now,
                        "Is expired:",
                        payload.exp < now
                    )
                } catch (e) {
                    console.log("Error parsing token:", e)
                }
            }

            // Test API call
            const response = await api.get("/auth/me")
            console.log("API Response:", response.data)

            setDebugInfo({
                token: token ? "Present" : "Missing",
                tokenLength: token?.length || 0,
                apiResponse: response.data,
                status: "Success",
            })
        } catch (error: any) {
            console.error("Auth test error:", error)
            setDebugInfo({
                token: localStorage.getItem("token") ? "Present" : "Missing",
                error: error.response?.data || error.message,
                status: error.response?.status || "Network Error",
            })
        } finally {
            setLoading(false)
        }
    }

    const testDoubtSubmission = async () => {
        setLoading(true)
        try {
            const testDoubt = {
                title: "Test Question",
                description: "This is a test question",
                subject: "MATHEMATICS",
                priority: "MEDIUM",
                attachments: [],
                preferredTutorId: null,
            }

            const response = await api.post("/api/doubts", testDoubt)
            console.log("Doubt submission response:", response.data)

            setDebugInfo({
                ...debugInfo,
                doubtSubmission: "Success",
                doubtResponse: response.data,
            })
        } catch (error: any) {
            console.error("Doubt submission error:", error)
            setDebugInfo({
                ...debugInfo,
                doubtSubmission: "Failed",
                doubtError: error.response?.data || error.message,
                doubtStatus: error.response?.status,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Authentication Debug</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex space-x-4">
                    <Button onClick={testAuth} disabled={loading}>
                        Test Auth
                    </Button>
                    <Button onClick={testDoubtSubmission} disabled={loading}>
                        Test Doubt Submission
                    </Button>
                </div>

                {debugInfo && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <pre className="text-sm overflow-auto">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
