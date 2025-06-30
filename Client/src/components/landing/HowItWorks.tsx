import { Badge } from "../ui/badge"
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
            title: "Create Your Royal Profile",
            description:
                "Sign up in seconds and tell us about your learning goals, subjects, and preferred learning style.",
            icon: UserPlus,
            gradient: "from-purple-500 to-indigo-600",
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
            gradient: "from-blue-500 to-cyan-600",
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
            gradient: "from-emerald-500 to-teal-600",
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
            gradient: "from-yellow-500 to-orange-600",
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
            gradient: "from-purple-500 to-pink-600",
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
            gradient: "from-indigo-500 to-purple-600",
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
            gradient: "from-green-500 to-emerald-600",
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
            gradient: "from-yellow-500 to-red-600",
            details: [
                "85% commission",
                "Weekly payouts",
                "Performance bonuses",
            ],
        },
    ]

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="flex justify-center mb-6">
                        <Badge
                            variant="secondary"
                            className="premium-glass border-0 text-purple-700 px-6 py-2 text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Simple Process
                            <Crown className="w-4 h-4 ml-2" />
                        </Badge>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-gray-900 premium-text-shadow">
                            How It Works
                        </span>
                        <br />
                        <span className="royal-text">Like Magic</span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Getting started with premium tutoring has never been
                        easier. Follow these simple steps to transform your
                        learning experience.
                    </p>
                </div>

                {/* For Students */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            For Students
                        </h3>
                        <p className="text-lg text-gray-600">
                            Your journey to academic excellence starts here
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 via-emerald-200 to-yellow-200 transform -translate-y-1/2 z-0"></div>

                        <div className="grid lg:grid-cols-4 gap-8 relative z-10">
                            {studentSteps.map((step, index) => (
                                <Card
                                    key={index}
                                    className="luxury-card border-0 group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                        <div
                                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                                        >
                                            <span className="text-white font-bold text-sm">
                                                {step.step}
                                            </span>
                                        </div>
                                    </div>

                                    <CardHeader className="pt-8 pb-4 text-center">
                                        <div
                                            className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 group-hover:glow transition-all duration-300`}
                                        >
                                            <step.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="text-center">
                                        <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                                            {step.description}
                                        </CardDescription>

                                        <div className="space-y-2">
                                            {step.details.map(
                                                (detail, detailIndex) => (
                                                    <div
                                                        key={detailIndex}
                                                        className="flex items-center justify-center text-sm text-gray-500"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                        {detail}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>

                                    {/* Arrow for desktop */}
                                    {index < studentSteps.length - 1 && (
                                        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-30">
                                            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Decorative gradient */}
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                    ></div>

                                    {/* Hover shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* For Tutors */}
                <div className="mb-16">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            For Tutors
                        </h3>
                        <p className="text-lg text-gray-600">
                            Join our elite community of expert educators
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-indigo-200 via-green-200 to-yellow-200 transform -translate-y-1/2 z-0"></div>

                        <div className="grid lg:grid-cols-4 gap-8 relative z-10">
                            {tutorSteps.map((step, index) => (
                                <Card
                                    key={index}
                                    className="luxury-card border-0 group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                        <div
                                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                                        >
                                            <span className="text-white font-bold text-sm">
                                                {step.step}
                                            </span>
                                        </div>
                                    </div>

                                    <CardHeader className="pt-8 pb-4 text-center">
                                        <div
                                            className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 group-hover:glow transition-all duration-300`}
                                        >
                                            <step.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="text-center">
                                        <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                                            {step.description}
                                        </CardDescription>

                                        <div className="space-y-2">
                                            {step.details.map(
                                                (detail, detailIndex) => (
                                                    <div
                                                        key={detailIndex}
                                                        className="flex items-center justify-center text-sm text-gray-500"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                        {detail}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>

                                    {/* Arrow for desktop */}
                                    {index < tutorSteps.length - 1 && (
                                        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-30">
                                            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Decorative gradient */}
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                    ></div>

                                    {/* Hover shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="luxury-card p-12 rounded-3xl text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full royal-gradient flex items-center justify-center">
                        <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Get Started?
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of students and tutors who are already
                        experiencing the future of online education.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="premium-button text-white border-0 px-8 py-4 text-lg font-semibold rounded-lg min-w-[200px]">
                            <Crown className="mr-2 h-5 w-5" />
                            Start as Student
                        </button>
                        <button className="premium-glass border-2 border-purple-200 text-purple-700 hover:text-purple-800 px-8 py-4 text-lg font-semibold rounded-lg min-w-[200px] backdrop-blur-lg transition-all duration-300">
                            <Star className="mr-2 h-5 w-5" />
                            Become a Tutor
                        </button>
                    </div>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-purple-400/5 rounded-full blur-xl animate-pulse float"></div>
            <div
                className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-400/5 rounded-full blur-xl animate-pulse float"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/5 rounded-full blur-xl animate-pulse float"
                style={{ animationDelay: "4s" }}
            ></div>
        </section>
    )
}
