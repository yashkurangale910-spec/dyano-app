import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Ghost, Trophy, Skull } from 'lucide-react';

const CognitiveCageMatch = ({ onClose }) => {
    const [status, setStatus] = useState('MATCHMAKING'); // MATCHMAKING, FIGHT, VICTORY, DEFEAT
    const [opponentProgress, setOpponentProgress] = useState(0);
    const [userProgress, setUserProgress] = useState(0);

    // Mock Puzzle
    const puzzle = {
        question: "Does P = NP if N = 1?",
        options: ["Yes", "No", "Only on Sundays", "Undefined"],
        answer: 0
    };

    useEffect(() => {
        if (status === 'MATCHMAKING') {
            setTimeout(() => setStatus('FIGHT'), 2000);
        }

        if (status === 'FIGHT') {
            const interval = setInterval(() => {
                setOpponentProgress(prev => {
                    if (prev >= 100) {
                        setStatus('DEFEAT');
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + (Math.random() * 8); // Aggressive AI
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [status]);

    const handleAnswer = (idx) => {
        if (idx === puzzle.answer) {
            setUserProgress(100);
            setStatus('VICTORY');
        } else {
            // Penalty delay
            setUserProgress(p => Math.max(0, p - 20));
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gray-900 border-2 border-red-900/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]">

                {/* Header */}
                <div className="bg-red-950/30 p-4 border-b border-red-900/30 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest">
                        <Swords size={20} /> CAGE MATCH
                    </div>
                    <div className="text-gray-500 font-mono text-xs">RANKED :: DIAMOND LEAGUE</div>
                </div>

                {/* Arena */}
                <div className="p-8 relative min-h-[400px] flex flex-col justify-center">

                    {status === 'MATCHMAKING' && (
                        <div className="text-center animate-pulse">
                            <Ghost size={48} className="mx-auto text-gray-600 mb-4" />
                            <h2 className="text-2xl font-display font-bold text-white">FINDING OPPONENT...</h2>
                            <p className="text-gray-500">Scanning global neural mesh...</p>
                        </div>
                    )}

                    {status === 'FIGHT' && (
                        <>
                            {/* Progress Bars */}
                            <div className="mb-12 space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-green-500 mb-1">
                                        <span>YOU</span>
                                        <span>{Math.round(userProgress)}%</span>
                                    </div>
                                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${userProgress}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-red-500 mb-1">
                                        <span className="flex items-center gap-1"><Ghost size={12} /> ENEMY_GHOST_88</span>
                                        <span>{Math.round(opponentProgress)}%</span>
                                    </div>
                                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${opponentProgress}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Puzzle */}
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-6">{puzzle.question}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {puzzle.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className="p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 rounded-lg text-gray-300 font-mono transition-all"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {status === 'VICTORY' && (
                        <div className="text-center">
                            <Trophy size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                            <h2 className="text-4xl font-black text-yellow-500 mb-2">VICTORY</h2>
                            <p className="text-gray-400 mb-6">+500 XP | +25 MMR</p>
                            <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded hover:scale-105 transition-transform">LEAVE ARENA</button>
                        </div>
                    )}

                    {status === 'DEFEAT' && (
                        <div className="text-center">
                            <Skull size={64} className="mx-auto text-red-600 mb-4" />
                            <h2 className="text-4xl font-black text-red-600 mb-2">DEFEAT</h2>
                            <p className="text-gray-400 mb-6">-200 XP | SHAME APPLIED</p>
                            <button onClick={onClose} className="px-6 py-2 border border-red-600/50 text-red-500 font-bold rounded hover:bg-red-900/20 transition-colors">RETREAT</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CognitiveCageMatch;
