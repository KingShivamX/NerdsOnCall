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
            <div className="min-h-screen bg-lime-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto mb-6 bg-yellow-400 shadow-[4px_4px_0px_0px_black]"></div>
                    <p className="text-black font-black text-xl uppercase tracking-wide">
                        Loading...
                    </p>
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
        <div className="min-h-screen bg-orange-200">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="min-h-screen flex items-center pt-20 pb-16 bg-orange-200">
                    <Hero />
                </section>

                {/* Features Section */}
                <section className="py-16 bg-cyan-200 border-t-4 border-b-4 border-black">
                    <Features />
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-pink-200 border-b-4 border-black">
                    <HowItWorks />
                </section>

                {/* Pricing Section */}
                <section className="py-16 bg-lime-200 border-b-4 border-black">
                    <Pricing />
                </section>
            </main>
            <Footer />
        </div>
    )
}
