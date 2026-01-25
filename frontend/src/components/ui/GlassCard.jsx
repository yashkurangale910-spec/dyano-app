import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * GlassCard - A glassmorphism card component with hover effects
 */
export default function GlassCard({
    children,
    className = '',
    hover = true,
    glow = false,
    glowColor = 'purple',
    onClick,
    ...props
}) {
    const glowClasses = {
        purple: 'hover:glow-purple',
        cyan: 'hover:glow-cyan',
        pink: 'hover:glow-pink',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hover ? { y: -8, scale: 1.02 } : {}}
            className={`
        glass-card
        ${glow ? glowClasses[glowColor] : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    );
}

GlassCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hover: PropTypes.bool,
    glow: PropTypes.bool,
    glowColor: PropTypes.oneOf(['purple', 'cyan', 'pink']),
    onClick: PropTypes.func,
};
