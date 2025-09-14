'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, PlayIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export function Hero() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

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
        <section className="relative min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Search Section */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-12"
                    >
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for doctors, consultations"
                                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                            </div>
                            <Button 
                                onClick={handleSearch}
                                className="px-8 py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Search
                            </Button>
                        </div>

                        <Button className="px-8 py-4 text-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg">
                            Book Consultation
                        </Button>
                    </motion.div>

                    {/* Watch Demo Section */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-12"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                                    <ArrowRightIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Watch Demo</h3>
                                    <p className="text-gray-600">See how our platform works</p>
                                </div>
                            </div>
                            <Button variant="outline" className="flex items-center px-6 py-3">
                                <PlayIcon className="h-5 w-5 mr-2" />
                                Watch Demo
                            </Button>
                        </div>
                    </motion.div>

                    {/* Statistics */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                    >
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
                            <div className="text-lg text-gray-600">Happy Patients</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                            <div className="text-lg text-gray-600">Expert Doctors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
                            <div className="text-lg text-gray-600">Cities Covered</div>
                        </div>
                    </motion.div>

                    {/* Why Choose Section */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We provide comprehensive healthcare solutions that make quality medical care accessible, convenient, and affordable for everyone across India.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}