import Link from "next/link"
import { Badge } from "../ui/badge"
import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Check, Crown, Star, Shield, Zap } from "lucide-react"

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
        },
    ]

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-6 leading-tight tracking-tight">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Choose the perfect plan for your learning journey. All
                        plans include our core features with no hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white ${
                                plan.popular
                                    ? "border-slate-400 shadow-xl scale-105 lg:scale-110"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-slate-800 text-white px-4 py-1.5 text-xs font-semibold shadow-lg">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
                                <div className="flex justify-center mb-4 sm:mb-6">
                                    <div
                                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg ${
                                            plan.popular
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }`}
                                    >
                                        <plan.icon
                                            className={`h-6 w-6 sm:h-8 sm:w-8 ${
                                                plan.popular
                                                    ? "text-amber-400"
                                                    : "text-slate-600"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">
                                    {plan.name}
                                </CardTitle>
                                <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-4 sm:mb-6">
                                    {plan.description}
                                </p>

                                <div className="flex items-baseline justify-center mb-4 sm:mb-6">
                                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
                                        ${plan.price}
                                    </span>
                                    <span className="text-slate-600 ml-2 text-base sm:text-lg">
                                        /{plan.period}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 px-4 sm:px-6 pb-6 sm:pb-8">
                                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    {plan.features.map(
                                        (feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start gap-2 sm:gap-3"
                                            >
                                                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                                                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600" />
                                                </div>
                                                <span className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                                                    {feature}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                                <Link href={plan.href}>
                                    <Button
                                        className={`w-full h-10 sm:h-12 font-semibold transition-all duration-200 text-sm sm:text-base ${
                                            plan.popular
                                                ? "bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-950 text-white hover:shadow-lg focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                                : "bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-slate-500 text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-50 focus:bg-slate-100 active:bg-slate-200 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
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
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto border border-slate-200 shadow-lg">
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 mb-2 sm:mb-3">
                            Start with a Free Trial
                        </h3>
                        <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                            All plans come with a 7-day free trial. No credit
                            card required. Cancel anytime.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center text-xs sm:text-sm text-slate-500">
                            <span>✓ No setup fees</span>
                            <span>✓ Cancel anytime</span>
                            <span>✓ 30-day money-back guarantee</span>
                        </div>
                    </div>
                </div>

                {/* Tutor CTA */}
                <div className="text-center">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto border border-slate-200 shadow-lg">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
                            Ready to Start Teaching?
                        </h3>
                        <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
                            Join our community of expert tutors and start
                            earning premium rates for your expertise.
                        </p>
                        <Link href="/auth/register?role=tutor">
                            <Button
                                variant="outline"
                                className="border-2 border-slate-300 hover:border-slate-400 focus:border-slate-500 text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-50 focus:bg-slate-100 active:bg-slate-200 font-semibold px-6 sm:px-8 h-10 sm:h-12 lg:h-14 transition-all duration-200 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
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
