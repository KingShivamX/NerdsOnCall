import Link from "next/link"
import { Button } from "../ui/Button"
import { ArrowRight, Video, Users, BookOpen } from "lucide-react"

export function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        Get Instant Help with
                        <span className="text-primary"> Live Tutoring</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Connect with expert tutors instantly for live
                        doubt-solving sessions with video calls, shared
                        whiteboard, and screen sharing. Learn effectively,
                        anytime, anywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/auth/register?role=student">
                            <Button size="lg" className="group">
                                Start Learning
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/auth/register?role=tutor">
                            <Button variant="outline" size="lg">
                                Become a Tutor
                            </Button>
                        </Link>
                    </div>

                    {/* Features Icons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-100 p-3 rounded-full mb-3">
                                <Video className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">
                                Live Video Calls
                            </h3>
                            <p className="text-sm text-gray-600">
                                Face-to-face learning experience
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-green-100 p-3 rounded-full mb-3">
                                <BookOpen className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">
                                Interactive Canvas
                            </h3>
                            <p className="text-sm text-gray-600">
                                Shared whiteboard for collaboration
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-purple-100 p-3 rounded-full mb-3">
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">
                                Expert Tutors
                            </h3>
                            <p className="text-sm text-gray-600">
                                Qualified tutors across all subjects
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
            </div>
        </section>
    )
}
