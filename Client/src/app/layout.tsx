import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ReactQueryProvider } from "../components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "NerdsOnCall - Real-Time Doubt Solving Platform",
    description: "Connect with tutors instantly for live doubt resolution",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning={true}>
                <ReactQueryProvider>
                    <div className="min-h-screen bg-background">
                        {children}
                        <Toaster position="top-right" />
                    </div>
                </ReactQueryProvider>
            </body>
        </html>
    )
}
