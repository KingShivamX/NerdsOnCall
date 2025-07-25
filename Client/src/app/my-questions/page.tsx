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
    MessageCircle,
    Search,
    Filter,
    Calendar,
    Paperclip,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Video,
} from "lucide-react"
import Link from "next/link"
import { StudentDoubtNotification } from "@/components/Doubt/StudentDoubtNotification"

interface Question {
    id: number
    title: string
    description: string
    subject: string
    priority: string
    status: string
    attachments: string[]
    tutor?: {
        id: number
        firstName: string
        lastName: string
        rating?: number
    }
    createdAt: string
    updatedAt: string
}

export default function MyQuestionsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [activeTab, setActiveTab] = useState("all")

    // Fetch questions from API
    const fetchQuestions = async () => {
        try {
            setLoading(true)
            const response = await api.get("/api/doubts/student")
            setQuestions(response.data)
        } catch (error) {
            console.error("Error fetching questions:", error)
            // Set empty array if API fails
            setQuestions([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user && user.role === "STUDENT") {
            fetchQuestions()
        }
    }, [user])

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "ASSIGNED":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "IN_PROGRESS":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "RESOLVED":
                return "bg-green-100 text-green-800 border-green-200"
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Get priority color
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

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "OPEN":
                return <Clock className="h-4 w-4" />
            case "ASSIGNED":
                return <AlertCircle className="h-4 w-4" />
            case "IN_PROGRESS":
                return <AlertCircle className="h-4 w-4" />
            case "RESOLVED":
                return <CheckCircle className="h-4 w-4" />
            case "CANCELLED":
                return <XCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    // Filter questions
    const filteredQuestions = questions.filter((question) => {
        const matchesSearch =
            question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        const matchesSubject =
            selectedSubject === "all" || question.subject === selectedSubject
        const matchesStatus =
            selectedStatus === "all" || question.status === selectedStatus

        // Filter by tab
        let matchesTab = true
        if (activeTab === "pending") {
            matchesTab = ["OPEN", "ASSIGNED", "IN_PROGRESS"].includes(
                question.status
            )
        } else if (activeTab === "resolved") {
            matchesTab = question.status === "RESOLVED"
        } else if (activeTab === "cancelled") {
            matchesTab = question.status === "CANCELLED"
        }

        return matchesSearch && matchesSubject && matchesStatus && matchesTab
    })

    // Get question counts
    const questionCounts = {
        all: questions.length,
        pending: questions.filter((q) =>
            ["OPEN", "ASSIGNED", "IN_PROGRESS"].includes(q.status)
        ).length,
        resolved: questions.filter((q) => q.status === "RESOLVED").length,
        cancelled: questions.filter((q) => q.status === "CANCELLED").length,
    }

    if (!user || user.role !== "STUDENT") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-slate-600 mb-4">
                            This page is only available to students.
                        </p>
                        <Button onClick={() => router.push("/dashboard")}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <StudentDoubtNotification onDoubtAccepted={fetchQuestions} />

            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    My Questions
                                </h1>
                                <p className="text-slate-600">
                                    Track your questions and get help from
                                    tutors
                                </p>
                            </div>
                            <Link href="/ask-question">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ask New Question
                                </Button>
                            </Link>
                        </div>
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
                                            Total Questions
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {questionCounts.all}
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
                                            Pending
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {questionCounts.pending}
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
                                            Resolved
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {questionCounts.resolved}
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
                                            {questionCounts.cancelled}
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
                                All ({questionCounts.all})
                            </TabsTrigger>
                            <TabsTrigger value="pending">
                                Pending ({questionCounts.pending})
                            </TabsTrigger>
                            <TabsTrigger value="resolved">
                                Resolved ({questionCounts.resolved})
                            </TabsTrigger>
                            <TabsTrigger value="cancelled">
                                Cancelled ({questionCounts.cancelled})
                            </TabsTrigger>
                        </TabsList>

                        {/* Filter Section */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search questions..."
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
                                            <SelectItem value="OPEN">
                                                Open
                                            </SelectItem>
                                            <SelectItem value="ASSIGNED">
                                                Assigned
                                            </SelectItem>
                                            <SelectItem value="IN_PROGRESS">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="RESOLVED">
                                                Resolved
                                            </SelectItem>
                                            <SelectItem value="CANCELLED">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Filter className="h-4 w-4 mr-2" />
                                        {filteredQuestions.length} questions
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Question Cards */}
                        {["all", "pending", "resolved", "cancelled"].map(
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
                                                    Loading questions...
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : filteredQuestions.length > 0 ? (
                                        filteredQuestions.map((question) => (
                                            <Card
                                                key={question.id}
                                                className="hover:shadow-md transition-shadow"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            {/* Question Header */}
                                                            <div className="flex items-center space-x-2 mb-3">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-slate-50"
                                                                >
                                                                    {question.subject.replace(
                                                                        /_/g,
                                                                        " "
                                                                    )}
                                                                </Badge>
                                                                <Badge
                                                                    className={`text-xs border ${getPriorityColor(
                                                                        question.priority
                                                                    )}`}
                                                                >
                                                                    {
                                                                        question.priority
                                                                    }
                                                                </Badge>
                                                                <Badge
                                                                    className={`text-xs border ${getStatusColor(
                                                                        question.status
                                                                    )} flex items-center space-x-1 animate-pulse`}
                                                                >
                                                                    {getStatusIcon(
                                                                        question.status
                                                                    )}
                                                                    <span>
                                                                        {question.status.replace(
                                                                            /_/g,
                                                                            " "
                                                                        )}
                                                                    </span>
                                                                </Badge>
                                                            </div>

                                                            {/* Question Content */}
                                                            <h3 className="font-semibold text-slate-800 mb-2">
                                                                {question.title}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                                {
                                                                    question.description
                                                                }
                                                            </p>

                                                            {/* Tutor Info */}
                                                            {question.tutor && (
                                                                <div className="flex items-center space-x-2 mb-3">
                                                                    <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                                        {
                                                                            question
                                                                                .tutor
                                                                                .firstName[0]
                                                                        }
                                                                    </div>
                                                                    <span className="text-sm text-slate-600">
                                                                        Assigned
                                                                        to{" "}
                                                                        {
                                                                            question
                                                                                .tutor
                                                                                .firstName
                                                                        }{" "}
                                                                        {
                                                                            question
                                                                                .tutor
                                                                                .lastName
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Footer */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                                    <div className="flex items-center space-x-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        <span>
                                                                            {new Date(
                                                                                question.createdAt
                                                                            ).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    {question
                                                                        .attachments
                                                                        .length >
                                                                        0 && (
                                                                        <div className="flex items-center space-x-1">
                                                                            <Paperclip className="h-3 w-3" />
                                                                            <span>
                                                                                {
                                                                                    question
                                                                                        .attachments
                                                                                        .length
                                                                                }{" "}
                                                                                files
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex space-x-2">
                                                                    {question.status ===
                                                                        "ASSIGNED" && (
                                                                        <Button
                                                                            size="sm"
                                                                            className="text-xs bg-green-600 hover:bg-green-700"
                                                                            onClick={() => {
                                                                                // Start video call
                                                                                const sessionId = `question_${
                                                                                    question.id
                                                                                }_${Date.now()}`
                                                                                window.open(
                                                                                    `/video-call/${sessionId}?questionId=${question.id}`,
                                                                                    "_blank"
                                                                                )
                                                                            }}
                                                                        >
                                                                            <Video className="h-3 w-3 mr-1" />
                                                                            Join
                                                                            Call
                                                                        </Button>
                                                                    )}
                                                                    {question.status ===
                                                                        "OPEN" && (
                                                                        <Badge className="text-xs bg-blue-100 text-blue-800 px-2 py-1">
                                                                            <Clock className="h-3 w-3 mr-1" />
                                                                            Waiting
                                                                            for
                                                                            tutor
                                                                        </Badge>
                                                                    )}
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-xs"
                                                                    >
                                                                        <Eye className="h-3 w-3 mr-1" />
                                                                        View
                                                                        Details
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <Card>
                                            <CardContent className="p-12 text-center">
                                                <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                                    No questions found
                                                </h3>
                                                <p className="text-slate-600 mb-4">
                                                    {tabValue === "all"
                                                        ? "You haven't asked any questions yet."
                                                        : `No ${tabValue} questions found.`}
                                                </p>
                                                {tabValue === "all" && (
                                                    <Link href="/ask-question">
                                                        <Button>
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Ask Your First
                                                            Question
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
