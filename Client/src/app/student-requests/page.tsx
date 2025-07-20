"use client"

import { useState, useEffect } from "react"
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
    Clock,
    User,
    BookOpen,
    MessageCircle,
    Video,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    Calendar,
    DollarSign,
    Star,
    FileText,
    Paperclip,
    ArrowRight,
    Users,
    Timer,
    Target,
} from "lucide-react"

// Dummy data based on database schema
const dummyDoubts = [
    {
        id: 1,
        student: {
            id: 101,
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            rating: 4.8,
        },
        subject: "MATHEMATICS",
        title: "Help with Calculus Integration",
        description:
            "I&apos;m struggling with integration by parts and need help understanding the concept with some practice problems.",
        priority: "HIGH",
        status: "OPEN",
        attachments: ["problem_set.pdf", "my_work.jpg"],
        preferredTutorId: null,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
    },
    {
        id: 2,
        student: {
            id: 102,
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            rating: 4.5,
        },
        subject: "PHYSICS",
        title: "Quantum Mechanics Basics",
        description:
            "Need explanation of wave-particle duality and Schrödinger equation fundamentals.",
        priority: "MEDIUM",
        status: "OPEN",
        attachments: [],
        preferredTutorId: 1, // Current tutor
        createdAt: "2024-01-15T09:15:00Z",
        updatedAt: "2024-01-15T09:15:00Z",
    },
    {
        id: 3,
        student: {
            id: 103,
            firstName: "Carol",
            lastName: "Davis",
            email: "carol@example.com",
            rating: 4.9,
        },
        subject: "CHEMISTRY",
        title: "Organic Chemistry Reactions",
        description:
            "Having trouble with substitution and elimination reactions. Need help with mechanisms.",
        priority: "URGENT",
        status: "ASSIGNED",
        attachments: ["reaction_sheet.pdf"],
        preferredTutorId: null,
        createdAt: "2024-01-15T08:45:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
    },
]

const dummySessions = [
    {
        id: 1,
        student: {
            id: 104,
            firstName: "David",
            lastName: "Wilson",
            email: "david@example.com",
        },
        doubt: {
            id: 4,
            title: "Linear Algebra Problems",
            subject: "MATHEMATICS",
        },
        status: "PENDING",
        startTime: "2024-01-15T14:00:00Z",
        cost: 25.0,
        tutorEarnings: 20.0,
        createdAt: "2024-01-15T12:00:00Z",
    },
    {
        id: 2,
        student: {
            id: 105,
            firstName: "Emma",
            lastName: "Brown",
            email: "emma@example.com",
        },
        doubt: {
            id: 5,
            title: "Thermodynamics Concepts",
            subject: "PHYSICS",
        },
        status: "ACTIVE",
        startTime: "2024-01-15T13:30:00Z",
        endTime: null,
        cost: 30.0,
        tutorEarnings: 24.0,
        createdAt: "2024-01-15T13:25:00Z",
    },
]

