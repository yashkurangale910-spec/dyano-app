import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe, Award, Share2, Download } from 'lucide-react';

export default function SingularityProtocol({ isOpen, onClose, userName = "Learner" }) {
    const [step, setStep] = useState(0);

    // Progression of the finale
    useEffect(() => {
        if (!isOpen) return;
        const timers = [
            setTimeout(() => setStep(1), 2000), // Neural Sync
            setTimeout(() => setStep(2), 5000), // Reality Calibration
            setTimeout(() => setStep(3), 8000), // Singularity Achieved
        ];
        return () => timers.forEach(t => clearTimeout(t));
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
            >
                {/* Background Pure Energy Effect */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/[0.02] animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[150px] rounded-full animate-ping" />
                </div>

                {/* Step 0 & 1: Neural Sync / Calibration */}
                {step < 3 && (
                    <motion.div
                        key="calibration"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center relative z-10"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 border-2 border-white/20 border-t-white rounded-full mx-auto mb-8 flex items-center justify-center"
                        >
                            <Zap className="text-white" size={48} strokeWidth={1} />
                        </motion.div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-[0.5em] mb-4">
                            {step === 0 ? "Neural_Sync_Initiated" : "Ascension_Protocol"}
                        </h2>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest animate-pulse">
                            {step === 0 ? "Calibrating_Brain_Waves..." : "Dissolving_Cognitive_Barriers..."}
                        </div>
                    </motion.div>
                )}

                {/* Step 3: The Finale Screen */}
                {step === 3 && (
                    <motion.div
                        key="finale"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl w-full p-12 relative z-10"
                    >
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[4rem] p-16 text-center space-y-8 relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.02] blur-[100px] rounded-full" />

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                                className="w-24 h-24 bg-white text-black rounded-full mx-auto flex items-center justify-center shadow-2xl"
                            >
                                <Award size={48} strokeWidth={1} />
                            </motion.div>

                            <div className="space-y-4">
                                <h1 className="text-6xl font-black text-white tracking-tighter">
                                    SINGULARITY <span className="text-gradient-monolith">ACHIEVED</span>
                                </h1>
                                <p className="text-gray-500 text-xl font-light">
                                    The journey of <b>{userName}</b> has transcended formal boundaries. Your cognitive architecture has been rebuilt through the Dyano swarm.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-12">
                                {[
                                    { label: 'Neural Density', val: '99.9%', icon: <Zap size={16} /> },
                                    { label: 'Time Synced', val: '128 Hours', icon: <Globe size={16} /> },
                                    { label: 'Global Rank', val: '0.1%', icon: <Shield size={16} /> }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group-hover:border-white/10 transition-all">
                                        <div className="text-white/40 mb-3 flex justify-center">{stat.icon}</div>
                                        <div className="text-2xl font-black text-white">{stat.val}</div>
                                        <div className="text-[10px] text-gray-700 uppercase font-black tracking-widest mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-12 justify-center">
                                <button className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-gray-200 transition-all shadow-2xl">
                                    <Download size={20} /> Export Neural Legacy
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-10 py-5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-white/5 transition-all"
                                >
                                    Return to Reality
                                </button>
                            </div>

                            <div className="pt-8 text-[8px] text-gray-700 font-black uppercase tracking-[0.6em]">
                                SYSTEM_STATUS: TRANSCENDENCE_COMPLETE // GOODBYE_WORLD
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
