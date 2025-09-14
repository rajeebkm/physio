'use client';

import { motion } from 'framer-motion';
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

const plans = [
    {
        name: 'Basic',
        price: '₹299',
        period: 'per month',
        description: 'Perfect for individuals who need occasional healthcare',
        features: [
            '2 Video consultations per month',
            'Basic health records',
            'Email support',
            'Mobile app access',
            'Prescription management',
        ],
        color: 'from-gray-500 to-gray-600',
        popular: false,
    },
    {
        name: 'Professional',
        price: '₹599',
        period: 'per month',
        description: 'Ideal for families and regular healthcare needs',
        features: [
            '5 Video consultations per month',
            'Unlimited health records',
            'Priority support',
            'Home visit booking',
            'Family member management',
            'Advanced analytics',
            'Prescription delivery',
        ],
        color: 'from-blue-500 to-blue-600',
        popular: true,
    },
    {
        name: 'Premium',
        price: '₹999',
        period: 'per month',
        description: 'Comprehensive healthcare for serious medical needs',
        features: [
            'Unlimited consultations',
            'Complete health records',
            '24/7 priority support',
            'Unlimited home visits',
            'Family & caregiver access',
            'AI-powered insights',
            'Prescription delivery',
            'Emergency care',
            'Specialist consultations',
        ],
        color: 'from-purple-500 to-purple-600',
        popular: false,
    },
];

export function Pricing() {
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
        <section className="section-padding bg-white">
            <div className="container-modern">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-headline text-gray-900 mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-body text-gray-600 max-w-3xl mx-auto">
                        Choose the plan that fits your healthcare needs. All plans include access to our network of verified doctors and specialists.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.name}
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium">
                                        <StarIcon className="h-4 w-4 mr-1" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className={`card-modern p-8 h-full ${plan.popular ? 'border-2 border-blue-500 shadow-modern-xl' : ''}`}>
                                {/* Plan Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-4xl font-bold text-gray-900">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-600 ml-2">
                                            {plan.period}
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    className={`w-full h-12 ${plan.popular
                                        ? 'btn-primary'
                                        : 'btn-secondary'
                                        }`}
                                >
                                    Get Started
                                </Button>
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
                    <p className="text-gray-600 mb-4">
                        All plans include a 30-day money-back guarantee
                    </p>
                    <p className="text-sm text-gray-500">
                        Need a custom plan? <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact us</a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}