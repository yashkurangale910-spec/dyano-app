import { motion } from 'framer-motion';

/**
 * Progress indicator component for multi-step processes
 * Shows current progress with visual feedback
 */
export default function ProgressIndicator({
    current,
    total,
    label = '',
    showPercentage = false,
    variant = 'linear',
    className = '',
    steps = []
}) {
    const percentage = Math.round((current / total) * 100);

    if (variant === 'linear') {
        return (
            <div className={`w-full ${className}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {label && (
                            <span className="text-sm font-medium text-gray-400">
                                {label}
                            </span>
                        )}
                        <span className="text-sm font-bold text-white">
                            {current} / {total}
                        </span>
                    </div>
                    {showPercentage && (
                        <span className="text-sm font-bold text-cosmic-cyan">
                            {percentage}%
                        </span>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cosmic-cyan to-cosmic-purple rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>
        );
    }

    if (variant === 'circular') {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className={`flex flex-col items-center ${className}`}>
                <div className="relative w-24 h-24">
                    <svg className="transform -rotate-90 w-24 h-24">
                        {/* Background circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            style={{
                                strokeDasharray: circumference
                            }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--cosmic-cyan)" />
                                <stop offset="100%" stopColor="var(--cosmic-purple)" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                            {percentage}%
                        </span>
                    </div>
                </div>
                {label && (
                    <p className="mt-3 text-sm text-gray-400 font-medium">
                        {label} {current}/{total}
                    </p>
                )}
            </div>
        );
    }

    if (variant === 'stepped' && steps.length > 0) {
        return (
            <div className={`w-full ${className}`}>
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const isActive = index === current - 1;
                        const isCompleted = index < current - 1;
                        const isLast = index === steps.length - 1;

                        return (
                            <div key={index} className="flex items-center flex-1">
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                      ${isCompleted
                                                ? 'bg-cosmic-cyan border-cosmic-cyan text-cosmic-void'
                                                : isActive
                                                    ? 'bg-cosmic-cyan/20 border-cosmic-cyan text-cosmic-cyan'
                                                    : 'bg-white/5 border-white/20 text-gray-600'
                                            }
                    `}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: isActive ? 1.1 : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isCompleted ? (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M13.5 3.5L6 11l-3.5-3.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </motion.div>
                                    <p className={`
                    mt-2 text-xs font-medium text-center
                    ${isActive ? 'text-white' : 'text-gray-600'}
                  `}>
                                        {step}
                                    </p>
                                </div>

                                {/* Connector Line */}
                                {!isLast && (
                                    <div className="flex-1 h-0.5 mx-2 bg-white/10 relative overflow-hidden">
                                        {isCompleted && (
                                            <motion.div
                                                className="absolute inset-0 bg-cosmic-cyan"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
}

/**
 * Simple progress bar component
 */
export function ProgressBar({
    value,
    max = 100,
    className = '',
    showLabel = false,
    size = 'md'
}) {
    const percentage = Math.round((value / max) * 100);

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">{value} / {max}</span>
                    <span className="text-xs font-bold text-cosmic-cyan">{percentage}%</span>
                </div>
            )}
            <div className={`relative bg-white/5 rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cosmic-cyan to-cosmic-purple rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
