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
import { AuthPageGuard } from "@/components/auth/AuthPageGuard"
import { Subject, RegisterRequest } from "@/types"
import toast from "react-hot-toast"
import { getUserFriendlyErrorMessage } from "@/utils/errorMessages"
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
            fieldsToValidate.push("bio", "subjects")
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
            const errorMessage = getUserFriendlyErrorMessage(err, "auth")
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
        <AuthPageGuard>
            <div className="min-h-screen bg-orange-200 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Image Section */}
                        <div className="hidden lg:flex justify-center items-center order-1">
                            <div className="relative">
                                <img
                                    src="/register.png"
                                    alt="Register Illustration"
                                    className="w-full max-w-lg h-auto"
                                />
                            </div>
                        </div>

                        {/* Register Form Section */}
                        <div className="w-full max-w-2xl mx-auto order-2">
                            <div className="text-center mb-8 px-2 sm:px-0">
                                <div className="flex justify-center mb-4 lg:mb-6">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-black border-4 border-black shadow-[6px_6px_0px_0px_black] flex items-center justify-center">
                                        <Crown className="h-8 w-8 lg:h-10 lg:w-10 text-yellow-400" />
                                    </div>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-2 leading-tight uppercase tracking-wide">
                                    Create Account
                                </h1>
                                <p className="text-black text-base lg:text-lg font-bold">
                                    Join the elite learning experience
                                </p>
                            </div>
                            <Card className="bg-yellow-300 mx-2 sm:mx-0">
                                <CardHeader className="bg-black text-white p-6">
                                    <CardTitle className="text-2xl text-white lg:text-3xl text-center font-black uppercase tracking-wide">
                                        Sign Up
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 lg:px-6 pb-6">
                                    {/* General Error Display */}
                                    {errors.general && (
                                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 mb-4">
                                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                            <span className="text-sm text-red-700">
                                                {errors.general}
                                            </span>
                                        </div>
                                    )}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-3"
                                    >
                                        {/* Role Selection - Full Width */}
                                        <div className="space-y-1">
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
                                                <SelectTrigger className="h-10">
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
                                                <p className="text-xs text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.role}
                                                </p>
                                            )}
                                        </div>

                                        {/* First Name and Last Name Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="firstName"
                                                    className="text-sm font-semibold text-slate-700"
                                                >
                                                    First Name
                                                </label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={formData.firstName}
                                                    className={`h-10 ${
                                                        errors.firstName
                                                            ? "border-red-400"
                                                            : isFieldValid(
                                                                  "firstName"
                                                              )
                                                            ? "border-emerald-400"
                                                            : "border-slate-300"
                                                    }`}
                                                    placeholder="Alex"
                                                />
                                                {errors.firstName && (
                                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.firstName}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="lastName"
                                                    className="text-sm font-semibold text-slate-700"
                                                >
                                                    Last Name
                                                </label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={formData.lastName}
                                                    className={`h-10 ${
                                                        errors.lastName
                                                            ? "border-red-400"
                                                            : isFieldValid(
                                                                  "lastName"
                                                              )
                                                            ? "border-emerald-400"
                                                            : "border-slate-300"
                                                    }`}
                                                    placeholder="Smith"
                                                />
                                                {errors.lastName && (
                                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.lastName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Email - Full Width */}
                                        <div className="space-y-1">
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
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={formData.email}
                                                className={`h-10 ${
                                                    errors.email
                                                        ? "border-red-400"
                                                        : isFieldValid("email")
                                                        ? "border-emerald-400"
                                                        : "border-slate-300"
                                                }`}
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password and Confirm Password Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="password"
                                                    className="text-sm font-semibold text-slate-700"
                                                >
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        name="password"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            formData.password
                                                        }
                                                        className={`pr-10 h-10 ${
                                                            errors.password
                                                                ? "border-red-400"
                                                                : isFieldValid(
                                                                      "password"
                                                                  )
                                                                ? "border-emerald-400"
                                                                : "border-slate-300"
                                                        }`}
                                                        placeholder="Create password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-3 w-3" />
                                                        ) : (
                                                            <Eye className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="confirmPassword"
                                                    className="text-sm font-semibold text-slate-700"
                                                >
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
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
                                                        value={
                                                            formData.confirmPassword
                                                        }
                                                        className={`pr-10 h-10 ${
                                                            errors.confirmPassword
                                                                ? "border-red-400"
                                                                : isFieldValid(
                                                                      "confirmPassword"
                                                                  )
                                                                ? "border-emerald-400"
                                                                : "border-slate-300"
                                                        }`}
                                                        placeholder="Confirm password"
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
                                                            <EyeOff className="h-3 w-3" />
                                                        ) : (
                                                            <Eye className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.confirmPassword}
                                                    </p>
                                                )}
                                            </div>
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
                                                        {subjectsList.map(
                                                            (s) => (
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
                                                                        htmlFor={
                                                                            s
                                                                        }
                                                                        className="text-sm"
                                                                    >
                                                                        {s.replace(
                                                                            /_/g,
                                                                            " "
                                                                        )}
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                    {errors.subjects && (
                                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.subjects}
                                                        </p>
                                                    )}
                                                </div>

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
                                                <Link
                                                    href="/terms"
                                                    className="underline"
                                                >
                                                    terms and conditions
                                                </Link>
                                                .
                                            </label>
                                        </div>
                                        {errors.agreeToTerms && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.agreeToTerms}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white h-10"
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

                                        <p className="text-center text-sm pt-2">
                                            Already have an account?{" "}
                                            <Link
                                                href="/auth/login"
                                                className="underline"
                                            >
                                                Log in
                                            </Link>
                                        </p>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthPageGuard>
    )
}
