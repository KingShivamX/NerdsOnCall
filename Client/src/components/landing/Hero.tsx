import Link from "next/link"
import { Button } from "../ui/Button"
import {
    Crown,
    Video,
    Users,
    BookOpen,
    Star,
    ArrowRight,
    Play,
} from "lucide-react"

export function Hero() {
    return (
        <section className="relative w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
                {/* Main heading with reduced spacing */}
                <div className="mt-8 sm:mt-12 lg:mt-16 mb-6 sm:mb-8 lg:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                        <span className="block text-slate-800 mb-2 sm:mb-3 lg:mb-4">
                            Master Any Subject
                        </span>
                        <span className="block text-slate-600">
                            With NerdsOnCall
                        </span>
                    </h1>
                </div>

                {/* Subheading with reduced spacing */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                        Connect with elite tutors instantly for personalized
                        learning sessions featuring live video calls,
                        interactive whiteboards, and premium tools for academic
                        excellence.
                    </p>
                </div>

                {/* Action buttons with reduced spacing */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center mb-10 sm:mb-12 lg:mb-16">
                    <Link href="/auth/register?role=student">
                        <Button
                            size="lg"
                            className="bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-950 text-white border-0 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold w-full sm:w-auto sm:min-w-[200px] h-10 sm:h-12 group transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        >
                            <Crown className="mr-2 h-4 w-4 text-amber-400" />
                            Start Learning Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/auth/register?role=tutor">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-slate-300 hover:border-slate-400 focus:border-slate-500 text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-50 focus:bg-slate-100 active:bg-slate-200 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold w-full sm:w-auto sm:min-w-[200px] h-10 sm:h-12 transition-all duration-200 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        >
                            <Star className="mr-2 h-4 w-4 text-amber-500" />
                            Become Elite Tutor
                        </Button>
                    </Link>
                </div>

                {/* Demo Button with reduced spacing */}
                <div className="mb-12 sm:mb-16 lg:mb-20">
                    <Button
                        variant="ghost"
                        className="text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-100 focus:bg-slate-200 active:bg-slate-300 font-medium text-xs sm:text-sm px-4 sm:px-6 py-2 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    >
                        <Play className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Watch Demo Video
                    </Button>
                </div>

                {/* Features showcase with reduced spacing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16 lg:mb-20">
                    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-slate-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3 sm:mb-4">
                                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
                            </div>
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 mb-2 sm:mb-3">
                            HD Video Calls
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                            Crystal-clear video sessions with professional-grade
                            audio for an immersive learning experience
                        </p>
                    </div>

                    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-slate-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3 sm:mb-4">
                                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
                            </div>
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 mb-2 sm:mb-3">
                            Smart Whiteboard
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                            Interactive collaborative canvas with advanced
                            drawing tools and mathematical equation support
                        </p>
                    </div>

                    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-slate-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3 sm:mb-4">
                                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
                            </div>
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 mb-2 sm:mb-3">
                            Elite Tutors
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                            Handpicked expert tutors from top universities with
                            proven track records of student success
                        </p>
                    </div>
                </div>

                {/* Trust indicators with reduced spacing */}
                <div className="mb-10 sm:mb-12 lg:mb-16">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <span className="font-medium">
                                Rated 4.9/5 by 10,000+ students
                            </span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                        <span className="font-medium">
                            Trusted by students from 50+ countries
                        </span>
                        <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                        <span className="font-medium">
                            24/7 Expert Support Available
                        </span>
                    </div>
                </div>

                {/* Quick stats with reduced spacing */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-3xl mx-auto">
                    <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                            50K+
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">
                            Active Students
                        </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                            5K+
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">
                            Expert Tutors
                        </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                            99.9%
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">
                            Uptime
                        </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 lg:p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                            24/7
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">
                            Support
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
