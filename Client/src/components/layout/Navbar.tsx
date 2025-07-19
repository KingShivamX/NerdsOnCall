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
        <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm sm:text-base">
                                N
                            </span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-slate-800">
                            NerdsOnCall
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {!user && (
                            <Link
                                href="/"
                                className="text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium transition-colors duration-200 text-sm"
                            >
                                Home
                            </Link>
                        )}
                        <Link
                            href="#features"
                            className="text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium transition-colors duration-200 text-sm"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium transition-colors duration-200 text-sm"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#about"
                            className="text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium transition-colors duration-200 text-sm"
                        >
                            About
                        </Link>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            // Logged in user - show user info and sign out
                            <>
                                <div className="flex items-center space-x-2 text-sm text-slate-700">
                                    <User className="h-4 w-4" />
                                    <span>Hi, {user.firstName}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={handleSignOut}
                                    className="text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-100 focus:bg-slate-200 active:bg-slate-300 px-3 py-1.5 text-sm font-medium h-8 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            // Not logged in - show auth buttons
                            <>
                                <Link href="/auth/login">
                                    <Button
                                        variant="ghost"
                                        className="text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-100 focus:bg-slate-200 active:bg-slate-300 px-3 py-1.5 text-sm font-medium h-8 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button className="bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-950 text-white px-4 py-1.5 text-sm font-medium h-8 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMenu}
                            className="text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-100 focus:bg-slate-200 active:bg-slate-300 p-2 h-8 w-8 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        >
                            {isMenuOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {!user && (
                            <Link
                                href="/"
                                className="block text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium py-2 px-3 rounded-md hover:bg-slate-100 focus:bg-slate-200 transition-colors duration-200 text-sm"
                                onClick={toggleMenu}
                            >
                                Home
                            </Link>
                        )}
                        <Link
                            href="#features"
                            className="block text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium py-2 px-3 rounded-md hover:bg-slate-100 focus:bg-slate-200 transition-colors duration-200 text-sm"
                            onClick={toggleMenu}
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="block text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium py-2 px-3 rounded-md hover:bg-slate-100 focus:bg-slate-200 transition-colors duration-200 text-sm"
                            onClick={toggleMenu}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#about"
                            className="block text-slate-700 hover:text-slate-800 focus:text-slate-900 font-medium py-2 px-3 rounded-md hover:bg-slate-100 focus:bg-slate-200 transition-colors duration-200 text-sm"
                            onClick={toggleMenu}
                        >
                            About
                        </Link>
                        <hr className="border-slate-200 my-3" />
                        <div className="space-y-2">
                            {user ? (
                                // Logged in user - show user info and sign out
                                <>
                                    <div className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700">
                                        <User className="h-4 w-4" />
                                        <span>Hi, {user.firstName}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={handleSignOut}
                                        className="w-full justify-start text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-100 focus:bg-slate-200 active:bg-slate-300 px-3 py-2 text-sm font-medium h-9 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
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
                                            variant="ghost"
                                            className="w-full justify-start text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-100 focus:bg-slate-200 active:bg-slate-300 px-3 py-2 text-sm font-medium h-9 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                            onClick={toggleMenu}
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button
                                            className="w-full bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-950 text-white px-3 py-2 text-sm font-medium h-9 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
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
