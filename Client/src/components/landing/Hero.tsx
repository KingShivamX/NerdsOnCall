import Link from "next/link"
import { Button } from "../ui/Button"
import { Badge } from "../ui/badge"
import {
    Crown,
    Video,
    Users,
    BookOpen,
    Sparkles,
    Star,
    ArrowRight,
    Play,
} from "lucide-react"

export function Hero() {
    return (
        <section className="relative w-full bg-transparent">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Main heading with better mobile spacing */}
                <div className="mt-16 mb-8 px-2 sm:px-0">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span className="block text-slate-800 mb-2 px-2 sm:px-0">
                            Master Any Subject
                        </span>
                        <span className="block text-slate-700 mt-2 px-2 sm:px-0">
                            With NerdsOnCall
                        </span>
                    </h1>
                </div>

                {/* Subheading with mobile optimization */}
                <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
                    Connect with elite tutors instantly for personalized
                    learning sessions featuring live video calls, interactive
                    whiteboards, and premium tools for academic excellence.
                </p>

                {/* Action buttons with better mobile spacing */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4 sm:px-0">
                    <Link href="/auth/register?role=student">
                        <Button
                            size="lg"
                            className="bg-slate-700 hover:bg-slate-800 text-white border-0 px-8 py-3 text-base font-semibold w-full sm:w-auto sm:min-w-[200px] h-12 group transition-all duration-200"
                        >
                            <Crown className="mr-2 h-4 w-4 text-amber-400 group-hover:animate-bounce" />
                            Start Learning Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/auth/register?role=tutor">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-slate-300 text-slate-700 hover:text-slate-800 hover:bg-slate-50 px-8 py-3 text-base font-semibold w-full sm:w-auto sm:min-w-[200px] h-12 group transition-all duration-200"
                        >
                            <Star className="mr-2 h-4 w-4 text-amber-500" />
                            Become Elite Tutor
                        </Button>
                    </Link>
                </div>

                {/* Demo Button */}
                <div className="mb-12 px-4 sm:px-0">
                    <Button
                        variant="ghost"
                        className="text-slate-700 hover:text-slate-800 hover:bg-slate-50 font-medium text-sm"
                    >
                        <Play className="mr-2 h-4 w-4" />
                        Watch Demo Video
                    </Button>
                </div>

                {/* Features showcase with enhanced mobile design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-0">
                    <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/30 hover:shadow-lg transition-all duration-300">
                        <div className="mb-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                <Video className="h-6 w-6 text-slate-700" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            HD Video Calls
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Crystal-clear video sessions with professional-grade
                            audio for an immersive learning experience
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/30 hover:shadow-lg transition-all duration-300">
                        <div className="mb-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                <BookOpen className="h-6 w-6 text-slate-700" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            Smart Whiteboard
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Interactive collaborative canvas with advanced
                            drawing tools and mathematical equation support
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/30 hover:shadow-lg transition-all duration-300">
                        <div className="mb-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                <Users className="h-6 w-6 text-slate-700" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            Elite Tutors
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Handpicked expert tutors from top universities with
                            proven track records of student success
                        </p>
                    </div>
                </div>

                {/* Trust indicators with mobile optimization */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-slate-500 px-4 sm:px-0">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-4 h-4 fill-amber-400 text-amber-400"
                                />
                            ))}
                        </div>
                        <span className="font-medium text-sm text-center sm:text-left">
                            Rated 4.9/5 by 10,000+ students
                        </span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span className="font-medium text-sm text-center sm:text-left">
                        Trusted by students from 50+ countries
                    </span>
                    <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span className="font-medium text-sm text-center sm:text-left">
                        24/7 Expert Support Available
                    </span>
                </div>

                {/* Quick stats with improved mobile layout */}
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-3xl mx-auto px-4 sm:px-0">
                    <div className="text-center p-2">
                        <div className="text-2xl font-bold text-slate-700 mb-1">
                            50K+
                        </div>
                        <div className="text-xs text-slate-600">
                            Active Students
                        </div>
                    </div>
                    <div className="text-center p-2">
                        <div className="text-2xl font-bold text-slate-700 mb-1">
                            5K+
                        </div>
                        <div className="text-xs text-slate-600">
                            Expert Tutors
                        </div>
                    </div>
                    <div className="text-center p-2">
                        <div className="text-2xl font-bold text-slate-700 mb-1">
                            99.9%
                        </div>
                        <div className="text-xs text-slate-600">Uptime</div>
                    </div>
                    <div className="text-center p-2">
                        <div className="text-2xl font-bold text-slate-700 mb-1">
                            24/7
                        </div>
                        <div className="text-xs text-slate-600">Support</div>
                    </div>
                </div>
            </div>

            {/* Simplified floating elements */}
            <div className="absolute top-1/4 left-8 w-3 h-3 bg-slate-400 rounded-full animate-bounce opacity-40"></div>
            <div
                className="absolute top-1/3 right-12 w-2 h-2 bg-slate-400 rounded-full animate-bounce opacity-40"
                style={{ animationDelay: "1s" }}
            ></div>
            <div
                className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-slate-400 rounded-full animate-bounce opacity-40"
                style={{ animationDelay: "2s" }}
            ></div>
        </section>
    )
}
