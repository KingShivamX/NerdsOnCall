import Link from "next/link"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Crown, Video, Users, BookOpen, Sparkles, Star } from "lucide-react"

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center hero-background overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-gold-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float"></div>
                <div
                    className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-gold-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-gold-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse float"
                    style={{ animationDelay: "4s" }}
                ></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Royal announcement badge */}
                <div className="mb-8 flex justify-center">
                    <Badge
                        variant="secondary"
                        className="premium-glass border-0 text-purple-700 px-6 py-2 text-sm font-medium"
                    >
                        <Crown className="w-4 h-4 mr-2" />
                        Premium Tutoring Experience
                        <Sparkles className="w-4 h-4 ml-2" />
                    </Badge>
                </div>

                {/* Main heading with royal styling */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
                    <span className="block text-gray-900 premium-text-shadow">
                        Master Any Subject
                    </span>
                    <span className="block royal-text mt-2">
                        With Royal Tutoring
                    </span>
                </h1>

                {/* Subheading with premium styling */}
                <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                    Connect with elite tutors instantly for personalized
                    learning sessions featuring
                    <span className="royal-text font-semibold">
                        {" "}
                        live video calls
                    </span>
                    ,
                    <span className="royal-text font-semibold">
                        {" "}
                        interactive whiteboards
                    </span>
                    , and
                    <span className="royal-text font-semibold">
                        {" "}
                        premium tools
                    </span>{" "}
                    for academic excellence.
                </p>

                {/* Premium action buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                    <Link href="/auth/register?role=student">
                        <Button
                            size="lg"
                            className="premium-button text-white border-0 px-8 py-4 text-lg font-semibold min-w-[200px] h-14"
                        >
                            <Crown className="mr-2 h-5 w-5" />
                            Start Learning Now
                        </Button>
                    </Link>
                    <Link href="/auth/register?role=tutor">
                        <Button
                            variant="outline"
                            size="lg"
                            className="premium-glass border-2 border-purple-200 text-purple-700 hover:text-purple-800 px-8 py-4 text-lg font-semibold min-w-[200px] h-14 backdrop-blur-lg"
                        >
                            <Star className="mr-2 h-5 w-5" />
                            Become Elite Tutor
                        </Button>
                    </Link>
                </div>

                {/* Premium features showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="luxury-card p-8 rounded-2xl group hover:scale-105 transition-all duration-300">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto rounded-full royal-gradient flex items-center justify-center mb-4 group-hover:glow transition-all duration-300">
                                <Video className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            4K Video Calls
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Crystal-clear HD video sessions with
                            professional-grade audio for an immersive learning
                            experience
                        </p>
                    </div>

                    <div className="luxury-card p-8 rounded-2xl group hover:scale-105 transition-all duration-300">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto rounded-full royal-gradient flex items-center justify-center mb-4 group-hover:glow transition-all duration-300">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Smart Whiteboard
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            AI-powered collaborative canvas with advanced
                            drawing tools and mathematical equation support
                        </p>
                    </div>

                    <div className="luxury-card p-8 rounded-2xl group hover:scale-105 transition-all duration-300">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto rounded-full royal-gradient flex items-center justify-center mb-4 group-hover:glow transition-all duration-300">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Elite Tutors
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Handpicked expert tutors from top universities with
                            proven track records of student success
                        </p>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                            ))}
                        </div>
                        <span className="font-medium">
                            Rated 4.9/5 by 10,000+ students
                        </span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="font-medium">
                        Trusted by students from 50+ countries
                    </span>
                </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-1/4 left-8 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
            <div
                className="absolute top-1/3 right-12 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "1s" }}
            ></div>
            <div
                className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-yellow-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "3s" }}
            ></div>
        </section>
    )
}
