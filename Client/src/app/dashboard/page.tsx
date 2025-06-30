"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
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
} from "lucide-react"

export default function DashboardPage() {
    const { user } = useAuth()

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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="group border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
                                >
                                    <Bell className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                    Notifications
                                </Button>
                                <Link
                                    href={
                                        isStudent
                                            ? "/search-tutors"
                                            : "/create-session"
                                    }
                                >
                                    <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 group w-full sm:w-auto">
                                        <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                                        {isStudent
                                            ? "Book Session"
                                            : "Create Session"}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards with enhanced mobile layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-10">
                        <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {isStudent
                                        ? "Sessions Attended"
                                        : "Sessions Taught"}
                                </CardTitle>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                    <Video className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6">
                                <div className="text-2xl font-bold text-slate-800">
                                    24
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
                                    Hours {isStudent ? "Learned" : "Taught"}
                                </CardTitle>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6">
                                <div className="text-2xl font-bold text-slate-800">
                                    48.5
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
                                    4.9
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
                                    {isStudent ? "Credits Used" : "Earnings"}
                                </CardTitle>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6">
                                <div className="text-2xl font-bold text-slate-800">
                                    {isStudent ? "150" : "$1,240"}
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
                                                    <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 h-auto p-4 flex-col w-full group">
                                                        <PlusCircle className="h-6 w-6 mb-2 group-hover:rotate-90 transition-transform" />
                                                        <span className="font-semibold">
                                                            Ask a Question
                                                        </span>
                                                        <span className="text-xs opacity-90">
                                                            Get instant help
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/browse-tutors">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-auto p-4 flex-col w-full group"
                                                    >
                                                        <Users className="h-6 w-6 mb-2 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold text-slate-700">
                                                            Browse Tutors
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            Find experts
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/study-materials">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-auto p-4 flex-col w-full group"
                                                    >
                                                        <BookOpen className="h-6 w-6 mb-2 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold text-slate-700">
                                                            Study Materials
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            Access resources
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/progress-report">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-auto p-4 flex-col w-full group"
                                                    >
                                                        <BarChart3 className="h-6 w-6 mb-2 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold text-slate-700">
                                                            Progress Report
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            View analytics
                                                        </span>
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/schedule">
                                                    <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 h-auto p-4 flex-col w-full group">
                                                        <Calendar className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold">
                                                            Open Schedule
                                                        </span>
                                                        <span className="text-xs opacity-90">
                                                            Set availability
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/student-requests">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-auto p-4 flex-col w-full group"
                                                    >
                                                        <Users className="h-6 w-6 mb-2 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold text-slate-700">
                                                            Student Requests
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            View pending
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/earnings">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-auto p-4 flex-col w-full group"
                                                    >
                                                        <TrendingUp className="h-6 w-6 mb-2 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold text-slate-700">
                                                            Earnings
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            View analytics
                                                        </span>
                                                    </Button>
                                                </Link>
                                                <Link href="/achievements">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-auto p-4 flex-col w-full group"
                                                    >
                                                        <Award className="h-6 w-6 mb-2 text-slate-600 group-hover:scale-110 transition-transform" />
                                                        <span className="font-semibold text-slate-700">
                                                            Achievements
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            Your badges
                                                        </span>
                                                    </Button>
                                                </Link>
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
                            {/* Progress Card */}
                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                <CardHeader className="px-4 sm:px-6">
                                    <CardTitle className="flex items-center text-slate-800">
                                        <TrendingUp className="w-5 h-5 mr-2 text-slate-600" />
                                        {isStudent
                                            ? "Learning Progress"
                                            : "Teaching Stats"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="space-y-4 lg:space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium text-slate-700">
                                                    Mathematics
                                                </span>
                                                <span className="text-slate-600">
                                                    85%
                                                </span>
                                            </div>
                                            <Progress
                                                value={85}
                                                className="h-2"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium text-slate-700">
                                                    Physics
                                                </span>
                                                <span className="text-slate-600">
                                                    72%
                                                </span>
                                            </div>
                                            <Progress
                                                value={72}
                                                className="h-2"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium text-slate-700">
                                                    Chemistry
                                                </span>
                                                <span className="text-slate-600">
                                                    91%
                                                </span>
                                            </div>
                                            <Progress
                                                value={91}
                                                className="h-2"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Achievements with mobile optimization */}
                            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                <CardHeader className="px-4 sm:px-6">
                                    <CardTitle className="flex items-center text-slate-800">
                                        <Trophy className="w-5 h-5 mr-2 text-amber-600" />
                                        Achievements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6">
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Trophy className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-xs font-medium text-slate-700">
                                                Perfect Week
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                7 sessions
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Star className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-xs font-medium text-slate-700">
                                                Top Rated
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                4.9+ rating
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Target className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-xs font-medium text-slate-700">
                                                Goal Crusher
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                10 goals met
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Heart className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-xs font-medium text-slate-700">
                                                Mentor
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                50+ hours
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
