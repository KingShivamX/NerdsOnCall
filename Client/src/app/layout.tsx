import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ReactQueryProvider } from "../components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "NerdsOnCall",
    description: "Connect with tutors instantly for live doubt resolution",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.png", type: "image/png" },
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    },
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