export default function StudentRequestsPage() {
    const { user } = useAuth()
    const [doubts, setDoubts] = useState(dummyDoubts)
    const [sessions, setSessions] = useState(dummySessions)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedPriority, setSelectedPriority] = useState("all")
    const [activeTab, setActiveTab] = useState("new-requests")

    const handleAcceptDoubt = async (doubtId: number) => {
        // TODO: Implement accept doubt functionality
        console.log("Accepting doubt:", doubtId)
        // Update doubt status to ASSIGNED and create session
        setDoubts((prev) =>
            prev.map((doubt) =>
                doubt.id === doubtId ? { ...doubt, status: "ASSIGNED" } : doubt
            )
        )
    }

    const handleRejectDoubt = async (doubtId: number) => {
        // TODO: Implement reject doubt functionality
        console.log("Rejecting doubt:", doubtId)
        // Remove from current tutor's view or mark as not interested
        setDoubts((prev) => prev.filter((doubt) => doubt.id !== doubtId))
    }

    const handleStartSession = async (sessionId: number) => {
        // TODO: Implement start session functionality
        console.log("Starting session:", sessionId)
        setSessions((prev) =>
            prev.map((session) =>
                session.id === sessionId
                    ? { ...session, status: "ACTIVE" }
                    : session
            )
        )
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT":
                return "bg-red-100 text-red-800 border-red-200"
            case "HIGH":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "LOW":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "ASSIGNED":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "PENDING":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "ACTIVE":
                return "bg-green-100 text-green-800 border-green-200"
            case "COMPLETED":
                return "bg-gray-100 text-gray-800 border-gray-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const filteredDoubts = doubts.filter((doubt) => {
        const matchesSearch =
            doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doubt.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            `${doubt.student.firstName} ${doubt.student.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        const matchesSubject =
            selectedSubject === "all" || doubt.subject === selectedSubject
        const matchesPriority =
            selectedPriority === "all" || doubt.priority === selectedPriority
        return matchesSearch && matchesSubject && matchesPriority
    })

    if (!user || user.role !== "TUTOR") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Access denied. This page is for tutors only.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Student Requests
                        </h1>
                        <p className="text-slate-600">
                            Manage incoming student requests and active sessions
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MessageCircle className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            New Requests
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {
                                                doubts.filter(
                                                    (d) => d.status === "OPEN"
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Pending Sessions
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {
                                                sessions.filter(
                                                    (s) =>
                                                        s.status === "PENDING"
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Video className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Active Sessions
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {
                                                sessions.filter(
                                                    (s) => s.status === "ACTIVE"
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Today&apos;s Earnings
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            $
                                            {sessions
                                                .reduce(
                                                    (sum, s) =>
                                                        sum +
                                                        (s.tutorEarnings || 0),
                                                    0
                                                )
                                                .toFixed(0)}
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
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="new-requests">
                                New Requests
                            </TabsTrigger>
                            <TabsTrigger value="my-sessions">
                                My Sessions
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed
                            </TabsTrigger>
                        </TabsList>

                        {/* New Requests Tab */}
                        <TabsContent value="new-requests" className="space-y-6">
                            {/* Filters */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder="Search requests..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
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
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={selectedPriority}
                                            onValueChange={setSelectedPriority}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Priorities" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Priorities
                                                </SelectItem>
                                                <SelectItem value="URGENT">
                                                    Urgent
                                                </SelectItem>
                                                <SelectItem value="HIGH">
                                                    High
                                                </SelectItem>
                                                <SelectItem value="MEDIUM">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="LOW">
                                                    Low
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Filter className="h-4 w-4 mr-2" />
                                            {filteredDoubts.length} requests
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Requests List */}
                            <div className="space-y-4">
                                {filteredDoubts.map((doubt) => (
                                    <Card
                                        key={doubt.id}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {
                                                                doubt.student
                                                                    .firstName[0]
                                                            }
                                                            {
                                                                doubt.student
                                                                    .lastName[0]
                                                            }
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-800">
                                                                {
                                                                    doubt
                                                                        .student
                                                                        .firstName
                                                                }{" "}
                                                                {
                                                                    doubt
                                                                        .student
                                                                        .lastName
                                                                }
                                                            </h3>
                                                            <div className="flex items-center space-x-2">
                                                                <Star className="h-3 w-3 text-amber-500 fill-current" />
                                                                <span className="text-xs text-slate-600">
                                                                    {
                                                                        doubt
                                                                            .student
                                                                            .rating
                                                                    }{" "}
                                                                    rating
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {doubt.subject.replace(
                                                                    /_/g,
                                                                    " "
                                                                )}
                                                            </Badge>
                                                            <Badge
                                                                className={`text-xs border ${getPriorityColor(
                                                                    doubt.priority
                                                                )}`}
                                                            >
                                                                {doubt.priority}
                                                            </Badge>
                                                            <Badge
                                                                className={`text-xs border ${getStatusColor(
                                                                    doubt.status
                                                                )}`}
                                                            >
                                                                {doubt.status}
                                                            </Badge>
                                                            {doubt.preferredTutorId && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    Preferred
                                                                    Tutor
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium text-slate-800 mb-2">
                                                            {doubt.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-600 line-clamp-2">
                                                            {doubt.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>
                                                                    {new Date(
                                                                        doubt.createdAt
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            {doubt.attachments
                                                                .length > 0 && (
                                                                <div className="flex items-center space-x-1">
                                                                    <Paperclip className="h-3 w-3" />
                                                                    <span>
                                                                        {
                                                                            doubt
                                                                                .attachments
                                                                                .length
                                                                        }{" "}
                                                                        files
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleRejectDoubt(
                                                                        doubt.id
                                                                    )
                                                                }
                                                                className="text-xs"
                                                            >
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                Decline
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleAcceptDoubt(
                                                                        doubt.id
                                                                    )
                                                                }
                                                                className="bg-slate-700 hover:bg-slate-800 text-xs"
                                                            >
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Accept
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* My Sessions Tab */}
                        <TabsContent value="my-sessions" className="space-y-6">
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <Card
                                        key={session.id}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold">
                                                        {
                                                            session.student
                                                                .firstName[0]
                                                        }
                                                        {
                                                            session.student
                                                                .lastName[0]
                                                        }
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-800">
                                                            {
                                                                session.doubt
                                                                    .title
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-slate-600">
                                                            with{" "}
                                                            {
                                                                session.student
                                                                    .firstName
                                                            }{" "}
                                                            {
                                                                session.student
                                                                    .lastName
                                                            }
                                                        </p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {session.doubt.subject.replace(
                                                                    /_/g,
                                                                    " "
                                                                )}
                                                            </Badge>
                                                            <Badge
                                                                className={`text-xs border ${getStatusColor(
                                                                    session.status
                                                                )}`}
                                                            >
                                                                {session.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-slate-800">
                                                        ${session.tutorEarnings}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {new Date(
                                                            session.startTime
                                                        ).toLocaleString()}
                                                    </div>
                                                    {session.status ===
                                                        "PENDING" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleStartSession(
                                                                    session.id
                                                                )
                                                            }
                                                            className="mt-2 bg-green-600 hover:bg-green-700 text-xs"
                                                        >
                                                            <Video className="h-3 w-3 mr-1" />
                                                            Start Session
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Completed Tab */}
                        <TabsContent value="completed" className="space-y-6">
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                                        No completed sessions yet
                                    </h3>
                                    <p className="text-slate-600">
                                        Completed sessions will appear here
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
