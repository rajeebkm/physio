'use client';

import { motion } from 'framer-motion';

export function FloatingElements() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Subtle floating circles */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 0.1,
                    scale: 1,
                    x: [0, 30, 0],
                    y: [0, -30, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-20 left-20 w-16 h-16 bg-blue-200 rounded-full blur-xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 0.1,
                    scale: 1,
                    x: [0, -20, 0],
                    y: [0, 40, 0]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute top-40 right-20 w-12 h-12 bg-indigo-200 rounded-full blur-xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 0.1,
                    scale: 1,
                    x: [0, 40, 0],
                    y: [0, -20, 0]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 10
                }}
                className="absolute bottom-40 left-1/3 w-14 h-14 bg-purple-200 rounded-full blur-xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 0.1,
                    scale: 1,
                    x: [0, -30, 0],
                    y: [0, -30, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute top-1/2 right-1/4 w-10 h-10 bg-cyan-200 rounded-full blur-xl"
            />
        </div>
    );
}