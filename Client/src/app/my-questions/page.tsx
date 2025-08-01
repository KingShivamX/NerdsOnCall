"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"

interface Doubt {
    id: number
    title: string
    description: string
    subject: string
    priority: string
    status: string
    createdAt: string
    acceptedTutor?: {
        firstName: string
        lastName: string
    }
}

export default function MyQuestionsPage() {
    const { user } = useAuth()
    const [doubts, setDoubts] = useState<Doubt[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user && user.role === "STUDENT") {
            fetchMyDoubts()
        }
    }, [user])

    const fetchMyDoubts = async () => {
        try {
            setLoading(true)
            const response = await api.get("/api/doubts/student")
            setDoubts(response.data)
        } catch (error) {
            console.error("Error fetching doubts:", error)
        } finally {
            setLoading(false)
        }
    }

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

    if (!user || user.role !== "STUDENT") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Access denied. This page is for students only.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-20 pb-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="mr-4">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    My Questions
                                </h1>
                                <p className="text-slate-600">
                                    Track all your submitted questions and their status
                                </p>
                            </div>
                            <Link href="/ask-question">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Ask New Question
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Questions List */}
                    {loading ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                                <p className="mt-4 text-slate-600">Loading your questions...</p>
                            </CardContent>
                        </Card>
                    ) : doubts.length > 0 ? (
                        <div className="space-y-4">
                            {doubts.map((doubt) => (
                                <Card key={doubt.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {doubt.subject.replace(/_/g, " ")}
                                                    </Badge>
                                                    <Badge className={`text-xs border ${getPriorityColor(doubt.priority)}`}>
                                                        {doubt.priority}
                                                    </Badge>
                                                    <Badge className={`text-xs border ${getStatusColor(doubt.status)}`}>
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
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {new Date(doubt.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {doubt.acceptedTutor && (
                                                        <div className="flex items-center space-x-1">
                                                            <User className="h-3 w-3" />
                                                            <span>
                                                                {doubt.acceptedTutor.firstName} {doubt.acceptedTutor.lastName}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                    No Questions Yet
                                </h3>
                                <p className="text-slate-600 mb-6">
                                    You haven't asked any questions yet. Start learning by asking your first question!
                                </p>
                                <Link href="/ask-question">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Ask Your First Question
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}