"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../ui/Button"
import { useAuth } from "@/context/AuthContext"
import { Menu, X, LogOut, User } from "lucide-react"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleSignOut = () => {
        logout()
        router.push("/")
        setIsMenuOpen(false)
    }

    return (
        <nav className="w-full border-b-3 py-1.5 border-black bg-yellow-300 sticky top-0 z-50 shadow-[0_3px_0px_0px_black]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12 sm:h-14">
                    {/* Logo */}
                    <Link
                        href={user ? "/dashboard" : "/"}
                        className="flex items-center space-x-2 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform duration-100"
                    >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black border-2 border-black shadow-[3px_3px_0px_0px_black] flex items-center justify-center">
                            <span className="text-white font-black text-sm sm:text-base">
                                N
                            </span>
                        </div>
                        <span className="text-lg sm:text-xl font-black text-black uppercase tracking-wide">
                            NerdsOnCall
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                        {!user && (
                            <Link
                                href="/"
                                className="text-black font-bold text-xs uppercase tracking-wide px-2 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                            >
                                Home
                            </Link>
                        )}
                        {user && (
                            <Link
                                href="/dashboard"
                                className="text-black font-bold text-xs uppercase tracking-wide px-2 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                            >
                                Dashboard
                            </Link>
                        )}
                        {user && (
                            <Link
                                href="/questions"
                                className="text-black font-bold text-xs uppercase tracking-wide px-2 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                            >
                                Explore
                            </Link>
                        )}
                        <Link
                            href="/chat"
                            className="text-black font-bold text-xs uppercase tracking-wide px-2 py-1 border-2 border-black bg-cyan-400 shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                        >
                            AI Assistant
                        </Link>
                        <Link
                            href="/features"
                            className="text-black font-bold text-xs uppercase tracking-wide px-2 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                        >
                            Features
                        </Link>
                        {(!user || user.role === "STUDENT") && (
                            <Link
                                href="/pricing"
                                className="text-black font-bold text-xs uppercase tracking-wide px-2 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                            >
                                Pricing
                            </Link>
                        )}
                        <Link
                            href="/about"
                            className="text-black font-bold text-xs uppercase tracking-wide px-2 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                        >
                            About
                        </Link>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            // Logged in user - show user info and sign out
                            <>
                                <Link
                                    href={`/profile/${user.id}`}
                                    className="flex items-center space-x-1 text-xs font-bold text-black bg-pink-300 px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                                >
                                    <User className="h-3 w-3" />
                                    <span>Hi, {user.firstName}</span>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={handleSignOut}
                                    className="text-xs px-2 py-1 h-auto"
                                >
                                    <LogOut className="h-3 w-3 mr-1" />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            // Not logged in - show auth buttons
                            <>
                                <Link href="/auth/login">
                                    <Button
                                        variant="outline"
                                        className="text-xs px-2 py-1 h-auto"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button
                                        variant="default"
                                        className="text-xs px-2 py-1 h-auto"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t-4 border-black bg-orange-200">
                    <div className="px-4 py-4 space-y-3">
                        {!user && (
                            <Link
                                href="/"
                                className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                                onClick={toggleMenu}
                            >
                                Home
                            </Link>
                        )}
                        {user && (
                            <Link
                                href="/dashboard"
                                className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                                onClick={toggleMenu}
                            >
                                Dashboard
                            </Link>
                        )}
                        {user && (
                            <Link
                                href={`/profile/${user.id}`}
                                className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-pink-300 shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                                onClick={toggleMenu}
                            >
                                Profile
                            </Link>
                        )}
                        {user && (
                            <Link
                                href="/questions"
                                className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                                onClick={toggleMenu}
                            >
                                Explore
                            </Link>
                        )}
                        <Link
                            href="/chat"
                            className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-cyan-400 shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                            onClick={toggleMenu}
                        >
                            AI Assistant
                        </Link>
                        <Link
                            href="/features"
                            className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                            onClick={toggleMenu}
                        >
                            Features
                        </Link>
                        {(!user || user.role === "STUDENT") && (
                            <Link
                                href="/pricing"
                                className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                                onClick={toggleMenu}
                            >
                                Pricing
                            </Link>
                        )}
                        <Link
                            href="/about"
                            className="block text-black font-bold text-sm uppercase tracking-wide py-3 px-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all duration-100"
                            onClick={toggleMenu}
                        >
                            About
                        </Link>
                        <div className="border-t-3 border-black my-4" />
                        <div className="space-y-3">
                            {user ? (
                                // Logged in user - show user info and sign out
                                <>
                                    <Button
                                        variant="destructive"
                                        onClick={handleSignOut}
                                        className="w-full"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                // Not logged in - show auth buttons
                                <>
                                    <Link href="/auth/login">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={toggleMenu}
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button
                                            variant="default"
                                            className="w-full"
                                            onClick={toggleMenu}
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
