"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { TutorDoubtNotification } from "@/components/Doubt/TutorDoubtNotification"
import { VideoCallModal } from "@/components/VideoCall/VideoCallModal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/card"
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
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Calendar,
    Paperclip,
    Star,
    Video,
    RefreshCw,
} from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface StudentRequest {
    id: number
    student: {
        id: number
        firstName: string
        lastName: string
        email: string
        rating?: number
    }
    subject: string
    title: string
    description: string
    priority: string
    status: string
    attachments: string[]
    preferredTutorId?: number
    createdAt: string
    updatedAt: string
}

export default function StudentRequestsPage() {
    const { user } = useAuth()
    const [requests, setRequests] = useState<StudentRequest[]>([])
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedPriority, setSelectedPriority] = useState("all")
    const [activeTab, setActiveTab] = useState("new-request")
    const [selectedAttachments, setSelectedAttachments] = useState<string[]>([])
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [acceptingId, setAcceptingId] = useState<number | null>(null)
    const [rejectingId, setRejectingId] = useState<number | null>(null)
    const router = useRouter()
    
    // State for VideoCallModal - exactly like browse-tutors
    const [selectedStudent, setSelectedStudent] = useState<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        rating?: number;
    } | null>(null)
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)
    const [currentDoubtId, setCurrentDoubtId] = useState<number | null>(null)

    // Fetch requests from API
    const fetchRequests = async () => {
        try {
            setLoading(true)
            setFetchError(null)
            console.log("Fetching tutor requests...")

            // Try the tutor-specific endpoint first
            let response
            try {
                response = await api.get("/api/doubts/tutor")
                console.log("Tutor requests response:", response.data)
            } catch (tutorError) {
                console.log("Tutor endpoint failed, trying alternative...")
                // Fallback: try to get all doubts and filter
                response = await api.get("/api/doubts")
                console.log("All doubts response:", response.data)
            }

            const doubts = response.data || []
            console.log("Setting requests:", doubts)
            setRequests(doubts)

            // Force a re-render
            setTimeout(() => {
                console.log("Current requests state:", doubts.length)
            }, 100)
        } catch (error) {
            console.error("Error fetching requests:", error)
            setFetchError(
                "Failed to fetch student requests. Please try again later."
            )
            setRequests([])
        } finally {
            setLoading(false)
        }
    }

    // Handle new doubt notifications from WebSocket
    const handleNewDoubt = (newDoubt?: any) => {
        console.log("handleNewDoubt called with:", newDoubt)
        if (newDoubt) {
            console.log("Adding new doubt to requests list")
            setRequests((prev) => {
                console.log("Previous requests:", prev.length)
                const updated = [newDoubt, ...prev]
                console.log("Updated requests:", updated.length)
                return updated
            })
        } else {
            console.log("Refreshing requests list")
            fetchRequests()
        }
    }

    // Handle accept request and create session
    const handleAcceptRequest = async (requestId: number) => {
        setAcceptingId(requestId)
        try {
            // First update the doubt status
            await api.put(`/api/doubts/${requestId}/status`, null, {
                params: { status: "ASSIGNED" },
            }) // Auth header is already included by api instance

            // Find the request to get student info
            const request = requests.find((r) => r.id === requestId)
            if (!request) return

            // Create a session for this doubt
            try {
                const sessionResponse = await api.post(
                    `/api/sessions?tutorId=${user?.id}&doubtId=${requestId}`
                )
                console.log("Session created:", sessionResponse.data)
            } catch (sessionError) {
                console.log(
                    "Session creation failed, continuing without session:",
                    sessionError
                )
            }

            // Update local state
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === requestId ? { ...req, status: "ASSIGNED" } : req
                )
            )

            // Show success message
            toast.success(
                `✅ Request accepted! You can now start a video call with ${request.student.firstName} ${request.student.lastName}`,
                { duration: 4000 }
            )
        } catch (error) {
            console.error("Error accepting request:", error)
            toast.error("❌ Failed to accept request. Please try again.")
        } finally {
            setAcceptingId(null)
        }
    }

    // Handle reject request
    const handleRejectRequest = async (requestId: number) => {
        setRejectingId(requestId)
        try {
            await api.put(`/api/doubts/${requestId}/status?status=CANCELLED`)
            setRequests((prev) =>
                prev.map((request) =>
                    request.id === requestId
                        ? { ...request, status: "CANCELLED" }
                        : request
                )
            )
            toast.success("Request declined successfully")
        } catch (error) {
            console.error("Error rejecting request:", error)
            toast.error("Failed to decline request. Please try again.")
        } finally {
            setRejectingId(null)
        }
    }

    // Handle view attachments
    const handleViewAttachments = (attachments: string[]) => {
        setSelectedAttachments(attachments)
        setIsAttachmentModalOpen(true)
    }

    // Handle start video call - exactly like Connect button in browse-tutors
    const handleStartVideoCall = (request: StudentRequest) => {
        // Generate session ID
        const sessionId = `doubt_${request.id}_${Date.now()}`
        const studentName = `${request.student.firstName} ${request.student.lastName}`
        
        // Navigate directly to video call page with correct parameters for tutor calling student
        router.push(
            `/video-call/${sessionId}?role=tutor&studentId=${request.student.id}&studentName=${encodeURIComponent(studentName)}&doubtId=${request.id}`
        )
        
        toast.success(`Starting video call with ${studentName}...`)
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

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "ASSIGNED":
                return "bg-green-100 text-green-800 border-green-200"
            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200"
            case "RESOLVED":
                return "bg-purple-100 text-purple-800 border-purple-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Filter requests
    const filteredRequests = requests.filter((request) => {
        const matchesSearch =
            request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            `${request.student.firstName} ${request.student.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        const matchesSubject =
            selectedSubject === "all" || request.subject === selectedSubject
        const matchesPriority =
            selectedPriority === "all" || request.priority === selectedPriority

        // Filter by status based on active tab
        let matchesStatus = false
        if (activeTab === "new-request") {
            matchesStatus = request.status === "OPEN"
        } else if (activeTab === "accepted") {
            matchesStatus =
                request.status === "ASSIGNED" ||
                request.status === "IN_PROGRESS"
        } else if (activeTab === "rejected") {
            matchesStatus = request.status === "CANCELLED"
        } else if (activeTab === "all-debug") {
            matchesStatus = true // Show all requests for debugging
        }

        return (
            matchesSearch && matchesSubject && matchesPriority && matchesStatus
        )
    })

    // Fetch requests on component mount
    useEffect(() => {
        if (user && user.role === "TUTOR") {
            fetchRequests()
        }
    }, [user])

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
            <TutorDoubtNotification onNewDoubt={handleNewDoubt} />

            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    Student Requests
                                </h1>
                                <p className="text-slate-600">
                                    Manage incoming student requests (
                                    {requests.length} total)
                                </p>
                                {fetchError && (
                                    <div className="mt-2 text-red-600 bg-red-100 border border-red-200 rounded px-4 py-2">
                                        {fetchError}
                                    </div>
                                )}
                                {!fetchError &&
                                    !loading &&
                                    requests.length === 0 && (
                                        <div className="mt-2 text-yellow-700 bg-yellow-100 border border-yellow-200 rounded px-4 py-2">
                                            No student requests found.
                                        </div>
                                    )}
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={fetchRequests}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 mr-2 ${
                                            loading ? "animate-spin" : ""
                                        }`}
                                    />
                                    {loading ? "Refreshing..." : "Refresh"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                                                requests.filter(
                                                    (r) => r.status === "OPEN"
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
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Accepted
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {
                                                requests.filter(
                                                    (r) =>
                                                        r.status ===
                                                            "ASSIGNED" ||
                                                        r.status ===
                                                            "IN_PROGRESS"
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
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Rejected
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {
                                                requests.filter(
                                                    (r) =>
                                                        r.status === "CANCELLED"
                                                ).length
                                            }
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
                            <TabsTrigger value="new-request">
                                New Request
                            </TabsTrigger>
                            <TabsTrigger value="accepted">Accepted</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                            <TabsTrigger value="all-debug">
                                All (Debug)
                            </TabsTrigger>
                        </TabsList>

                        {/* Filter Section */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search requests..."
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
                                        {filteredRequests.length} requests
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Request Cards */}
                        {[
                            "new-request",
                            "accepted",
                            "rejected",
                            "all-debug",
                        ].map((tabValue) => (
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
                                                Loading requests...
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => (
                                        <Card
                                            key={request.id}
                                            className="hover:shadow-md transition-shadow"
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        {/* Student Info */}
                                                        <div className="flex items-center space-x-3 mb-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                {
                                                                    request
                                                                        .student
                                                                        .firstName[0]
                                                                }
                                                                {
                                                                    request
                                                                        .student
                                                                        .lastName[0]
                                                                }
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-slate-800">
                                                                    {
                                                                        request
                                                                            .student
                                                                            .firstName
                                                                    }{" "}
                                                                    {
                                                                        request
                                                                            .student
                                                                            .lastName
                                                                    }
                                                                </h3>
                                                                {request.student
                                                                    .rating && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <Star className="h-3 w-3 text-amber-500 fill-current" />
                                                                        <span className="text-xs text-slate-600">
                                                                            {
                                                                                request
                                                                                    .student
                                                                                    .rating
                                                                            }{" "}
                                                                            rating
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Request Details */}
                                                        <div className="mb-3">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    {request.subject.replace(
                                                                        /_/g,
                                                                        " "
                                                                    )}
                                                                </Badge>
                                                                <Badge
                                                                    className={`text-xs border ${getPriorityColor(
                                                                        request.priority
                                                                    )}`}
                                                                >
                                                                    {
                                                                        request.priority
                                                                    }
                                                                </Badge>
                                                                {tabValue !==
                                                                    "new-request" && (
                                                                    <Badge
                                                                        className={`text-xs border ${getStatusColor(
                                                                            request.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            request.status
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <h4 className="font-medium text-slate-800 mb-2">
                                                                {request.title}
                                                            </h4>
                                                            <p className="text-sm text-slate-600 line-clamp-2">
                                                                {
                                                                    request.description
                                                                }
                                                            </p>
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                                <div className="flex items-center space-x-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>
                                                                        {new Date(
                                                                            request.createdAt
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                {request
                                                                    .attachments
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex items-center space-x-1">
                                                                        <Paperclip className="h-3 w-3" />
                                                                        <button
                                                                            onClick={() =>
                                                                                handleViewAttachments(
                                                                                    request.attachments
                                                                                )
                                                                            }
                                                                            className="text-blue-600 hover:text-blue-800 underline"
                                                                        >
                                                                            {
                                                                                request
                                                                                    .attachments
                                                                                    .length
                                                                            }{" "}
                                                                            files
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Action Buttons */}
                                                            {tabValue ===
                                                                "new-request" && (
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleRejectRequest(
                                                                                request.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            rejectingId ===
                                                                                request.id ||
                                                                            acceptingId ===
                                                                                request.id
                                                                        }
                                                                        className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                                                                    >
                                                                        {rejectingId ===
                                                                        request.id ? (
                                                                            <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin mr-1" />
                                                                        ) : (
                                                                            <XCircle className="h-3 w-3 mr-1" />
                                                                        )}
                                                                        {rejectingId ===
                                                                        request.id
                                                                            ? "Declining..."
                                                                            : "Decline"}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleAcceptRequest(
                                                                                request.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            acceptingId ===
                                                                                request.id ||
                                                                            rejectingId ===
                                                                                request.id
                                                                        }
                                                                        className="bg-green-600 hover:bg-green-700 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {acceptingId ===
                                                                        request.id ? (
                                                                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                                                                        ) : (
                                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                                        )}
                                                                        {acceptingId ===
                                                                        request.id
                                                                            ? "Accepting..."
                                                                            : "Accept"}
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            {/* Video Call Button for accepted requests */}
                                                            {tabValue ===
                                                                "accepted" && (
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleStartVideoCall(
                                                                                request
                                                                            )
                                                                        }
                                                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xs text-white shadow-md hover:shadow-lg transition-all duration-200 animate-pulse"
                                                                    >
                                                                        <Video className="h-3 w-3 mr-1" />
                                                                        Start
                                                                        Video
                                                                        Call
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            // Mark as in progress
                                                                            handleAcceptRequest(
                                                                                request.id
                                                                            )
                                                                        }}
                                                                        className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                                                    >
                                                                        <MessageCircle className="h-3 w-3 mr-1" />
                                                                        Mark In
                                                                        Progress
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="border-dashed border-2 border-gray-300">
                                        <CardContent className="p-12 text-center">
                                            {tabValue === "new-request" ? (
                                                <>
                                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <MessageCircle className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                                                        No New Requests
                                                    </h3>
                                                    <p className="text-slate-600 mb-4">
                                                        Student questions will
                                                        appear here when they
                                                        need help
                                                    </p>
                                                </>
                                            ) : tabValue === "accepted" ? (
                                                <>
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                                                        No Accepted Requests
                                                    </h3>
                                                    <p className="text-slate-600">
                                                        Requests you accept will
                                                        appear here
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <XCircle className="h-8 w-8 text-red-600" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                                                        No Rejected Requests
                                                    </h3>
                                                    <p className="text-slate-600">
                                                        Declined requests will
                                                        appear here
                                                    </p>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>

            {/* Attachment Modal */}
            {isAttachmentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Attachments
                            </h3>
                            <button
                                onClick={() => setIsAttachmentModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedAttachments.map((attachment, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4"
                                >
                                    {attachment.match(
                                        /\.(jpg|jpeg|png|gif|webp)$/i
                                    ) ? (
                                        <img
                                            src={attachment}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-full h-auto max-h-64 object-contain rounded"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
                                            <Paperclip className="h-8 w-8 text-gray-400" />
                                            <span className="ml-2 text-gray-600">
                                                File attachment
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <a
                                            href={attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                                        >
                                            Open in new tab
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Video Call Modal - for tutor calling student */}
            {selectedStudent && currentDoubtId && (
                <VideoCallModal
                    isOpen={isCallModalOpen}
                    onClose={() => setIsCallModalOpen(false)}
                    tutorId={selectedStudent.id}
                    tutorName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    sessionId={`doubt_${currentDoubtId}_${Date.now()}`}
                />
            )}
        </div>
    )
}
