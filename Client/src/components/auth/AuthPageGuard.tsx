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
            <div className="min-h-screen bg-cyan-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto mb-6 bg-yellow-400 shadow-[4px_4px_0px_0px_black]"></div>
                    <p className="text-black text-xl font-black uppercase tracking-wide bg-white px-4 py-2 border-3 border-black shadow-[3px_3px_0px_0px_black]">
                        Loading...
                    </p>
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
