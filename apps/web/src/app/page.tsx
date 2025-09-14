'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
    MagnifyingGlassIcon,
    PlayIcon,
    ArrowRightIcon,
    HeartIcon,
    MapPinIcon,
    ClockIcon,
    PhoneIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    StarIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Your Health, Our Priority
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                Connect with India's top doctors and physiotherapists for personalized care,
                                right from your home or at our clinics.
                            </p>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                                <div className="flex gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search for doctors, conditions, or treatments..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                    >
                                        Search
                                    </Button>
                                </div>
                            </form>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                                    Book Consultation
                                </Button>
                                <Button variant="outline" className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <PlayIcon className="mr-2 h-4 w-4" />
                                    Watch Demo
                                </Button>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-3xl font-bold text-blue-600 mb-1">10,000+</div>
                                <div className="text-gray-600">Happy Patients</div>
                            </div>
                            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-3xl font-bold text-indigo-600 mb-1">500+</div>
                                <div className="text-gray-600">Expert Doctors</div>
                            </div>
                            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
                                <div className="text-gray-600">Cities Covered</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Why Choose PhysioCare?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We provide comprehensive healthcare solutions that make quality medical care
                                accessible, convenient, and affordable for everyone across India.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: PhoneIcon,
                                    title: "Online Consultations",
                                    description: "Connect with doctors instantly through secure video calls from anywhere in India."
                                },
                                {
                                    icon: MapPinIcon,
                                    title: "Home Visits",
                                    description: "Get physiotherapy and medical care delivered right to your doorstep by certified professionals."
                                },
                                {
                                    icon: ClockIcon,
                                    title: "24/7 Availability",
                                    description: "Access healthcare services round the clock, whenever you need them most."
                                },
                                {
                                    icon: ShieldCheckIcon,
                                    title: "Verified Doctors",
                                    description: "All our healthcare providers are thoroughly verified, licensed, and background-checked."
                                },
                                {
                                    icon: HeartIcon,
                                    title: "Personalized Care",
                                    description: "Receive customized treatment plans tailored to your specific health needs and goals."
                                },
                                {
                                    icon: UserGroupIcon,
                                    title: "Expert Team",
                                    description: "Access to India's top doctors and physiotherapists in every medical specialty."
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <feature.icon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                                    description: "Create your account and complete your health profile in just a few minutes."
                                },
                                {
                                    step: "2",
                                    title: "Find & Book",
                                    description: "Search for doctors or physiotherapists and book appointments that fit your schedule."
                                },
                                {
                                    step: "3",
                                    title: "Get Care",
                                    description: "Attend your consultation online or receive home visits from qualified professionals."
                                }
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    className="text-center"
                                >
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Choose the plan that works best for you. No hidden fees, no surprises.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    popular: false
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
                                    popular: true
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
                                    popular: false
                                }
                            ].map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-white p-6 rounded-lg border-2 transition-all ${plan.popular
                                            ? 'border-blue-500 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {plan.price}
                                            <span className="text-sm font-normal text-gray-500">{plan.period}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center text-sm">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full py-2 text-sm font-medium rounded-lg ${plan.popular
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
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
                <section className="py-16 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                What Our Patients Say
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Don't just take our word for it. Here's what our patients have to say
                                about their experience with PhysioCare.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Priya Sharma",
                                    role: "Software Engineer, Mumbai",
                                    content: "The home physiotherapy service was amazing. The therapist was professional and helped me recover quickly from my back pain.",
                                    rating: 5
                                },
                                {
                                    name: "Rajesh Kumar",
                                    role: "Business Owner, Delhi",
                                    content: "Online consultation with Dr. Singh was very convenient. I got expert advice without leaving my home.",
                                    rating: 5
                                },
                                {
                                    name: "Anita Patel",
                                    role: "Teacher, Bangalore",
                                    content: "The platform is easy to use and the doctors are very knowledgeable. Highly recommended for quality healthcare.",
                                    rating: 5
                                }
                            ].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-4 italic text-sm">
                                        "{testimonial.content}"
                                    </p>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                                        <div className="text-gray-500 text-xs">{testimonial.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-blue-600">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Transform Your Healthcare Experience?
                        </h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of patients and healthcare professionals who are already
                            experiencing the future of healthcare. Start your journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                className="px-8 py-3 text-lg font-medium bg-white text-blue-600 hover:bg-gray-100 rounded-lg"
                            >
                                Get Started Free
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                className="px-8 py-3 text-lg font-medium border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg"
                            >
                                Download App
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}