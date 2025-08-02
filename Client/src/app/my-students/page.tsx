"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    MessageCircle,
    Calendar,
    User,
    BookOpen,
} from "lucide-react"
import Link from "next/link"

interface Doubt {
    id: number
    title: string
    description: string
    subject: string
    priority: string
    status: string
    createdAt: string
    resolvedAt?: string
    solutionDescription?: string
    videoUrl?: string
    student: {
        firstName: string
        lastName: string
        email: string
    }
    attachments?: string[]
}

export default function MyStudentsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [doubts, setDoubts] = useState<Doubt[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("pending")

    useEffect(() => {
        if (user && user.role === "TUTOR") {
            fetchMyStudentDoubts()
        }
    }, [user])

    const fetchMyStudentDoubts = async () => {
        try {
            setLoading(true)
            const response = await api.get("/api/doubts/preferred")
            setDoubts(response.data)
        } catch (error) {
            console.error("Error fetching student doubts:", error)
            setDoubts([])
        } finally {
            setLoading(false)
        }
    }

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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "LOW":
                return "bg-green-100 text-green-800 border-green-200"
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "HIGH":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "URGENT":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const filteredDoubts = doubts.filter((doubt) => {
        if (activeTab === "pending") {
            return ["OPEN", "ASSIGNED", "IN_PROGRESS"].includes(doubt.status)
        } else if (activeTab === "resolved") {
            return doubt.status === "RESOLVED"
        }
        return true
    })

    if (!user || user.role !== "TUTOR") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-slate-600 mb-4">
                            This page is only available to tutors.
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
            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-4"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    My Students
                                </h1>
                                <p className="text-slate-600">
                                    Manage student doubts and provide solutions
                                </p>
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
                                            Total Doubts
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {doubts.length}
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
                                            Pending
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {
                                                doubts.filter((d) =>
                                                    [
                                                        "OPEN",
                                                        "ASSIGNED",
                                                        "IN_PROGRESS",
                                                    ].includes(d.status)
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
                                            Resolved
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {
                                                doubts.filter(
                                                    (d) =>
                                                        d.status === "RESOLVED"
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
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pending">
                                Pending (
                                {
                                    doubts.filter((d) =>
                                        [
                                            "OPEN",
                                            "ASSIGNED",
                                            "IN_PROGRESS",
                                        ].includes(d.status)
                                    ).length
                                }
                                )
                            </TabsTrigger>
                            <TabsTrigger value="resolved">
                                Resolved (
                                {
                                    doubts.filter(
                                        (d) => d.status === "RESOLVED"
                                    ).length
                                }
                                )
                            </TabsTrigger>
                        </TabsList>

                        {/* Doubts List */}
                        <TabsContent value={activeTab} className="space-y-4">
                            {loading ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                                        <p className="mt-4 text-slate-600">
                                            Loading doubts...
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : filteredDoubts.length > 0 ? (
                                filteredDoubts.map((doubt) => (
                                    <Card
                                        key={doubt.id}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
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
                                                    </div>

                                                    <h3 className="font-semibold text-slate-800 mb-2">
                                                        {doubt.title}
                                                    </h3>

                                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                                        {doubt.description}
                                                    </p>

                                                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                        <div className="flex items-center space-x-1">
                                                            <User className="h-3 w-3" />
                                                            <Link
                                                                href={`/profile/${doubt.student.id}`}
                                                            >
                                                                <span className="hover:text-blue-600 cursor-pointer transition-colors">
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
                                                                </span>
                                                            </Link>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>
                                                                {new Date(
                                                                    doubt.createdAt
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ml-4">
                                                    {doubt.status !==
                                                    "RESOLVED" ? (
                                                        <Link
                                                            href={`/doubts/${doubt.id}/solve`}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                <BookOpen className="h-4 w-4 mr-2" />
                                                                Provide Solution
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            ✓ Solved
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                            No {activeTab} doubts
                                        </h3>
                                        <p className="text-slate-600">
                                            {activeTab === "pending"
                                                ? "No pending doubts from your students yet."
                                                : "No resolved doubts yet."}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
