import { Navbar } from "../components/layout/Navbar"
import { Footer } from "../components/layout/Footer"
import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features"
import { HowItWorks } from "../components/landing/HowItWorks"
import { Pricing } from "../components/landing/Pricing"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="min-h-screen flex items-center pt-16 pb-16">
                    <Hero />
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <Features />
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-slate-50">
                    <HowItWorks />
                </section>

                {/* Pricing Section */}
                <section className="py-16 bg-white">
                    <Pricing />
                </section>
            </main>
            <Footer />
        </div>
    )
}
