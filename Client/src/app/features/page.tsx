"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    Video,
    Clock,
    Users,
    BookOpen,
    Shield,
    ArrowRight,
    FileText,
    Zap,
    Globe,
    Award,
    MessageSquare,
    Headphones,
    Monitor,
    Smartphone,
    CheckCircle,
    Star,
    TrendingUp,
    Brain,
    Target,
    Lightbulb,
    Palette,
    BarChart3,
    Calendar,
    CreditCard,
    Lock,
    Wifi,
    PlayCircle,
} from "lucide-react"

const mainFeatures = [
    {
        icon: Video,
        title: "HD Video Sessions",
        description:
            "Crystal-clear video calls with professional-grade audio quality for seamless learning experiences.",
        details: [
            "1080p HD video quality",
            "Noise cancellation technology",
            "Low-latency communication",
            "Multi-device support",
        ],
    },
    {
        icon: FileText,
        title: "Interactive Whiteboard",
        description:
            "Advanced collaborative canvas with drawing tools, equation support, and real-time synchronization.",
        details: [
            "Real-time collaboration",
            "Mathematical equation support",
            "Drawing and annotation tools",
            "Save and share sessions",
        ],
    },
    {
        icon: Users,
        title: "Expert Tutors",
        description:
            "Handpicked tutors from top universities with proven expertise in their respective subjects.",
        details: [
            "Verified credentials",
            "Subject matter experts",
            "Continuous training",
            "Student feedback system",
        ],
    },
    {
        icon: Shield,
        title: "Secure Platform",
        description:
            "Enterprise-grade security with encrypted communications and protected personal information.",
        details: [
            "End-to-end encryption",
            "GDPR compliant",
            "Secure payment processing",
            "Data privacy protection",
        ],
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description:
            "Round-the-clock access to tutoring sessions and support whenever you need assistance.",
        details: [
            "Global tutor network",
            "Flexible scheduling",
            "Instant doubt resolution",
            "Emergency support",
        ],
    },
    {
        icon: BookOpen,
        title: "All Subjects",
        description:
            "Comprehensive coverage from elementary math to advanced university-level courses.",
        details: [
            "Mathematics & Sciences",
            "Programming & Technology",
            "Languages & Literature",
            "Business & Economics",
        ],
    },
]

const additionalFeatures = [
    {
        icon: Monitor,
        title: "Screen Sharing",
        description:
            "Share your screen or specific applications for better problem-solving",
    },
    {
        icon: MessageSquare,
        title: "AI Assistant",
        description:
            "Get instant help with our intelligent chatbot for quick questions",
    },
    {
        icon: BarChart3,
        title: "Progress Tracking",
        description:
            "Monitor your learning journey with detailed analytics and insights",
    },
    {
        icon: Calendar,
        title: "Smart Scheduling",
        description:
            "Intelligent scheduling system that matches your availability",
    },
    {
        icon: Award,
        title: "Certification",
        description: "Earn certificates for completed courses and milestones",
    },
    {
        icon: Smartphone,
        title: "Mobile App",
        description: "Learn on-the-go with our responsive mobile application",
    },
]

const subjects = [
    {
        name: "Mathematics",
        icon: "📐",
        courses: "Algebra, Calculus, Geometry, Statistics",
    },
    {
        name: "Physics",
        icon: "⚛️",
        courses: "Mechanics, Thermodynamics, Quantum Physics",
    },
    {
        name: "Chemistry",
        icon: "🧪",
        courses: "Organic, Inorganic, Physical Chemistry",
    },
    {
        name: "Biology",
        icon: "🧬",
        courses: "Cell Biology, Genetics, Ecology, Anatomy",
    },
    {
        name: "Computer Science",
        icon: "💻",
        courses: "Programming, Data Structures, Algorithms",
    },
    {
        name: "English",
        icon: "📚",
        courses: "Literature, Grammar, Writing, Communication",
    },
    {
        name: "Economics",
        icon: "📊",
        courses: "Micro, Macro, International Economics",
    },
    {
        name: "Accounting",
        icon: "💰",
        courses: "Financial, Management, Cost Accounting",
    },
]

const stats = [
    { number: "10,000+", label: "Students Helped", icon: Users },
    { number: "500+", label: "Expert Tutors", icon: Award },
    { number: "50+", label: "Subjects Covered", icon: BookOpen },
    { number: "99.9%", label: "Uptime", icon: Zap },
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <Badge className="mb-6 bg-slate-800 text-white px-4 py-2">
                        ✨ Premium Learning Platform
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                        Powerful Features for
                        <span className="text-slate-800"> Modern Learning</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Discover how NerdsOnCall revolutionizes education with
                        cutting-edge technology, expert tutors, and innovative
                        learning tools designed for your success.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register?role=student">
                            <Button
                                size="lg"
                                className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Start Learning Now
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-slate-300 hover:border-slate-400 px-8 py-4 text-lg font-semibold"
                            >
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                            Core Features That Make Us Different
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Experience the future of education with our
                            comprehensive suite of learning tools
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {mainFeatures.map((feature, index) => (
                            <Card
                                key={index}
                                className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white group"
                            >
                                <CardContent className="p-8">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <feature.icon className="h-8 w-8 text-slate-700" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-800 mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-slate-600 mb-4 leading-relaxed">
                                                {feature.description}
                                            </p>
                                            <ul className="space-y-2">
                                                {feature.details.map(
                                                    (detail, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-center text-sm text-slate-600"
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                            {detail}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                            Advanced Learning Tools
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Enhance your learning experience with our additional
                            features and tools
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {additionalFeatures.map((feature, index) => (
                            <Card
                                key={index}
                                className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm group"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subjects Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                            Subjects We Cover
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            From elementary concepts to advanced university
                            courses, we've got you covered
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subjects.map((subject, index) => (
                            <Card
                                key={index}
                                className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-white group hover:-translate-y-1"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-4">
                                        {subject.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                                        {subject.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {subject.courses}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Learning?
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who have already discovered
                        the power of personalized, on-demand tutoring with
                        NerdsOnCall.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register?role=student">
                            <Button
                                size="lg"
                                className="bg-white text-slate-800 hover:bg-slate-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/questions">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-white text-white hover:bg-white hover:text-slate-800 px-8 py-4 text-lg font-semibold"
                            >
                                Explore Questions
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
