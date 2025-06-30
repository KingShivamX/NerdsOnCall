"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../ui/Button"
import { Avatar } from "../ui/Avatar"
import { Menu, X, GraduationCap } from "lucide-react"

export function Navbar() {
    const { user, logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isAuthenticated = !!user

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-gray-900">
                            NerdsOnCall
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="#features"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            How it Works
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Pricing
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard">
                                    <Button variant="outline">Dashboard</Button>
                                </Link>
                                <div className="relative group">
                                    <Avatar
                                        src={user?.profilePicture}
                                        alt={
                                            `${user?.firstName} ${user?.lastName}` ||
                                            "User"
                                        }
                                        size="sm"
                                        className="cursor-pointer"
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <Link
                                            href="/dashboard/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/dashboard/sessions"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sessions
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/auth/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="#features"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Features
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                How it Works
                            </Link>
                            <Link
                                href="#pricing"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Pricing
                            </Link>

                            {isAuthenticated ? (
                                <div className="flex flex-col space-y-2 pt-4 border-t">
                                    <Link href="/dashboard">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-left text-gray-600 hover:text-gray-900"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-4 border-t">
                                    <Link href="/auth/login">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
