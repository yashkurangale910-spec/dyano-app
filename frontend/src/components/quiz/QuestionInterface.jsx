import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ParticleButton from '../ui/ParticleButton';

export default function QuestionInterface({ question, currentIndex, totalIndex, timeLeft, onAnswer, selectedAnswer, onNext, isLast }) {
    // Format seconds into MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Asymmetric Header */}
            <header className="flex justify-between items-end mb-16 px-4">
                <div className="text-left">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan mb-2">
                        Neural Sync Active // {question.type || 'standard'}_scan
                    </div>
                    <div className="text-4xl font-display font-bold text-white tracking-tighter">
                        Question {currentIndex + 1}
                        <span className="text-gray-700 font-light ml-4">/ {totalIndex}</span>
                    </div>
                </div>

                <div className="text-right pb-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1">Time Remaining</div>
                    <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-cosmic-pink animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <GlassCard className="p-12 mb-12" glow glowColor="purple">
                        <h2 className="text-3xl font-display font-medium text-white mb-12 leading-tight tracking-tight">
                            {question.text}
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {question.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onAnswer(question.id, idx)}
                                    className={`
                                        w-full text-left p-6 rounded-2xl border transition-all duration-300
                                        ${selectedAnswer === idx
                                            ? 'bg-cosmic-cyan/10 border-cosmic-cyan text-white shadow-[0_0_20px_rgba(0,245,255,0.2)]'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'}
                                    `}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border
                                            ${selectedAnswer === idx ? 'bg-cosmic-cyan border-none text-cosmic-void' : 'border-white/10'}
                                        `}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-lg font-light tracking-wide">{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Explanation Bubble (Appears after selection) */}
                        <AnimatePresence>
                            {selectedAnswer !== undefined && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-12 pt-10 border-t border-white/5"
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="p-2 rounded-lg bg-cosmic-cyan/10">
                                            <Zap size={16} className="text-cosmic-cyan" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-widest font-bold text-cosmic-cyan mb-2">Neural Insight</div>
                                            <p className="text-gray-400 text-sm italic leading-relaxed">
                                                {question.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center px-4">
                <div className="w-48 h-[1px] bg-white/5"></div>

                <ParticleButton
                    onClick={onNext}
                    disabled={selectedAnswer === undefined}
                    className="disabled:opacity-20 disabled:scale-95 px-12 py-5 rounded-none tracking-[0.3em] font-bold text-xs uppercase"
                >
                    {isLast ? 'Complete Sequence' : 'Next Transmission'}
                </ParticleButton>
            </div>
        </div>
    );
}
