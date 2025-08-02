"use client"

import { Crown, BookOpen, Users, Video } from "lucide-react"
import { BlockLoader } from "@/components/ui/Loader"

interface LoadingScreenProps {
    message?: string
    progress?: number
}

export function LoadingScreen({
    message = "Loading your premium experience...",
    progress,
}: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 bg-lime-200 flex items-center justify-center z-50 overflow-hidden">
            <div className="relative text-center max-w-md mx-auto px-6">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_black] flex items-center justify-center animate-bounce">
                            <Crown className="h-12 w-12 text-black" />
                        </div>

                        {/* Floating icons around main logo */}
                        <div
                            className="absolute -top-3 -right-3 w-10 h-10 bg-pink-400 border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center animate-bounce"
                            style={{ animationDelay: "0.5s" }}
                        >
                            <Video className="h-5 w-5 text-black" />
                        </div>
                        <div
                            className="absolute -bottom-3 -left-3 w-10 h-10 bg-cyan-400 border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center animate-bounce"
                            style={{ animationDelay: "1s" }}
                        >
                            <BookOpen className="h-5 w-5 text-black" />
                        </div>
                        <div
                            className="absolute -bottom-3 -right-3 w-10 h-10 bg-lime-400 border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center animate-bounce"
                            style={{ animationDelay: "1.5s" }}
                        >
                            <Users className="h-5 w-5 text-black" />
                        </div>
                    </div>
                </div>

                {/* Brand name */}
                <h1 className="text-4xl font-black text-black mb-4 uppercase tracking-wide bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_black]">
                    NerdsOnCall
                </h1>
                <p className="text-lg font-bold text-black mb-8 bg-orange-400 px-4 py-2 border-3 border-black shadow-[3px_3px_0px_0px_black] uppercase tracking-wide">
                    Premium Tutoring Platform
                </p>

                {/* Loading spinner */}
                <div className="relative mb-6">
                    <BlockLoader size="lg" className="mx-auto" />
                </div>

                {/* Progress bar (if progress is provided) */}
                {typeof progress === "number" && (
                    <div className="mb-6">
                        <div className="w-full bg-white border-3 border-black h-4 shadow-[3px_3px_0px_0px_black]">
                            <div
                                className="h-full bg-green-400 border-r-2 border-black transition-all duration-300 ease-out"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, progress)
                                    )}%`,
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-black font-bold mt-3 bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_black]">
                            {Math.round(progress)}% Complete
                        </p>
                    </div>
                )}

                {/* Loading message */}
                <p className="text-black text-lg font-bold animate-pulse bg-pink-400 px-4 py-2 border-3 border-black shadow-[3px_3px_0px_0px_black]">
                    {message}
                </p>

                {/* Dots animation */}
                <div className="flex justify-center space-x-2 mt-6">
                    <div className="w-4 h-4 bg-black border-2 border-white shadow-[2px_2px_0px_0px_white] animate-bounce"></div>
                    <div
                        className="w-4 h-4 bg-black border-2 border-white shadow-[2px_2px_0px_0px_white] animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-4 h-4 bg-black border-2 border-white shadow-[2px_2px_0px_0px_white] animate-bounce"
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
            <BlockLoader size={size} />
        </div>
    )
}
