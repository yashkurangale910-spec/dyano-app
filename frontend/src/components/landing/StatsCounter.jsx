import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Animated Stats Counter Component
 * Features: count-up animation, intersection observer trigger
 */
export default function StatsCounter({ stats = [] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent" />

            <div className="container-cosmic relative z-10">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <StatItem key={index} stat={stat} isInView={isInView} delay={index * 0.1} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

StatsCounter.propTypes = {
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            suffix: PropTypes.string,
            prefix: PropTypes.string
        })
    )
};

// Individual Stat Item with Count-up Animation
function StatItem({ stat, isInView, delay }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        let animationFrame;
        const duration = 2000; // 2 seconds
        const startValue = 0;
        const endValue = stat.value;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutExpo)
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutExpo);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        // Add delay before starting
        const timeout = setTimeout(() => {
            animationFrame = requestAnimationFrame(animate);
        }, delay * 1000);

        return () => {
            clearTimeout(timeout);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isInView, stat.value, delay]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="text-center group"
        >
            {/* Background glow on hover */}
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-cosmic-cyan/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number display */}
                <div className="relative">
                    <h3 className="text-6xl md:text-7xl font-display font-black text-white mb-2 group-hover:text-cosmic-cyan transition-colors duration-300">
                        {stat.prefix}
                        {count.toLocaleString()}
                        {stat.suffix}
                    </h3>
                </div>
            </div>

            {/* Label */}
            <p className="text-sm font-sans uppercase tracking-[0.2em] text-gray-500 font-semibold">
                {stat.label}
            </p>

            {/* Decorative line */}
            <div className="mt-4 h-[2px] w-16 mx-auto bg-gradient-to-r from-transparent via-cosmic-cyan/50 to-transparent group-hover:via-cosmic-cyan transition-all duration-300" />
        </motion.div>
    );
}

StatItem.propTypes = {
    stat: PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        suffix: PropTypes.string,
        prefix: PropTypes.string
    }).isRequired,
    isInView: PropTypes.bool.isRequired,
    delay: PropTypes.number
};
