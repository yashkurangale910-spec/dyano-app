import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import BaseButton from '../components/ui/BaseButton';
import LuxuryCard from '../components/ui/LuxuryCard';
import FeatureGrid from '../components/landing/FeatureGrid';
import { LANDING_FEATURES, LANDING_STATS } from '../constants/landingContent';

const Landing = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();

    // Phase VI: Cinematic Parallax
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 400]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

    return (
        <div className="relative w-full overflow-hidden">
            {/* 🌌 Phase VI: Cinematic Atmospheric Layers (Minimalist) */}
            <motion.div style={{ y: y1 }} className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-white/[0.02] blur-[180px] rounded-full pointer-events-none" />
            <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-white/[0.01] blur-[180px] rounded-full pointer-events-none" />

            {/* 1. HERO SECTION - High-Spec Narrative */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 lg:pt-48 lg:pb-40">
                <motion.div
                    style={{ opacity, scale }}
                    className="max-w-6xl mx-auto px-6 text-center z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] uppercase font-black tracking-[0.3em] text-gray-500 mb-12"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                        Production Environment: 0.15.2 [Stable]
                    </motion.div>

                    <h1 className="text-display mb-12 text-white leading-[0.95] tracking-[-0.06em]">
                        Mastery via <br />
                        <span className="text-gray-400">Precision Intelligence.</span>
                    </h1>

                    <p className="text-h3 font-light text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
                        Dyano is the high-performance synthesis engine for modern learners.
                        Adaptive neural structures meet professional-grade cognitive architecture.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <BaseButton size="lg" variant="primary" onClick={() => navigate('/register')}>
                            Neural Initialization <ArrowRight className="ml-2 w-4 h-4" />
                        </BaseButton>
                        <BaseButton size="lg" variant="secondary" onClick={() => navigate('/login')}>
                            Terminal Access
                        </BaseButton>
                    </motion.div>
                </motion.div>

                {/* Visual Anchor: Static Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]" />
            </section>

            {/* 2. STATS SECTION - Deep Density */}
            <section className="py-24 border-y border-white/[0.05] relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-left">
                        {LANDING_STATS.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="border-l border-white/5 pl-8"
                            >
                                <div className="text-h1 font-black text-white mb-2 tracking-tighter">
                                    {stat.value.toLocaleString()}{stat.suffix}
                                </div>
                                <div className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. BENTO GRID - Phase IV Override */}
            <FeatureGrid features={LANDING_FEATURES.slice(0, 5)} />

            {/* 4. PERFORMANCE ARCHITECTURE - Modular View */}
            <section className="py-48 bg-bg-surface/30 relative z-10 border-t border-white/5">
                <div className="container-monolith">
                    <div className="grid lg:grid-cols-2 gap-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8 block opacity-40">Architecture Alpha</span>
                            <h2 className="text-h1 font-black text-white mb-10 tracking-tight">Unified <br /> <span className="text-gray-500">Neural Stream.</span></h2>
                            <ul className="space-y-12">
                                {[
                                    { icon: <Zap size={24} />, text: "Low-latency AI inference", sub: "Response times under 400ms globally via Edge Cognitive Nodes." },
                                    { icon: <Shield size={24} />, text: "End-to-end neural encryption", sub: "Zero-knowledge knowledge bases. Only you hold the synaptic keys." },
                                    { icon: <Globe size={24} />, text: "Distributed global sync", sub: "Collaborate across the nebula with real-time vector consistency." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-8 group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white/5 group-hover:text-white group-hover:border-white/20 transition-all duration-500 flex-shrink-0 shadow-2xl">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">{item.text}</div>
                                            <div className="text-gray-500 text-sm font-light leading-relaxed max-w-md">{item.sub}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-accent-cyan/10 blur-[120px] rounded-full pointer-events-none" />
                            <LuxuryCard variant="glass" className="p-4 overflow-hidden border-white/10 shadow-3xl">
                                <div className="w-full aspect-[4/3] bg-bg-main/80 rounded-xl flex items-center justify-center text-gray-700 font-mono text-[9px] tracking-[0.6em] relative overflow-hidden backdrop-blur-xl">
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/5" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/5" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/5" />
                                    </div>
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center animate-[spin_8s_linear_infinite]">
                                            <div className="w-8 h-8 rounded-full border border-accent-cyan/30 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                                            </div>
                                        </div>
                                        <span className="animate-pulse">STREAM_READY</span>
                                    </div>
                                    <div className="absolute bottom-6 left-6 text-[8px]">COREOS_V_0.15.2</div>
                                    <div className="absolute bottom-6 right-6 flex items-center gap-2">
                                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-accent-cyan shadow-[0_0_10px_rgba(var(--accent-cyan-h),100%,50%,0.5)]" />
                                        </div>
                                    </div>
                                </div>
                            </LuxuryCard>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. FOOTER - Cinematic Minimalist */}
            <footer className="py-32 border-t border-white/5 relative z-10 bg-bg-main">
                <div className="container-cosmic flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
                    <div>
                        <div className="text-display-sm font-black text-white mb-4 tracking-tighter">DYANO.</div>
                        <div className="text-[10px] text-gray-700 font-mono tracking-[0.5em] uppercase italic">
                            Redefining Cognition since 2026
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
                        <a href="#" className="hover:text-white transition-colors">Nodes</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                        <a href="#" className="hover:text-white transition-colors">Manifesto</a>
                        <a href="#" className="hover:text-white transition-colors">Relay</a>
                        <a href="#" className="hover:text-white transition-colors">Docs</a>
                        <a href="#" className="hover:text-white transition-colors">Terminal</a>
                    </div>
                </div>
                <div className="container-cosmic mt-32 pt-8 border-t border-white/[0.03] flex justify-between text-[8px] font-mono text-gray-800 tracking-[0.5em]">
                    <span>&copy; DYANO_SYSTEMS</span>
                    <span>ALL_RIGHTS_RESERVED</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
