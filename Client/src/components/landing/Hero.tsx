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
    Clock,
} from "lucide-react"

export function Hero() {
    return (
        <section className="relative w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
                    {/* Content Section */}
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        {/* Main heading */}
                        <div className="mb-8 sm:mb-10 lg:mb-12">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-wide uppercase">
                                <span className="block text-black mb-4 sm:mb-6 lg:mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                    Master Any Subject
                                </span>
                                <span className="inline-block text-black bg-yellow-400 px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_black] transform rotate-[-2deg]">
                                    With NerdsOnCall
                                </span>
                            </h1>
                        </div>

                        {/* Subheading */}
                        <div className="mb-10 sm:mb-12 lg:mb-16">
                            <p className="text-lg sm:text-xl lg:text-2xl text-black font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_black] transform rotate-[1deg]">
                                Connect with elite tutors instantly for
                                personalized learning sessions featuring live
                                video calls, interactive whiteboards, and
                                premium tools for academic excellence.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 justify-center lg:justify-start mb-12 sm:mb-16 lg:mb-20">
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
                    </div>

                    {/* Image Section */}
                    <div className="flex justify-center items-center order-1 lg:order-2">
                        <div className="relative">
                            <img
                                src="/Nerd1.png"
                                alt="Master Any Subject Illustration"
                                className="w-full max-w-lg h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
