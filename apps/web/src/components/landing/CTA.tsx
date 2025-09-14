'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowDownTrayIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export function CTA() {
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
        <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="container-modern">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-headline text-white mb-6"
                    >
                        Ready to Transform Your Healthcare Experience?
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                    >
                        Join thousands of patients and healthcare professionals who are already experiencing the future of healthcare. Start your journey today.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        <Button
                            size="lg"
                            className="h-14 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
                        >
                            Get Started Free
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600"
                        >
                            <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                            Download App
                        </Button>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PhoneIcon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Book in 2 Minutes
                            </h3>
                            <p className="text-blue-100 text-sm">
                                Quick and easy appointment booking
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ArrowRightIcon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Instant Access
                            </h3>
                            <p className="text-blue-100 text-sm">
                                Connect with doctors immediately
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ArrowDownTrayIcon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Mobile First
                            </h3>
                            <p className="text-blue-100 text-sm">
                                Access care from anywhere
                            </p>
                        </div>
                    </motion.div>

                    {/* Bottom Text */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-12 pt-8 border-t border-blue-500"
                    >
                        <p className="text-blue-100 text-sm">
                            Trusted by 10,000+ patients and 500+ healthcare professionals across India
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}