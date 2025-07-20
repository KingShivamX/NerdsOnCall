"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Lock,
    Crown,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    ArrowLeft,
    ArrowRight,
} from "lucide-react"
import toast from "react-hot-toast"

interface FormData {
    newPassword: string
    confirmPassword: string
}

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [formData, setFormData] = useState<FormData>({
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPasswordReset, setIsPasswordReset] = useState(false)

    useEffect(() => {
        if (!token) {
            setIsTokenValid(false)
            return
        }

        // Validate token on component mount
        const validateToken = async () => {
            try {
                await api.get(`/auth/validate-reset-token?token=${token}`)
                setIsTokenValid(true)
            } catch (error) {
                setIsTokenValid(false)
            }
        }

        validateToken()
    }, [token])

    const validateField = (name: string, value: string) => {
        switch (name) {
            case "newPassword":
                if (!value) return "New password is required"
                if (value.length < 6)
                    return "Password must be at least 6 characters"
                return ""
            case "confirmPassword":
                if (!value) return "Please confirm your password"
                if (value !== formData.newPassword)
                    return "Passwords do not match"
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

        // Clear confirm password error when new password changes
        if (name === "newPassword" && errors.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "" }))
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

        if (Object.keys(newErrors).length === 0 && token) {
            try {
                await api.post("/auth/reset-password", {
                    token: token,
                    newPassword: formData.newPassword,
                })
                setIsPasswordReset(true)
                toast.success("Password reset successfully!")
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to reset password. Please try again."
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

    // Loading state while validating token
    if (isTokenValid === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
                    <p className="text-slate-600">Validating reset link...</p>
                </div>
            </div>
        )
    }

    // Invalid token state
    if (isTokenValid === false) {
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
                            Invalid Reset Link
                        </h1>
                        <p className="text-slate-600 text-base lg:text-lg">
                            This password reset link is invalid or has expired
                        </p>
                    </div>

                    {/* Error Card */}
                    <Card className="border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm mx-2 sm:mx-0">
                        <CardContent className="space-y-6 px-6 lg:px-8 py-8">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <AlertCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                        Link Expired
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        This password reset link has expired or
                                        is invalid. Please request a new one.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/auth/forgot-password">
                                    <Button className="w-full h-12 lg:h-14 bg-slate-800 hover:bg-slate-700 text-white font-semibold">
                                        Request New Reset Link
                                    </Button>
                                </Link>
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

    // Success state after password reset
    if (isPasswordReset) {
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
                            Password Reset
                        </h1>
                        <p className="text-slate-600 text-base lg:text-lg">
                            Your password has been successfully reset
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
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                        Success!
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        Your password has been reset
                                        successfully. You can now log in with
                                        your new password.
                                    </p>
                                </div>
                            </div>

                            <Link href="/auth/login">
                                <Button className="w-full h-12 lg:h-14 bg-slate-800 hover:bg-slate-700 text-white font-semibold">
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Continue to Login
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Reset password form
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
                        Reset Password
                    </h1>
                    <p className="text-slate-600 text-base lg:text-lg">
                        Enter your new password below
                    </p>
                </div>

                {/* Reset Password Form */}
                <Card className="border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm mx-2 sm:mx-0">
                    <CardHeader className="space-y-1 pb-6 px-6 lg:px-8">
                        <CardTitle className="text-xl lg:text-2xl text-center text-slate-800 font-bold">
                            New Password
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="newPassword"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`pl-10 pr-10 h-12 lg:h-14 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white shadow-sm ${
                                            errors.newPassword
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                                : isFieldValid("newPassword")
                                                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                                                : ""
                                        }`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-slate-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`pl-10 pr-10 h-12 lg:h-14 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white shadow-sm ${
                                            errors.confirmPassword
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                                : isFieldValid(
                                                      "confirmPassword"
                                                  )
                                                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                                                : ""
                                        }`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-slate-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.confirmPassword}
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
                                        Resetting...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        Reset Password
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
    )
}
