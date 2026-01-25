import { motion } from 'framer-motion';
import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ParticleButton - An interactive button with particle effects
 */
export default function ParticleButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    const [particles, setParticles] = useState([]);

    const handleClick = (e) => {
        if (disabled) return;

        // Create particle effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newParticles = Array.from({ length: 12 }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
            angle: (i * 30) * (Math.PI / 180),
        }));

        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);

        if (onClick) onClick(e);
    };

    const variants = {
        primary: 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink border-cosmic-pink',
        secondary: 'bg-gradient-to-r from-cosmic-cyan to-cosmic-purple border-cosmic-cyan',
        outline: 'bg-transparent border-cosmic-pink text-cosmic-pink hover:bg-cosmic-pink/10',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-4 text-lg',
        lg: 'px-12 py-5 text-xl',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`
        particle-btn
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
            onClick={handleClick}
            disabled={disabled}
            {...props}
        >
            <span className="relative z-10">{children}</span>

            {/* Particle Effects */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{
                        x: particle.x,
                        y: particle.y,
                        opacity: 1,
                        scale: 1
                    }}
                    animate={{
                        x: particle.x + Math.cos(particle.angle) * 100,
                        y: particle.y + Math.sin(particle.angle) * 100,
                        opacity: 0,
                        scale: 0,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute w-2 h-2 bg-cosmic-cyan rounded-full pointer-events-none"
                    style={{
                        boxShadow: '0 0 10px var(--cosmic-cyan)',
                    }}
                />
            ))}
        </motion.button>
    );
}

ParticleButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
};
