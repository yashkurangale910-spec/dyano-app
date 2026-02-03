import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const LuxuryCard = forwardRef(({
    children,
    variant = 'default', // 'default', 'glass', 'outline'
    className = '',
    onClick,
    ...props
}, ref) => {
    const baseStyles = "relative rounded-2xl overflow-hidden transition-all duration-500";

    const variants = {
        default: "bg-bg-surface border border-white/[0.05] hover:border-white/[0.12]",
        glass: "glass-premium hover:bg-white/[0.05]",
        outline: "bg-transparent border border-white/[0.1] hover:border-white/[0.2]"
    };

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={onClick ? {
                y: -6,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            } : {}}
            whileTap={onClick ? {
                scale: 0.98,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            } : {}}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
            {...props}
        >
            {/* Phase III: Sub-pixel Highlight Border */}
            <div className="absolute inset-0 border border-white/[0.08] rounded-2xl pointer-events-none" />
            <div className="absolute inset-[0.5px] border border-white/[0.03] rounded-2xl pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
});

LuxuryCard.displayName = 'LuxuryCard';

export const LuxuryHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-5 border-b border-white/[0.05] ${className}`}>
        {children}
    </div>
);

export const LuxuryContent = ({ children, className = '' }) => (
    <div className={`px-6 py-6 ${className}`}>
        {children}
    </div>
);

export default LuxuryCard;
