'use client';

import { motion } from 'framer-motion';
import {
    UserPlusIcon,
    MagnifyingGlassIcon,
    VideoCameraIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

const steps = [
    {
        number: '01',
        icon: UserPlusIcon,
        title: 'Create Account',
        description: 'Sign up in minutes with your basic information and verify your identity',
        color: 'from-blue-500 to-blue-600',
    },
    {
        number: '02',
        icon: MagnifyingGlassIcon,
        title: 'Find Your Doctor',
        description: 'Browse through our network of verified doctors and specialists',
        color: 'from-indigo-500 to-indigo-600',
    },
    {
        number: '03',
        icon: VideoCameraIcon,
        title: 'Book Consultation',
        description: 'Schedule a video call or in-person appointment at your convenience',
        color: 'from-purple-500 to-purple-600',
    },
    {
        number: '04',
        icon: HeartIcon,
        title: 'Get Treatment',
        description: 'Receive personalized care and follow-up support for your recovery',
        color: 'from-green-500 to-green-600',
    },
];

export function HowItWorks() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
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
        <section className="section-padding bg-gray-50">
            <div className="container-modern">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-headline text-gray-900 mb-6">
                        How It Works
                    </h2>
                    <p className="text-body text-gray-600 max-w-3xl mx-auto">
                        Getting quality healthcare has never been easier. Follow these simple steps to start your journey towards better health.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            variants={itemVariants}
                            className="relative text-center"
                        >
                            {/* Connection Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-1/2 z-0">
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full"></div>
                                </div>
                            )}

                            <div className="relative z-10">
                                {/* Step Number */}
                                <div className="text-6xl font-bold text-gray-200 mb-4">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.color} shadow-modern mb-6`}>
                                    <step.icon className="h-8 w-8 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-title text-gray-900 mb-4">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-body text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}