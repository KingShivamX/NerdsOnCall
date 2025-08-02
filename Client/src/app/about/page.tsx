"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    Users,
    Target,
    Heart,
    Award,
    Globe,
    Lightbulb,
    BookOpen,
    Star,
    ArrowRight,
    CheckCircle,
    TrendingUp,
    Shield,
    Zap,
    Brain,
    Rocket,
    Coffee,
    Code,
    Palette,
    MessageSquare,
    Video,
    Clock,
} from "lucide-react"

const values = [
    {
        icon: Heart,
        title: "Student-Centric",
        description:
            "Every decision we make is guided by what's best for our students' learning journey and success.",
    },
    {
        icon: Award,
        title: "Excellence",
        description:
            "We maintain the highest standards in tutor selection, platform quality, and educational outcomes.",
    },
    {
        icon: Globe,
        title: "Accessibility",
        description:
            "Quality education should be accessible to everyone, anywhere, at any time.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description:
            "We continuously evolve our platform with cutting-edge technology to enhance learning experiences.",
    },
]

const stats = [
    { number: "10,000+", label: "Students Helped", icon: Users },
    { number: "500+", label: "Expert Tutors", icon: Award },
    { number: "25+", label: "Countries Served", icon: Globe },
    { number: "98%", label: "Satisfaction Rate", icon: Star },
]

const features = [
    {
        icon: Video,
        title: "Live Video Sessions",
        description: "HD quality video calls with professional tutors",
    },
    {
        icon: MessageSquare,
        title: "AI Assistant",
        description: "Instant help with our intelligent chatbot",
    },
    {
        icon: BookOpen,
        title: "All Subjects",
        description: "Comprehensive coverage from K-12 to university",
    },
    {
        icon: Clock,
        title: "24/7 Available",
        description: "Round-the-clock access to learning support",
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-6 bg-slate-800 text-white px-4 py-2">
                            🚀 About NerdsOnCall
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                            Revolutionizing Education
                            <span className="text-slate-800">
                                {" "}
                                One Student at a Time
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
                            We're on a mission to make quality education
                            accessible to every student, anywhere in the world.
                            Through innovative technology and expert tutors,
                            we're transforming how students learn and succeed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                To democratize access to quality education by
                                connecting students with expert tutors through
                                innovative technology, making learning
                                personalized, engaging, and effective.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            Personalized Learning
                                        </h3>
                                        <p className="text-slate-600">
                                            Tailored tutoring sessions that
                                            adapt to each student's unique
                                            learning style
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            Global Accessibility
                                        </h3>
                                        <p className="text-slate-600">
                                            Breaking down geographical barriers
                                            to connect students with the best
                                            tutors worldwide
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            Technology-Enhanced
                                        </h3>
                                        <p className="text-slate-600">
                                            Leveraging cutting-edge technology
                                            to create immersive learning
                                            experiences
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-slate-800 rounded-2xl p-8 text-white">
                                <Target className="h-12 w-12 mb-6" />
                                <h3 className="text-2xl font-bold mb-4">
                                    Our Vision
                                </h3>
                                <p className="text-blue-100 leading-relaxed">
                                    To become the world's leading platform for
                                    personalized education, where every student
                                    has access to expert guidance and can
                                    achieve their full academic potential,
                                    regardless of their location or background.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            The principles that guide everything we do and shape
                            our commitment to educational excellence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card
                                key={index}
                                className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-white group hover:-translate-y-1"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <value.icon className="h-8 w-8 text-slate-700" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology */}
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                            Built with Modern Technology
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Our platform leverages cutting-edge technology to
                            deliver the best learning experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="border border-slate-200 hover:shadow-lg transition-all duration-300 bg-white group"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
                            <Code className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-4">
                                Open Source & Secure
                            </h3>
                            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
                                Built with Spring Boot, Next.js, and modern web
                                technologies. Our platform is secure, scalable,
                                and continuously updated with the latest
                                features.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Badge className="bg-blue-600 text-white">
                                    Spring Boot
                                </Badge>
                                <Badge className="bg-blue-600 text-white">
                                    Next.js
                                </Badge>
                                <Badge className="bg-blue-600 text-white">
                                    WebRTC
                                </Badge>
                                <Badge className="bg-blue-600 text-white">
                                    PostgreSQL
                                </Badge>
                                <Badge className="bg-blue-600 text-white">
                                    TypeScript
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Join Our Educational Revolution
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Whether you're a student seeking help or an expert tutor
                        looking to make an impact, we'd love to have you as part
                        of our growing community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register?role=student">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Start Learning
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/auth/register?role=tutor">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                            >
                                Become a Tutor
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
