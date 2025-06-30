"use client"

import { Crown, BookOpen, Users, Video } from "lucide-react"

interface LoadingScreenProps {
    message?: string
    progress?: number
}

export function LoadingScreen({
    message = "Loading your premium experience...",
    progress,
}: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center z-50 overflow-hidden">
            {/* Background blur orbs for consistent design */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-slate-300/20 to-slate-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div
                    className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-br from-amber-400/15 to-amber-600/15 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-slate-400/10 to-slate-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                    style={{ animationDelay: "4s" }}
                ></div>
            </div>

            <div className="relative text-center max-w-md mx-auto px-6">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                            <Crown className="h-10 w-10 text-amber-400" />
                        </div>

                        {/* Floating icons around main logo */}
                        <div
                            className="absolute -top-2 -right-2 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center animate-bounce"
                            style={{ animationDelay: "0.5s" }}
                        >
                            <Video className="h-4 w-4 text-white" />
                        </div>
                        <div
                            className="absolute -bottom-2 -left-2 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center animate-bounce"
                            style={{ animationDelay: "1s" }}
                        >
                            <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <div
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center animate-bounce"
                            style={{ animationDelay: "1.5s" }}
                        >
                            <Users className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* Brand name */}
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    NerdsOnCall
                </h1>
                <p className="text-sm text-slate-600 mb-8">
                    Premium Tutoring Platform
                </p>

                {/* Loading spinner */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto">
                        {/* Outer ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>

                        {/* Animated ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-slate-700 border-r-slate-700 animate-spin"></div>

                        {/* Inner glow */}
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 animate-pulse"></div>
                    </div>
                </div>

                {/* Progress bar (if progress is provided) */}
                {typeof progress === "number" && (
                    <div className="mb-6">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, progress)
                                    )}%`,
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            {Math.round(progress)}% Complete
                        </p>
                    </div>
                )}

                {/* Loading message */}
                <p className="text-slate-600 text-sm font-medium animate-pulse">
                    {message}
                </p>

                {/* Dots animation */}
                <div className="flex justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

// Simple loading spinner component for smaller use cases
export function LoadingSpinner({
    size = "md",
    className = "",
}: {
    size?: "sm" | "md" | "lg"
    className?: string
}) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    }

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-700 border-r-slate-700 animate-spin"></div>
        </div>
    )
}
