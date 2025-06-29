import { Check } from "lucide-react"
import { Button } from "../ui/Button"

const plans = [
    {
        name: "Basic",
        price: 9.99,
        period: "month",
        description: "Perfect for occasional learners",
        features: [
            "5 sessions per month",
            "HD video calls",
            "Interactive whiteboard",
            "Screen sharing",
            "Basic support",
        ],
        popular: false,
    },
    {
        name: "Standard",
        price: 19.99,
        period: "month",
        description: "Great for regular students",
        features: [
            "15 sessions per month",
            "HD video calls",
            "Interactive whiteboard",
            "Screen sharing",
            "Priority support",
            "Session recordings",
            "Progress tracking",
        ],
        popular: true,
    },
    {
        name: "Premium",
        price: 39.99,
        period: "month",
        description: "Best for intensive learning",
        features: [
            "Unlimited sessions",
            "HD video calls",
            "Interactive whiteboard",
            "Screen sharing",
            "24/7 priority support",
            "Session recordings",
            "Progress tracking",
            "Preferred tutor selection",
            "Advanced analytics",
        ],
        popular: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose the plan that best fits your learning needs. All
                        plans include access to our expert tutors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                                plan.popular
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-gray-200"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {plan.description}
                                </p>
                                <div className="text-4xl font-bold text-gray-900">
                                    ${plan.price}
                                    <span className="text-lg font-normal text-gray-600">
                                        /{plan.period}
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="flex items-center"
                                    >
                                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${
                                    plan.popular
                                        ? "bg-primary hover:bg-primary/90"
                                        : "bg-gray-900 hover:bg-gray-800"
                                }`}
                                size="lg"
                            >
                                Get Started
                            </Button>
                        </div>
                    ))}
                </div>

                {/* For Tutors Section */}
                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        For Tutors
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                        Earn money by sharing your knowledge. Set your own rates
                        and work on your schedule.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-8 max-w-2xl mx-auto">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            Earn $15-50+
                            <span className="text-lg font-normal text-gray-600">
                                {" "}
                                per hour
                            </span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Set your own hourly rate and keep 80% of your
                            earnings
                        </p>
                        <Button variant="outline" size="lg">
                            Become a Tutor
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
