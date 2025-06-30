"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
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
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-4 group"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                                <Crown className="h-6 w-6 text-amber-400" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4">
                                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-slate-800">
                                NerdsOnCall
                            </span>
                            <div className="text-xs text-slate-500 font-medium">
                                Premium Tutoring
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    href="/features"
                                    className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 py-2"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 py-2"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 py-2"
                                >
                                    How It Works
                                </Link>
                                <div className="flex items-center space-x-4 ml-8">
                                    <Link href="/auth/login">
                                        <Button
                                            variant="ghost"
                                            className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium px-6 h-11"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 px-6 h-11 font-medium shadow-lg">
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
                                        className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium px-6 h-11"
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
                                            <Avatar className="h-12 w-12 border-2 border-slate-200 hover:border-slate-400 transition-colors">
                                                <AvatarImage
                                                    src={
                                                        user.profilePicture ||
                                                        undefined
                                                    }
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold">
                                                    {user.firstName[0]}
                                                    {user.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {user.role === "TUTOR" && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute -bottom-2 -right-2 bg-amber-100 text-amber-800 text-xs px-2 py-0 border-0"
                                                >
                                                    <Crown className="w-3 h-3" />
                                                </Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-64 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="font-normal p-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-bold leading-none text-slate-800">
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </p>
                                                    {user.role === "TUTOR" && (
                                                        <Crown className="w-4 h-4 text-amber-600" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-600">
                                                    {user.email}
                                                </p>
                                                <Badge
                                                    variant={
                                                        user.role === "TUTOR"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className={`w-fit text-xs ${
                                                        user.role === "TUTOR"
                                                            ? "bg-slate-700 text-white"
                                                            : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    {user.role === "TUTOR"
                                                        ? "Elite Tutor"
                                                        : "Premium Student"}
                                                </Badge>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-slate-200" />
                                        <DropdownMenuItem className="cursor-pointer p-3 text-slate-700 hover:bg-slate-50">
                                            <User className="mr-3 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer p-3 text-slate-700 hover:bg-slate-50">
                                            <Settings className="mr-3 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer p-3 text-slate-700 hover:bg-slate-50">
                                            <CreditCard className="mr-3 h-4 w-4" />
                                            <span>Billing</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-200" />
                                        <DropdownMenuItem
                                            className="cursor-pointer p-3 text-red-600 focus:text-red-600 hover:bg-red-50"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
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
                                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 w-11 h-11"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="bg-white/95 backdrop-blur-sm border-l border-slate-200 w-80"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between mb-8 pt-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                                                <Crown className="h-5 w-5 text-amber-400" />
                                            </div>
                                            <span className="text-lg font-bold text-slate-800">
                                                NerdsOnCall
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile Navigation */}
                                    <div className="flex-1">
                                        {!isAuthenticated ? (
                                            <div className="space-y-2">
                                                <Link
                                                    href="/features"
                                                    className="block py-4 px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    Features
                                                </Link>
                                                <Link
                                                    href="/pricing"
                                                    className="block py-4 px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    Pricing
                                                </Link>
                                                <Link
                                                    href="/how-it-works"
                                                    className="block py-4 px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    How It Works
                                                </Link>
                                                <div className="border-t border-slate-200 pt-6 mt-6 space-y-3">
                                                    <Link
                                                        href="/auth/login"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start h-12 border-slate-300 text-slate-700 hover:bg-slate-50"
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
                                                        <Button className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white border-0 h-12 shadow-lg">
                                                            Get Started
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {/* User Info */}
                                                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg mb-6">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage
                                                            src={
                                                                user.profilePicture ||
                                                                undefined
                                                            }
                                                            alt={`${user.firstName} ${user.lastName}`}
                                                        />
                                                        <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold">
                                                            {user.firstName[0]}
                                                            {user.lastName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-1">
                                                            <p className="font-bold text-sm text-slate-800">
                                                                {user.firstName}{" "}
                                                                {user.lastName}
                                                            </p>
                                                            {user.role ===
                                                                "TUTOR" && (
                                                                <Crown className="w-4 h-4 text-amber-600" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-600">
                                                            {user.email}
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                user.role ===
                                                                "TUTOR"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={`w-fit text-xs mt-1 ${
                                                                user.role ===
                                                                "TUTOR"
                                                                    ? "bg-slate-700 text-white"
                                                                    : "bg-slate-200 text-slate-700"
                                                            }`}
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
                                                    className="flex items-center py-4 px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <BookOpen className="w-5 h-5 mr-3" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center py-4 px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <User className="w-5 h-5 mr-3" />
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center py-4 px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <Settings className="w-5 h-5 mr-3" />
                                                    Settings
                                                </Link>
                                                <Link
                                                    href="/billing"
                                                    className="flex items-center py-4 px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
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
                                        <div className="border-t border-slate-200 pt-4">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-12"
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
