"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Video,
    Search,
    Filter,
    Calendar,
    Clock,
    Star,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    Play,
    Plus,
} from "lucide-react"
import Link from "next/link"

interface Session {
    id: number
    title: string
    subject: string
    status: string
    duration: number
    scheduledAt: string
    completedAt?: string
    tutor: {
        id: number
        firstName: string
        lastName: string
        rating?: number
        profilePicture?: string
    }
    student: {
        id: number
        firstName: string
        lastName: string
        profilePicture?: string
    }
    rating?: number
    feedback?: string
    sessionUrl?: string
    createdAt: string
}

export default function MySessionsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [activeTab, setActiveTab] = useState("all")

    // Fetch sessions from API
    const fetchSessions = async () => {
        try {
            setLoading(true)
            const response = await api.get("/api/sessions/my-sessions")
            setSessions(response.data)
        } catch (error) {
            console.error("Error fetching sessions:", error)
            // Create mock data for now if API fails
            setSessions([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchSessions()
        }
    }, [user])

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "SCHEDULED":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "COMPLETED":
                return "bg-green-100 text-green-800 border-green-200"
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200"
            case "NO_SHOW":
                return "bg-gray-100 text-gray-800 border-gray-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "SCHEDULED":
                return <Clock className="h-4 w-4" />
            case "IN_PROGRESS":
                return <Play className="h-4 w-4" />
            case "COMPLETED":
                return <CheckCircle className="h-4 w-4" />
            case "CANCELLED":
                return <XCircle className="h-4 w-4" />
            case "NO_SHOW":
                return <AlertCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    // Filter sessions
    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${session.tutor.firstName} ${session.tutor.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            `${session.student.firstName} ${session.student.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        const matchesSubject =
            selectedSubject === "all" || session.subject === selectedSubject
        const matchesStatus =
            selectedStatus === "all" || session.status === selectedStatus

        // Filter by tab
        let matchesTab = true
        if (activeTab === "upcoming") {
            matchesTab = session.status === "SCHEDULED"
        } else if (activeTab === "completed") {
            matchesTab = session.status === "COMPLETED"
        } else if (activeTab === "cancelled") {
            matchesTab = ["CANCELLED", "NO_SHOW"].includes(session.status)
        }

        return matchesSearch && matchesSubject && matchesStatus && matchesTab
    })

    // Get session counts
    const sessionCounts = {
        all: sessions.length,
        upcoming: sessions.filter((s) => s.status === "SCHEDULED").length,
        completed: sessions.filter((s) => s.status === "COMPLETED").length,
        cancelled: sessions.filter((s) =>
            ["CANCELLED", "NO_SHOW"].includes(s.status)
        ).length,
    }

    // Format duration
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return `${hours}h ${mins}m`
        }
        return `${mins}m`
    }

    // Join session
    const joinSession = (session: Session) => {
        if (session.sessionUrl) {
            window.open(session.sessionUrl, "_blank")
        } else {
            // Generate session URL
            const sessionId = `session_${session.id}_${Date.now()}`
            const tutorId = session.tutor.id
            const tutorName = `${session.tutor.firstName} ${session.tutor.lastName}`
            router.push(
                `/video-call/${sessionId}?tutorId=${tutorId}&tutorName=${encodeURIComponent(
                    tutorName
                )}`
            )
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-slate-600 mb-4">
                            Please log in to view your sessions.
                        </p>
                        <Button onClick={() => router.push("/auth/login")}>
                            Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isStudent = user.role === "STUDENT"

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    My Sessions
                                </h1>
                                <p className="text-slate-600">
                                    {isStudent
                                        ? "View your learning sessions"
                                        : "Manage your teaching sessions"}
                                </p>
                            </div>
                            {isStudent && (
                                <Link href="/browse-tutors">
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Book New Session
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Video className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Total Sessions
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {sessionCounts.all}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Upcoming
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {sessionCounts.upcoming}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Completed
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {sessionCounts.completed}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Cancelled
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {sessionCounts.cancelled}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-6"
                    >
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">
                                All ({sessionCounts.all})
                            </TabsTrigger>
                            <TabsTrigger value="upcoming">
                                Upcoming ({sessionCounts.upcoming})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({sessionCounts.completed})
                            </TabsTrigger>
                            <TabsTrigger value="cancelled">
                                Cancelled ({sessionCounts.cancelled})
                            </TabsTrigger>
                        </TabsList>

                        {/* Filter Section */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search sessions..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select
                                        value={selectedSubject}
                                        onValueChange={setSelectedSubject}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Subjects" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Subjects
                                            </SelectItem>
                                            <SelectItem value="MATHEMATICS">
                                                Mathematics
                                            </SelectItem>
                                            <SelectItem value="PHYSICS">
                                                Physics
                                            </SelectItem>
                                            <SelectItem value="CHEMISTRY">
                                                Chemistry
                                            </SelectItem>
                                            <SelectItem value="BIOLOGY">
                                                Biology
                                            </SelectItem>
                                            <SelectItem value="COMPUTER_SCIENCE">
                                                Computer Science
                                            </SelectItem>
                                            <SelectItem value="ENGLISH">
                                                English
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={setSelectedStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="SCHEDULED">
                                                Scheduled
                                            </SelectItem>
                                            <SelectItem value="IN_PROGRESS">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="COMPLETED">
                                                Completed
                                            </SelectItem>
                                            <SelectItem value="CANCELLED">
                                                Cancelled
                                            </SelectItem>
                                            <SelectItem value="NO_SHOW">
                                                No Show
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Filter className="h-4 w-4 mr-2" />
                                        {filteredSessions.length} sessions
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Session Cards */}
                        {["all", "upcoming", "completed", "cancelled"].map(
                            (tabValue) => (
                                <TabsContent
                                    key={tabValue}
                                    value={tabValue}
                                    className="space-y-4"
                                >
                                    {loading ? (
                                        <Card>
                                            <CardContent className="p-12 text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                                                <p className="mt-4 text-slate-600">
                                                    Loading sessions...
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : filteredSessions.length > 0 ? (
                                        filteredSessions.map((session) => (
                                            <Card
                                                key={session.id}
                                                className="hover:shadow-md transition-shadow"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            {/* Session Header */}
                                                            <div className="flex items-center space-x-2 mb-3">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    {session.subject.replace(
                                                                        /_/g,
                                                                        " "
                                                                    )}
                                                                </Badge>
                                                                <Badge
                                                                    className={`text-xs border ${getStatusColor(
                                                                        session.status
                                                                    )} flex items-center space-x-1`}
                                                                >
                                                                    {getStatusIcon(
                                                                        session.status
                                                                    )}
                                                                    <span>
                                                                        {session.status.replace(
                                                                            /_/g,
                                                                            " "
                                                                        )}
                                                                    </span>
                                                                </Badge>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    {formatDuration(
                                                                        session.duration
                                                                    )}
                                                                </Badge>
                                                            </div>

                                                            {/* Session Content */}
                                                            <h3 className="font-semibold text-slate-800 mb-2">
                                                                {session.title}
                                                            </h3>

                                                            {/* Participant Info */}
                                                            <div className="flex items-center space-x-4 mb-3">
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                                        {isStudent
                                                                            ? session
                                                                                  .tutor
                                                                                  .firstName[0]
                                                                            : session
                                                                                  .student
                                                                                  .firstName[0]}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-slate-800">
                                                                            {isStudent
                                                                                ? `${session.tutor.firstName} ${session.tutor.lastName}`
                                                                                : `${session.student.firstName} ${session.student.lastName}`}
                                                                        </p>
                                                                        <p className="text-xs text-slate-600">
                                                                            {isStudent
                                                                                ? "Tutor"
                                                                                : "Student"}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {session.rating && (
                                                                    <div className="flex items-center space-x-1">
                                                                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                                                                        <span className="text-sm text-slate-600">
                                                                            {
                                                                                session.rating
                                                                            }
                                                                            /5
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Session Details */}
                                                            <div className="flex items-center space-x-4 text-xs text-slate-500 mb-4">
                                                                <div className="flex items-center space-x-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>
                                                                        {new Date(
                                                                            session.scheduledAt
                                                                        ).toLocaleDateString()}{" "}
                                                                        at{" "}
                                                                        {new Date(
                                                                            session.scheduledAt
                                                                        ).toLocaleTimeString(
                                                                            [],
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {session.completedAt && (
                                                                    <div className="flex items-center space-x-1">
                                                                        <CheckCircle className="h-3 w-3" />
                                                                        <span>
                                                                            Completed
                                                                            on{" "}
                                                                            {new Date(
                                                                                session.completedAt
                                                                            ).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Feedback */}
                                                            {session.feedback && (
                                                                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                                                                    <p className="text-sm text-slate-700">
                                                                        "
                                                                        {
                                                                            session.feedback
                                                                        }
                                                                        "
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex flex-col space-y-2 ml-4">
                                                            {session.status ===
                                                                "SCHEDULED" && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        joinSession(
                                                                            session
                                                                        )
                                                                    }
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <Video className="h-4 w-4 mr-2" />
                                                                    Join Session
                                                                </Button>
                                                            )}

                                                            {session.status ===
                                                                "COMPLETED" &&
                                                                !session.rating &&
                                                                isStudent && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        <Star className="h-4 w-4 mr-2" />
                                                                        Rate
                                                                        Session
                                                                    </Button>
                                                                )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <Card>
                                            <CardContent className="p-12 text-center">
                                                <Video className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                                    No sessions found
                                                </h3>
                                                <p className="text-slate-600 mb-4">
                                                    {tabValue === "all"
                                                        ? "You don't have any sessions yet."
                                                        : `No ${tabValue} sessions found.`}
                                                </p>
                                                {tabValue === "all" &&
                                                    isStudent && (
                                                        <Link href="/browse-tutors">
                                                            <Button>
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Book Your First
                                                                Session
                                                            </Button>
                                                        </Link>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>
                            )
                        )}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
