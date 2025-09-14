'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    Play,
    ArrowRight,
    Users,
    MapPin,
    Clock,
    Phone,
    Shield,
    Heart,
    Star,
    CheckCircle,
    Calendar
} from 'lucide-react';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const stats = [
        { icon: Users, value: '10,000+', label: 'Happy Patients', color: 'text-primary' },
        { icon: MapPin, value: '500+', label: 'Expert Doctors', color: 'text-secondary' },
        { icon: Clock, value: '50+', label: 'Cities Covered', color: 'text-accent' },
    ];

    const features = [
        {
            icon: Phone,
            title: "Online Consultations",
            description: "Connect with doctors instantly through secure video calls from anywhere in India.",
            color: "text-primary",
            bgColor: "bg-primary-light"
        },
        {
            icon: MapPin,
            title: "Home Visits",
            description: "Get physiotherapy and medical care delivered right to your doorstep by certified professionals.",
            color: "text-secondary",
            bgColor: "bg-secondary-light"
        },
        {
            icon: Clock,
            title: "24/7 Availability",
            description: "Access healthcare services round the clock, whenever you need them most.",
            color: "text-accent",
            bgColor: "bg-accent-light"
        },
        {
            icon: Shield,
            title: "Verified Doctors",
            description: "All our healthcare providers are thoroughly verified, licensed, and background-checked.",
            color: "text-success",
            bgColor: "bg-green-50"
        },
        {
            icon: Heart,
            title: "Personalized Care",
            description: "Receive customized treatment plans tailored to your specific health needs and goals.",
            color: "text-pink-500",
            bgColor: "bg-pink-50"
        },
        {
            icon: Users,
            title: "Expert Team",
            description: "Access to India's top doctors and physiotherapists in every medical specialty.",
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-25 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">PhysioCare</span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
                            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">How it Works</a>
                            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
                            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
                            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
                        </nav>

                        {/* Emergency Contact & CTA */}
                        <div className="flex items-center space-x-6">
                            <div className="hidden lg:flex items-center text-gray-700">
                                <Phone className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">Emergency: 1800-123-4567</span>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Appointment
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32">
                    {/* Background Image Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/physio.jpg"
                            alt="Medical professional background"
                            fill
                            className="object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-white/70"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                    Your Health,{' '}
                                    <span className="text-blue-600">Our Priority</span>
                                </h1>

                                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    Connect with India's top doctors and physiotherapists for personalized care,
                                    right from your home or at our clinics. Experience healthcare like never before.
                                </p>

                                {/* Search Bar */}
                                <form onSubmit={handleSearch} className="max-w-md mx-auto lg:mx-0 mb-8">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search doctors, conditions, treatments..."
                                            className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 shadow-sm"
                                        />
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </form>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
                                        Book Consultation
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-lg">
                                        <Play className="mr-2 h-5 w-5" />
                                        Watch Demo
                                    </Button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center lg:text-left">
                                            <div className="flex items-center justify-center lg:justify-start mb-2">
                                                <stat.icon className={`h-6 w-6 ${stat.color} mr-3`} />
                                                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                                            </div>
                                            <p className="text-gray-600 font-medium">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Image Card */}
                            <div className="relative lg:block hidden">
                                <div className="relative">
                                    {/* Main Card with Medical Image */}
                                    <div className="w-full h-96 bg-white rounded-3xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src="/physio.jpg"
                                                alt="Medical professional caring for patient"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30"></div>
                                        </div>
                                    </div>

                                    {/* Floating Cards */}
                                    <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Live Consultation</p>
                                                <p className="text-xs text-gray-500">24/7 Available</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">4.9★</div>
                                            <p className="text-xs text-gray-500">Patient Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="services" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose{' '}
                                <span className="text-blue-600">PhysioCare?</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We provide comprehensive healthcare solutions that make quality medical care
                                accessible, convenient, and affordable for everyone across India.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`h-7 w-7 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                How It Works
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Getting started with PhysioCare is simple and straightforward.
                                Follow these easy steps to begin your healthcare journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: "1",
                                    title: "Sign Up & Profile",
                                    description: "Create your account and complete your health profile in just a few minutes.",
                                    icon: Users,
                                    color: "blue"
                                },
                                {
                                    step: "2",
                                    title: "Find & Book",
                                    description: "Search for doctors or physiotherapists and book appointments that fit your schedule.",
                                    icon: Calendar,
                                    color: "green"
                                },
                                {
                                    step: "3",
                                    title: "Get Care",
                                    description: "Attend your consultation online or receive home visits from qualified professionals.",
                                    icon: Heart,
                                    color: "purple"
                                }
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    className="text-center group"
                                >
                                    <div className="relative mb-6">
                                        <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center text-2xl font-bold text-${step.color}-600 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                            {step.step}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-md">
                                            <step.icon className={`h-4 w-4 text-${step.color}-600`} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Choose the plan that works best for you. No hidden fees, no surprises.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Basic",
                                    price: "₹299",
                                    period: "per consultation",
                                    description: "Perfect for occasional healthcare needs",
                                    features: [
                                        "Online consultations",
                                        "Basic health records",
                                        "Email support",
                                        "Mobile app access"
                                    ],
                                    popular: false,
                                    color: "border-gray-200"
                                },
                                {
                                    name: "Premium",
                                    price: "₹999",
                                    period: "per month",
                                    description: "Most popular for regular healthcare",
                                    features: [
                                        "Unlimited consultations",
                                        "Home visits included",
                                        "Priority support",
                                        "Advanced health tracking",
                                        "Family plan (up to 4 members)",
                                        "Prescription management"
                                    ],
                                    popular: true,
                                    color: "border-blue-500"
                                },
                                {
                                    name: "Enterprise",
                                    price: "Custom",
                                    period: "contact us",
                                    description: "For organizations and large families",
                                    features: [
                                        "Everything in Premium",
                                        "Dedicated account manager",
                                        "Custom integrations",
                                        "Bulk appointment scheduling",
                                        "Advanced analytics",
                                        "24/7 phone support"
                                    ],
                                    popular: false,
                                    color: "border-gray-200"
                                }
                            ].map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-white border-2 ${plan.color} rounded-2xl p-8 hover:shadow-lg transition-all ${plan.popular ? 'shadow-lg' : 'hover:shadow-md'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <div className="text-4xl font-bold text-gray-900 mb-2">
                                            {plan.price}
                                            <span className="text-lg font-normal text-gray-500">/{plan.period}</span>
                                        </div>
                                        <p className="text-gray-600">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full py-3 px-6 text-sm font-medium rounded-lg transition-all ${plan.popular
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                What Our Patients Say
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Don't just take our word for it. Here's what our patients have to say
                                about their experience with PhysioCare.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Priya Sharma",
                                    role: "Software Engineer, Mumbai",
                                    content: "The home physiotherapy service was amazing. The therapist was professional and helped me recover quickly from my back pain.",
                                    rating: 5,
                                    avatar: "PS"
                                },
                                {
                                    name: "Rajesh Kumar",
                                    role: "Business Owner, Delhi",
                                    content: "Online consultation with Dr. Singh was very convenient. I got expert advice without leaving my home.",
                                    rating: 5,
                                    avatar: "RK"
                                },
                                {
                                    name: "Anita Patel",
                                    role: "Teacher, Bangalore",
                                    content: "The platform is easy to use and the doctors are very knowledgeable. Highly recommended for quality healthcare.",
                                    rating: 5,
                                    avatar: "AP"
                                }
                            ].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-6 italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                                            <div className="text-gray-500 text-xs">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Healthcare Experience?
                        </h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of patients and healthcare professionals who are already
                            experiencing the future of healthcare. Start your journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="px-8 py-4 text-lg font-medium bg-white text-blue-600 hover:bg-gray-100 rounded-lg transition-all hover:scale-105">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 inline" />
                            </Button>
                            <Button variant="outline" className="px-8 py-4 text-lg font-medium border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg transition-all">
                                Download App
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">P</span>
                                </div>
                                <span className="text-xl font-bold">PhysioCare</span>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Making quality healthcare accessible, convenient, and affordable for everyone across India.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-400">
                                    <Phone className="h-4 w-4 mr-3" />
                                    <span>+91 98765 43210</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                    <MapPin className="h-4 w-4 mr-3" />
                                    <span>Available in 50+ cities across India</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Company</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Team</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                            </ul>
                        </div>

                        {/* Services Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Services</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Online Consultations</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home Visits</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Physiotherapy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Emergency Care</a></li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Support</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
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
                                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}