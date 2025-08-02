"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { AuthPageGuard } from "@/components/auth/AuthPageGuard"
import { BlockLoader } from "@/components/ui/Loader"
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
import toast from "react-hot-toast"
import { getUserFriendlyErrorMessage } from "@/utils/errorMessages"

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
                toast.success("Welcome back to your elite learning experience!")

                // Get user data after login to determine redirect
                const token = localStorage.getItem("token")
                if (token) {
                    const userResponse = await api.get("/auth/me")
                    const userData = userResponse.data

                    // Role-based redirection
                    if (userData.role === "STUDENT") {
                        router.push("/dashboard")
                    } else if (userData.role === "TUTOR") {
                        router.push("/dashboard")
                    } else {
                        router.push("/dashboard")
                    }
                } else {
                    router.push("/dashboard")
                }
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

    const handleSocialLogin = async (provider: string) => {
        toast(`${provider} login will be available soon!`)
    }

    const isFieldValid = (fieldName: string) => {
        const value = formData[fieldName as keyof FormData]
        return value && !errors[fieldName]
    }

    return (
        <AuthPageGuard>
            <div className="min-h-screen bg-orange-200 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Image Section */}
                        <div className="hidden lg:flex justify-center items-center order-2 lg:order-1">
                            <div className="relative">
                                <img
                                    src="/login.png"
                                    alt="Login Illustration"
                                    className="w-full max-w-lg h-auto"
                                />
                            </div>
                        </div>

                        {/* Login Form Section */}
                        <div className="w-full max-w-md mx-auto order-1 lg:order-2">
                            {/* Header */}
                            <div className="text-center mb-8 px-2 sm:px-0">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-black border-4 border-black shadow-[6px_6px_0px_0px_black] flex items-center justify-center">
                                        <Crown className="h-10 w-10 lg:h-12 lg:w-12 text-yellow-400" />
                                    </div>
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight uppercase tracking-wide">
                                    Welcome Back
                                </h1>
                                <p className="text-black text-lg lg:text-xl font-bold">
                                    Sign in to your account
                                </p>
                            </div>

                            {/* Login Form */}
                            <Card className="bg-yellow-300 mx-2 sm:mx-0">
                                <CardHeader>
                                    <CardTitle className="text-2xl lg:text-3xl text-center text-black font-black uppercase tracking-wide">
                                        Sign In
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* General Error */}
                                    {errors.general && (
                                        <div className="p-4 bg-red-400 border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center space-x-2">
                                            <AlertCircle className="h-5 w-5 text-black flex-shrink-0" />
                                            <span className="text-sm font-bold text-black">
                                                {errors.general}
                                            </span>
                                        </div>
                                    )}

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Email Field */}
                                        <div className="space-y-3">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-black text-black uppercase tracking-wide"
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
                                                className={`h-14 ${
                                                    errors.email
                                                        ? "border-red-500"
                                                        : isFieldValid("email")
                                                        ? "border-green-500"
                                                        : ""
                                                }`}
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-black font-bold flex items-center gap-2 bg-red-300 p-3 border-2 border-black shadow-[2px_2px_0px_0px_black]">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor="password"
                                                    className="text-sm font-black text-black uppercase tracking-wide"
                                                >
                                                    Password
                                                </label>
                                                <Link
                                                    href="/auth/forgot-password"
                                                    className="text-sm text-black font-bold underline hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform duration-100"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`pr-12 h-14 ${
                                                        errors.password
                                                            ? "border-red-500"
                                                            : isFieldValid(
                                                                  "password"
                                                              )
                                                            ? "border-green-500"
                                                            : ""
                                                    }`}
                                                    placeholder="Enter your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-black hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform duration-100"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-sm text-black font-bold flex items-center gap-2 bg-red-300 p-3 border-2 border-black shadow-[2px_2px_0px_0px_black]">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            variant="default"
                                            size="lg"
                                            className="w-full h-16"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <BlockLoader size="sm" />
                                                    Signing In...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Crown className="h-5 w-5 text-yellow-400" />
                                                    Sign In
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            )}
                                        </Button>
                                    </form>

                                    {/* Sign Up Link */}
                                    <div className="mt-8 text-center">
                                        <p className="text-base text-black font-bold">
                                            Don&apos;t have an account?{" "}
                                            <Link
                                                href="/auth/register"
                                                className="text-black font-black underline hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform duration-100 bg-pink-300 px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_black]"
                                            >
                                                Create account
                                            </Link>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthPageGuard>
    )
}
