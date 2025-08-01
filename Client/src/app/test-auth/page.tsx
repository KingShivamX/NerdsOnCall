"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
    const { user, logout } = useAuth()
    const [testResult, setTestResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const testAuthEndpoint = async () => {
        setLoading(true)
        try {
            const response = await api.get("/test/auth")
            setTestResult({ success: true, data: response.data })
        } catch (error: any) {
            setTestResult({
                success: false,
                error: error.response?.data || error.message
            })
        } finally {
            setLoading(false)
        }
    }

    const testPublicEndpoint = async () => {
        setLoading(true)
        try {
            const response = await api.get("/test/public")
            setTestResult({ success: true, data: response.data })
        } catch (error: any) {
            setTestResult({
                success: false,
                error: error.response?.data || error.message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Authentication Test</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Current User:</h3>
                            {user ? (
                                <div className="bg-green-50 p-3 rounded">
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                    <p><strong>Active:</strong> {user.isActive ? "Yes" : "No"}</p>
                                </div>
                            ) : (
                                <div className="bg-red-50 p-3 rounded">
                                    <p>No user logged in</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={testAuthEndpoint}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Test Protected Endpoint
                            </Button>
                            <Button
                                onClick={testPublicEndpoint}
                                disabled={loading}
                                variant="outline"
                            >
                                Test Public Endpoint
                            </Button>
                            {user && (
                                <Button
                                    onClick={logout}
                                    variant="destructive"
                                >
                                    Logout
                                </Button>
                            )}
                        </div>

                        {testResult && (
                            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                                <h4 className="font-semibold mb-2">Test Result:</h4>
                                <pre className="text-sm overflow-auto">
                                    {JSON.stringify(testResult, null, 2)}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}