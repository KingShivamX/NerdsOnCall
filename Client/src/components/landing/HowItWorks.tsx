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
    BookOpen,
    Crown,
    Sparkles,
    ArrowRight,
    Star,
    Zap,
    CheckCircle,
    Trophy,
    Target,
    Users,
    MessageCircle,
} from "lucide-react"

export function HowItWorks() {
    const studentSteps = [
        {
            step: 1,
            title: "Create Your Elite Profile",
            description:
                "Sign up in seconds and tell us about your learning goals, subjects, and preferred learning style.",
            icon: UserPlus,
            gradient: "from-slate-600 to-slate-800",
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
            gradient: "from-slate-600 to-slate-800",
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
            gradient: "from-slate-600 to-slate-800",
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
            gradient: "from-slate-600 to-slate-800",
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
            gradient: "from-slate-600 to-slate-800",
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
            gradient: "from-slate-600 to-slate-800",
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
            gradient: "from-slate-600 to-slate-800",
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
            gradient: "from-slate-600 to-slate-800",
            details: [
                "85% commission",
                "Weekly payouts",
                "Performance bonuses",
            ],
        },
    ]

    return (
        <section className="bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header with mobile optimization */}
                <div className="text-center mb-16 lg:mb-20 px-2 sm:px-0">
                    <div className="flex justify-center mb-5 lg:mb-6">
                        <Badge
                            variant="secondary"
                            className="bg-white/90 border border-slate-200 text-slate-700 px-6 py-2 text-sm font-semibold shadow-sm backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                            Simple Process
                            <Crown className="w-4 h-4 ml-2 text-amber-500" />
                        </Badge>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-5 lg:mb-6 leading-tight">
                        <span className="text-slate-800">How It Works</span>
                        <br />
                        <span className="text-slate-600">Like Magic</span>
                    </h2>

                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Getting started with premium tutoring has never been
                        easier. Follow these simple steps to transform your
                        learning experience.
                    </p>
                </div>

                {/* For Students with enhanced mobile layout */}
                <div className="mb-20 lg:mb-24">
                    <div className="text-center mb-12 lg:mb-16 px-2 sm:px-0">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 lg:mb-4">
                            For Students
                        </h3>
                        <p className="text-base lg:text-lg text-slate-600">
                            Your journey to academic excellence starts here
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
                        {studentSteps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Step Number - positioned above the card with better mobile spacing */}
                                <div className="flex justify-center mb-4 lg:mb-6">
                                    <div
                                        className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg z-20`}
                                    >
                                        <span className="text-white font-bold text-lg lg:text-xl">
                                            {step.step}
                                        </span>
                                    </div>
                                </div>

                                <Card className="bg-white/85 backdrop-blur-md border border-slate-200/50 shadow-xl group hover:shadow-2xl transition-all duration-300 h-full">
                                    <CardHeader className="pt-6 pb-4 text-center px-4 lg:px-6">
                                        <div
                                            className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}
                                        >
                                            <step.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                                        </div>
                                        <CardTitle className="text-lg lg:text-xl font-bold text-slate-800 mb-2 leading-tight">
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="text-center px-4 lg:px-6 pb-6">
                                        <CardDescription className="text-slate-600 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                                            {step.description}
                                        </CardDescription>

                                        <div className="space-y-2 lg:space-y-3">
                                            {step.details.map(
                                                (detail, detailIndex) => (
                                                    <div
                                                        key={detailIndex}
                                                        className="flex items-center justify-center text-xs lg:text-sm text-slate-500"
                                                    >
                                                        <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-500 mr-2 flex-shrink-0" />
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

                {/* For Tutors with enhanced mobile layout */}
                <div className="mb-20 lg:mb-28 mt-12 lg:mt-16">
                    <div className="text-center mb-12 lg:mb-16 px-2 sm:px-0">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 lg:mb-4">
                            For Tutors
                        </h3>
                        <p className="text-base lg:text-lg text-slate-600">
                            Join our elite community of expert educators
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
                        {tutorSteps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Step Number - positioned above the card with better mobile spacing */}
                                <div className="flex justify-center mb-4 lg:mb-6">
                                    <div
                                        className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg z-20`}
                                    >
                                        <span className="text-white font-bold text-lg lg:text-xl">
                                            {step.step}
                                        </span>
                                    </div>
                                </div>

                                <Card className="bg-white/85 backdrop-blur-md border border-slate-200/50 shadow-xl group hover:shadow-2xl transition-all duration-300 h-full">
                                    <CardHeader className="pt-6 pb-4 text-center px-4 lg:px-6">
                                        <div
                                            className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}
                                        >
                                            <step.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                                        </div>
                                        <CardTitle className="text-lg lg:text-xl font-bold text-slate-800 mb-2 leading-tight">
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="text-center px-4 lg:px-6 pb-6">
                                        <CardDescription className="text-slate-600 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                                            {step.description}
                                        </CardDescription>

                                        <div className="space-y-2 lg:space-y-3">
                                            {step.details.map(
                                                (detail, detailIndex) => (
                                                    <div
                                                        key={detailIndex}
                                                        className="flex items-center justify-center text-xs lg:text-sm text-slate-500"
                                                    >
                                                        <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-500 mr-2 flex-shrink-0" />
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

                {/* Call to Action with mobile optimization and more spacing */}
                <div className="bg-white/80 backdrop-blur-lg border border-white/30 p-6 sm:p-8 lg:p-12 rounded-3xl text-center shadow-xl mx-2 sm:mx-0 mt-16 lg:mt-20">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-6 lg:mb-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                        <Zap className="h-8 w-8 lg:h-10 lg:w-10 text-amber-400" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 lg:mb-6 leading-tight">
                        Ready to Get Started?
                    </h3>
                    <p className="text-lg sm:text-xl text-slate-600 mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of students and tutors who are already
                        experiencing the future of online education.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
                        <Link href="/auth/register?role=student">
                            <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white px-6 sm:px-8 py-4 text-base lg:text-lg font-semibold rounded-lg w-full sm:w-auto sm:min-w-[220px] shadow-lg group">
                                <Crown className="mr-2 h-5 w-5 text-amber-400 group-hover:animate-bounce" />
                                Start as Student
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/auth/register?role=tutor">
                            <Button
                                variant="outline"
                                className="border-2 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-6 sm:px-8 py-4 text-base lg:text-lg font-semibold rounded-lg w-full sm:w-auto sm:min-w-[220px] backdrop-blur-lg transition-all duration-300 group"
                            >
                                <Star className="mr-2 h-5 w-5 text-amber-500" />
                                Become a Tutor
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background decorations - reduced since main page has blur balls */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-slate-200/10 rounded-full blur-xl animate-pulse float"></div>
            <div
                className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200/10 rounded-full blur-xl animate-pulse float"
                style={{ animationDelay: "2s" }}
            ></div>
        </section>
    )
}
