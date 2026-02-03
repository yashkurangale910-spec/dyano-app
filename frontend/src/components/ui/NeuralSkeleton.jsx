import React from 'react';
import { motion } from 'framer-motion';

export default function NeuralSkeleton({
    className = "",
    variant = "rect", // "rect", "circle", "bento"
    count = 1
}) {
    const SkeletonItem = () => (
        <motion.div
            initial={{ opacity: 0.3, filter: 'blur(4px)' }}
            animate={{
                opacity: [0.3, 0.6, 0.3],
                filter: ['blur(4px)', 'blur(2px)', 'blur(4px)']
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={`
                relative overflow-hidden bg-white/[0.03] border border-white/[0.05]
                ${variant === 'circle' ? 'rounded-full' : 'rounded-3xl'}
                ${className}
            `}
        >
            {/* Shimmer Effect */}
            <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12"
            />
        </motion.div>
    );

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonItem key={i} />
            ))}
        </>
    );
}
