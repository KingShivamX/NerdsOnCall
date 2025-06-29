import Link from "next/link"
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 mb-4"
                        >
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">
                                NerdsOnCall
                            </span>
                        </Link>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Connect with expert tutors instantly for live
                            doubt-solving sessions. Learn effectively with video
                            calls, interactive whiteboard, and screen sharing.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-300">
                                <Mail className="h-4 w-4" />
                                <span>support@nerdsoncall.com</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-300">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-300">
                                <MapPin className="h-4 w-4" />
                                <span>San Francisco, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#features"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#how-it-works"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#pricing"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/auth/register"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Get Started
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/help"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-300 text-sm">
                        © 2024 NerdsOnCall. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link
                            href="/privacy"
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                            Terms
                        </Link>
                        <Link
                            href="/cookies"
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
