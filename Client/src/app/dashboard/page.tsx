"use client"

import { useAuth } from "../../context/AuthContext"
import { Navbar } from "../../components/layout/Navbar"
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs"
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
} from "lucide-react"

export default function DashboardPage() {
    const { user } = useAuth()

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center hero-background">
                <Card className="luxury-card border-0 p-8 max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full royal-gradient flex items-center justify-center">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Access Required
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Please log in to access your premium dashboard
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const isStudent = user.role === "STUDENT"
    const isTutor = user.role === "TUTOR"

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back, {user.firstName}!
                                </h1>
                                <div className="flex items-center space-x-2">
                                    <Badge
                                        variant={
                                            isTutor ? "default" : "secondary"
                                        }
                                        className={
                                            isTutor
                                                ? "royal-gradient text-white border-0"
                                                : ""
                                        }
                                    >
                                        {isTutor && (
                                            <Crown className="w-4 h-4 mr-1" />
                                        )}
                                        {isTutor
                                            ? "Elite Tutor"
                                            : "Premium Student"}
                                    </Badge>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">
                                        Dashboard
                                    </span>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                <Button className="premium-button text-white border-0">
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    {isStudent
                                        ? "Book Session"
                                        : "Create Session"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="luxury-card border-0 group hover:scale-105 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {isStudent
                                        ? "Sessions Attended"
                                        : "Sessions Taught"}
                                </CardTitle>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                    <Video className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold royal-text">
                                    24
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    <span className="text-green-600">+12%</span>{" "}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="luxury-card border-0 group hover:scale-105 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Hours Learned
                                </CardTitle>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold royal-text">
                                    48.5
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    <span className="text-green-600">
                                        +2.5h
                                    </span>{" "}
                                    this week
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="luxury-card border-0 group hover:scale-105 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Average Rating
                                </CardTitle>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                    <Star className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold royal-text">
                                    4.9
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    <span className="text-green-600">+0.1</span>{" "}
                                    improvement
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="luxury-card border-0 group hover:scale-105 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {isStudent ? "Credits Used" : "Earnings"}
                                </CardTitle>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold royal-text">
                                    {isStudent ? "150" : "$1,240"}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    <span className="text-green-600">+8%</span>{" "}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Actions */}
                            <Card className="luxury-card border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Zap className="w-5 h-5 mr-2 text-purple-600" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {isStudent ? (
                                            <>
                                                <Button className="premium-button text-white border-0 h-auto p-4 flex-col">
                                                    <PlusCircle className="h-6 w-6 mb-2" />
                                                    <span className="font-semibold">
                                                        Ask a Question
                                                    </span>
                                                    <span className="text-xs opacity-90">
                                                        Get instant help
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="premium-glass border-2 border-purple-200 h-auto p-4 flex-col"
                                                >
                                                    <Users className="h-6 w-6 mb-2 text-purple-600" />
                                                    <span className="font-semibold text-purple-700">
                                                        Browse Tutors
                                                    </span>
                                                    <span className="text-xs text-purple-600">
                                                        Find experts
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="premium-glass border-2 border-blue-200 h-auto p-4 flex-col"
                                                >
                                                    <BookOpen className="h-6 w-6 mb-2 text-blue-600" />
                                                    <span className="font-semibold text-blue-700">
                                                        Study Materials
                                                    </span>
                                                    <span className="text-xs text-blue-600">
                                                        Access resources
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="premium-glass border-2 border-green-200 h-auto p-4 flex-col"
                                                >
                                                    <BarChart3 className="h-6 w-6 mb-2 text-green-600" />
                                                    <span className="font-semibold text-green-700">
                                                        Progress Report
                                                    </span>
                                                    <span className="text-xs text-green-600">
                                                        View analytics
                                                    </span>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button className="premium-button text-white border-0 h-auto p-4 flex-col">
                                                    <Calendar className="h-6 w-6 mb-2" />
                                                    <span className="font-semibold">
                                                        Open Schedule
                                                    </span>
                                                    <span className="text-xs opacity-90">
                                                        Set availability
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="premium-glass border-2 border-purple-200 h-auto p-4 flex-col"
                                                >
                                                    <Users className="h-6 w-6 mb-2 text-purple-600" />
                                                    <span className="font-semibold text-purple-700">
                                                        Student Requests
                                                    </span>
                                                    <span className="text-xs text-purple-600">
                                                        View pending
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="premium-glass border-2 border-blue-200 h-auto p-4 flex-col"
                                                >
                                                    <TrendingUp className="h-6 w-6 mb-2 text-blue-600" />
                                                    <span className="font-semibold text-blue-700">
                                                        Earnings
                                                    </span>
                                                    <span className="text-xs text-blue-600">
                                                        View analytics
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="premium-glass border-2 border-green-200 h-auto p-4 flex-col"
                                                >
                                                    <Award className="h-6 w-6 mb-2 text-green-600" />
                                                    <span className="font-semibold text-green-700">
                                                        Achievements
                                                    </span>
                                                    <span className="text-xs text-green-600">
                                                        Your badges
                                                    </span>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="luxury-card border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: "Mathematics Session Completed",
                                                subtitle:
                                                    "With Dr. Sarah Johnson",
                                                time: "2 hours ago",
                                                icon: Video,
                                                color: "text-green-600",
                                                bg: "bg-green-100",
                                            },
                                            {
                                                title: "Physics Homework Help",
                                                subtitle:
                                                    "Question about quantum mechanics",
                                                time: "5 hours ago",
                                                icon: BookOpen,
                                                color: "text-blue-600",
                                                bg: "bg-blue-100",
                                            },
                                            {
                                                title: "Session Rated 5 Stars",
                                                subtitle:
                                                    "Great explanation of calculus concepts",
                                                time: "1 day ago",
                                                icon: Star,
                                                color: "text-yellow-600",
                                                bg: "bg-yellow-100",
                                            },
                                        ].map((activity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0`}
                                                >
                                                    <activity.icon
                                                        className={`h-5 w-5 ${activity.color}`}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {activity.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {activity.subtitle}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Progress Card */}
                            <Card className="luxury-card border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                                        Learning Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">
                                                    Mathematics
                                                </span>
                                                <span className="text-gray-600">
                                                    85%
                                                </span>
                                            </div>
                                            <Progress
                                                value={85}
                                                className="h-2"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">
                                                    Physics
                                                </span>
                                                <span className="text-gray-600">
                                                    72%
                                                </span>
                                            </div>
                                            <Progress
                                                value={72}
                                                className="h-2"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">
                                                    Chemistry
                                                </span>
                                                <span className="text-gray-600">
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

                            {/* Achievements */}
                            <Card className="luxury-card border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                                        Achievements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            {
                                                icon: Crown,
                                                name: "Elite Learner",
                                                earned: true,
                                            },
                                            {
                                                icon: Star,
                                                name: "5-Star Student",
                                                earned: true,
                                            },
                                            {
                                                icon: Target,
                                                name: "Goal Achiever",
                                                earned: true,
                                            },
                                            {
                                                icon: Heart,
                                                name: "Dedicated",
                                                earned: false,
                                            },
                                            {
                                                icon: Zap,
                                                name: "Quick Learner",
                                                earned: false,
                                            },
                                            {
                                                icon: GraduationCap,
                                                name: "Graduate",
                                                earned: false,
                                            },
                                        ].map((badge, index) => (
                                            <div
                                                key={index}
                                                className="text-center"
                                            >
                                                <div
                                                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                                                        badge.earned
                                                            ? "royal-gradient"
                                                            : "bg-gray-100"
                                                    }`}
                                                >
                                                    <badge.icon
                                                        className={`h-6 w-6 ${
                                                            badge.earned
                                                                ? "text-white"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                </div>
                                                <p
                                                    className={`text-xs ${
                                                        badge.earned
                                                            ? "text-gray-900 font-medium"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {badge.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Sessions */}
                            <Card className="luxury-card border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                                        Upcoming Sessions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                subject: "Advanced Calculus",
                                                tutor: "Dr. Emily Chen",
                                                time: "Today, 3:00 PM",
                                                duration: "1 hour",
                                            },
                                            {
                                                subject: "Organic Chemistry",
                                                tutor: "Prof. Michael Brown",
                                                time: "Tomorrow, 10:00 AM",
                                                duration: "1.5 hours",
                                            },
                                        ].map((session, index) => (
                                            <div
                                                key={index}
                                                className="p-3 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-gray-900">
                                                        {session.subject}
                                                    </h4>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {session.duration}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {session.tutor}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {session.time}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full mt-2 text-xs"
                                                >
                                                    <PlayCircle className="w-3 h-3 mr-1" />
                                                    Join Session
                                                </Button>
                                            </div>
                                        ))}
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
