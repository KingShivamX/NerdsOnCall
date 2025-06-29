import {
    Video,
    Users,
    BookOpen,
    Monitor,
    Clock,
    Star,
    MessageSquare,
    Shield,
} from "lucide-react"

const features = [
    {
        icon: Video,
        title: "HD Video Calls",
        description:
            "Crystal clear video and audio for the best learning experience with WebRTC technology.",
    },
    {
        icon: BookOpen,
        title: "Interactive Whiteboard",
        description:
            "Real-time collaborative canvas for solving problems together with drawing tools.",
    },
    {
        icon: Monitor,
        title: "Screen Sharing",
        description:
            "Share your screen to show problems or let tutors demonstrate solutions.",
    },
    {
        icon: Users,
        title: "Expert Tutors",
        description:
            "Connect with qualified tutors across Mathematics, Physics, Chemistry, and more.",
    },
    {
        icon: Clock,
        title: "Available 24/7",
        description:
            "Get help anytime with our global network of online tutors.",
    },
    {
        icon: Star,
        title: "Rated Sessions",
        description:
            "Quality assurance through student ratings and feedback system.",
    },
    {
        icon: MessageSquare,
        title: "Instant Matching",
        description:
            "Get connected with available tutors in seconds, not minutes.",
    },
    {
        icon: Shield,
        title: "Secure Platform",
        description:
            "Safe and secure learning environment with encrypted connections.",
    },
]

export function Features() {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Powerful Features for Effective Learning
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need for successful online tutoring
                        sessions in one platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="bg-white p-3 rounded-lg w-fit mb-4">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
