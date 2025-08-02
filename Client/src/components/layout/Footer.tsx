"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Crown, Sparkles, Mail } from "lucide-react"

export function Footer() {
    const { user } = useAuth()

    const basePlatformLinks = [
        { name: "Features", href: "/features" },
        { name: "About", href: "/about" },
        { name: "Browse Tutors", href: "/browse-tutors" },
    ]

    // Add pricing link only for students or non-logged-in users
    const platformLinks =
        !user || user.role === "STUDENT"
            ? [
                  ...basePlatformLinks.slice(0, 2), // How It Works, Features
                  { name: "Pricing", href: "/pricing" },
                  ...basePlatformLinks.slice(2), // For Students, For Tutors
              ]
            : basePlatformLinks

    const footerLinks = {
        platform: platformLinks,
        subjects: [
            { name: "Mathematics", href: "/browse-tutors" },
            { name: "Physics", href: "/browse-tutors" },
            { name: "Chemistry", href: "/browse-tutors" },
            { name: "Biology", href: "/browse-tutors" },
            { name: "Computer Science", href: "/browse-tutors" },
        ],
        company: [{ name: "About Us", href: "/about" }],
        support: [
            { name: "Dashboard", href: "/dashboard" },
            { name: "My Questions", href: "/my-questions" },
            { name: "Browse Tutors", href: "/browse-tutors" },
        ],
        legal: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
        ],
    }

    return (
        <footer className="bg-black text-white border-t-3 border-white relative">
            <div className="relative">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    {/* Top Section */}
                    <div className="grid lg:grid-cols-6 gap-6 mb-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-yellow-400 border-3 border-white shadow-[4px_4px_0px_0px_white] flex items-center justify-center">
                                        <Crown className="h-6 w-6 text-black" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4">
                                        <Sparkles className="w-3 h-3 text-yellow-400" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xl font-black text-white uppercase tracking-wide">
                                        NerdsOnCall
                                    </span>
                                    <div className="text-sm text-white font-bold uppercase tracking-wide">
                                        Doubt Solving Platform
                                    </div>
                                </div>
                            </div>

                            <p className="text-black mb-4 leading-relaxed text-sm font-bold bg-cyan-400 p-3 border-3 border-white shadow-[3px_3px_0px_0px_white]">
                                Connect with tutors for instant doubt resolution
                                through live video calls and video solutions.
                                Get help when you need it.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-black bg-pink-400 p-2 border-2 border-white shadow-[2px_2px_0px_0px_white] w-fit">
                                    <Mail className="w-4 h-4 text-black" />
                                    <span className="text-sm font-bold">
                                        support@nerdsoncall.com
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Links Sections */}
                        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Platform */}
                            <div>
                                <h3 className="font-black mb-3 text-sm uppercase tracking-wide bg-yellow-400 text-black p-2 border-2 border-white shadow-[2px_2px_0px_0px_white]">
                                    Platform
                                </h3>
                                <ul className="space-y-2">
                                    {footerLinks.platform.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-white font-bold text-md block py-1 px-2 border-2 border-white hover:bg-white hover:text-black transition-all duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_white]"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Subjects */}
                            <div>
                                <h3 className="font-black mb-3 text-sm uppercase tracking-wide bg-pink-400 text-black p-2 border-2 border-white shadow-[2px_2px_0px_0px_white]">
                                    Subjects
                                </h3>
                                <ul className="space-y-2">
                                    {footerLinks.subjects.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-white font-bold text-md block py-1 px-2 border-2 border-white hover:bg-white hover:text-black transition-all duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_white]"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="font-black mb-3 text-sm uppercase tracking-wide bg-cyan-400 text-black p-2 border-2 border-white shadow-[2px_2px_0px_0px_white]">
                                    Company
                                </h3>
                                <ul className="space-y-2">
                                    {footerLinks.company.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-white font-bold text-md block py-1 px-2 border-2 border-white hover:bg-white hover:text-black transition-all duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_white]"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h3 className="font-black mb-3 text-sm uppercase tracking-wide bg-lime-400 text-black p-2 border-2 border-white shadow-[2px_2px_0px_0px_white]">
                                    Support
                                </h3>
                                <ul className="space-y-2">
                                    {footerLinks.support.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-white font-bold text-md block py-1 px-2 border-2 border-white hover:bg-white hover:text-black transition-all duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_white]"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t-3 border-white pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            {/* Copyright */}
                            <div className="text-sm font-bold bg-orange-400 text-black px-3 py-1 border-2 border-white shadow-[2px_2px_0px_0px_white]">
                                © {new Date().getFullYear()} NerdsOnCall. All
                                rights reserved.
                            </div>

                            {/* Legal Links */}
                            <div className="flex flex-wrap justify-center space-x-3">
                                {footerLinks.legal.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-white font-bold text-xs py-1 px-2 border-2 border-white hover:bg-white hover:text-black transition-all duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_white]"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="border-t-3 border-white pt-6 mt-6">
                        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 text-center">
                            <div className="flex items-center space-x-2 text-black bg-green-400 px-3 py-2 border-2 border-white shadow-[3px_3px_0px_0px_white]">
                                <div className="w-6 h-6 bg-black border-2 border-white shadow-[2px_2px_0px_0px_white] flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white"></div>
                                </div>
                                <span className="text-xs font-black uppercase tracking-wide">
                                    Secure Platform
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-black bg-blue-400 px-3 py-2 border-2 border-white shadow-[3px_3px_0px_0px_white]">
                                <div className="w-6 h-6 bg-black border-2 border-white shadow-[2px_2px_0px_0px_white] flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white"></div>
                                </div>
                                <span className="text-xs font-black uppercase tracking-wide">
                                    Video Call Support
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-black bg-yellow-400 px-3 py-2 border-2 border-white shadow-[3px_3px_0px_0px_white]">
                                <div className="w-6 h-6 bg-black border-2 border-white shadow-[2px_2px_0px_0px_white] flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white"></div>
                                </div>
                                <span className="text-xs font-black uppercase tracking-wide">
                                    Multiple Subjects
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
