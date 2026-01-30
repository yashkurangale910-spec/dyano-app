import { motion } from 'framer-motion';
import ParticleButton from '../ui/ParticleButton';
import { ArrowRight, Activity, Command } from 'lucide-react';

export default function HeroSection({ content, onLaunch, onSignIn }) {
    return (
        <div className="relative z-10 min-h-screen flex items-center pt-32 pb-40 overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-cosmic-purple/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-cosmic-cyan/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="container-cosmic relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Top Status Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-6 mb-16"
                    >
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
                            <Activity size={10} className="text-cosmic-cyan animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">System Live // Node-01</span>
                        </div>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        <span className="text-[8px] font-mono text-gray-700 tracking-[0.4em]">v4.2.0_STABLE</span>
                    </motion.div>

<<<<<<< HEAD
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                        <motion.div
                            className="lg:col-span-8"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Cinematic Typography */}
                            <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-display font-black text-white leading-[0.8] tracking-[-0.06em] mb-12">
                                {content.subtitle.split(' ').map((word, i) => (
                                    <span key={i} className={i === 1 ? "text-gradient-kinetic block" : "block"}>
                                        {word}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-500 max-w-xl leading-relaxed font-light mb-16 tracking-wide">
                                {content.description}
                            </p>

                            <div className="flex flex-col gap-12">
                                {/* Architect Input */}
                                <div className="relative max-w-2xl group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-cyan/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); onLaunch(e.target.topic.value); }}
                                        className="relative flex flex-col md:flex-row gap-4 bg-white/[0.02] border border-white/5 p-2 rounded-[2rem] backdrop-blur-3xl"
                                    >
                                        <div className="flex-1 flex items-center px-6 gap-4 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0">
                                            <Command size={16} className="text-gray-600" />
                                            <input
                                                name="topic"
                                                type="text"
                                                placeholder="Initialize Neural Topic..."
                                                className="w-full bg-transparent py-4 text-white text-lg focus:outline-none placeholder:text-gray-700"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-10 py-4 bg-cosmic-cyan text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-glow-cyan hover:scale-95 transition-all"
                                        >
                                            Deep Dive
                                        </button>
                                    </form>
                                </div>

                                {/* Quick Links */}
                                <div className="flex flex-wrap items-center gap-12">
                                    <button
                                        onClick={() => onLaunch()}
                                        className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cosmic-cyan/10 group-hover:border-cosmic-cyan/30 transition-all">
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        Mission Control
                                    </button>

                                    <button
                                        onClick={onSignIn}
                                        className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cosmic-pink/10 group-hover:border-cosmic-pink/30 transition-all">
                                            <Activity size={14} />
                                        </div>
                                        Synchronize
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Geometric Side Element */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 1.5 }}
                            className="hidden lg:block lg:col-span-4 relative"
                        >
                            <div className="aspect-square rounded-[4rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl flex items-center justify-center p-12 group">
                                <Activity className="w-32 h-32 text-white/5 group-hover:text-cosmic-cyan/20 transition-all duration-1000" strokeWidth={0.5} />
                                <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-[4rem]" />
                                {/* Floating Tags */}
                                <div className="absolute -top-6 -right-6 px-4 py-2 bg-cosmic-pink/10 border border-cosmic-pink/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-cosmic-pink">Sector-D3</div>
                                <div className="absolute -bottom-6 -left-6 px-4 py-2 bg-cosmic-cyan/10 border border-cosmic-cyan/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-cosmic-cyan">Neural-Link</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
=======
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
                        className="flex flex-col gap-8 items-center sm:items-start"
                    >
                        {/* Restore Topic Input */}
                        <div className="w-full max-w-lg mb-4">
                            <form onSubmit={(e) => { e.preventDefault(); onLaunch(e.target.topic.value); }} className="relative group">
                                <input
                                    name="topic"
                                    type="text"
                                    placeholder="Enter topic to Deep Dive (e.g. Quantum Physics)"
                                    className="w-full bg-white/[0.03] border-b-2 border-white/10 py-5 px-6 text-xl text-white placeholder:text-gray-700 focus:outline-none focus:border-cosmic-cyan transition-all duration-500 rounded-t-xl"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <ParticleButton type="submit" size="sm" className="rounded-sm px-8 py-3 uppercase tracking-widest text-[10px] font-bold">
                                        Deep Dive
                                    </ParticleButton>
                                </div>
                            </form>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
                            <button
                                onClick={() => onLaunch()}
                                className="group flex items-center gap-4 text-[11px] tracking-[0.3em] font-display font-bold text-white/30 hover:text-white transition-all uppercase"
                            >
                                <span className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-cosmic-cyan transition-all duration-500"></span>
                                Access Mission Control
                            </button>

                            <button
                                onClick={onSignIn}
                                className="group flex items-center gap-4 text-[11px] tracking-[0.3em] font-display font-bold text-white/30 hover:text-white transition-all uppercase"
                            >
                                <span className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-cosmic-pink transition-all duration-500"></span>
                                Synchronize
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
            </div>
        </div>
    );
}
