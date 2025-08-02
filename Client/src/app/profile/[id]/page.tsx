"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DoubtForm } from "@/components/Doubt/DoubtForm"
import {
    User,
    Mail,
    Phone,
    Calendar,
    Star,
    BookOpen,
    Clock,
    DollarSign,
    Crown,
    Award,
    TrendingUp,
    Users,
    MessageSquare,
    Video,
    ArrowLeft,
    CheckCircle,
    MapPin,
} from "lucide-react"
import { Subject } from "@/types"
import toast from "react-hot-toast"
import { useRouter, useParams } from "next/navigation"

export default function PublicProfilePage() {
    const { user } = useAuth()
    const router = useRouter()
    const params = useParams()
    const userId = params.id as string

    const [profileData, setProfileData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<any>(null)
    const [reviews, setReviews] = useState<any[]>([])
    const [isDoubtFormOpen, setIsDoubtFormOpen] = useState(false)

    useEffect(() => {
        if (userId) {
            fetchProfileData()
            fetchUserStats()
            fetchUserReviews()
        }
    }, [userId])

    const fetchProfileData = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/users/${userId}`)
            setProfileData(response.data)
        } catch (error: any) {
            console.error("Error fetching profile:", error)
            if (error.response?.status === 404) {
                toast.error("User not found")
                router.push("/browse-tutors")
            } else {
                toast.error("Failed to load profile data")
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchUserStats = async () => {
        try {
            const response = await api.get(`/users/${userId}/stats`)
            setStats(response.data)
        } catch (error) {
            console.error("Error fetching stats:", error)
        }
    }

    const fetchUserReviews = async () => {
        try {
            const response = await api.get(`/users/${userId}/reviews`)
            setReviews(response.data)
        } catch (error: any) {
            console.error("Error fetching reviews:", error)
            // If it's a 400 error (not a tutor), just set empty reviews
            if (error.response?.status === 400) {
                setReviews([])
            }
        }
    }

    const handleStartVideoCall = () => {
        if (!user) {
            toast.error("Please log in to start a video call")
            router.push("/auth/login")
            return
        }

        if (user.role !== "STUDENT") {
            toast.error("Only students can start video calls with tutors")
            return
        }

        // Generate session ID and navigate to video call
        const sessionId = `tutor_${profileData.id}_student_${
            user.id
        }_${Date.now()}`
        router.push(
            `/video-call/${sessionId}?tutorId=${
                profileData.id
            }&tutorName=${encodeURIComponent(
                `${profileData.firstName} ${profileData.lastName}`
            )}`
        )
    }

    const handleAskDoubt = () => {
        if (!user) {
            toast.error("Please log in to ask a doubt")
            router.push("/auth/login")
            return
        }

        if (user.role !== "STUDENT") {
            toast.error("Only students can ask doubts")
            return
        }

        setIsDoubtFormOpen(true)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-20 pb-10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                            <div className="h-64 bg-slate-200 rounded mb-6"></div>
                            <div className="h-32 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-20 pb-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-2xl font-bold text-slate-800 mb-4">
                            Profile Not Found
                        </h1>
                        <p className="text-slate-600 mb-6">
                            The profile you're looking for doesn't exist or has
                            been removed.
                        </p>
                        <Button onClick={() => router.push("/browse-tutors")}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Browse Tutors
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const isTutor = profileData.role === "TUTOR"
    const isOwnProfile = user?.id === profileData.id

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-20 pb-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    {profileData.firstName}{" "}
                                    {profileData.lastName}'s Profile
                                </h1>
                                <p className="text-slate-600">
                                    {isTutor ? "Professional Tutor" : "Student"}{" "}
                                    • Member since{" "}
                                    {new Date(
                                        profileData.createdAt
                                    ).getFullYear()}
                                </p>
                            </div>
                            {isOwnProfile && (
                                <Button
                                    onClick={() => router.push("/profile")}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Summary Card */}
                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                                            {profileData.firstName?.[0]}
                                            {profileData.lastName?.[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h2 className="text-2xl font-bold text-slate-800">
                                                    {profileData.firstName}{" "}
                                                    {profileData.lastName}
                                                </h2>
                                                <Badge
                                                    variant={
                                                        isTutor
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className={`${
                                                        isTutor
                                                            ? "bg-slate-700 text-white"
                                                            : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    {isTutor && (
                                                        <Crown className="w-4 h-4 mr-1" />
                                                    )}
                                                    {profileData.role}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        profileData.isOnline
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className={
                                                        profileData.isOnline
                                                            ? "bg-green-500 text-white"
                                                            : "bg-slate-200 text-slate-700"
                                                    }
                                                >
                                                    {profileData.isOnline
                                                        ? "Online"
                                                        : "Offline"}
                                                </Badge>
                                            </div>

                                            {isTutor && (
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-5 w-5 text-amber-500 fill-current" />
                                                        <span className="font-semibold text-lg">
                                                            {profileData.rating?.toFixed(
                                                                1
                                                            ) || "0.0"}
                                                        </span>
                                                        <span className="text-slate-600">
                                                            (
                                                            {profileData.totalSessions ||
                                                                0}{" "}
                                                            sessions)
                                                        </span>
                                                    </div>
                                                    {profileData.hourlyRate && (
                                                        <div className="flex items-center space-x-1">
                                                            <DollarSign className="h-4 w-4 text-green-600" />
                                                            <span className="font-medium">
                                                                ₹
                                                                {
                                                                    profileData.hourlyRate
                                                                }
                                                                /hour
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-slate-700">
                                                {profileData.bio ||
                                                    "No bio available."}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <User className="h-5 w-5 mr-2" />
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-700">
                                            {profileData.email}
                                        </span>
                                    </div>
                                    {profileData.phoneNumber && (
                                        <div className="flex items-center space-x-3">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-700">
                                                {profileData.phoneNumber}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-700">
                                            Member since{" "}
                                            {new Date(
                                                profileData.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subjects (for tutors) */}
                            {isTutor &&
                                profileData.subjects &&
                                profileData.subjects.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <BookOpen className="h-5 w-5 mr-2" />
                                                Subjects Taught
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.subjects.map(
                                                    (subject: Subject) => (
                                                        <Badge
                                                            key={subject}
                                                            variant="secondary"
                                                            className="text-sm"
                                                        >
                                                            {subject.replace(
                                                                /_/g,
                                                                " "
                                                            )}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Reviews Section (for tutors) */}
                            {isTutor && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <MessageSquare className="h-5 w-5 mr-2" />
                                            Student Reviews
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {reviews.length > 0 ? (
                                            <div className="space-y-4">
                                                {reviews
                                                    .slice(0, 3)
                                                    .map((review, index) => (
                                                        <div
                                                            key={index}
                                                            className="border-l-4 border-blue-200 pl-4 py-2"
                                                        >
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="flex items-center space-x-1">
                                                                    {[
                                                                        ...Array(
                                                                            5
                                                                        ),
                                                                    ].map(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <Star
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={`h-4 w-4 ${
                                                                                    i <
                                                                                    review.rating
                                                                                        ? "text-amber-500 fill-current"
                                                                                        : "text-slate-300"
                                                                                }`}
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                                <span className="text-sm text-slate-600">
                                                                    by{" "}
                                                                    {
                                                                        review.studentName
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-slate-400">
                                                                    {new Date(
                                                                        review.createdAt
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-700 text-sm">
                                                                {review.comment}
                                                            </p>
                                                        </div>
                                                    ))}
                                                {reviews.length > 3 && (
                                                    <p className="text-sm text-slate-500 text-center">
                                                        And {reviews.length - 3}{" "}
                                                        more reviews...
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 text-center py-4">
                                                No reviews yet
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Stats & Actions */}
                        <div className="space-y-6">
                            {/* Action Buttons */}
                            {!isOwnProfile &&
                                user &&
                                user.role === "STUDENT" &&
                                isTutor && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Connect with{" "}
                                                {profileData.firstName}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Button
                                                onClick={handleStartVideoCall}
                                                className="w-full bg-green-600 hover:bg-green-700"
                                                disabled={!profileData.isOnline}
                                            >
                                                <Video className="h-4 w-4 mr-2" />
                                                {profileData.isOnline
                                                    ? "Start Video Call"
                                                    : "Tutor Offline"}
                                            </Button>
                                            <Button
                                                onClick={handleAskDoubt}
                                                className="w-full"
                                                variant="outline"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Ask a Doubt
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Stats Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <TrendingUp className="h-5 w-5 mr-2" />
                                        {isTutor
                                            ? "Teaching Stats"
                                            : "Learning Stats"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {isTutor ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">
                                                    Total Sessions
                                                </span>
                                                <span className="font-medium">
                                                    {profileData.totalSessions ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">
                                                    Average Rating
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                                                    <span className="font-medium">
                                                        {profileData.rating?.toFixed(
                                                            1
                                                        ) || "0.0"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">
                                                    Total Earnings
                                                </span>
                                                <span className="font-medium">
                                                    ₹
                                                    {profileData.totalEarnings?.toFixed(
                                                        2
                                                    ) || "0.00"}
                                                </span>
                                            </div>
                                            {stats && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600">
                                                            This Month
                                                        </span>
                                                        <span className="font-medium">
                                                            {stats.sessionsThisMonth ||
                                                                0}{" "}
                                                            sessions
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600">
                                                            Response Rate
                                                        </span>
                                                        <span className="font-medium">
                                                            {stats.responseRate ||
                                                                "N/A"}
                                                            %
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {stats && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600">
                                                            Questions Asked
                                                        </span>
                                                        <span className="font-medium">
                                                            {stats.questionsAsked ||
                                                                0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600">
                                                            Sessions Attended
                                                        </span>
                                                        <span className="font-medium">
                                                            {stats.sessionsAttended ||
                                                                0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600">
                                                            Doubts Resolved
                                                        </span>
                                                        <span className="font-medium">
                                                            {stats.doubtsResolved ||
                                                                0}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Achievements (for tutors) */}
                            {isTutor && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Award className="h-5 w-5 mr-2" />
                                            Achievements
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {profileData.totalSessions >= 10 && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Experienced Tutor
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        Completed 10+ sessions
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {profileData.rating >= 4.5 && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                                    <Star className="h-5 w-5 text-amber-600 fill-current" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Top Rated
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        4.5+ star rating
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {profileData.totalSessions >= 50 && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Crown className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Master Tutor
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        Completed 50+ sessions
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {(!profileData.totalSessions ||
                                            profileData.totalSessions < 10) && (
                                            <p className="text-slate-500 text-sm text-center py-4">
                                                No achievements yet
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Availability (for tutors) */}
                            {isTutor && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Clock className="h-5 w-5 mr-2" />
                                            Availability
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center">
                                            <div
                                                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                                    profileData.isOnline
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                <Clock className="h-8 w-8" />
                                            </div>
                                            <p className="font-medium">
                                                {profileData.isOnline
                                                    ? "Available Now"
                                                    : "Currently Offline"}
                                            </p>
                                            <p className="text-sm text-slate-600 mt-1">
                                                {profileData.isOnline
                                                    ? "Ready to help with your questions"
                                                    : "Will be back soon"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Doubt Form Modal */}
            {isDoubtFormOpen && (
                <DoubtForm
                    isOpen={isDoubtFormOpen}
                    onClose={() => setIsDoubtFormOpen(false)}
                    tutorId={profileData.id}
                    tutorName={`${profileData.firstName} ${profileData.lastName}`}
                    onSubmitSuccess={() => {
                        setIsDoubtFormOpen(false)
                        toast.success("Doubt sent successfully!")
                    }}
                    flowType="browse-tutors"
                />
            )}
            <Footer />
        </div>
    )
}
