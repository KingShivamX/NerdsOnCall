import { Navbar } from "../components/layout/Navbar"
import { Footer } from "../components/layout/Footer"
import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features"
import { HowItWorks } from "../components/landing/HowItWorks"
import { Pricing } from "../components/landing/Pricing"

export default function HomePage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Beautiful Background Blur Balls with Custom Animations - BIGGER SIZES */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Large morphing blur orbs - MUCH BIGGER */}
                <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl blur-orb-float"></div>
                <div
                    className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/25 to-teal-500/25 rounded-full mix-blend-multiply filter blur-3xl blur-orb-drift"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-40 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl blur-orb-slow"
                    style={{ animationDelay: "4s" }}
                ></div>
                <div
                    className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full mix-blend-multiply filter blur-3xl blur-orb-float"
                    style={{ animationDelay: "6s" }}
                ></div>
                <div
                    className="absolute bottom-20 right-1/3 w-[520px] h-[520px] bg-gradient-to-br from-slate-400/20 to-gray-500/20 rounded-full mix-blend-multiply filter blur-3xl blur-orb-drift"
                    style={{ animationDelay: "8s" }}
                ></div>

                {/* Medium floating orbs - BIGGER */}
                <div
                    className="absolute top-1/3 left-1/2 w-[350px] h-[350px] bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-2xl blur-orb-slow"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-1/3 left-20 w-[400px] h-[400px] bg-gradient-to-br from-rose-400/20 to-red-500/20 rounded-full mix-blend-multiply filter blur-2xl blur-orb-float"
                    style={{ animationDelay: "3s" }}
                ></div>
                <div
                    className="absolute top-2/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-green-400/25 to-emerald-500/25 rounded-full mix-blend-multiply filter blur-2xl blur-orb-drift"
                    style={{ animationDelay: "5s" }}
                ></div>

                {/* Small breathing orbs - BIGGER */}
                <div
                    className="absolute top-1/4 left-3/4 w-[250px] h-[250px] bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-full mix-blend-multiply filter blur-xl blur-orb-float"
                    style={{ animationDelay: "7s" }}
                ></div>
                <div
                    className="absolute bottom-1/4 left-1/2 w-[200px] h-[200px] bg-gradient-to-br from-indigo-400/25 to-purple-500/25 rounded-full mix-blend-multiply filter blur-xl blur-orb-slow"
                    style={{ animationDelay: "9s" }}
                ></div>

                {/* Extra dynamic orbs for more depth - BIGGER */}
                <div
                    className="absolute top-10 left-1/3 w-[280px] h-[280px] bg-gradient-to-br from-fuchsia-400/20 to-violet-500/20 rounded-full mix-blend-multiply filter blur-2xl blur-orb-drift"
                    style={{ animationDelay: "11s" }}
                ></div>
                <div
                    className="absolute bottom-10 right-1/2 w-[220px] h-[220px] bg-gradient-to-br from-lime-400/25 to-green-500/25 rounded-full mix-blend-multiply filter blur-xl blur-orb-float"
                    style={{ animationDelay: "13s" }}
                ></div>

                {/* Additional massive orbs for extra drama */}
                <div
                    className="absolute top-0 left-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-300/10 to-indigo-400/10 rounded-full mix-blend-multiply filter blur-3xl blur-orb-slow"
                    style={{ animationDelay: "15s" }}
                ></div>
                <div
                    className="absolute bottom-0 right-0 w-[650px] h-[650px] bg-gradient-to-br from-emerald-300/12 to-teal-400/12 rounded-full mix-blend-multiply filter blur-3xl blur-orb-float"
                    style={{ animationDelay: "17s" }}
                ></div>
            </div>

            <Navbar />
            <main className="relative z-10">
                {/* Hero Section - full screen with consistent bottom spacing */}
                <div className="min-h-screen flex items-center pt-20 pb-16 lg:pb-20">
                    <Hero />
                </div>

                {/* Features Section - consistent top and bottom spacing */}
                <div className="py-16 lg:py-20">
                    <Features />
                </div>

                {/* How It Works Section - consistent top and bottom spacing */}
                <div className="py-16 lg:py-20">
                    <HowItWorks />
                </div>

                {/* Pricing Section - consistent top and bottom spacing */}
                <div className="py-16 lg:py-20">
                    <Pricing />
                </div>
            </main>
            <Footer />
        </div>
    )
}
