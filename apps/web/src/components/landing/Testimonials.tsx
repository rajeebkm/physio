'use client';

import { motion } from 'framer-motion';
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
    {
        name: 'Dr. Priya Sharma',
        role: 'Orthopedic Surgeon',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        content: 'The platform makes it easy to manage patients and track their progress. The exercise library and treatment plans are comprehensive.',
        rating: 5,
    },
    {
        name: 'Rajesh Kumar',
        role: 'Patient',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        content: 'After my knee surgery, the personalized rehabilitation program helped me get back to my normal routine faster than expected.',
        rating: 5,
    },
    {
        name: 'Dr. Neha Patel',
        role: 'Sports Medicine Specialist',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        content: 'The integration of AI-powered recommendations with traditional physiotherapy has improved patient outcomes significantly.',
        rating: 5,
    },
    {
        name: 'Vikram Singh',
        role: 'Patient',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        content: 'The home visit service was a game-changer for my elderly father. The physiotherapist was professional and caring.',
        rating: 5,
    },
    {
        name: 'Dr. Amit Desai',
        role: 'Physiotherapist',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        content: 'The platform has streamlined my practice and allowed me to reach more patients while maintaining quality care.',
        rating: 5,
    },
    {
        name: 'Sneha Reddy',
        role: 'Patient',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        content: 'The video consultations are so convenient, and the doctors are just as thorough as in-person visits.',
        rating: 5,
    },
];

export function Testimonials() {
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
                        What Our Users Say
                    </h2>
                    <p className="text-body text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Here's what patients and healthcare professionals are saying about PhysioCare.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className="card-modern p-6 h-full"
                        >
                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Quote */}
                            <div className="relative mb-6">
                                <ChatBubbleLeftRightIcon className="absolute -top-2 -left-2 h-6 w-6 text-blue-100" />
                                <p className="text-gray-700 italic pl-4">
                                    "{testimonial.content}"
                                </p>
                            </div>

                            {/* Author */}
                            <div className="flex items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {testimonial.role}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Overall Rating */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3">
                        <div className="flex items-center mr-4">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                            ))}
                        </div>
                        <span className="text-gray-700 font-semibold">
                            <span className="text-2xl font-bold text-gray-900">4.9</span> out of 5
                        </span>
                        <span className="text-gray-500 ml-2">(2,500+ reviews)</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}