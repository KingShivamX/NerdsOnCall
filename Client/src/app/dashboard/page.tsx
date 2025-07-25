"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentDoubtNotification } from "@/components/Doubt/StudentDoubtNotification"
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
    Crown,
    Trophy,
    Target,
    Zap,
    Heart,
    Award,
    Sparkles,
    BarChart3,
    GraduationCap,
    PlayCircle,
    ArrowRight,
    Bell,
    Search,
    Filter,
    Settings,
    Power,
    CheckCircle,
    XCircle,
} from "lucide-react"

export default function DashboardPage() {
    const { user, loading } = useAuth()
    const [isOnline, setIsOnline] = useState(user?.isOnline || false)
    const [updatingStatus, setUpdatingStatus] = useState(false)

    // Sync local state with user data when user changes
    useEffect(() => {
        if (user) {
            setIsOnline(user.isOnline || false)
        }
    }, [user])

    const handleOnlineStatusToggle = async () => {
        if (updatingStatus) return

        setUpdatingStatus(true)
        try {
            const newStatus = !isOnline
            await api.put(`/users/online-status?isOnline=${newStatus}`)
            setIsOnline(newStatus)
            // Update the user context if needed
            window.location.reload() // Simple refresh to update the user state
        } catch (error) {
            console.error("Error updating online status:", error)
        } finally {
            setUpdatingStatus(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg animate-pulse">
                        <Crown className="h-8 w-8 text-amber-400" />
                    </div>
                    <p className="text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
                <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl p-6 sm:p-8 max-w-md mx-auto w-full">
                    <CardHeader className="text-center pb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                            <Crown className="h-8 w-8 text-amber-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-800">
                            Access Required
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Please log in to access your premium dashboard
                        </CardDescription>
                    </CardHeader>
                    <div className="flex justify-center mt-6">
                        <Link href="/auth/login">
                            <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 w-full sm:w-auto">
                                <Crown className="w-4 h-4 mr-2" />
                                Sign In Now
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        )
    }

    const isStudent = user.role === "STUDENT"
    const isTutor = user.role === "TUTOR"

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with mobile optimization */}
                    <div className="mb-8 lg:mb-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
                            <div className="px-2 sm:px-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 leading-tight">
                                    Welcome back, {user.firstName}!
                                </h1>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
                                    <Badge
                                        variant={
                                            isTutor ? "default" : "secondary"
                                        }
                                        className={`w-fit ${
                                            isTutor
                                                ? "bg-slate-700 text-white border-0"
                                                : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        {isTutor && (
                                            <Crown className="w-4 h-4 mr-1" />
                                        )}
                                        {isTutor
                                            ? "Elite Tutor"
                                            : "Premium Student"}
                                    </Badge>
                                    <span className="hidden sm:inline text-slate-400">
                                        •
                                    </span>
                                    <span className="text-slate-600 text-sm">
                                        Dashboard
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                                {/* <Button
                                    variant="outline"
                                    size="sm"
                                    className="group border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
                                >
                                    <Bell className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                    Notifications
                                </Button> */}
                                <Link
                                    href={
                                        isStudent
                                            ? "/search-tutors"
                                            : "/create-session"
                                    }
                                >
                                    {/* <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 group w-full sm:w-auto">
                                        <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                                        {isStudent
                                            ? "Book Session"
                                            : "Create Session"}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button> */}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards - Only for Students */}
                    {isStudent && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 lg:mb-10">
                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                                    <CardTitle className="text-sm font-medium text-slate-600">
                                        Sessions Attended
                                    </CardTitle>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                        <Video className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="text-2xl font-bold text-slate-800">
                                        {user.totalSessions || 0}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Total learning sessions
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                                    <CardTitle className="text-sm font-medium text-slate-600">
                                        Hours Learned
                                    </CardTitle>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="text-2xl font-bold text-slate-800">
                                        {Math.round(
                                            (user.totalSessions || 0) * 1.5
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Estimated learning time
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Tutor Stats - Keep existing for tutors */}
                    {isTutor && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-10">
                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                                    <CardTitle className="text-sm font-medium text-slate-600">
                                        Sessions Taught
                                    </CardTitle>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                        <Video className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="text-2xl font-bold text-slate-800">
                                        {user.totalSessions || 0}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        <span className="text-emerald-600">
                                            +12%
                                        </span>{" "}
                                        from last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                                    <CardTitle className="text-sm font-medium text-slate-600">
                                        Hours Taught
                                    </CardTitle>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="text-2xl font-bold text-slate-800">
                                        {Math.round(
                                            (user.totalSessions || 0) * 1.5
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        <span className="text-emerald-600">
                                            +2.5h
                                        </span>{" "}
                                        this week
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                                    <CardTitle className="text-sm font-medium text-slate-600">
                                        Average Rating
                                    </CardTitle>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                        <Star className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="text-2xl font-bold text-slate-800">
                                        {user.rating?.toFixed(1) || "0.0"}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        <span className="text-emerald-600">
                                            +0.1
                                        </span>{" "}
                                        improvement
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                                    <CardTitle className="text-sm font-medium text-slate-600">
                                        Earnings
                                    </CardTitle>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="text-2xl font-bold text-slate-800">
                                        ${user.totalEarnings?.toFixed(0) || "0"}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        <span className="text-emerald-600">
                                            +8%
                                        </span>{" "}
                                        from last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Main Content with improved mobile layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                            {/* Quick Actions with mobile optimization */}
                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                <CardHeader className="px-4 sm:px-6">
                                    <CardTitle className="flex items-center text-slate-800">
                                        <Zap className="w-5 h-5 mr-2 text-amber-500" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {isStudent ? (
                                            <>
                                                <Link href="/ask-question">
                                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 h-auto p-6 flex-col w-full group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                            <PlusCircle className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                                                        </div>
                                                        <span className="font-bold text-lg">
                                                            Ask a Question
                                                        </span>
                                                        <span className="text-sm opacity-90">
                                                            Get instant help
                                                            from expert tutors
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/browse-tutors">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 h-auto p-6 flex-col w-full group shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                                    >
                                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                                                            <Users className="h-6 w-6 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        </div>
                                                        <span className="font-bold text-slate-700">
                                                            Browse Tutors
                                                        </span>
                                                        <span className="text-sm text-slate-600">
                                                            Find expert tutors
                                                            in your subject
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/my-sessions">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 h-auto p-6 flex-col w-full group shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                                    >
                                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                                                            <Video className="h-6 w-6 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        </div>
                                                        <span className="font-bold text-slate-700">
                                                            My Sessions
                                                        </span>
                                                        <span className="text-sm text-slate-600">
                                                            View your learning
                                                            sessions
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/my-questions">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 h-auto p-6 flex-col w-full group shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                                    >
                                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                                                            <MessageCircle className="h-6 w-6 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        </div>
                                                        <span className="font-bold text-slate-700">
                                                            My Questions
                                                        </span>
                                                        <span className="text-sm text-slate-600">
                                                            Track your question
                                                            progress
                                                        </span>
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/student-requests">
                                                    <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 h-auto p-4 flex-col w-full group">
                                                        <Users className="h-6 w-6 mb-2 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold">
                                                            Student Requests
                                                        </span>
                                                        <span className="text-xs opacity-90">
                                                            View pending
                                                            requests
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <div className="bg-slate-50 border-2 border-dashed border-slate-300 h-auto p-4 flex-col w-full flex items-center justify-center rounded-lg">
                                                    <MessageCircle className="h-6 w-6 mb-2 text-slate-400" />
                                                    <span className="font-semibold text-slate-500 text-sm">
                                                        More features
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Coming soon
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity with mobile optimization */}
                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                <CardHeader className="px-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center text-slate-800">
                                            <Clock className="w-5 h-5 mr-2 text-slate-600" />
                                            Recent Activity
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-600 hover:text-slate-800"
                                        >
                                            View All
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: "Mathematics Session Completed",
                                                subtitle:
                                                    "With Dr. Sarah Johnson",
                                                time: "2 hours ago",
                                                icon: Video,
                                                color: "text-emerald-600",
                                                bg: "bg-emerald-100",
                                            },
                                            {
                                                title: "Physics Homework Help",
                                                subtitle:
                                                    "Question about quantum mechanics",
                                                time: "5 hours ago",
                                                icon: BookOpen,
                                                color: "text-slate-600",
                                                bg: "bg-slate-100",
                                            },
                                            {
                                                title: "Session Rated 5 Stars",
                                                subtitle:
                                                    "Great explanation of calculus concepts",
                                                time: "1 day ago",
                                                icon: Star,
                                                color: "text-amber-600",
                                                bg: "bg-amber-100",
                                            },
                                        ].map((activity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                                                >
                                                    <activity.icon
                                                        className={`h-5 w-5 ${activity.color}`}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {activity.title}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        {activity.subtitle}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {activity.time}
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column with mobile optimization */}
                        <div className="space-y-6 lg:space-y-8">
                            {/* Student Quick Stats */}
                            {isStudent && (
                                <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                    <CardHeader className="px-4 sm:px-6">
                                        <CardTitle className="flex items-center text-slate-800">
                                            <GraduationCap className="w-5 h-5 mr-2 text-slate-600" />
                                            Quick Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 sm:px-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                                                        <Video className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Active Sessions
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    0
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                                        <MessageCircle className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Open Questions
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    0
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                        <Users className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Favorite Tutors
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    0
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tutor Manage Profile */}
                            {isTutor && (
                                <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                    <CardHeader className="px-4 sm:px-6">
                                        <CardTitle className="flex items-center text-slate-800">
                                            <Settings className="w-5 h-5 mr-2 text-slate-600" />
                                            Manage Profile
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 sm:px-6">
                                        <div className="space-y-4">
                                            {/* Online Status Toggle */}
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                            isOnline
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                        }`}
                                                    >
                                                        <Power className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-700">
                                                            Online Status
                                                        </span>
                                                        <p className="text-xs text-slate-500">
                                                            {isOnline
                                                                ? "Available for students"
                                                                : "Not accepting requests"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={
                                                        isOnline
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    onClick={
                                                        handleOnlineStatusToggle
                                                    }
                                                    disabled={updatingStatus}
                                                    className={`${
                                                        isOnline
                                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {updatingStatus ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            {isOnline ? (
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                            ) : (
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                            )}
                                                            {isOnline
                                                                ? "Online"
                                                                : "Offline"}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            {/* Availability Info */}
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-start space-x-2">
                                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-white text-xs font-bold">
                                                            i
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-blue-800">
                                                            Visibility Status
                                                        </p>
                                                        <p className="text-xs text-blue-700 mt-1">
                                                            {isOnline
                                                                ? "You are visible to students and can receive connection requests."
                                                                : "You are hidden from student searches. Toggle online to start receiving requests."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tutor Student Requests Overview */}
                            {isTutor && (
                                <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                    <CardHeader className="px-4 sm:px-6">
                                        <CardTitle className="flex items-center text-slate-800">
                                            <Users className="w-5 h-5 mr-2 text-slate-600" />
                                            Student Requests
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 sm:px-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                                        <Clock className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Pending Requests
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    0
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                        <Video className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Active Sessions
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    0
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                                                        <MessageCircle className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Today&apos;s Questions
                                                    </span>
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    0
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Doubt Notifications */}
            {isStudent && <StudentDoubtNotification />}
        </div>
    )
}
