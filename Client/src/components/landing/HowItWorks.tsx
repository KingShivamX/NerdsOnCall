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
            title: "Create Your Elite Profile",
            description:
                "Sign up in seconds and tell us about your learning goals, subjects, and preferred learning style.",
            icon: UserPlus,
            details: [
                "Quick 2-minute signup",
                "Learning preference quiz",
                "Goal setting wizard",
            ],
        },
        {
            step: 2,
            title: "Find Your Perfect Tutor",
            description:
                "Our AI-powered matching system connects you with elite tutors who specialize in your subjects.",
            icon: Search,
            details: [
                "AI-powered matching",
                "Browse tutor profiles",
                "Read reviews & ratings",
            ],
        },
        {
            step: 3,
            title: "Start Premium Sessions",
            description:
                "Jump into HD video calls with interactive whiteboards and professional-grade tools.",
            icon: Video,
            details: [
                "4K video quality",
                "Interactive whiteboard",
                "Screen sharing & recording",
            ],
        },
        {
            step: 4,
            title: "Master Your Subjects",
            description:
                "Track your progress, access session recordings, and achieve academic excellence.",
            icon: Trophy,
            details: [
                "Progress tracking",
                "Session recordings",
                "Achievement badges",
            ],
        },
    ]

    const tutorSteps = [
        {
            step: 1,
            title: "Apply as Elite Tutor",
            description:
                "Complete our rigorous screening process to join our exclusive community of expert educators.",
            icon: Crown,
            details: [
                "Expert verification",
                "Background check",
                "Teaching demonstration",
            ],
        },
        {
            step: 2,
            title: "Build Your Empire",
            description:
                "Create your professional profile showcasing your expertise, credentials, and teaching style.",
            icon: Star,
            details: [
                "Professional profile",
                "Portfolio showcase",
                "Rate setting",
            ],
        },
        {
            step: 3,
            title: "Connect & Teach",
            description:
                "Get matched with students and start earning while making a difference in their education.",
            icon: Users,
            details: [
                "Student matching",
                "Flexible scheduling",
                "Instant notifications",
            ],
        },
        {
            step: 4,
            title: "Earn Premium Income",
            description:
                "Enjoy competitive rates, instant payments, and grow your tutoring business with our platform.",
            icon: Target,
            details: [
                "85% commission",
                "Weekly payouts",
                "Performance bonuses",
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
                        <span className="block text-slate-600">Like Magic</span>
                    </h2>

                    <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Getting started with premium tutoring has never been
                        easier. Follow these simple steps to transform your
                        learning experience.
                    </p>
                </div>

                {/* For Students */}
                <div className="mb-16 sm:mb-20 lg:mb-24">
                    <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 sm:mb-4">
                            For Students
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                            Your journey to academic excellence starts here
                        </p>
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
                        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                            Join our elite community of expert educators
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
                    <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of students and tutors who are already
                        experiencing the future of online education.
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
