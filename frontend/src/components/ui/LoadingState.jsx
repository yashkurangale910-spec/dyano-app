import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Enhanced loading state component with multiple variants
 * Provides context-aware loading feedback to users
 */
export default function LoadingState({
    type = 'spinner',
    message = 'Loading...',
    progress = null,
    estimatedTime = null,
    size = 'md',
    className = ''
}) {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const spinnerSizes = {
        sm: 20,
        md: 32,
        lg: 48
    };

    if (type === 'spinner') {
        return (
            <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
                <Loader2
                    className="animate-spin text-cosmic-cyan"
                    size={spinnerSizes[size]}
                />
                {message && (
                    <p className={`text-gray-400 font-medium ${sizeClasses[size]}`}>
                        {message}
                    </p>
                )}
                {estimatedTime && (
                    <p className="text-xs text-gray-600 font-mono">
                        {estimatedTime}
                    </p>
                )}
            </div>
        );
    }

    if (type === 'progress') {
        return (
            <div className={`flex flex-col gap-4 w-full max-w-md ${className}`}>
                {message && (
                    <div className="flex items-center justify-between">
                        <p className={`text-gray-300 font-medium ${sizeClasses[size]}`}>
                            {message}
                        </p>
                        {progress !== null && (
                            <span className="text-sm font-bold text-cosmic-cyan">
                                {Math.round(progress)}%
                            </span>
                        )}
                    </div>
                )}

                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cosmic-cyan to-cosmic-purple rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress || 0}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                            x: ['-100%', '100%']
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                </div>

                {estimatedTime && (
                    <p className="text-xs text-gray-600 font-mono text-center">
                        {estimatedTime}
                    </p>
                )}
            </div>
        );
    }

    if (type === 'dots') {
        return (
            <div className={`flex flex-col items-center gap-4 ${className}`}>
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 bg-cosmic-cyan rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
                {message && (
                    <p className={`text-gray-400 font-medium ${sizeClasses[size]}`}>
                        {message}
                    </p>
                )}
            </div>
        );
    }

    return null;
}

/**
 * Skeleton loader for content placeholders
 */
export function SkeletonLoader({
    variant = 'text',
    width = '100%',
    height = '1rem',
    className = '',
    count = 1,
    animate = true
}) {
    const baseClasses = 'bg-white/5 rounded';
    const animateClasses = animate ? 'animate-pulse' : '';

    const variants = {
        text: 'h-4',
        title: 'h-8',
        avatar: 'w-12 h-12 rounded-full',
        card: 'h-48',
        button: 'h-10 w-32'
    };

    const skeletonClass = `${baseClasses} ${variants[variant] || ''} ${animateClasses} ${className}`;

    if (count > 1) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className={skeletonClass}
                        style={{ width, height: variant === 'text' ? height : undefined }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={skeletonClass}
            style={{ width, height: variant === 'text' ? height : undefined }}
        />
    );
}

/**
 * Skeleton for card layouts
 */
export function SkeletonCard({ className = '' }) {
    return (
        <div className={`bg-white/5 rounded-2xl p-6 space-y-4 ${className}`}>
            <div className="flex items-center gap-4">
                <SkeletonLoader variant="avatar" />
                <div className="flex-1 space-y-2">
                    <SkeletonLoader variant="title" width="60%" />
                    <SkeletonLoader variant="text" width="40%" />
                </div>
            </div>
            <SkeletonLoader variant="text" count={3} />
            <div className="flex gap-2">
                <SkeletonLoader variant="button" />
                <SkeletonLoader variant="button" />
            </div>
        </div>
    );
}

/**
 * Skeleton for list layouts
 */
export function SkeletonList({ items = 5, className = '' }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                    <SkeletonLoader variant="avatar" />
                    <div className="flex-1 space-y-2">
                        <SkeletonLoader variant="text" width="70%" />
                        <SkeletonLoader variant="text" width="40%" />
                    </div>
                </div>
            ))}
        </div>
    );
}
