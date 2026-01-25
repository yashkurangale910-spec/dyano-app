import { motion } from 'framer-motion';
import ParticleButton from '../ui/ParticleButton';

export default function HeroSection({ content, onLaunch, onSignIn }) {
    return (
        <div className="relative z-10 min-h-[90vh] flex items-center pt-20 overflow-hidden">
            <div
                className="container-cosmic grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                style={{ transform: `translateY(calc(var(--scroll-y, 0px) * 0.2))` }}
            >
                <motion.div
                    className="lg:col-span-8 text-left"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Subtle Project Label */}
                    <motion.div
                        className="flex items-center gap-4 mb-8 opacity-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="w-10 h-[1px] bg-cosmic-cyan"></div>
                        <span className="text-[10px] font-display tracking-[0.4em] font-bold text-cosmic-cyan uppercase">
                            {content.title} Internal // Node 0.1
                        </span>
                    </motion.div>

                    {/* High-Contrast Header */}
                    <motion.h1
                        className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white mb-8 leading-[0.9] tracking-tighter"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {content.subtitle.split(' ').map((word, i) => (
                            <span key={i} className={word === 'Universe' ? 'text-cosmic-cyan' : ''}>
                                {word}{' '}
                            </span>
                        ))}
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-500 mb-12 max-w-xl leading-relaxed font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {content.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-10 items-center sm:items-start"
                    >
                        <ParticleButton size="lg" onClick={onLaunch} className="rounded-sm px-12 py-5 uppercase tracking-widest text-sm">
                            Initialize
                        </ParticleButton>

                        <button
                            onClick={onSignIn}
                            className="group flex items-center gap-4 text-[11px] tracking-[0.3em] font-display font-bold text-white/30 hover:text-white transition-all uppercase"
                        >
                            <span className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-cosmic-pink transition-all duration-500"></span>
                            Synchronize
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
