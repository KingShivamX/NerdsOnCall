"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Crown,
    Mail,
    Lock,
    User,
    Users,
    Sparkles,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle,
    Star,
    BookOpen,
    GraduationCap,
} from "lucide-react"
import toast from "react-hot-toast"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "" as "STUDENT" | "TUTOR" | "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleRoleChange = (value: string) => {
        setFormData({
            ...formData,
            role: value as "STUDENT" | "TUTOR",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.role) {
            toast.error("Please select your role")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        setIsLoading(true)

        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            })
            toast.success("Welcome to your royal learning journey!")
            router.push("/dashboard")
        } catch (error) {
            toast.error("Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const passwordRequirements = [
        { text: "At least 6 characters", met: formData.password.length >= 6 },
        { text: "Contains letters", met: /[a-zA-Z]/.test(formData.password) },
        {
            text: "Passwords match",
            met:
                formData.password === formData.confirmPassword &&
                formData.confirmPassword !== "",
        },
    ]

    return (
        <div className="min-h-screen hero-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-gold-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float"></div>
                <div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-gold-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            <div className="relative max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full royal-gradient flex items-center justify-center glow">
                                <Crown className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4">
                                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Join the Elite
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Start your royal learning journey today
                    </p>

                    <div className="flex justify-center mb-8">
                        <Badge
                            variant="secondary"
                            className="premium-glass border-0 text-purple-700 px-4 py-2"
                        >
                            <Crown className="w-4 h-4 mr-2" />
                            Premium Platform
                        </Badge>
                    </div>
                </div>

                {/* Registration Form */}
                <Card className="luxury-card border-0 overflow-hidden">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Fill in your details to get started
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Selection */}
                            <div>
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    I want to join as
                                </label>
                                <Select onValueChange={handleRoleChange}>
                                    <SelectTrigger className="premium-input">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent className="luxury-card border-0">
                                        <SelectItem
                                            value="STUDENT"
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center">
                                                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                                <span className="font-medium">
                                                    Student
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    - Learn from experts
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem
                                            value="TUTOR"
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center">
                                                <GraduationCap className="h-4 w-4 mr-2 text-purple-600" />
                                                <span className="font-medium">
                                                    Tutor
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    - Teach and earn
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            className="premium-input pl-10"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            className="premium-input pl-10"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="premium-input pl-10"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        className="premium-input pl-10 pr-10"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        className="premium-input pl-10 pr-10"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
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
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        Password requirements:
                                    </p>
                                    <div className="space-y-1">
                                        {passwordRequirements.map(
                                            (req, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <CheckCircle
                                                        className={`h-4 w-4 ${
                                                            req.met
                                                                ? "text-green-500"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                    <span
                                                        className={`text-xs ${
                                                            req.met
                                                                ? "text-green-600"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {req.text}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading || !formData.role}
                                className="w-full premium-button text-white border-0 font-semibold"
                                size="lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="royal-spinner w-5 h-5 mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Crown className="w-5 h-5 mr-2" />
                                        Start Royal Journey
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="premium-glass border-2 border-gray-200"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
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
                                className="premium-glass border-2 border-gray-200"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sign In Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                        >
                            Sign in to your royal account
                        </Link>
                    </p>
                </div>

                {/* Features for different roles */}
                {formData.role && (
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {formData.role === "STUDENT" ? (
                            <>
                                <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">
                                        Learn from Experts
                                    </p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">
                                        4K Video Calls
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                                        <Crown className="w-4 h-4 text-green-600" />
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">
                                        Earn Premium
                                    </p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">
                                        Elite Status
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Floating elements */}
            <div className="absolute top-1/4 left-8 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
            <div
                className="absolute top-1/3 right-12 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "1s" }}
            ></div>
            <div
                className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-yellow-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "3s" }}
            ></div>
        </div>
    )
}
