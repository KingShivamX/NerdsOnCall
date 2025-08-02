import { Pricing } from "@/components/landing/Pricing"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-orange-100">
            <Navbar />
            <main className="pt-16 sm:pt-20">
                <Pricing />
            </main>
            <Footer />
        </div>
    )
}
