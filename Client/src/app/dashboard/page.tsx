"use client"

import { useAuth } from "../../context/AuthContext"
import { Navbar } from "../../components/layout/Navbar"
import { Button } from "../../components/ui/Button"
import {
    BookOpen,
    Users,
    Clock,
    Star,
    MessageCircle,
    Video,
    Calendar,
    TrendingUp,
    PlusCircle,
    DollarSign,
} from "lucide-react"

export default function DashboardPage() {
    const { user } = useAuth()

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Please log in to access your dashboard
                    </h2>
                </div>
            </div>
        )
    }

    const isStudent = user.role === "STUDENT"
    const isTutor = user.role === "TUTOR"

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user.firstName} {user.lastName}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {isStudent
                            ? "Ready to get your doubts resolved?"
                            : "Ready to help students learn?"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    {isStudent
                                        ? "Active Doubts"
                                        : "Questions Answered"}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    12
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    {isStudent
                                        ? "Sessions Completed"
                                        : "Students Helped"}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    24
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Hours
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    48
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    {isStudent ? "Credits Used" : "Earnings"}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {isStudent ? "150" : "$240"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {isStudent && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Quick Actions
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button className="flex items-center justify-center p-4 h-auto">
                                    <PlusCircle className="h-6 w-6 mr-2" />
                                    Ask a New Question
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex items-center justify-center p-4 h-auto"
                                >
                                    <BookOpen className="h-6 w-6 mr-2" />
                                    Browse Available Tutors
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {isTutor && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Available Questions
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                Mathematics - Calculus
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Need help with integration by
                                                parts
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Posted 5 minutes ago
                                            </p>
                                        </div>
                                        <Button size="sm">Accept</Button>
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                Physics - Mechanics
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Projectile motion problem
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Posted 12 minutes ago
                                            </p>
                                        </div>
                                        <Button size="sm">Accept</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
