"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Mail,
    Crown,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
} from "lucide-react"
import toast from "react-hot-toast"
import { getUserFriendlyErrorMessage } from "@/utils/errorMessages"

interface FormData {
    email: string
}

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        email: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)

    const validateField = (name: string, value: string) => {
        switch (name) {
            case "email":
                if (!value) return "Email is required"
                if (!/\S+@\S+\.\S+/.test(value))
                    return "Please enter a valid email"
                return ""
            default:
                return ""
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const error = validateField(name, value)
        setErrors((prev) => ({ ...prev, [name]: error }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Validate all fields
        const newErrors: Record<string, string> = {}
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value)
            if (error) newErrors[key] = error
        })

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            try {
                await api.post("/auth/forgot-password", formData)
                setIsEmailSent(true)
                toast.success("Password reset link sent to your email!")
            } catch (error: any) {
                const errorMessage = getUserFriendlyErrorMessage(error, "auth")
                setErrors({ general: errorMessage })
                toast.error(errorMessage)
            } finally {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
        }
    }

    const isFieldValid = (fieldName: string) => {
        const value = formData[fieldName as keyof FormData]
        return value && !errors[fieldName]
    }

    if (isEmailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8 px-2 sm:px-0">
                        <div className="flex justify-center mb-4 lg:mb-6">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                                <Crown className="h-8 w-8 lg:h-10 lg:w-10 text-amber-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 leading-tight">
                            Check Your Email
                        </h1>
                        <p className="text-slate-600 text-base lg:text-lg">
                            We&apos;ve sent you a password reset link
                        </p>
                    </div>

                    {/* Success Card */}
                    <Card className="border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm mx-2 sm:mx-0">
                        <CardContent className="space-y-6 px-6 lg:px-8 py-8">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className=" text-lg font-semibold text-slate-800 mb-2">
                                        Reset Link Sent
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        We&apos;ve sent a password reset link to{" "}
                                        <span className="font-medium text-slate-800">
                                            {formData.email}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-xs text-slate-500 space-y-1">
                                    <p>• The link will expire in 1 hour</p>
                                    <p>
                                        • Check your spam folder if you
                                        don&apos;t see it
                                    </p>
                                    <p>
                                        • Make sure to use the same email you
                                        registered with
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => setIsEmailSent(false)}
                                    className="w-full h-12 lg:h-14 bg-slate-800 hover:bg-slate-700 text-white font-semibold"
                                >
                                    Send Another Email
                                </Button>
                                <Link href="/auth/login">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 lg:h-14 border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-orange-200 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Image Section */}
                    <div className="hidden lg:flex justify-center items-center order-2 lg:order-1">
                        <div className="relative">
                            <img
                                src="/reset-password.png"
                                alt="Reset Password Illustration"
                                className="w-full max-w-lg h-auto"
                            />
                        </div>
                    </div>

                    {/* Reset Password Form Section */}
                    <div className="w-full max-w-md mx-auto order-1 lg:order-2">
                        {/* Header */}
                        <div className="text-center mb-8 px-2 sm:px-0">
                            <div className="flex justify-center mb-4 lg:mb-6">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-black border-4 border-black shadow-[6px_6px_0px_0px_black] flex items-center justify-center">
                                    <Crown className="h-8 w-8 lg:h-10 lg:w-10 text-yellow-400" />
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 leading-tight uppercase tracking-wide">
                                Reset Password
                            </h1>
                            <p className="text-black text-base lg:text-lg font-bold">
                                Enter your email to reset your password
                            </p>
                        </div>

                        {/* Forgot Password Form */}
                        <Card className="bg-yellow-300 mx-2 sm:mx-0">
                            <CardHeader className="bg-black text-white p-6">
                                <CardTitle className=" text-white text-2xl lg:text-3xl text-center font-black uppercase tracking-wide">
                                    Reset Password
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 px-6 lg:px-8">
                                {/* General Error */}
                                {errors.general && (
                                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2">
                                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                        <span className="text-sm text-red-700">
                                            {errors.general}
                                        </span>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="email"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Email Address
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`h-12 lg:h-14 ${
                                                errors.email
                                                    ? "border-red-400"
                                                    : isFieldValid("email")
                                                    ? "border-emerald-400"
                                                    : ""
                                            }`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 lg:h-14 bg-slate-800 hover:bg-slate-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                Send Reset Link
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </div>
                                        )}
                                    </Button>
                                </form>

                                {/* Back to Login */}
                                <div className="text-center">
                                    <Link
                                        href="/auth/login"
                                        className="text-sm text-slate-600 hover:text-slate-800 hover:underline flex items-center justify-center gap-1"
                                    >
                                        <ArrowLeft className="h-3 w-3" />
                                        Back to Login
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
