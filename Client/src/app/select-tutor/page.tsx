"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Star,
  MessageCircle,
  ArrowLeft,
  AlertCircle,
  Clock,
  BookOpen,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface Tutor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  rating: number;
  isOnline: boolean;
  profilePicture?: string;
  bio?: string;
  experience?: string;
}

export default function SelectTutorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sessionStatus, setSessionStatus] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    if (user && user.role === "STUDENT") {
      fetchTutors();
      fetchSessionStatus();
    }
  }, [user]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/tutors");
      setTutors(response.data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionStatus = async () => {
    try {
      setLoadingSession(true);
      const response = await api.get("/subscriptions/session-status");
      setSessionStatus(response.data);
    } catch (error: any) {
      console.error("Error fetching session status:", error);
      // Set a default state for no subscription
      setSessionStatus({
        hasActiveSubscription: false,
        message: "Unable to load subscription status",
        canAskDoubt: false,
      });

      // Show error toast only if it's not a 401 (which might mean no subscription)
      if (error.response?.status !== 401) {
        toast.error("Failed to load subscription status");
      }
    } finally {
      setLoadingSession(false);
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      `${tutor.firstName} ${tutor.lastName}`
        .toLowerCase()
        .includes(searchLower) ||
      tutor.subjects.some((subject) =>
        subject.toLowerCase().includes(searchLower)
      );

    const matchesSubject =
      selectedSubject === "all" || tutor.subjects.includes(selectedSubject);

    return matchesSearch && matchesSubject;
  });

  const handleAskDoubt = (tutorId: number) => {
    // If session status is not loaded yet, allow the attempt (backend will validate)
    if (loadingSession) {
      toast.error("Please wait while we load your subscription status...");
      return;
    }

    // Check session limits before allowing doubt submission
    if (sessionStatus && !sessionStatus.hasActiveSubscription) {
      toast.error(
        "You need an active subscription to ask doubts. Please subscribe to a plan first."
      );
      router.push("/pricing");
      return;
    }

    if (sessionStatus && !sessionStatus.canAskDoubt) {
      toast.error(
        `Daily session limit reached! You have used ${sessionStatus.sessionsUsed} out of ${sessionStatus.sessionsLimit} allowed doubts for today. Your limit will reset at 12:00 AM.`
      );
      return;
    }

    // If no session status (error case), let the backend handle validation
    router.push(`/ask-question?tutorId=${tutorId}`);
  };

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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                Select a Tutor
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Choose a tutor to ask your doubt. Each tutor specializes in
                different subjects and can provide personalized solutions.
              </p>
            </div>
          </div>

          {/* Session Status */}
          {!loadingSession && sessionStatus && (
            <Card className="mb-6">
              <CardContent className="p-4">
                {sessionStatus.hasActiveSubscription ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            sessionStatus.canAskDoubt
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="font-medium text-slate-800">
                          {sessionStatus.planName} Plan
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {sessionStatus.sessionsUsed} /{" "}
                        {sessionStatus.sessionsLimit} sessions used today
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-slate-700">
                        {sessionStatus.sessionsRemaining} remaining
                      </div>
                      {!sessionStatus.canAskDoubt && (
                        <Badge variant="destructive" className="text-xs">
                          Limit Reached
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <span className="font-medium text-slate-800">
                        No Active Subscription
                      </span>
                    </div>
                    <Link href="/pricing">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Subscribe Now
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search tutors by name or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="MATHEMATICS">Mathematics</SelectItem>
                    <SelectItem value="PHYSICS">Physics</SelectItem>
                    <SelectItem value="CHEMISTRY">Chemistry</SelectItem>
                    <SelectItem value="BIOLOGY">Biology</SelectItem>
                    <SelectItem value="COMPUTER_SCIENCE">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="ENGLISH">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-slate-600">
                  <Filter className="h-4 w-4 mr-2" />
                  {filteredTutors.length} tutors available
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Offline</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutors Grid */}
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading tutors...</p>
              </CardContent>
            </Card>
          ) : filteredTutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <Card
                  key={tutor.id}
                  className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {tutor.firstName[0]}
                          {tutor.lastName[0]}
                        </div>
                        {tutor.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-lg">
                          {tutor.firstName} {tutor.lastName}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-slate-600">
                            {tutor.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({tutor.isOnline ? "Online" : "Offline"})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Subjects */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.slice(0, 3).map((subject, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {subject.replace(/_/g, " ")}
                          </Badge>
                        ))}
                        {tutor.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tutor.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {tutor.bio && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {tutor.bio}
                      </p>
                    )}

                    {/* Ask Doubt Button */}
                    <Button
                      onClick={() => handleAskDoubt(tutor.id)}
                      disabled={
                        loadingSession ||
                        (sessionStatus && !sessionStatus.canAskDoubt)
                      }
                      className={`w-full font-medium py-2 rounded-xl shadow-lg transition-all ${
                        sessionStatus?.canAskDoubt && !loadingSession
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl"
                          : "bg-gray-400 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {loadingSession
                        ? "Loading..."
                        : !sessionStatus
                        ? "Ask a Doubt"
                        : !sessionStatus.hasActiveSubscription
                        ? "Subscribe Required"
                        : !sessionStatus.canAskDoubt
                        ? "Limit Reached"
                        : "Ask a Doubt"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  No Tutors Found
                </h3>
                <p className="text-slate-600 mb-6">
                  No tutors match your search criteria. Try adjusting your
                  filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubject("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
