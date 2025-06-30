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
    FileText,
} from "lucide-react"

const features = [
    {
        icon: Video,
        title: "HD Video Sessions",
        description:
            "Crystal-clear video calls with professional-grade audio quality for seamless learning experiences.",
    },
    {
        icon: FileText,
        title: "Interactive Whiteboard",
        description:
            "Advanced collaborative canvas with drawing tools, equation support, and real-time synchronization.",
    },
    {
        icon: Users,
        title: "Expert Tutors",
        description:
            "Handpicked tutors from top universities with proven expertise in their respective subjects.",
    },
    {
        icon: Shield,
        title: "Secure Platform",
        description:
            "Enterprise-grade security with encrypted communications and protected personal information.",
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description:
            "Round-the-clock access to tutoring sessions and support whenever you need assistance.",
    },
    {
        icon: BookOpen,
        title: "All Subjects",
        description:
            "Comprehensive coverage from elementary math to advanced university-level courses.",
    },
]

export function Features() {
    return (
        <section className="py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16 px-2 sm:px-0">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                        Premium Learning Experience
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Access world-class tutoring with cutting-edge technology
                        designed for optimal learning outcomes
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white group"
                        >
                            <CardContent className="p-6 lg:p-8">
                                <div className="mb-4">
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon className="h-6 w-6 lg:h-7 lg:w-7 text-slate-700" />
                                    </div>
                                    <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center px-2 sm:px-0">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 sm:p-8 lg:p-10 mb-8">
                        <div className="flex justify-center mb-4 lg:mb-6">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                                <Sparkles className="h-8 w-8 lg:h-10 lg:w-10 text-amber-400" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 lg:mb-4 leading-tight">
                            Ready to Experience Premium Learning?
                        </h3>
                        <p className="text-slate-600 mb-6 lg:mb-8 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
                            Join thousands of students who have transformed
                            their academic journey with our expert tutoring
                            platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
                            <Link href="/auth/register?role=student">
                                <Button
                                    size="lg"
                                    className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-6 sm:px-8 h-12 lg:h-14 group transition-all duration-200 w-full sm:w-auto"
                                >
                                    Start Learning Today
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/auth/register?role=tutor">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-slate-300 text-slate-700 hover:text-slate-800 hover:bg-slate-50 font-semibold px-6 sm:px-8 h-12 lg:h-14 w-full sm:w-auto"
                                >
                                    Become a Tutor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
