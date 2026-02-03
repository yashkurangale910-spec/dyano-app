import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Universal Card Component
 * Variants: glass (default), solid, outline, gradient
 * Hover effects: lift, glow, scale, none
 */
const Card = forwardRef(({
    children,
    variant = 'glass',
    hover = 'lift',
    className = '',
    onClick,
    ...props
}, ref) => {
    const baseClasses = 'rounded-3xl transition-all duration-300 relative overflow-hidden';

    const variantClasses = {
        glass: 'bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-lg',
        solid: 'bg-cosmic-nebula border border-white/5',
        outline: 'bg-transparent border-2 border-white/20',
        gradient: 'bg-gradient-to-br from-cosmic-purple/20 to-cosmic-cyan/10 border border-white/10'
    };

    const hoverClasses = {
        lift: 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-cosmic-purple/20',
        glow: 'hover:shadow-glow-cyan hover:border-cosmic-cyan/30',
        scale: 'hover:scale-[1.02]',
        none: ''
    };

    const isClickable = !!onClick;

    return (
        <div
            ref={ref}
            onClick={onClick}
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${hoverClasses[hover]}
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
            {...props}
        >
            {/* Grain texture overlay */}
            <div className="grain-overlay opacity-[0.02] pointer-events-none" />
            {children}
        </div>
    );
});

Card.displayName = 'Card';

Card.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['glass', 'solid', 'outline', 'gradient']),
    hover: PropTypes.oneOf(['lift', 'glow', 'scale', 'none']),
    className: PropTypes.string,
    onClick: PropTypes.func
};

// Sub-components
export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-5 border-b border-white/5 ${className}`}>
        {children}
    </div>
);

CardHeader.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-5 ${className}`}>
        {children}
    </div>
);

CardContent.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-white/5 ${className}`}>
        {children}
    </div>
);

CardFooter.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Card;
