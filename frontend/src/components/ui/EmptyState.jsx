import { motion } from 'framer-motion';

/**
 * Enhanced empty state component with helpful actions
 * Provides context and guidance when no data is available
 */
export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    suggestions = [],
    className = '',
    size = 'md'
}) {
    const sizeClasses = {
        sm: {
            icon: 40,
            title: 'text-lg',
            description: 'text-sm'
        },
        md: {
            icon: 64,
            title: 'text-2xl',
            description: 'text-base'
        },
        lg: {
            icon: 96,
            title: 'text-4xl',
            description: 'text-lg'
        }
    };

    const sizes = sizeClasses[size];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
        >
            {/* Icon */}
            {Icon && (
                <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                    {typeof Icon === 'function' ? (
                        <Icon
                            size={sizes.icon}
                            className="text-gray-600"
                            strokeWidth={1}
                        />
                    ) : (
                        Icon
                    )}
                </div>
            )}

            {/* Title */}
            {title && (
                <h3 className={`font-display font-bold text-white mb-3 ${sizes.title}`}>
                    {title}
                </h3>
            )}

            {/* Description */}
            {description && (
                <p className={`text-gray-500 max-w-md mb-8 leading-relaxed ${sizes.description}`}>
                    {description}
                </p>
            )}

            {/* Primary Action */}
            {action && (
                <motion.button
                    onClick={action.onClick}
                    className="px-6 py-3 bg-cosmic-cyan text-cosmic-void font-bold rounded-xl hover:bg-cosmic-cyan/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {action.label}
                </motion.button>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div className="mt-8 space-y-2">
                    <p className="text-xs uppercase tracking-widest text-gray-700 font-bold mb-3">
                        Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400"
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

/**
 * Specialized empty states for common scenarios
 */
export function EmptySearchResults({ query, onClear }) {
    return (
        <EmptyState
            icon={({ size, className }) => (
                <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" strokeWidth="2" />
                    <path d="M11 8v6M8 11h6" strokeWidth="2" />
                </svg>
            )}
            title="No results found"
            description={`We couldn't find anything matching "${query}". Try adjusting your search.`}
            action={{
                label: 'Clear Search',
                onClick: onClear
            }}
            suggestions={[
                'Check your spelling',
                'Try different keywords',
                'Use fewer filters'
            ]}
        />
    );
}

export function EmptyList({ itemName = 'items', onCreate }) {
    return (
        <EmptyState
            icon={({ size, className }) => (
                <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                    <path d="M12 8v8M8 12h8" strokeWidth="2" />
                </svg>
            )}
            title={`No ${itemName} yet`}
            description={`Get started by creating your first ${itemName.slice(0, -1)}.`}
            action={onCreate ? {
                label: `Create ${itemName.slice(0, -1)}`,
                onClick: onCreate
            } : null}
        />
    );
}
