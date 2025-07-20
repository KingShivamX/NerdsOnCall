"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugAuthPage() {
    const { user, loading, logout } = useAuth()
    const [tokenInfo, setTokenInfo] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (typeof window === "undefined") return
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]))
                setTokenInfo({
                    exists: true,
                    payload,
                    expired:
                        payload.exp &&
                        payload.exp < Math.floor(Date.now() / 1000),
                    expiresAt: new Date(payload.exp * 1000).toLocaleString(),
                })
            } catch (error) {
                setTokenInfo({
                    exists: true,
                    invalid: true,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                })
            }
        } else {
            setTokenInfo({ exists: false })
        }
    }, [])

    const clearAllTokens = () => {
        if (typeof window === "undefined") return
        localStorage.removeItem("token")
        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        window.location.reload()
    }

    if (!mounted) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    Authentication Debug Page
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Auth State */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Auth State</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                <strong>Loading:</strong>{" "}
                                {loading ? "✅ Yes" : "❌ No"}
                            </p>
                            <p>
                                <strong>User:</strong>{" "}
                                {user ? "✅ Logged in" : "❌ Not logged in"}
                            </p>
                            {user && (
                                <div className="mt-2">
                                    <p>
                                        <strong>Name:</strong> {user.firstName}{" "}
                                        {user.lastName}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p>
                                        <strong>Role:</strong> {user.role}
                                    </p>
                                    <p>
                                        <strong>ID:</strong> {user.id}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Token Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Token Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tokenInfo ? (
                                <div>
                                    <p>
                                        <strong>Token Exists:</strong>{" "}
                                        {tokenInfo.exists ? "✅ Yes" : "❌ No"}
                                    </p>
                                    {tokenInfo.exists && (
                                        <>
                                            {tokenInfo.invalid ? (
                                                <p>
                                                    <strong>Status:</strong> ❌
                                                    Invalid ({tokenInfo.error})
                                                </p>
                                            ) : (
                                                <>
                                                    <p>
                                                        <strong>Status:</strong>{" "}
                                                        {tokenInfo.expired
                                                            ? "❌ Expired"
                                                            : "✅ Valid"}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            User ID:
                                                        </strong>{" "}
                                                        {
                                                            tokenInfo.payload
                                                                ?.userId
                                                        }
                                                    </p>
                                                    <p>
                                                        <strong>Role:</strong>{" "}
                                                        {
                                                            tokenInfo.payload
                                                                ?.role
                                                        }
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Expires:
                                                        </strong>{" "}
                                                        {tokenInfo.expiresAt}
                                                    </p>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <p>Loading token info...</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                onClick={clearAllTokens}
                                variant="outline"
                                className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            >
                                Clear All Tokens & Reload
                            </Button>

                            {user && (
                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Logout
                                </Button>
                            )}

                            <div className="space-y-2">
                                <a href="/auth/login" className="block">
                                    <Button className="w-full">
                                        Go to Login
                                    </Button>
                                </a>
                                <a href="/auth/register" className="block">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Go to Register
                                    </Button>
                                </a>
                                <a href="/dashboard" className="block">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Go to Dashboard
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Browser Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Browser Storage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-100 p-4 rounded text-sm font-mono">
                                <p>
                                    <strong>localStorage token:</strong>
                                </p>
                                <p className="break-all">
                                    {localStorage.getItem("token") || "None"}
                                </p>
                                <br />
                                <p>
                                    <strong>document.cookie:</strong>
                                </p>
                                <p className="break-all">
                                    {document.cookie || "None"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
