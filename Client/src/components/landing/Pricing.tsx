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
            name: "Essential",
            description: "Perfect for getting started with quality tutoring",
            price: 29,
            period: "month",
            popular: false,
            features: [
                "Up to 10 hours of tutoring per month",
                "Access to certified tutors",
                "HD video sessions",
                "Basic whiteboard tools",
                "Email support",
                "Session recordings (7 days)",
            ],
            cta: "Start Free Trial",
            href: "/auth/register?role=student&plan=essential",
            icon: Star,
            color: "slate",
        },
        {
            name: "Professional",
            description: "Most popular choice for serious learners",
            price: 79,
            period: "month",
            popular: true,
            features: [
                "Unlimited tutoring hours",
                "Premium tutor selection",
                "HD video + screen sharing",
                "Advanced whiteboard tools",
                "Priority support",
                "Session recordings (30 days)",
                "Progress tracking",
                "Mobile app access",
            ],
            cta: "Get Started",
            href: "/auth/register?role=student&plan=professional",
            icon: Crown,
            color: "slate",
        },
        {
            name: "Enterprise",
            description: "For institutions and teams",
            price: 199,
            period: "month",
            popular: false,
            features: [
                "Everything in Professional",
                "Dedicated account manager",
                "Custom integrations",
                "Admin dashboard",
                "Bulk user management",
                "Custom branding",
                "SLA guarantee",
                "24/7 phone support",
            ],
            cta: "Contact Sales",
            href: "/auth/register?role=student&plan=enterprise",
            icon: Shield,
            color: "slate",
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
        <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16 px-2 sm:px-0">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Choose the perfect plan for your learning journey. All
                        plans include our core features with no hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 lg:mb-16">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white ${
                                plan.popular
                                    ? "border-slate-300 shadow-lg scale-105 lg:scale-110"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-slate-700 text-white px-4 py-1 text-sm font-semibold">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-6">
                                <div className="flex justify-center mb-4">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                            plan.popular
                                                ? "bg-gradient-to-br from-slate-700 to-slate-900"
                                                : "bg-slate-100"
                                        }`}
                                    >
                                        <plan.icon
                                            className={`h-8 w-8 ${
                                                plan.popular
                                                    ? "text-amber-400"
                                                    : "text-slate-600"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                                    {plan.name}
                                </CardTitle>
                                <p className="text-sm text-slate-600 mb-4">
                                    {plan.description}
                                </p>

                                <div className="flex items-baseline justify-center mb-6">
                                    <span className="text-4xl font-bold text-slate-800">
                                        ${plan.price}
                                    </span>
                                    <span className="text-slate-600 ml-2">
                                        /{plan.period}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map(
                                        (feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                                                    <Check className="h-3 w-3 text-emerald-600" />
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    {feature}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                                <Link href={plan.href}>
                                    <Button
                                        className={`w-full h-12 font-semibold transition-all duration-200 ${
                                            plan.popular
                                                ? "bg-slate-700 hover:bg-slate-800 text-white"
                                                : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                        }`}
                                        variant={
                                            plan.popular ? "default" : "outline"
                                        }
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="text-center mt-12">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto border border-slate-200">
                        <div className="flex justify-center mb-4">
                            <Zap className="h-6 w-6 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            Start with a Free Trial
                        </h3>
                        <p className="text-slate-600 mb-4">
                            All plans come with a 7-day free trial. No credit
                            card required. Cancel anytime.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm text-slate-500">
                            <span>✓ No setup fees</span>
                            <span>✓ Cancel anytime</span>
                            <span>✓ 30-day money-back guarantee</span>
                        </div>
                    </div>
                </div>

                {/* Tutor CTA */}
                <div className="text-center mt-12">
                    <div className="bg-slate-100 rounded-2xl p-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                            Ready to Start Teaching?
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Join our community of expert tutors and start
                            earning premium rates for your expertise.
                        </p>
                        <Link href="/auth/register?role=tutor">
                            <Button
                                variant="outline"
                                className="border-2 border-slate-300 text-slate-700 hover:text-slate-800 hover:bg-white font-semibold px-8 h-12"
                            >
                                <Crown className="mr-2 h-4 w-4 text-amber-500" />
                                Become a Tutor
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
