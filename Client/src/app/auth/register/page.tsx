"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Crown,
    GraduationCap,
    BookOpen,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { register } from "@/lib/api"

interface FormData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    role: "STUDENT" | "TUTOR" | ""
    agreeToTerms: boolean
}

export default function RegisterPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const preSelectedRole = searchParams.get("role") as
        | "student"
        | "tutor"
        | null

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: preSelectedRole
            ? (preSelectedRole.toUpperCase() as "STUDENT" | "TUTOR")
            : "",
        agreeToTerms: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [apiError, setApiError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const validateField = (name: string, value: string | boolean) => {
        switch (name) {
            case "firstName":
                if (!value) return "First name is required"
                if (typeof value === "string" && value.length < 2)
                    return "First name must be at least 2 characters"
                return ""
            case "lastName":
                if (!value) return "Last name is required"
                if (typeof value === "string" && value.length < 2)
                    return "Last name must be at least 2 characters"
                return ""
            case "email":
                if (!value) return "Email is required"
                if (typeof value === "string" && !/\S+@\S+\.\S+/.test(value))
                    return "Please enter a valid email"
                return ""
            case "password":
                if (!value) return "Password is required"
                if (typeof value === "string" && value.length < 8)
                    return "Password must be at least 8 characters"
                if (
                    typeof value === "string" &&
                    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
                )
                    return "Password must contain uppercase, lowercase, and number"
                return ""
            case "confirmPassword":
                if (!value) return "Please confirm your password"
                if (value !== formData.password) return "Passwords do not match"
                return ""
            case "role":
                if (!value) return "Please select your role"
                return ""
            case "agreeToTerms":
                if (!value) return "You must agree to the terms and conditions"
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
        if (apiError) setApiError(null)

        // Also validate confirm password when password changes
        if (name === "password" && formData.confirmPassword) {
            const confirmError = validateField(
                "confirmPassword",
                formData.confirmPassword
            )
            if (confirmError) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: confirmError,
                }))
            } else {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }))
            }
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const error = validateField(name, value)
        setErrors((prev) => ({ ...prev, [name]: error }))
    }

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            role: value.toUpperCase() as "STUDENT" | "TUTOR",
        }))
        if (errors.role) {
            setErrors((prev) => ({ ...prev, role: "" }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setApiError(null)

        // Validate all fields
        const newErrors: Record<string, string> = {}
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value)
            if (error) newErrors[key] = error
        })

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            try {
                const { confirmPassword, agreeToTerms, ...registerData } =
                    formData
                await register(registerData)
                toast.success("Registration successful! Please login.")
                router.push("/auth/login")
            } catch (error: any) {
                const message =
                    error.response?.data?.message ||
                    "An unexpected error occurred."
                setApiError(message)
                toast.error(message)
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

    const getPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const passwordStrength = getPasswordStrength(formData.password)

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
                        Join NerdsOnCall
                    </h1>
                    <p className="text-slate-600 text-base lg:text-lg">
                        Begin your premium learning experience
                    </p>
                </div>

                {/* Registration Form */}
                <Card className="border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm mx-2 sm:mx-0">
                    <CardHeader className="space-y-1 pb-6 px-6 lg:px-8">
                        <CardTitle className="text-xl lg:text-2xl text-center text-slate-800 font-bold">
                            Create Account
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6 lg:px-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {apiError && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{apiError}</span>
                                </div>
                            )}
                            {/* Role Selection with proper mobile spacing */}
                            <div className="space-y-3 relative">
                                <label className="text-sm font-semibold text-slate-700">
                                    I want to join as
                                </label>
                                <div className="relative z-50">
                                    <Select
                                        value={formData.role.toLowerCase()}
                                        onValueChange={handleRoleChange}
                                    >
                                        <SelectTrigger
                                            className={`h-12 lg:h-14 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white shadow-sm ${
                                                errors.role
                                                    ? "border-red-400"
                                                    : ""
                                            }`}
                                        >
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 bg-white border border-slate-200 shadow-xl">
                                            <SelectItem
                                                value="student"
                                                className="hover:bg-slate-50 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <GraduationCap className="h-4 w-4 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-800">
                                                            Student
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            Learn with expert
                                                            tutors
                                                        </div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem
                                                value="tutor"
                                                className="hover:bg-slate-50 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <BookOpen className="h-4 w-4 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-800">
                                                            Tutor
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            Teach and earn
                                                            premium
                                                        </div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errors.role && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* First Name Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="firstName"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`pl-10 pr-10 h-12 lg:h-14 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white shadow-sm ${
                                                errors.firstName
                                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                                    : isFieldValid("firstName")
                                                    ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                                                    : ""
                                            }`}
                                            placeholder="John"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            {errors.firstName && (
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            {isFieldValid("firstName") && (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            )}
                                        </div>
                                    </div>
                                    {errors.firstName && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>
                                {/* Last Name Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="lastName"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`pr-10 h-12 lg:h-14 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white shadow-sm ${
                                                errors.lastName
                                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                                    : isFieldValid("lastName")
                                                    ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                                                    : ""
                                            }`}
                                            placeholder="Doe"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            {errors.lastName && (
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            {isFieldValid("lastName") && (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            )}
                                        </div>
                                    </div>
                                    {errors.lastName && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

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
                                <label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>
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
                                        placeholder="Create a strong password"
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

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-2 flex-1 rounded-full ${
                                                        i < passwordStrength
                                                            ? passwordStrength <=
                                                              2
                                                                ? "bg-red-400"
                                                                : passwordStrength <=
                                                                  3
                                                                ? "bg-amber-400"
                                                                : "bg-emerald-400"
                                                            : "bg-slate-200"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-xs text-slate-600 font-medium">
                                            Password strength:{" "}
                                            {passwordStrength <= 2
                                                ? "Weak"
                                                : passwordStrength <= 3
                                                ? "Medium"
                                                : "Strong"}
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
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
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
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

                            {/* Terms Agreement */}
                            <div className="space-y-2">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                agreeToTerms:
                                                    checked as boolean,
                                            }))
                                            if (errors.agreeToTerms) {
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    agreeToTerms: "",
                                                }))
                                            }
                                        }}
                                        className="border-slate-300 mt-1"
                                    />
                                    <label
                                        htmlFor="agreeToTerms"
                                        className="text-sm text-slate-600 leading-5"
                                    >
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="text-slate-700 hover:text-slate-900 font-medium hover:underline"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="text-slate-700 hover:text-slate-900 font-medium hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                                {errors.agreeToTerms && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.agreeToTerms}
                                    </p>
                                )}
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
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4 text-amber-400" />
                                        Create Account
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

                        {/* Sign In Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-600">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="text-slate-700 hover:text-slate-900 font-semibold hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
