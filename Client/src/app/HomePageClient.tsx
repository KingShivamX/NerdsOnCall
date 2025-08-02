"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Navbar } from "../components/layout/Navbar"
import { Footer } from "../components/layout/Footer"
import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features"
import { HowItWorks } from "../components/landing/HowItWorks"
import { Pricing } from "../components/landing/Pricing"

export function HomePageClient() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // If user is logged in, redirect to dashboard
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

    // If user is logged in, don't render the landing page (redirect will happen)
    if (user) {
        return null
    }

    // Show landing page for non-authenticated users
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="min-h-screen flex items-center pt-16 pb-16">
                    <Hero />
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <Features />
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-slate-50">
                    <HowItWorks />
                </section>

                {/* Pricing Section */}
                <section className="py-16 bg-white">
                    <Pricing />
                </section>
            </main>
            <Footer />
        </div>
    )
}
