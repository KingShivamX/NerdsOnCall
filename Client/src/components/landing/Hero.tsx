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
                <div className="mt-8 sm:mt-12 lg:mt-16 mb-8 sm:mb-10 lg:mb-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-wide uppercase">
                        <span className="block text-black mb-4 sm:mb-6 lg:mb-8 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            Master Any Subject
                        </span>
                        <span className="inline-block text-black bg-yellow-400 px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_black] transform rotate-[-2deg]">
                            With NerdsOnCall
                        </span>
                    </h1>
                </div>

                {/* Subheading with reduced spacing */}
                <div className="mb-10 sm:mb-12 lg:mb-16">
                    <p className="text-lg sm:text-xl lg:text-2xl text-black font-bold max-w-4xl mx-auto leading-relaxed bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_black] transform rotate-[1deg] text-center">
                        Connect with elite tutors instantly for personalized
                        learning sessions featuring live video calls,
                        interactive whiteboards, and premium tools for academic
                        excellence.
                    </p>
                </div>

                {/* Action buttons with reduced spacing */}
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 justify-center mb-12 sm:mb-16 lg:mb-20">
                    <Link href="/auth/register?role=student">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full sm:w-auto sm:min-w-[250px] h-16 text-lg group"
                        >
                            <Crown className="mr-3 h-6 w-6 text-yellow-400" />
                            Start Learning Now
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/auth/register?role=tutor">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full sm:w-auto sm:min-w-[250px] h-16 text-lg"
                        >
                            <Star className="mr-3 h-6 w-6 text-black" />
                            Become Elite Tutor
                        </Button>
                    </Link>
                </div>
                {/* Features showcase with reduced spacing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
                    <div className="bg-pink-300 p-6 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_black] transition-all duration-100">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-black border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center mb-4">
                                <Video className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-black mb-4 uppercase tracking-wide">
                            HD Video Calls
                        </h3>
                        <p className="text-sm sm:text-base text-black font-bold leading-relaxed">
                            Crystal-clear video sessions with professional-grade
                            audio for an immersive learning experience
                        </p>
                    </div>

                    <div className="bg-cyan-300 p-6 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_black] transition-all duration-100">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-black border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center mb-4">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-black mb-4 uppercase tracking-wide">
                            Smart Whiteboard
                        </h3>
                        <p className="text-sm sm:text-base text-black font-bold leading-relaxed">
                            Interactive collaborative canvas with advanced
                            drawing tools and mathematical equation support
                        </p>
                    </div>

                    <div className="bg-lime-300 p-6 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_black] transition-all duration-100">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-black border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-black mb-4 uppercase tracking-wide">
                            Elite Tutors
                        </h3>
                        <p className="text-sm sm:text-base text-black font-bold leading-relaxed">
                            Handpicked expert tutors from top universities with
                            proven track records of student success
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
