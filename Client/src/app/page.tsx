import { Navbar } from "../components/layout/Navbar"
import { Footer } from "../components/layout/Footer"
import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features"
import { HowItWorks } from "../components/landing/HowItWorks"
import { Pricing } from "../components/landing/Pricing"

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                <Hero />
                <Features />
                <HowItWorks />
                <Pricing />
            </main>
            <Footer />
        </div>
    )
}
