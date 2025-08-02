import Link from "next/link"
import { Badge } from "../ui/badge"
import { Button } from "../ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import {
    UserPlus,
    Search,
    Video,
    Crown,
    ArrowRight,
    Star,
    CheckCircle,
    Trophy,
    Target,
    Users,
    Zap,
} from "lucide-react"

export function HowItWorks() {
    const studentSteps = [
        {
            step: 1,
            title: "Sign Up & Subscribe",
            description:
                "Create your account and choose a subscription plan to start asking doubts.",
            icon: UserPlus,
            details: [
                "Quick registration",
                "Choose subscription plan",
                "Secure payment with Razorpay",
            ],
        },
        {
            step: 2,
            title: "Ask Your Doubts",
            description:
                "Submit your questions with attachments and select preferred tutors.",
            icon: Search,
            details: [
                "Submit doubt with attachments",
                "Choose specific tutor or broadcast",
                "Set priority level",
            ],
        },
        {
            step: 3,
            title: "Connect via Video Call",
            description:
                "When a tutor accepts your doubt, start an instant video call session for real-time help.",
            icon: Video,
            details: [
                "WebRTC video calls",
                "Real-time communication",
                "Session tracking",
            ],
        },
        {
            step: 4,
            title: "Track Your Progress",
            description:
                "View your session history, hours learned, and manage your subscription from the dashboard.",
            icon: Trophy,
            details: [
                "Session statistics",
                "Hours learned tracking",
                "Subscription management",
            ],
        },
    ]

    const tutorSteps = [
        {
            step: 1,
            title: "Register as Tutor",
            description:
                "Sign up with your expertise subjects and create your tutor profile.",
            icon: Crown,
            details: [
                "Register with subjects",
                "Set hourly rate",
                "Complete profile setup",
            ],
        },
        {
            step: 2,
            title: "Receive Doubt Requests",
            description:
                "Get notified when students submit doubts in your subject areas or request you specifically.",
            icon: Star,
            details: [
                "View available doubts",
                "Subject-based filtering",
                "Direct tutor requests",
            ],
        },
        {
            step: 3,
            title: "Upload Video Solutions",
            description:
                "Create and upload video solutions to help students understand and solve their doubts.",
            icon: Users,
            details: [
                "Record solution videos",
                "Upload via Cloudinary",
                "Provide detailed explanations",
            ],
        },
        {
            step: 4,
            title: "Optional Live Calls & Earnings",
            description:
                "Accept live call requests for additional earnings and track your teaching impact through the dashboard.",
            icon: Target,
            details: [
                "Accept live call requests",
                "Earn from video calls",
                "Track teaching statistics",
            ],
        },
    ]

    return (
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <Badge className="bg-white border border-slate-200 text-slate-700 px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shadow-sm">
                            Simple Process
                        </Badge>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
                        <span className="block text-slate-800 mb-1 sm:mb-2">
                            How It Works
                        </span>
                        <span className="block text-slate-600">
                            Real-Time Doubt Solving
                        </span>
                    </h2>

                    <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed text-center">
                        Connect with expert tutors instantly for doubt
                        resolution through live video calls. Follow these simple
                        steps to get started.
                    </p>
                </div>

                {/* For Students */}
                <div className="mb-16 sm:mb-20 lg:mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
                        {/* Content Section */}
                        <div className="order-2 lg:order-1">
                            <div className="text-center lg:text-left mb-10 sm:mb-12 lg:mb-16">
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-2 sm:mb-4 uppercase tracking-wide">
                                    For Students
                                </h3>
                                <p className="text-sm sm:text-base text-black font-bold max-w-xl mx-auto lg:mx-0 bg-white px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_black]">
                                    Get instant help with your doubts through
                                    live video sessions with expert tutors
                                </p>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="flex justify-center items-center order-1 lg:order-2">
                            <div className="relative">
                                <img
                                    src="/Nerd2.png"
                                    alt="Students Learning Illustration"
                                    className="w-full max-w-md h-auto"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {studentSteps.map((step, index) => (
                            <div key={index} className="relative pt-8 sm:pt-10">
                                {/* Step Number - Fixed positioning to prevent overlap */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm sm:text-base">
                                            {step.step}
                                        </span>
                                    </div>
                                </div>

                                <Card className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 pt-6 sm:pt-8">
                                    <CardHeader className="pt-4 sm:pt-6 pb-3 sm:pb-4 text-center px-4 sm:px-6">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-3 sm:mb-4">
                                            <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-base sm:text-lg font-bold text-slate-800 mb-2 leading-tight">
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="text-center px-4 sm:px-6 pb-4 sm:pb-6">
                                        <CardDescription className="text-slate-600 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm">
                                            {step.description}
                                        </CardDescription>

                                        <div className="space-y-2 sm:space-y-3">
                                            {step.details.map(
                                                (detail, detailIndex) => (
                                                    <div
                                                        key={detailIndex}
                                                        className="flex items-center justify-center text-xs text-slate-500"
                                                    >
                                                        <CheckCircle className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0" />
                                                        {detail}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* For Tutors */}
                <div className="mb-16 sm:mb-20 lg:mb-24">
                    <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 sm:mb-4">
                            For Tutors
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto text-center">
                            Help students solve their doubts and earn through
                            teaching
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {tutorSteps.map((step, index) => (
                            <div key={index} className="relative pt-8 sm:pt-10">
                                {/* Step Number - Fixed positioning to prevent overlap */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm sm:text-base">
                                            {step.step}
                                        </span>
                                    </div>
                                </div>

                                <Card className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 pt-6 sm:pt-8">
                                    <CardHeader className="pt-4 sm:pt-6 pb-3 sm:pb-4 text-center px-4 sm:px-6">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-3 sm:mb-4">
                                            <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-base sm:text-lg font-bold text-slate-800 mb-2 leading-tight">
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="text-center px-4 sm:px-6 pb-4 sm:pb-6">
                                        <CardDescription className="text-slate-600 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm">
                                            {step.description}
                                        </CardDescription>

                                        <div className="space-y-2 sm:space-y-3">
                                            {step.details.map(
                                                (detail, detailIndex) => (
                                                    <div
                                                        key={detailIndex}
                                                        className="flex items-center justify-center text-xs text-slate-500"
                                                    >
                                                        <CheckCircle className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0" />
                                                        {detail}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-white border border-slate-200 p-6 sm:p-8 lg:p-10 rounded-2xl text-center shadow-lg max-w-4xl mx-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 sm:mb-8 rounded-full bg-slate-800 flex items-center justify-center shadow-lg">
                        <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
                        Ready to Get Started?
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed text-center">
                        Start solving your doubts instantly with live video
                        calls and expert tutors available 24/7.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                        <Link href="/auth/register?role=student">
                            <Button className="bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-950 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg w-full sm:w-auto sm:min-w-[200px] shadow-lg group hover:shadow-xl transition-all duration-200 h-10 sm:h-12 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                                <Crown className="mr-2 h-4 w-4 text-amber-400" />
                                Start as Student
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/auth/register?role=tutor">
                            <Button
                                variant="outline"
                                className="border-2 border-slate-300 hover:border-slate-400 focus:border-slate-500 text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-50 focus:bg-slate-100 active:bg-slate-200 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg w-full sm:w-auto sm:min-w-[200px] transition-all duration-300 h-10 sm:h-12 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            >
                                <Star className="mr-2 h-4 w-4 text-amber-500" />
                                Become a Tutor
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
