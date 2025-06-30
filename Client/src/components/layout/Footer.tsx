import Link from "next/link"
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
    const footerLinks = {
        platform: [
            { name: "How It Works", href: "/how-it-works" },
            { name: "Features", href: "/features" },
            { name: "Pricing", href: "/pricing" },
            { name: "For Students", href: "/students" },
            { name: "For Tutors", href: "/tutors" },
        ],
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
        <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                    {/* Top Section */}
                    <div className="grid lg:grid-cols-6 gap-8 mb-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full royal-gradient flex items-center justify-center">
                                        <Crown className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4">
                                        <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold royal-text">
                                        NerdsOnCall
                                    </span>
                                    <div className="text-xs text-gray-300">
                                        Premium Tutoring Platform
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Transforming education through premium online
                                tutoring. Connect with elite tutors worldwide
                                for personalized learning experiences that drive
                                academic excellence.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <Mail className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm">
                                        hello@nerdsoncall.com
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <Phone className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm">
                                        +1 (555) 123-4567
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm">
                                        San Francisco, CA
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Links Sections */}
                        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {/* Platform */}
                            <div>
                                <h3 className="font-bold text-white mb-4">
                                    Platform
                                </h3>
                                <ul className="space-y-3">
                                    {footerLinks.platform.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Subjects */}
                            <div>
                                <h3 className="font-bold text-white mb-4">
                                    Subjects
                                </h3>
                                <ul className="space-y-3">
                                    {footerLinks.subjects.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h3 className="font-bold text-white mb-4">
                                    Company
                                </h3>
                                <ul className="space-y-3">
                                    {footerLinks.company.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h3 className="font-bold text-white mb-4">
                                    Support
                                </h3>
                                <ul className="space-y-3">
                                    {footerLinks.support.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="border-t border-gray-800 pt-8 mb-8">
                        <div className="max-w-md">
                            <h3 className="font-bold text-white mb-4">
                                Stay Updated
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Get the latest updates on new features,
                                subjects, and exclusive offers.
                            </p>
                            <div className="flex space-x-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button className="px-6 py-2 royal-gradient text-white rounded-lg font-medium hover:glow transition-all duration-300">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            {/* Copyright */}
                            <div className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} NerdsOnCall. All
                                rights reserved.
                            </div>

                            {/* Legal Links */}
                            <div className="flex flex-wrap justify-center space-x-6">
                                {footerLinks.legal.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
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
                                        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300 group"
                                    >
                                        <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="border-t border-gray-800 pt-8 mt-8">
                        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-center">
                            <div className="flex items-center space-x-2 text-gray-400">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm">99.9% Uptime</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm">
                                    Bank-Level Security
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm">24/7 Support</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm">50+ Countries</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
