"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import {
    Crown,
    Menu,
    X,
    LogOut,
    User,
    Settings,
    CreditCard,
    BookOpen,
    Sparkles,
} from "lucide-react"

export function Navbar() {
    const { user, logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isAuthenticated = !!user

    const handleLogout = () => {
        logout()
        setIsMenuOpen(false)
    }

    return (
        <nav className="fixed top-0 w-full z-50 royal-nav border-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Royal Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-3 group"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full royal-gradient flex items-center justify-center group-hover:glow transition-all duration-300">
                                <Crown className="h-7 w-7 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4">
                                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-bold royal-text">
                                NerdsOnCall
                            </span>
                            <div className="text-xs text-gray-500 font-medium">
                                Premium Tutoring
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    href="/features"
                                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                                >
                                    How It Works
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <Link href="/auth/login">
                                        <Button
                                            variant="ghost"
                                            className="text-purple-700 hover:text-purple-800 hover:bg-purple-50 font-medium"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button className="premium-button text-white border-0 px-6 font-medium">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        variant="ghost"
                                        className="text-purple-700 hover:text-purple-800 hover:bg-purple-50 font-medium"
                                    >
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>

                                {/* User Profile Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-12 w-12 rounded-full p-0"
                                        >
                                            <Avatar className="h-12 w-12 border-2 border-purple-200 hover:border-purple-400 transition-colors">
                                                <AvatarImage
                                                    src={
                                                        user.profilePicture ||
                                                        undefined
                                                    }
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                />
                                                <AvatarFallback className="royal-gradient text-white font-bold">
                                                    {user.firstName[0]}
                                                    {user.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {user.role === "TUTOR" && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute -bottom-2 -right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0 border-0"
                                                >
                                                    <Crown className="w-3 h-3" />
                                                </Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-64 luxury-card border-0"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-bold leading-none">
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </p>
                                                    {user.role === "TUTOR" && (
                                                        <Crown className="w-4 h-4 text-yellow-600" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    {user.email}
                                                </p>
                                                <Badge
                                                    variant={
                                                        user.role === "TUTOR"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="w-fit text-xs"
                                                >
                                                    {user.role === "TUTOR"
                                                        ? "Elite Tutor"
                                                        : "Premium Student"}
                                                </Badge>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Billing</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600 focus:text-red-600"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="luxury-card border-0 w-80"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full royal-gradient flex items-center justify-center">
                                                <Crown className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-lg font-bold royal-text">
                                                NerdsOnCall
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile Navigation */}
                                    <div className="flex-1">
                                        {!isAuthenticated ? (
                                            <div className="space-y-4">
                                                <Link
                                                    href="/features"
                                                    className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    Features
                                                </Link>
                                                <Link
                                                    href="/pricing"
                                                    className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    Pricing
                                                </Link>
                                                <Link
                                                    href="/how-it-works"
                                                    className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    How It Works
                                                </Link>
                                                <div className="border-t pt-4 mt-6 space-y-3">
                                                    <Link
                                                        href="/auth/login"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start"
                                                        >
                                                            Sign In
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href="/auth/register"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                    >
                                                        <Button className="w-full premium-button text-white border-0">
                                                            Get Started
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {/* User Info */}
                                                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage
                                                            src={
                                                                user.profilePicture ||
                                                                undefined
                                                            }
                                                            alt={`${user.firstName} ${user.lastName}`}
                                                        />
                                                        <AvatarFallback className="royal-gradient text-white font-bold">
                                                            {user.firstName[0]}
                                                            {user.lastName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-1">
                                                            <p className="font-bold text-sm">
                                                                {user.firstName}{" "}
                                                                {user.lastName}
                                                            </p>
                                                            {user.role ===
                                                                "TUTOR" && (
                                                                <Crown className="w-4 h-4 text-yellow-600" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600">
                                                            {user.email}
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                user.role ===
                                                                "TUTOR"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className="w-fit text-xs mt-1"
                                                        >
                                                            {user.role ===
                                                            "TUTOR"
                                                                ? "Elite Tutor"
                                                                : "Premium Student"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Mobile Menu Items */}
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <BookOpen className="w-5 h-5 mr-3" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <User className="w-5 h-5 mr-3" />
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <Settings className="w-5 h-5 mr-3" />
                                                    Settings
                                                </Link>
                                                <Link
                                                    href="/billing"
                                                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <CreditCard className="w-5 h-5 mr-3" />
                                                    Billing
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Logout */}
                                    {isAuthenticated && (
                                        <div className="border-t pt-4">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="w-5 h-5 mr-3" />
                                                Log out
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
