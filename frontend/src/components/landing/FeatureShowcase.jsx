import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from '../ui/Card';

/**
 * Premium Feature Showcase Grid
 * Displays features in a responsive grid with staggered animations
 */
export default function FeatureShowcase({ features = [] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cosmic-purple/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cosmic-cyan/10 blur-[120px] rounded-full" />

            <div className="container-cosmic relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-xl mb-6">
                        <div className="w-2 h-2 rounded-full bg-cosmic-cyan animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                            Core Features
                        </span>
                    </div>

                    <h2 className="text-6xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">
                        Everything You Need to <br />
                        <span className="text-gradient-kinetic">Master Anything</span>
                    </h2>

                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
                        Transform your learning experience with AI-powered tools designed for the modern learner
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <FeatureCard feature={feature} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

FeatureShowcase.propTypes = {
    features: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            tag: PropTypes.string
        })
    )
};

// Individual Feature Card Component
function FeatureCard({ feature }) {
    return (
        <Card variant="glass" hover="lift" className="group h-full">
            <CardContent className="p-8">
                {/* Icon with glow effect */}
                <div className="mb-6 relative inline-block">
                    <div className="absolute inset-0 bg-cosmic-cyan/20 blur-xl rounded-full group-hover:bg-cosmic-cyan/30 transition-all duration-500" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cosmic-cyan/20 to-cosmic-purple/10 border border-white/10 flex items-center justify-center text-cosmic-cyan group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                    </div>
                </div>

                {/* Tag */}
                {feature.tag && (
                    <div className="inline-block px-3 py-1 rounded-full bg-cosmic-purple/10 border border-cosmic-purple/20 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cosmic-pink">
                            {feature.tag}
                        </span>
                    </div>
                )}

                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-cosmic-cyan transition-colors">
                    {feature.title}
                </h3>

                <p className="text-gray-500 font-light leading-relaxed">
                    {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cosmic-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
}

FeatureCard.propTypes = {
    feature: PropTypes.shape({
        icon: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        tag: PropTypes.string
    }).isRequired
};
