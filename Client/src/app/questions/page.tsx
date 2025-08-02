"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { QuestionList } from "@/components/questions/QuestionList"
import { useAuth } from "@/context/AuthContext"
import { PlusCircle, BookOpen, Users, TrendingUp } from "lucide-react"

export default function QuestionsPage() {
    const { user } = useAuth()
    // Determine if user is a tutor based on their role
    const isTutor = user?.role === "TUTOR"

    // Check if user is authenticated for certain actions
    const handleAskQuestion = () => {
        if (!user) {
            // You can add a toast here if needed
            window.location.href = "/auth/login"
            return
        }
        window.location.href = "/questions/ask"
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Community Questions
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                {isTutor
                                    ? "Share your expertise and help students succeed by answering their questions"
                                    : "Get instant help from our community of expert tutors and fellow students"}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <BookOpen className="h-5 w-5" />
                                        <span className="font-semibold">
                                            1,000+
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-100">
                                        Questions Answered
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Users className="h-5 w-5" />
                                        <span className="font-semibold">
                                            500+
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-100">
                                        Active Tutors
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5" />
                                        <span className="font-semibold">
                                            95%
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-100">
                                        Success Rate
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleAskQuestion}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Ask a Question
                            </button>
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="container mx-auto px-4 py-8">
                    <QuestionList isTutor={isTutor} />
                </div>
            </main>
            <Footer />
        </div>
    )
}
