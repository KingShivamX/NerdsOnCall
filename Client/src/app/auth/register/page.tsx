"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
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
import { Textarea } from "@/components/ui/textarea"
import { Subject, RegisterRequest } from "@/types"
import toast from "react-hot-toast"
import {
    ArrowRight,
    Crown,
    GraduationCap,
    BookOpen,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    User,
} from "lucide-react"

const subjectsList: Subject[] = [
    "MATHEMATICS",
    "PHYSICS",
    "CHEMISTRY",
    "BIOLOGY",
    "COMPUTER_SCIENCE",
    "ENGLISH",
    "HISTORY",
    "GEOGRAPHY",
    "ECONOMICS",
    "ACCOUNTING",
    "STATISTICS",
    "CALCULUS",
    "ALGEBRA",
    "GEOMETRY",
    "TRIGONOMETRY",
]

export default function RegisterPage() {
    const router = useRouter()
    const { register } = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "" as "STUDENT" | "TUTOR" | "",
        agreeToTerms: false,
        bio: "",
        subjects: [] as Subject[],
        hourlyRate: "",
        phoneNumber: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const validateField = (name: string, value: string) => {
        switch (name) {
            case "firstName":
                if (!value) return "First name is required"
                return ""
            case "lastName":
                if (!value) return "Last name is required"
                return ""
            case "email":
                if (!value) return "Email is required"
                if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format"
                return ""
            case "password":
                if (!value) return "Password is required"
                if (value.length < 8)
                    return "Password must be at least 8 characters"
                return ""
            case "confirmPassword":
                if (!value) return "Please confirm your password"
                if (value !== formData.password) return "Passwords do not match"
                return ""
            case "role":
                if (!value) return "Role is required"
                return ""
            case "agreeToTerms":
                if (!formData.agreeToTerms) return "You must agree to the terms"
                return ""
            case "bio":
                if (formData.role === "TUTOR" && !value)
                    return "Bio is required for tutors"
                return ""
            case "subjects":
                if (formData.role === "TUTOR" && formData.subjects.length === 0)
                    return "At least one subject is required"
                return ""
            case "hourlyRate":
                if (formData.role === "TUTOR" && !value)
                    return "Hourly rate is required"
                return ""
            default:
                return ""
        }
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        const fieldsToValidate = [
            "firstName",
            "lastName",
            "email",
            "password",
            "confirmPassword",
            "role",
            "agreeToTerms",
        ]
        if (formData.role === "TUTOR") {
            fieldsToValidate.push("bio", "subjects", "hourlyRate")
        }

        fieldsToValidate.forEach((field) => {
            const error = validateField(
                field,
                formData[field as keyof typeof formData] as string
            )
            if (error) {
                newErrors[field] = error
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)

        const { confirmPassword, agreeToTerms, ...data } = formData
        const registrationData: RegisterRequest = {
            ...data,
            role: data.role as "STUDENT" | "TUTOR",
            hourlyRate:
                data.role === "TUTOR" && data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
        }

        console.log("Registration data being sent:", registrationData)

        try {
            await register(registrationData)
            toast.success("Registration successful! Welcome to NerdsOnCall!")
            
            // Role-based redirection after successful registration
            if (registrationData.role === "STUDENT") {
                router.push("/dashboard")
            } else if (registrationData.role === "TUTOR") {
                router.push("/dashboard")
            } else {
                router.push("/dashboard")
            }
        } catch (err: any) {
            console.error("Registration error:", err)
            const errorMessage = err?.response?.data || err?.message || "Registration failed."
            console.error("Error message:", errorMessage)
            toast.error(errorMessage)
            setErrors({ general: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        const checked =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : undefined
        setFormData((prev) => ({ ...prev, [name]: checked ?? value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        const error = validateField(name, value)
        setErrors((prev) => ({ ...prev, [name]: error }))
    }

    const handleSubjectChange = (subject: Subject) => {
        const newSubjects = formData.subjects.includes(subject)
            ? formData.subjects.filter((s) => s !== subject)
            : [...formData.subjects, subject]
        setFormData((prev) => ({ ...prev, subjects: newSubjects }))
    }

    const isFieldValid = (fieldName: keyof typeof formData) => {
        const value = formData[fieldName]
        if (Array.isArray(value)) {
            return value.length > 0 && !errors[fieldName]
        }
        return value && !errors[fieldName]
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 px-2 sm:px-0">
                    <div className="flex justify-center mb-4 lg:mb-6">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                            <Crown className="h-8 w-8 lg:h-10 lg:w-10 text-amber-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 leading-tight">
                        Create Your Account
                    </h1>
                    <p className="text-slate-600 text-base lg:text-lg">
                        Join the elite learning experience
                    </p>
                </div>
                <Card className="border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm mx-2 sm:mx-0">
                    <CardHeader>
                        <CardTitle className="text-xl lg:text-2xl text-center text-slate-800 font-bold">
                            Sign Up
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 lg:px-8 pb-8">
                        {/* General Error Display */}
                        {errors.general && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 mb-4">
                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span className="text-sm text-red-700">
                                    {errors.general}
                                </span>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="role"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    I am a...
                                </label>
                                <Select
                                    onValueChange={(value) =>
                                        setFormData((p) => ({
                                            ...p,
                                            role: value as any,
                                        }))
                                    }
                                    value={formData.role}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent className="z-50 bg-white">
                                        <SelectItem value="STUDENT">
                                            Student
                                        </SelectItem>
                                        <SelectItem value="TUTOR">
                                            Tutor
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.role}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.firstName}
                                            className={`pl-10 pr-10 h-12 lg:h-14 ${
                                                errors.firstName
                                                    ? "border-red-400"
                                                    : isFieldValid("firstName")
                                                    ? "border-emerald-400"
                                                    : "border-slate-300"
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
                                <div className="space-y-2">
                                    <label
                                        htmlFor="lastName"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.lastName}
                                            className={`pl-10 pr-10 h-12 lg:h-14 ${
                                                errors.lastName
                                                    ? "border-red-400"
                                                    : isFieldValid("lastName")
                                                    ? "border-emerald-400"
                                                    : "border-slate-300"
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={formData.email}
                                        className={`pl-10 pr-10 h-12 lg:h-14 ${
                                            errors.email
                                                ? "border-red-400"
                                                : isFieldValid("email")
                                                ? "border-emerald-400"
                                                : "border-slate-300"
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={formData.password}
                                        className={`pl-10 pr-10 h-12 lg:h-14 ${
                                            errors.password
                                                ? "border-red-400"
                                                : isFieldValid("password")
                                                ? "border-emerald-400"
                                                : "border-slate-300"
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
                                {errors.password && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={formData.confirmPassword}
                                        className={`pl-10 pr-10 h-12 lg:h-14 ${
                                            errors.confirmPassword
                                                ? "border-red-400"
                                                : isFieldValid(
                                                      "confirmPassword"
                                                  )
                                                ? "border-emerald-400"
                                                : "border-slate-300"
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

                            {formData.role === "TUTOR" && (
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="text-lg font-semibold text-center">
                                        Tutor Details
                                    </h3>
                                    <Textarea
                                        name="bio"
                                        placeholder="Your professional bio"
                                        onChange={handleChange}
                                        value={formData.bio}
                                    />
                                    {errors.bio && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.bio}
                                        </p>
                                    )}
                                    <div>
                                        <label className="font-semibold">
                                            Subjects
                                        </label>
                                        <div className="grid grid-cols-2 p-2 border rounded-md max-h-48 overflow-auto">
                                            {subjectsList.map((s) => (
                                                <div
                                                    key={s}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        id={s}
                                                        checked={formData.subjects.includes(
                                                            s
                                                        )}
                                                        onCheckedChange={() =>
                                                            handleSubjectChange(
                                                                s
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={s}
                                                        className="text-sm"
                                                    >
                                                        {s.replace(/_/g, " ")}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.subjects && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.subjects}
                                            </p>
                                        )}
                                    </div>
                                    <Input
                                        name="hourlyRate"
                                        placeholder="Hourly Rate ($)"
                                        onChange={handleChange}
                                        value={formData.hourlyRate}
                                    />
                                    {errors.hourlyRate && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.hourlyRate}
                                        </p>
                                    )}
                                    <Input
                                        name="phoneNumber"
                                        placeholder="Phone Number (Optional)"
                                        onChange={handleChange}
                                        value={formData.phoneNumber}
                                    />
                                </div>
                            )}

                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    onCheckedChange={(checked) =>
                                        setFormData((p) => ({
                                            ...p,
                                            agreeToTerms: !!checked,
                                        }))
                                    }
                                />
                                <label
                                    htmlFor="agreeToTerms"
                                    className="text-sm"
                                >
                                    I agree to the{" "}
                                    <Link href="/terms" className="underline">
                                        terms and conditions
                                    </Link>
                                    .
                                </label>
                            </div>
                            {errors.agreeToTerms && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.agreeToTerms}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white h-12"
                            >
                                {isLoading ? (
                                    "Creating Account..."
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Crown className="h-4 w-4 text-amber-400" />
                                        Create Account
                                    </div>
                                )}
                            </Button>

                            <p className="text-center text-sm pt-4">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="underline">
                                    Log in
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
