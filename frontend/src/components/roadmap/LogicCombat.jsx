import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Heart, Timer, Sword, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import ParticleButton from '../ui/ParticleButton';
import { HapticService } from '../../utils/HapticService';

const LogicCombat = ({ quiz, onDefeat, onVictory }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [combatStatus, setCombatStatus] = useState('entering'); // entering | fighting | success | failed

    const currentQuestion = quiz.questions[currentQuestionIndex];

    useEffect(() => {
        if (combatStatus === 'fighting' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && combatStatus === 'fighting') {
            handleTimeOut();
        }
    }, [timeLeft, combatStatus]);

    const handleTimeOut = () => {
        setLives(prev => prev - 1);
        HapticService.error();
        setFeedback({ type: 'error', message: "CHRONO_DISRUPTION: Time Expired! Neural sync damaged." });
        if (lives <= 1) {
            setCombatStatus('failed');
        } else {
            setTimeout(() => {
                setFeedback(null);
                setTimeLeft(30);
                nextQuestion();
            }, 2000);
        }
    };

    const handleAnswer = (answer) => {
        if (selectedAnswer || feedback) return;
        setSelectedAnswer(answer);

        const isCorrect = answer === currentQuestion.correctAnswer;
        if (isCorrect) {
            HapticService.success();
            setFeedback({ type: 'success', message: "LOGIC_STRIKE: Critical hit! Enemy neural pattern disrupted." });
            setTimeout(() => {
                setFeedback(null);
                setSelectedAnswer(null);
                setTimeLeft(30);
                if (currentQuestionIndex === quiz.questions.length - 1) {
                    setCombatStatus('success');
                } else {
                    nextQuestion();
                }
            }, 2000);
        } else {
            setLives(prev => prev - 1);
            HapticService.heavy();
            setFeedback({ type: 'error', message: "SYSTEM_RECOIL: Error detected. Feedback loop damaging neural links." });
            if (lives <= 1) {
                setCombatStatus('failed');
            } else {
                setTimeout(() => {
                    setFeedback(null);
                    setSelectedAnswer(null);
                    setTimeLeft(30);
                    nextQuestion();
                }, 2000);
            }
        }
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(prev => prev + 1);
    };

    if (combatStatus === 'entering') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center"
            >
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="w-32 h-32 bg-red-600/20 rounded-full flex items-center justify-center mb-8 border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                >
                    <Sword size={64} className="text-red-600" />
                </motion.div>
                <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4 animate-pulse">BOSS_ENCOUNTER_DETECTED</h2>
                <p className="text-red-500 font-bold uppercase tracking-[0.5em] mb-12">Level Tier: EXTREME // Logic Density: CRITICAL</p>
                <ParticleButton
                    onClick={() => setCombatStatus('fighting')}
                    className="px-12 py-5 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                >
                    Initiate Combat Protocol
                </ParticleButton>
            </motion.div>
        );
    }

    if (combatStatus === 'success') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-[#05010d] flex flex-col items-center justify-center p-8 text-center">
                <Trophy size={100} className="text-cosmic-gold mb-8 animate-bounce" />
                <h2 className="text-6xl font-black text-white mb-4">BOSS_DEFEATED</h2>
                <p className="text-cosmic-cyan font-bold uppercase tracking-widest mb-12">Neural Synchrony achieved. Mastered Pattern Acquired.</p>
                <ParticleButton onClick={() => onVictory(quiz)} className="px-12 py-5 bg-cosmic-cyan text-black font-black uppercase tracking-widest rounded-2xl">
                    Collect Artifact Loot
                </ParticleButton>
            </motion.div>
        );
    }

    if (combatStatus === 'failed') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle size={100} className="text-red-500 mb-8" />
                <h2 className="text-6xl font-black text-white mb-4">CRITICAL_FAILURE</h2>
                <p className="text-red-400 font-bold uppercase tracking-widest mb-12">Neural links severed. Forced Resynchronization required.</p>
                <ParticleButton onClick={onDefeat} className="px-12 py-5 bg-white text-red-950 font-black uppercase tracking-widest rounded-2xl">
                    Return to Library
                </ParticleButton>
            </motion.div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] bg-[#05010d] flex flex-col overflow-hidden">
            {/* HUD */}
            <div className="p-8 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cosmic-cyan'}`} />
                        <span className="text-2xl font-black font-mono text-white">{timeLeft}S</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {[...Array(3)].map((_, i) => (
                            <Heart
                                key={i}
                                className={`w-6 h-6 transition-all duration-500 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-800'}`}
                                style={{ filter: i < lives ? 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.5))' : 'none' }}
                            />
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Encounter Progress</div>
                    <div className="flex gap-1">
                        {quiz.questions.map((_, i) => (
                            <div key={i} className={`h-1.5 w-8 rounded-full ${i < currentQuestionIndex ? 'bg-cosmic-cyan' : i === currentQuestionIndex ? 'bg-white animate-pulse' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Combat Arena */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-4xl"
                    >
                        <div className="mb-12">
                            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                {currentQuestion.questionText}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    disabled={!!selectedAnswer}
                                    className={`relative p-8 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden group ${selectedAnswer === option
                                        ? option === currentQuestion.correctAnswer
                                            ? 'bg-green-600/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                                            : 'bg-red-600/20 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                                        }`}
                                >
                                    <span className={`text-lg font-bold ${selectedAnswer === option ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                        {option}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Feedback Toast */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className={`absolute bottom-12 px-8 py-4 rounded-2xl border font-bold uppercase tracking-widest text-sm backdrop-blur-xl ${feedback.type === 'success' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'
                                }`}
                        >
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default LogicCombat;
