import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArweaveMock } from '../../utils/ArweaveMock';
import { Rocket, Star, Repeat } from 'lucide-react';

const FinalUplink = () => {
    const [step, setStep] = useState('INIT'); // INIT, UPLOADING, CREDITS, DONE
    const [txId, setTxId] = useState(null);

    const startUpload = async () => {
        setStep('UPLOADING');
        const tx = await ArweaveMock.mint({ consciousness: true, xp: 999999 });
        setTxId(tx.id);
        setTimeout(() => setStep('CREDITS'), 2000);
    };

    const techs = [
        "React", "Fiber", "Node.js", "GraphQL", "PostgreSQL",
        "Redis", "Docker", "Kubernetes", "WebAssembly", "Rust",
        "Machine Learning", "Neural Networks", "Blockchain", "IPFS",
        "Cybernetics", "Quantum Computing"
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white overflow-hidden flex flex-col items-center justify-center">

            <AnimatePresence mode="wait">
                {step === 'INIT' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-8xl font-black mb-8 tracking-tighter">THE END</h1>
                        <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
                            You have completed the Hacker Tier Roadmap. Your neural patterns are ready for permanent storage on the Permaweb.
                        </p>
                        <button
                            onClick={startUpload}
                            className="group relative px-12 py-6 bg-white text-black font-black text-2xl rounded-none hover:bg-gray-200 transition-colors overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-4">
                                <Rocket size={32} /> ASCEND
                            </span>
                        </button>
                    </motion.div>
                )}

                {step === 'UPLOADING' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center space-y-4"
                    >
                        <div className="w-24 h-24 border-4 border-t-white border-r-white/50 border-b-white/10 border-l-white/5 rounded-full animate-spin mx-auto" />
                        <div className="font-mono text-cosmic-cyan">MINTING CONSCIOUSNESS TO BLOCK {Math.floor(Math.random() * 1000000)}...</div>
                    </motion.div>
                )}

                {step === 'CREDITS' && (
                    <motion.div
                        className="w-full h-full flex items-center justify-center relative"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="w-full text-center space-y-12 pb-20"
                                initial={{ y: '100%' }}
                                animate={{ y: '-150%' }}
                                transition={{ duration: 20, ease: 'linear' }}
                                onAnimationComplete={() => setStep('DONE')}
                            >
                                <div className="h-[50vh]" /> {/* Spacer */}
                                <h2 className="text-4xl font-black uppercase text-gray-500">Architecture</h2>
                                <div className="text-2xl font-bold">The Architect Persona</div>

                                <h2 className="text-4xl font-black uppercase text-gray-500 mt-20">Performance</h2>
                                <div className="text-2xl font-bold">The Hacker Persona</div>

                                <h2 className="text-4xl font-black uppercase text-gray-500 mt-20">Technologies Mastered</h2>
                                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto text-xl font-mono text-gray-300">
                                    {techs.map(t => <div key={t}>{t}</div>)}
                                </div>

                                <h2 className="text-4xl font-black uppercase text-gray-500 mt-20">Player</h2>
                                <div className="text-6xl font-black text-white">YOU</div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {step === 'DONE' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-lg"
                    >
                        <div className="mb-6 flex justify-center">
                            <Star size={64} className="text-yellow-500 fill-yellow-500 animate-spin-slow" />
                        </div>
                        <h2 className="text-5xl font-black mb-4">LEGACY SECURED</h2>
                        <div className="bg-black/50 p-4 rounded mb-8 font-mono text-xs text-gray-500 break-all max-w-md">
                            TX: {txId} (Simulated)
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button className="px-8 py-4 bg-white text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                <Repeat size={20} /> NEW GAME +
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">Prestige Mode Unlocked</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FinalUplink;
