"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { VideoCallModal } from "@/components/VideoCall/VideoCallModal"
import { Star, Search, Filter, Video, Clock, Users } from "lucide-react"
import { Subject, User } from "@/types"

const subjectsList: Subject[] = [
    "MATHEMATICS",
    "PHYSICS",
    "CHEMISTRY",
    "BIOLOGY",
    "COMPUTER_SCIENCE",
    "ENGLISH",
    "HISTORY",
    "GEOGRAPHY",
    "ECONOMICS",
    "ACCOUNTING",
    "STATISTICS",
    "CALCULUS",
    "ALGEBRA",
    "GEOMETRY",
    "TRIGONOMETRY",
]

export default function BrowseTutorsPage() {
    const { user } = useAuth()
    const [tutors, setTutors] = useState<User[]>([])
    const [filteredTutors, setFilteredTutors] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSubject, setSelectedSubject] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("rating")

    useEffect(() => {
        fetchTutors()
    }, [selectedSubject, sortBy])

    useEffect(() => {
        filterAndSortTutors()
    }, [tutors, searchQuery])

    const fetchTutors = async () => {
        try {
            setLoading(true)
            // Use the new dedicated tutors API endpoint with query parameters
            const response = await api.get("/api/tutors", {
                params: {
                    subject: selectedSubject !== "all" ? selectedSubject : null,
                    sortBy: sortBy,
                    onlineOnly: true,
                },
            })
            setTutors(response.data)
        } catch (error) {
            console.error("Error fetching tutors:", error)
        } finally {
            setLoading(false)
        }
    }

    const filterAndSortTutors = useCallback(() => {
        let filtered = [...tutors]

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (tutor) =>
                    `${tutor.firstName} ${tutor.lastName}`
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    tutor.bio
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    tutor.subjects?.some((subject) =>
                        subject
                            .toLowerCase()
                            .replace(/_/g, " ")
                            .includes(searchQuery.toLowerCase())
                    )
            )
        }

        // Filter by subject
        if (selectedSubject !== "all") {
            filtered = filtered.filter((tutor) =>
                tutor.subjects?.includes(selectedSubject as Subject)
            )
        }

        // Sort tutors
        // filtered.sort((a, b) => {
        //     switch (sortBy) {
        //         case "rating":
        //             return (b.rating || 0) - (a.rating || 0)
        //         case "sessions":
        //             return (b.totalSessions || 0) - (a.totalSessions || 0)
        //         case "price_low":
        //             return (a.hourlyRate || 0) - (b.hourlyRate || 0)
        //         case "price_high":
        //             return (b.hourlyRate || 0) - (a.hourlyRate || 0)
        //         default:
        //             return (b.rating || 0) - (a.rating || 0)
        //     }
        // })

        setFilteredTutors(filtered)
    }, [tutors, searchQuery, selectedSubject, sortBy])

    const [selectedTutor, setSelectedTutor] = useState<User | null>(null)
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)

    const handleConnectTutor = (tutor: User) => {
        setSelectedTutor(tutor)
        setIsCallModalOpen(true)
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to browse tutors.</p>
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
                            Browse Available Tutors
                        </h1>
                        <p className="text-slate-600">
                            Connect with online tutors ready to help you right
                            now
                        </p>
                    </div>

                    {/* Filters */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search tutors..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>

                                {/* Subject Filter */}
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
                                        {subjectsList.map((subject) => (
                                            <SelectItem
                                                key={subject}
                                                value={subject}
                                            >
                                                {subject.replace(/_/g, " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Sort By */}
                                {/*<Select
                                    value={sortBy}
                                    onValueChange={setSortBy}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rating">
                                            Highest Rated
                                        </SelectItem>
                                        <SelectItem value="sessions">
                                            Most Sessions
                                        </SelectItem>
                                        <SelectItem value="price_low">
                                            Price: Low to High
                                        </SelectItem>
                                        <SelectItem value="price_high">
                                            Price: High to Low
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                */}

                                {/* Results Count */}
                                <div className="flex items-center text-sm text-slate-600">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {filteredTutors.length} tutors found
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="h-20 bg-slate-200 rounded mb-4"></div>
                                        <div className="h-4 bg-slate-200 rounded mb-2"></div>
                                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Tutors Grid */}
                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Tutor Cards */}
                            {filteredTutors.map((tutor) => (
                                <Card
                                    key={tutor.id}
                                    className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 group"
                                >
                                    <CardContent className="p-6">
                                        {/* Header with Avatar and Name */}
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                                                    {tutor.firstName?.[0]}
                                                    {tutor.lastName?.[0]}
                                                </div>
                                                {tutor.isOnline && (
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-slate-800 truncate">
                                                        {tutor.firstName}{" "}
                                                        {tutor.lastName}
                                                    </h3>
                                                    {tutor.isOnline && (
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                                    )}
                                                </div>
                                                {/* <div className="flex items-center space-x-1 mt-1">
                                                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {tutor.rating?.toFixed(
                                                            1
                                                        ) || "0.0"}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        (
                                                        {tutor.totalSessions ||
                                                            0}
                                                        )
                                                    </span>
                                                </div> */}
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                            {tutor.bio ||
                                                "Experienced tutor ready to help you succeed."}
                                        </p>

                                        {/* Subjects */}
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {tutor.subjects
                                                    ?.slice(0, 2)
                                                    .map((subject) => (
                                                        <Badge
                                                            key={subject}
                                                            variant="secondary"
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            {subject.replace(
                                                                /_/g,
                                                                " "
                                                            )}
                                                        </Badge>
                                                    ))}
                                                {(tutor.subjects?.length || 0) >
                                                    2 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs px-2 py-1"
                                                    >
                                                        +
                                                        {(tutor.subjects
                                                            ?.length || 0) - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3" />
                                                <span>Online</span>
                                            </div>
                                            {/* <div className="flex items-center space-x-1">
                                                <DollarSign className="h-3 w-3" />
                                                <span className="font-medium">
                                                    ₹{Math.round((tutor.hourlyRate || 0) * 83)}/hr
                                                </span>
                                            </div> */}
                                        </div>

                                        {/* Action Button */}
                                        <Button
                                            onClick={() =>
                                                handleConnectTutor(tutor)
                                            }
                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                            size="sm"
                                        >
                                            <Video className="h-4 w-4 mr-2" />
                                            🚀 Start Video Call
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && filteredTutors.length === 0 && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                    No tutors found
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    Try adjusting your search criteria or
                                    filters
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedSubject("all")
                                        setSortBy("rating")
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Video Call Modal */}
            {selectedTutor && (
                <VideoCallModal
                    isOpen={isCallModalOpen}
                    onClose={() => setIsCallModalOpen(false)}
                    tutorId={selectedTutor.id}
                    tutorName={`${selectedTutor.firstName} ${selectedTutor.lastName}`}
                    sessionId={`tutor_${selectedTutor.id}_student_${
                        user.id
                    }_${Date.now()}`}
                />
            )}
        </div>
    )
}
