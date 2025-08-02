"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-orange-200 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Image Section */}
                    <div className="flex justify-center items-center order-2 lg:order-1">
                        <div className="relative">
                            <img
                                src="/404-error.png"
                                alt="Error Illustration"
                                className="w-full max-w-lg h-auto"
                            />
                        </div>
                    </div>

                    {/* Error Content Section */}
                    <div className="w-full max-w-md mx-auto order-1 lg:order-2">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-red-500 border-4 border-black shadow-[6px_6px_0px_0px_black] flex items-center justify-center">
                                    <AlertTriangle className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4 leading-none uppercase tracking-wider">
                                Oops!
                            </h1>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-4 leading-tight uppercase tracking-wide">
                                Something Went Wrong
                            </h2>
                        </div>

                        {/* Action Card */}
                        <Card className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_black]">
                            <CardHeader className="bg-black text-white p-6">
                                <CardTitle className="text-white text-xl font-black uppercase tracking-wide text-center">
                                    Let&apos;s Fix This
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {/* Try Again Button */}
                                <Button
                                    onClick={reset}
                                    className="w-full h-14 bg-green-500 border-4 border-black text-white font-black text-lg shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all uppercase tracking-wide"
                                >
                                    <RefreshCw className="h-6 w-6 mr-3" />
                                    Try Again
                                </Button>

                                {/* Go Home Button */}
                                <Link href="/" className="block">
                                    <Button className="w-full h-14 bg-blue-500 border-4 border-black text-white font-black text-lg shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all uppercase tracking-wide">
                                        <Home className="h-6 w-6 mr-3" />
                                        Go Home
                                    </Button>
                                </Link>

                                {/* Error Details (Development Only) */}
                                {process.env.NODE_ENV === "development" && (
                                    <details className="mt-6 p-4 bg-gray-100 border-2 border-black rounded">
                                        <summary className="font-bold text-black cursor-pointer">
                                            Error Details (Dev Mode)
                                        </summary>
                                        <pre className="mt-2 text-xs text-gray-700 overflow-auto">
                                            {error.message}
                                            {error.stack && (
                                                <>
                                                    {"\n\nStack Trace:\n"}
                                                    {error.stack}
                                                </>
                                            )}
                                        </pre>
                                    </details>
                                )}

                                {/* Help Text */}
                                <div className="text-center pt-4">
                                    <p className="text-black font-bold text-sm">
                                        If this problem persists, please{" "}
                                        <Link
                                            href="/contact"
                                            className="underline hover:no-underline font-black"
                                        >
                                            contact support
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
