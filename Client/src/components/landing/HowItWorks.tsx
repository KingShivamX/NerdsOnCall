import { ArrowRight, UserPlus, Search, Video, Star } from "lucide-react"

const steps = [
    {
        icon: UserPlus,
        title: "Sign Up",
        description:
            "Create your account as a student or tutor in just a few clicks.",
    },
    {
        icon: Search,
        title: "Post Your Doubt",
        description:
            "Students post their questions and get matched with available tutors instantly.",
    },
    {
        icon: Video,
        title: "Start Learning",
        description:
            "Join live video sessions with interactive whiteboard and screen sharing.",
    },
    {
        icon: Star,
        title: "Rate & Review",
        description:
            "Provide feedback to help maintain quality and help other students.",
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get started with NerdsOnCall in four simple steps and
                        start learning immediately.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center relative">
                            {/* Step number */}
                            <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
                                {index + 1}
                            </div>

                            {/* Arrow */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                                    <ArrowRight className="h-6 w-6 text-gray-300" />
                                </div>
                            )}

                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-6">
                                    <step.icon className="h-8 w-8 text-primary" />
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {step.title}
                                </h3>

                                <p className="text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to get started?
                    </h3>
                    <p className="text-gray-600 mb-8">
                        Join thousands of students and tutors already using
                        NerdsOnCall.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Start as Student
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Become a Tutor
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
