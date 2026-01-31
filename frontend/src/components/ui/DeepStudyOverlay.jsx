import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Cpu, Activity, Zap } from 'lucide-react';

export default function DeepStudyOverlay({ onClose }) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [authProgress, setAuthProgress] = useState(0);

    useEffect(() => {
        if (isAuthenticating) {
            const interval = setInterval(() => {
                setAuthProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsAuthenticating(false), 500);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isAuthenticating]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black backdrop-blur-3xl flex items-center justify-center p-8 overflow-hidden"
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cosmic-cyan/5 blur-[150px] animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <AnimatePresence mode="wait">
                {isAuthenticating ? (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="relative z-10 flex flex-col items-center max-w-md w-full"
                    >
                        <motion.div
                            animate={{
                                rotateY: [0, 180, 360],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 mb-12 relative"
                        >
                            <div className="absolute inset-0 bg-cosmic-cyan/20 blur-2xl rounded-full" />
                            <div className="relative w-full h-full bg-black/50 border-2 border-cosmic-cyan rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,245,255,0.3)]">
                                <Shield className="text-cosmic-cyan" size={48} />
                            </div>
                        </motion.div>

                        <div className="w-full space-y-4 text-center">
                            <div className="text-[12px] font-black text-cosmic-cyan uppercase tracking-[0.5em] mb-2">Biometric Scan Initialized</div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${authProgress}%` }}
                                    className="h-full bg-gradient-to-r from-cosmic-cyan via-white to-cosmic-cyan shadow-glow-cyan"
                                />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                                <span>Scanning Neural Pattern</span>
                                <span>{authProgress}% Verified</span>
                            </div>
                        </div>

                        <div className="mt-16 grid grid-cols-2 gap-8 w-full opacity-40">
                            <div className="flex items-center gap-3">
                                <Cpu size={16} className="text-cosmic-cyan" />
                                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Core_Sync</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Activity size={16} className="text-cosmic-cyan" />
                                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Synapse_Load</div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="study-mode"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 w-full max-w-6xl h-full flex flex-col pt-20"
                    >
                        {/* Header HUD */}
                        <div className="flex justify-between items-start mb-20">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] font-black uppercase tracking-[0.3em] mb-4">
                                    Deep Study Protocol Active
                                </div>
                                <h1 className="text-6xl font-display font-black text-white tracking-tighter uppercase italic">Hyper_State</h1>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all group"
                            >
                                <X className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Main Interaction Area */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-8 space-y-12">
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-display font-bold text-gray-400 leading-tight">
                                        Distraction-free environment engaged. Focus on your synaptic growth.
                                    </h2>
                                    <div className="h-[2px] w-40 bg-gradient-to-r from-cosmic-cyan to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl">
                                        <Zap className="text-cosmic-cyan mb-6" size={32} />
                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Retention Rate</div>
                                        <div className="text-4xl font-black text-white">+24%</div>
                                    </div>
                                    <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl md:col-span-2 flex items-center gap-8">
                                        <div className="flex-1">
                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Cognitive Load Status</div>
                                            <div className="text-2xl font-bold text-cosmic-cyan">Optimized for Synthesis</div>
                                        </div>
                                        <div className="flex -space-x-4">
                                            {[1, 2, 3].map(i => <div key={i} className="w-12 h-12 rounded-2xl bg-cosmic-cyan/10 border border-cosmic-cyan/20 backdrop-blur-md" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cosmic-cyan/20 to-transparent border border-cosmic-cyan/30 text-center space-y-6">
                                    <div className="text-xs font-black text-white uppercase tracking-[0.3em]">Session Clock</div>
                                    <div className="text-6xl font-display font-black text-white tracking-widest tabular-nums">25:00</div>
                                    <button className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-95 transition-all">Pause Flux</button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Status */}
                        <div className="mt-auto py-12 flex justify-between items-center border-t border-white/5">
                            <div className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.4em]">Ambient Biometrics Enabled // Sensory Dampening 100%</div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Neural_Stable</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-cosmic-cyan animate-pulse" />
                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Sync_Healthy</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
