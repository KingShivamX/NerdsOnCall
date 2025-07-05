"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Crown,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
} from "lucide-react"
import { toast } from "sonner"

interface FormData {
    email: string
    password: string
    rememberMe: boolean
}

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    const validateField = (name: string, value: string | boolean) => {
        switch (name) {
            case "email":
                if (!value) return "Email is required"
                if (typeof value === "string" && !/\S+@\S+\.\S+/.test(value))
                    return "Please enter a valid email"
                return ""
            case "password":
                if (!value) return "Password is required"
                return ""
            default:
                return ""
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        const fieldValue = type === "checkbox" ? checked : value

        setFormData((prev) => ({ ...prev, [name]: fieldValue }))

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
            if (key !== "rememberMe") {
                const error = validateField(key, value)
                if (error) newErrors[key] = error
            }
        })

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            try {
                await login(formData.email, formData.password)
                toast.success("Login successful!")
                router.push("/dashboard")
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Login failed. Please check your credentials."
                setErrors({ general: errorMessage })
                toast.error(errorMessage)
            } finally {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = async (provider: string) => {
        toast.info(`${provider} login will be available soon!`)
    }

    const isFieldValid = (fieldName: string) => {
        const value = formData[fieldName as keyof FormData]
        return value && !errors[fieldName]
    }

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
                        Welcome Back
                    </h1>
                    <p className="text-slate-600 text-base lg:text-lg">
                        Sign in to your premium account
                    </p>
                </div>

                {/* Login Form */}
                <Card className="border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm mx-2 sm:mx-0">
                    <CardHeader className="space-y-1 pb-6 px-6 lg:px-8">
                        <CardTitle className="text-xl lg:text-2xl text-center text-slate-800 font-bold">
                            Sign In
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
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`pl-10 pr-10 h-12 lg:h-14 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white shadow-sm ${
                                            errors.email
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                                : isFieldValid("email")
                                                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                                                : ""
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        {errors.email && (
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        {isFieldValid("email") && (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        )}
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Password
                                    </label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-slate-600 hover:text-slate-800 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`pl-10 pr-10 h-12 lg:h-14 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white shadow-sm ${
                                            errors.password
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                                : isFieldValid("password")
                                                ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                                                : ""
                                        }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="ml-2 block text-sm text-slate-600"
                                >
                                    Remember me for 30 days
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white py-3 h-12 lg:h-14 font-semibold shadow-lg transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4 text-amber-400" />
                                        Sign In
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* Social Login */}
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full bg-slate-300" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-500 font-medium">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="border-slate-300 hover:bg-slate-50 h-11 lg:h-12 font-medium"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-slate-300 hover:bg-slate-50 h-11 lg:h-12 font-medium"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </Button>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-600">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/register"
                                    className="text-slate-700 hover:text-slate-900 font-semibold hover:underline"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
