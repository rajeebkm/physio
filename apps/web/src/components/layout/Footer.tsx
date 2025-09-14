'use client';

import Link from 'next/link';
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

const footerLinks = {
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
    ],
    services: [
        { name: 'Online Consultations', href: '/consultations' },
        { name: 'Home Visits', href: '/home-visits' },
        { name: 'Physiotherapy', href: '/physiotherapy' },
        { name: 'Emergency Care', href: '/emergency' },
    ],
    support: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <HeartIcon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">PhysioCare</span>
                        </Link>
                        <p className="text-gray-400 mb-6">
                            Making quality healthcare accessible, convenient, and affordable for everyone across India.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-400">
                                <PhoneIcon className="h-4 w-4 mr-3" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <EnvelopeIcon className="h-4 w-4 mr-3" />
                                <span>support@physiocare.com</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <MapPinIcon className="h-4 w-4 mr-3" />
                                <span>Available in 50+ cities across India</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Services</h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 PhysioCare. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}