import Link from "next/link"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import {
    Video,
    MessageSquare,
    Share,
    Clock,
    Users,
    BookOpen,
    Shield,
    Zap,
    Star,
    Crown,
    Sparkles,
    Globe,
    Award,
    Heart,
    Lightbulb,
    Target,
    Rocket,
    ArrowRight,
    Play,
} from "lucide-react"

export function Features() {
    const primaryFeatures = [
        {
            icon: Video,
            title: "4K Video Calling",
            description:
                "Crystal-clear HD video sessions with professional-grade audio and screen sharing capabilities for an immersive learning experience.",
            gradient: "from-purple-500 to-indigo-600",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
        },
        {
            icon: BookOpen,
            title: "Smart Whiteboard",
            description:
                "AI-powered collaborative canvas with advanced drawing tools, mathematical equation support, and real-time synchronization.",
            gradient: "from-blue-500 to-cyan-600",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            icon: Users,
            title: "Elite Tutors",
            description:
                "Handpicked expert tutors from top universities with proven track records and specialized subject expertise.",
            gradient: "from-emerald-500 to-teal-600",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
    ]

    const advancedFeatures = [
        {
            icon: Shield,
            title: "Bank-Grade Security",
            description: "End-to-end encryption and secure data handling",
            gradient: "from-red-500 to-pink-600",
        },
        {
            icon: Zap,
            title: "Instant Connections",
            description: "Connect with tutors in under 30 seconds",
            gradient: "from-yellow-500 to-orange-600",
        },
        {
            icon: Globe,
            title: "Global Availability",
            description: "24/7 tutoring across all time zones",
            gradient: "from-indigo-500 to-purple-600",
        },
        {
            icon: Award,
            title: "Quality Assurance",
            description: "Regular performance monitoring and feedback",
            gradient: "from-green-500 to-emerald-600",
        },
        {
            icon: Heart,
            title: "Personalized Learning",
            description: "AI-powered matching with perfect tutors",
            gradient: "from-pink-500 to-rose-600",
        },
        {
            icon: Rocket,
            title: "Progress Tracking",
            description: "Advanced analytics and learning insights",
            gradient: "from-purple-500 to-violet-600",
        },
    ]

    return (
        <section className="py-20 hero-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-5">
                        <Badge
                            variant="secondary"
                            className="premium-glass border-0 text-purple-700 px-5 py-2 text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Premium Features
                            <Crown className="w-4 h-4 ml-2" />
                        </Badge>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
                        <span className="text-gray-900 premium-text-shadow">
                            Everything You Need for
                        </span>
                        <br />
                        <span className="royal-text">Academic Excellence</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Experience the future of online tutoring with our
                        comprehensive suite of premium tools and features
                        designed to maximize your learning potential.
                    </p>
                </div>

                {/* Primary Features - Large Cards */}
                <div className="grid lg:grid-cols-3 gap-6 mb-16">
                    {primaryFeatures.map((feature, index) => (
                        <Card
                            key={index}
                            className="luxury-card border-0 group hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                            <CardHeader className="pb-3">
                                <div
                                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:glow transition-all duration-300`}
                                >
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>

                            {/* Decorative gradient */}
                            <div
                                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            ></div>
                        </Card>
                    ))}
                </div>

                {/* Advanced Features Grid */}
                <div className="mb-14">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Advanced Capabilities
                        </h3>
                        <p className="text-base text-gray-600 max-w-2xl mx-auto">
                            Powerful features that set us apart from the
                            competition
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {advancedFeatures.map((feature, index) => (
                            <Card
                                key={index}
                                className="luxury-card border-0 p-5 group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:glow transition-all duration-300`}
                                    >
                                        <feature.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 mb-1 text-base">
                                            {feature.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="luxury-card p-10 rounded-3xl">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold royal-text mb-3">
                            Trusted by Students Worldwide
                        </h3>
                        <p className="text-base text-gray-600">
                            Join thousands of students who have achieved
                            academic success with us
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-full royal-gradient flex items-center justify-center group-hover:glow transition-all duration-300">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-2xl font-bold royal-text mb-1">
                                50K+
                            </div>
                            <div className="text-gray-600 font-medium text-sm">
                                Active Students
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-full royal-gradient flex items-center justify-center group-hover:glow transition-all duration-300">
                                <Award className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-2xl font-bold royal-text mb-1">
                                5K+
                            </div>
                            <div className="text-gray-600 font-medium text-sm">
                                Expert Tutors
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-full royal-gradient flex items-center justify-center group-hover:glow transition-all duration-300">
                                <Star className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-2xl font-bold royal-text mb-1">
                                4.9/5
                            </div>
                            <div className="text-gray-600 font-medium text-sm">
                                Average Rating
                            </div>
                        </div>

                        <div className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-full royal-gradient flex items-center justify-center group-hover:glow transition-all duration-300">
                                <Globe className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-2xl font-bold royal-text mb-1">
                                50+
                            </div>
                            <div className="text-gray-600 font-medium text-sm">
                                Countries
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-14">
                    <p className="text-base text-gray-600 mb-6">
                        Ready to experience the future of online tutoring?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register?role=student">
                            <Button className="premium-button text-white border-0 px-7 py-3 text-base font-semibold rounded-lg min-w-[200px] group">
                                <Crown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                                Start Learning Today
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="premium-glass border-2 border-purple-200 text-purple-700 hover:text-purple-800 px-7 py-3 text-base font-semibold rounded-lg min-w-[200px] backdrop-blur-lg transition-all duration-300 group"
                        >
                            <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            Watch Demo
                        </Button>
                    </div>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-purple-400/10 rounded-full blur-xl animate-pulse float"></div>
            <div
                className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse float"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/5 rounded-full blur-xl animate-pulse float"
                style={{ animationDelay: "4s" }}
            ></div>
        </section>
    )
}
