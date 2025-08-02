"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface AuthPageGuardProps {
    children: React.ReactNode
}

export function AuthPageGuard({ children }: AuthPageGuardProps) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (!loading && user) {
            router.push("/dashboard")
        }
    }, [user, loading, router])

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        )
    }

    // If user is logged in, don't render auth pages (redirect will happen)
    if (user) {
        return null
    }

    // Show auth pages for non-authenticated users
    return <>{children}</>
}
