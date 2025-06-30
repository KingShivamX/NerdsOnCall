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
    Check,
    Crown,
    Star,
    Sparkles,
    Zap,
    Shield,
    Heart,
    Trophy,
    Gem,
    ArrowRight,
} from "lucide-react"

export function Pricing() {
    const plans = [
        {
            name: "Student Basic",
            description: "Perfect for getting started with premium tutoring",
            price: 19,
            period: "month",
            popular: false,
            features: [
                "5 tutoring sessions per month",
                "HD video calls",
                "Basic whiteboard tools",
                "Session recordings",
                "Email support",
                "Mobile app access",
            ],
            icon: Star,
            gradient: "from-blue-500 to-cyan-600",
            bgGradient: "from-blue-50 to-cyan-50",
            buttonText: "Start Learning",
            accent: "blue",
            href: "/auth/register?role=student&plan=basic",
        },
        {
            name: "Student Pro",
            description: "Most popular choice for serious learners",
            price: 49,
            period: "month",
            popular: true,
            features: [
                "Unlimited tutoring sessions",
                "4K video calls with AI enhancement",
                "Advanced whiteboard with AI tools",
                "Session recordings & transcripts",
                "Priority matching",
                "24/7 chat support",
                "Progress analytics",
                "Exam preparation tools",
                "Study group access",
                "Mobile & desktop apps",
            ],
            icon: Crown,
            gradient: "from-purple-500 to-indigo-600",
            bgGradient: "from-purple-50 to-indigo-50",
            buttonText: "Most Popular",
            accent: "purple",
            href: "/auth/register?role=student&plan=pro",
        },
        {
            name: "Student Elite",
            description: "Ultimate learning experience with VIP benefits",
            price: 99,
            period: "month",
            popular: false,
            features: [
                "Everything in Pro",
                "1-on-1 dedicated tutor matching",
                "Personalized learning paths",
                "Instant tutor connections",
                "VIP support line",
                "Advanced AI study assistant",
                "Career counseling sessions",
                "University application help",
                "Scholarship guidance",
                "Exclusive masterclasses",
            ],
            icon: Gem,
            gradient: "from-yellow-500 to-orange-600",
            bgGradient: "from-yellow-50 to-orange-50",
            buttonText: "Go Elite",
            accent: "yellow",
            href: "/auth/register?role=student&plan=elite",
        },
    ]

    const tutorPlans = [
        {
            name: "Tutor Standard",
            description: "Start your tutoring journey",
            price: "Free",
            period: "month",
            commission: "80%",
            features: [
                "Create your tutor profile",
                "Basic scheduling tools",
                "Standard video calls",
                "Basic whiteboard",
                "Email support",
                "80% commission rate",
            ],
            icon: Star,
            gradient: "from-emerald-500 to-teal-600",
            buttonText: "Start Teaching",
            href: "/auth/register?role=tutor&plan=standard",
        },
        {
            name: "Tutor Pro",
            description: "Advanced tools for professional tutors",
            price: 29,
            period: "month",
            commission: "85%",
            features: [
                "Everything in Standard",
                "Priority student matching",
                "Advanced scheduling system",
                "4K video enhancement",
                "Advanced whiteboard tools",
                "Analytics dashboard",
                "85% commission rate",
                "Marketing tools",
                "Custom branding",
            ],
            icon: Trophy,
            gradient: "from-purple-500 to-pink-600",
            buttonText: "Upgrade to Pro",
            href: "/auth/register?role=tutor&plan=pro",
        },
    ]

    return (
        <section className="py-24 hero-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="flex justify-center mb-6">
                        <Badge
                            variant="secondary"
                            className="premium-glass border-0 text-purple-700 px-6 py-2 text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Flexible Pricing
                            <Crown className="w-4 h-4 ml-2" />
                        </Badge>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-gray-900 premium-text-shadow">
                            Choose Your
                        </span>
                        <br />
                        <span className="royal-text">Learning Journey</span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Unlock your potential with our premium tutoring plans
                        designed for every learning style and budget.
                    </p>
                </div>

                {/* Student Plans */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            For Students
                        </h3>
                        <p className="text-lg text-gray-600">
                            Transform your learning experience with our premium
                            student plans
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <Card
                                key={index}
                                className={`
                                    relative overflow-hidden border-0 transition-all duration-300 
                                    ${
                                        plan.popular
                                            ? "pricing-card transform scale-105 z-10 shadow-2xl"
                                            : "luxury-card hover:scale-105"
                                    }
                                `}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-0 right-0 royal-gradient p-3 text-center">
                                        <span className="text-white font-bold text-sm flex items-center justify-center">
                                            <Crown className="w-4 h-4 mr-2" />
                                            MOST POPULAR
                                            <Crown className="w-4 h-4 ml-2" />
                                        </span>
                                    </div>
                                )}

                                <CardHeader
                                    className={`pb-4 ${
                                        plan.popular ? "pt-16" : "pt-8"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}
                                        >
                                            <plan.icon className="h-6 w-6 text-white" />
                                        </div>
                                        {plan.popular && (
                                            <Badge className="royal-gradient text-white border-0">
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                Best Value
                                            </Badge>
                                        )}
                                    </div>

                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mt-2">
                                        {plan.description}
                                    </CardDescription>

                                    <div className="mt-6">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold royal-text">
                                                ${plan.price}
                                            </span>
                                            <span className="text-gray-600 ml-2">
                                                /{plan.period}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-4">
                                    <Link href={plan.href}>
                                        <Button
                                            className={`
                                                w-full mb-6 font-semibold group
                                                ${
                                                    plan.popular
                                                        ? "premium-button text-white border-0"
                                                        : "premium-glass border-2 border-purple-200 text-purple-700 hover:text-purple-800 backdrop-blur-lg"
                                                }
                                            `}
                                            size="lg"
                                        >
                                            {plan.popular && (
                                                <Crown className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                                            )}
                                            {plan.buttonText}
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>

                                    <div className="space-y-3">
                                        {plan.features.map(
                                            (feature, featureIndex) => (
                                                <div
                                                    key={featureIndex}
                                                    className="flex items-start"
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                                    >
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                    <span className="text-gray-700 ml-3 text-sm">
                                                        {feature}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>

                                {/* Decorative elements */}
                                <div
                                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.gradient} opacity-60`}
                                ></div>

                                {plan.popular && (
                                    <>
                                        <div className="absolute top-20 right-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                                        <div
                                            className="absolute bottom-20 left-4 w-12 h-12 bg-purple-400/20 rounded-full blur-xl animate-pulse"
                                            style={{ animationDelay: "1s" }}
                                        ></div>
                                    </>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Tutor Plans */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            For Tutors
                        </h3>
                        <p className="text-lg text-gray-600">
                            Start earning with our comprehensive tutor platform
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {tutorPlans.map((plan, index) => (
                            <Card
                                key={index}
                                className="luxury-card border-0 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}
                                        >
                                            <plan.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {plan.commission} Commission
                                        </Badge>
                                    </div>

                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mt-2">
                                        {plan.description}
                                    </CardDescription>

                                    <div className="mt-6">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold royal-text">
                                                {typeof plan.price === "string"
                                                    ? plan.price
                                                    : `$${plan.price}`}
                                            </span>
                                            {typeof plan.price === "number" && (
                                                <span className="text-gray-600 ml-2">
                                                    /{plan.period}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-4">
                                    <Link href={plan.href}>
                                        <Button
                                            className="w-full mb-6 premium-glass border-2 border-emerald-200 text-emerald-700 hover:text-emerald-800 backdrop-blur-lg font-semibold group"
                                            size="lg"
                                        >
                                            <Star className="w-4 h-4 mr-2 group-hover:animate-spin" />
                                            {plan.buttonText}
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>

                                    <div className="space-y-3">
                                        {plan.features.map(
                                            (feature, featureIndex) => (
                                                <div
                                                    key={featureIndex}
                                                    className="flex items-start"
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                                    >
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                    <span className="text-gray-700 ml-3 text-sm">
                                                        {feature}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>

                                <div
                                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.gradient} opacity-60`}
                                ></div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Money Back Guarantee */}
                <div className="luxury-card p-8 rounded-3xl text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full royal-gradient flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        30-Day Money-Back Guarantee
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        Not satisfied with your learning experience? Get a full
                        refund within 30 days, no questions asked. We're
                        confident you'll love our premium tutoring platform.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/auth/register">
                            <Button className="premium-button text-white border-0 px-8 py-3 font-semibold group">
                                Try Risk-Free Now
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-pulse float"></div>
            <div
                className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse float"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-400/5 rounded-full blur-xl animate-pulse float"
                style={{ animationDelay: "4s" }}
            ></div>
        </section>
    )
}
