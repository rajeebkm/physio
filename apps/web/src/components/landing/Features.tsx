'use client';

import { motion } from 'framer-motion';
import {
    VideoCameraIcon,
    HomeIcon,
    UsersIcon,
    ShieldCheckIcon,
    ClockIcon,
    HeartIcon,
    DevicePhoneMobileIcon,
    DocumentTextIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const features = [
    {
        icon: VideoCameraIcon,
        title: 'Video Consultations',
        description: 'Connect with doctors through secure, HD video calls from anywhere in India',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100',
    },
    {
        icon: HomeIcon,
        title: 'Home Visits',
        description: 'Get physiotherapy and medical care delivered to your doorstep by certified professionals',
        color: 'from-indigo-500 to-indigo-600',
        bgColor: 'from-indigo-50 to-indigo-100',
    },
    {
        icon: UsersIcon,
        title: 'Expert Doctors',
        description: 'Access to 500+ verified and experienced healthcare professionals across specialties',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100',
    },
    {
        icon: ShieldCheckIcon,
        title: 'Secure & Private',
        description: 'HIPAA compliant platform ensuring your medical data privacy and security',
        color: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100',
    },
    {
        icon: ClockIcon,
        title: '24/7 Support',
        description: 'Round-the-clock assistance for all your healthcare needs and emergencies',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-orange-50 to-orange-100',
    },
    {
        icon: HeartIcon,
        title: 'Personalized Care',
        description: 'AI-powered treatment plans tailored to your specific condition and recovery goals',
        color: 'from-pink-500 to-pink-600',
        bgColor: 'from-pink-50 to-pink-100',
    },
    {
        icon: DevicePhoneMobileIcon,
        title: 'Mobile App',
        description: 'Manage appointments, track progress, and access care on our intuitive mobile app',
        color: 'from-cyan-500 to-cyan-600',
        bgColor: 'from-cyan-50 to-cyan-100',
    },
    {
        icon: DocumentTextIcon,
        title: 'Digital Records',
        description: 'Maintain comprehensive health records and prescriptions in one secure place',
        color: 'from-teal-500 to-teal-600',
        bgColor: 'from-teal-50 to-teal-100',
    },
    {
        icon: CalendarIcon,
        title: 'Easy Booking',
        description: 'Schedule appointments with just a few clicks and get instant confirmations',
        color: 'from-violet-500 to-violet-600',
        bgColor: 'from-violet-50 to-violet-100',
    },
];

export function Features() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="section-padding bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-gray-100/50"></div>
            </div>

            <div className="container-modern relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-headline text-gray-900 mb-6">
                        Why Choose Our Platform?
                    </h2>
                    <p className="text-body text-gray-600 max-w-3xl mx-auto">
                        We provide comprehensive healthcare solutions that make quality medical care
                        accessible, convenient, and affordable for everyone across India.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className="group relative"
                        >
                            <div className="card-modern p-8 h-full">
                                {/* Icon */}
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-modern mb-6`}>
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-title text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-body text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                        <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-blue-800 font-medium">
                            Trusted by 10,000+ patients across India
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}