import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Page Header Component
 * Provides consistent page headers with title, subtitle, stats, and actions
 */
export default function PageHeader({
    title,
    subtitle,
    stats = [],
    actions,
    backButton = false,
    helpText,
    className = ''
}) {
    const navigate = useNavigate();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-12 ${className}`}
        >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                {/* Left side - Title & Subtitle */}
                <div className="flex-1">
                    {/* Back button */}
                    {backButton && (
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>
                    )}

                    {/* Title */}
                    <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">
                            {title}
                        </h1>
                        {helpText && (
                            <button
                                className="text-gray-600 hover:text-cosmic-cyan transition-colors"
                                title={helpText}
                                aria-label="Help"
                            >
                                <HelpCircle size={20} />
                            </button>
                        )}
                    </div>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    {/* Stats */}
                    {stats.length > 0 && (
                        <div className="flex flex-wrap items-center gap-6 mt-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    {index > 0 && (
                                        <div className="w-px h-8 bg-white/10" />
                                    )}
                                    <div>
                                        <div className="text-2xl font-display font-bold text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs uppercase tracking-widest text-gray-600 font-bold">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right side - Actions */}
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </motion.header>
    );
}

/**
 * Page Section Header
 * For section titles within a page
 */
export function SectionHeader({ title, subtitle, action, className = '' }) {
    return (
        <div className={`flex items-end justify-between mb-8 ${className}`}>
            <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mb-2">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-gray-500">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
}
