'use client';

import { useState } from 'react';
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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Heart className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">PhysioCare</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
                            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost">Sign In</Button>
                            <Button className="btn-primary">Get Started</Button>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-light to-background overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/10"></div>
                        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
                        <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Content */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 fade-up">
                                    Your Health,
                                    <span className="text-gradient-primary"> Our Priority</span>
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 fade-up-delay-1">
                                    Connect with India's top doctors and physiotherapists for personalized care,
                                    right from your home or at our clinics. Experience healthcare like never before.
                                </p>

                                {/* Search Bar */}
                                <form onSubmit={handleSearch} className="max-w-md mx-auto lg:mx-0 mb-8 fade-up-delay-2">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search doctors, conditions, treatments..."
                                            className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 focus:border-primary shadow-soft"
                                        />
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    </div>
                                </form>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 fade-up-delay-3">
                                    <Button className="btn-primary px-8 py-4 text-lg">
                                        Book Consultation
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-muted">
                                        <Play className="mr-2 h-5 w-5" />
                                        Watch Demo
                                    </Button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 fade-up-delay-3">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center lg:text-left">
                                            <div className="flex items-center justify-center lg:justify-start mb-2">
                                                <stat.icon className={`h-6 w-6 ${stat.color} mr-2`} />
                                                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                                            </div>
                                            <p className="text-muted-foreground text-sm">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="relative lg:block hidden">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-3xl transform rotate-6"></div>
                                    <div className="relative z-10 w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl shadow-card hover-lift flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Users className="h-12 w-12 text-white" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-foreground mb-2">Professional Care</h3>
                                            <p className="text-muted-foreground">Expert healthcare at your fingertips</p>
                                        </div>
                                    </div>

                                    {/* Floating Card */}
                                    <div className="absolute top-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-card animate-float">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-card-foreground">Live Consultation</p>
                                                <p className="text-xs text-muted-foreground">24/7 Available</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Card */}
                                    <div className="absolute bottom-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-card animate-float" style={{ animationDelay: '1s' }}>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gradient-primary">4.9★</div>
                                            <p className="text-xs text-muted-foreground">Patient Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="services" className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
                                Why Choose
                                <span className="text-gradient-primary"> PhysioCare?</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
                                We provide comprehensive healthcare solutions that make quality medical care
                                accessible, convenient, and affordable for everyone across India.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-card border border-border rounded-2xl p-8 hover-lift fade-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`h-7 w-7 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-card-foreground mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
                                How It Works
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
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
                                    color: "text-primary"
                                },
                                {
                                    step: "2",
                                    title: "Find & Book",
                                    description: "Search for doctors or physiotherapists and book appointments that fit your schedule.",
                                    icon: Calendar,
                                    color: "text-secondary"
                                },
                                {
                                    step: "3",
                                    title: "Get Care",
                                    description: "Attend your consultation online or receive home visits from qualified professionals.",
                                    icon: Heart,
                                    color: "text-accent"
                                }
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    className="text-center group"
                                >
                                    <div className="relative mb-6">
                                        <div className={`w-16 h-16 bg-gradient-to-br from-${step.color.split('-')[1]}-100 to-${step.color.split('-')[1]}-200 rounded-full flex items-center justify-center text-2xl font-bold text-foreground mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                            {step.step}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border-2 border-background rounded-full flex items-center justify-center">
                                            <step.icon className={`h-4 w-4 ${step.color}`} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
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
                                    color: "border-muted"
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
                                    color: "border-primary"
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
                                    color: "border-muted"
                                }
                            ].map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-card border-2 ${plan.color} rounded-2xl p-8 hover-lift transition-all ${plan.popular ? 'shadow-card' : 'hover:shadow-soft'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                                        <div className="text-4xl font-bold text-foreground mb-2">
                                            {plan.price}
                                            <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                                        </div>
                                        <p className="text-muted-foreground">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center text-sm">
                                                <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full py-3 px-6 text-sm font-medium rounded-lg transition-all ${plan.popular
                                                ? 'btn-primary'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                <section id="testimonials" className="py-20 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 fade-up">
                                What Our Patients Say
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-up-delay-1">
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
                                    className="bg-card border border-border rounded-2xl p-6 shadow-soft hover-lift"
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                                            <div className="text-muted-foreground text-xs">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-hero">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 fade-up">
                            Ready to Transform Your Healthcare Experience?
                        </h2>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto fade-up-delay-1">
                            Join thousands of patients and healthcare professionals who are already
                            experiencing the future of healthcare. Start your journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up-delay-2">
                            <Button className="px-8 py-4 text-lg font-medium bg-white text-primary hover:bg-white/90 rounded-lg transition-all hover:scale-105">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 inline" />
                            </Button>
                            <Button variant="outline" className="px-8 py-4 text-lg font-medium border-2 border-white text-white hover:bg-white hover:text-primary rounded-lg transition-all">
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
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Heart className="h-5 w-5 text-white" />
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