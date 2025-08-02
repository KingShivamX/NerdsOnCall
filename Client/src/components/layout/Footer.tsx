"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import {
    Crown,
    Sparkles,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
} from "lucide-react"

export function Footer() {
    const { user } = useAuth()

    const basePlatformLinks = [
        { name: "How It Works", href: "/how-it-works" },
        { name: "Features", href: "/features" },
        { name: "AI Assistant", href: "/chat" },
        { name: "For Students", href: "/students" },
        { name: "For Tutors", href: "/tutors" },
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
            { name: "Mathematics", href: "/subjects/mathematics" },
            { name: "Physics", href: "/subjects/physics" },
            { name: "Chemistry", href: "/subjects/chemistry" },
            { name: "Biology", href: "/subjects/biology" },
            { name: "Computer Science", href: "/subjects/computer-science" },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Press", href: "/press" },
            { name: "Blog", href: "/blog" },
            { name: "Contact", href: "/contact" },
        ],
        support: [
            { name: "Help Center", href: "/help" },
            { name: "Safety", href: "/safety" },
            { name: "Community", href: "/community" },
            { name: "Status", href: "/status" },
            { name: "API", href: "/api" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Cookie Policy", href: "/cookies" },
            { name: "GDPR", href: "/gdpr" },
            { name: "Refund Policy", href: "/refund" },
        ],
    }

    const socialLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: "https://facebook.com/nerdsoncall",
        },
        {
            name: "Twitter",
            icon: Twitter,
            href: "https://twitter.com/nerdsoncall",
        },
        {
            name: "Instagram",
            icon: Instagram,
            href: "https://instagram.com/nerdsoncall",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            href: "https://linkedin.com/company/nerdsoncall",
        },
        {
            name: "YouTube",
            icon: Youtube,
            href: "https://youtube.com/nerdsoncall",
        },
    ]

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-700/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-12">
                    {/* Top Section */}
                    <div className="grid lg:grid-cols-6 gap-12 mb-16">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                                        <Crown className="h-7 w-7 text-amber-400" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4">
                                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold text-white">
                                        NerdsOnCall
                                    </span>
                                    <div className="text-sm text-slate-300 font-medium">
                                        Premium Tutoring Platform
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-300 mb-8 leading-relaxed text-base">
                                Transforming education through premium online
                                tutoring. Connect with elite tutors worldwide
                                for personalized learning experiences that drive
                                academic excellence.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-slate-300">
                                    <Mail className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm">
                                        hello@nerdsoncall.com
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-300">
                                    <Phone className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm">
                                        +1 (555) 123-4567
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-300">
                                    <MapPin className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm">
                                        San Francisco, CA
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Links Sections */}
                        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-10">
                            {/* Platform */}
                            <div>
                                <h3 className="font-bold text-white mb-6 text-base">
                                    Platform
                                </h3>
                                <ul className="space-y-4">
                                    {footerLinks.platform.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm block py-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Subjects */}
                            <div>
                                <h3 className="font-bold text-white mb-6 text-base">
                                    Subjects
                                </h3>
                                <ul className="space-y-4">
                                    {footerLinks.subjects.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm block py-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="font-bold text-white mb-6 text-base">
                                    Company
                                </h3>
                                <ul className="space-y-4">
                                    {footerLinks.company.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm block py-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h3 className="font-bold text-white mb-6 text-base">
                                    Support
                                </h3>
                                <ul className="space-y-4">
                                    {footerLinks.support.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm block py-1"
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
                    <div className="border-t border-slate-700 pt-10">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                            {/* Copyright */}
                            <div className="text-slate-400 text-sm">
                                © {new Date().getFullYear()} NerdsOnCall. All
                                rights reserved.
                            </div>

                            {/* Legal Links */}
                            <div className="flex flex-wrap justify-center space-x-8">
                                {footerLinks.legal.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm py-1"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors duration-300 group border border-slate-700 hover:border-slate-600"
                                    >
                                        <social.icon className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors duration-300" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="border-t border-slate-700 pt-10 mt-10">
                        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 text-center">
                            <div className="flex items-center space-x-3 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium">
                                    99.9% Uptime
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium">
                                    Bank-Level Security
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium">
                                    24/7 Support
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium">
                                    50+ Countries
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
