import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, RotateCcw, Plus, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useFlashcards from '../hooks/useFlashcards';
import Flashcard from '../components/flashcard/Flashcard';
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';

export default function FlashcardSpace() {
    const navigate = useNavigate();
    const {
        status,
        flashcardSets,
        currentSet,
        currentCard,
        currentIndex,
        total,
        isFlipped,
        sessionComplete,
        flip,
        rate,
        setCurrentSet,
        generateSet,
        reset
    } = useFlashcards();

    const [newTopic, setNewTopic] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (newTopic.trim()) {
            await generateSet(newTopic);
            setNewTopic('');
        }
    };

    const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

    if (status === 'loading' && flashcardSets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <Loader2 className="w-12 h-12 text-cosmic-cyan animate-spin mb-4" />
                <p className="text-gray-500 font-mono tracking-widest uppercase text-xs">Accessing neural archive...</p>
            </div>
        );
    }

    return (
        <div className="container-cosmic py-12 min-h-[85vh] flex flex-col items-center">
            {/* Top Bar: Selector & Generator */}
            <div className="w-full flex flex-col lg:flex-row gap-8 mb-16 items-start">
                <div className="flex-1 w-full">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-4">Saved Clusters</div>
                    <div className="flex flex-wrap gap-4">
                        {flashcardSets.map((set) => (
                            <button
                                key={set._id}
                                onClick={() => { setCurrentSet(set); reset(); }}
                                className={`px-4 py-2 rounded-lg border transition-all text-[10px] uppercase font-bold tracking-widest ${currentSet?._id === set._id
                                    ? 'bg-cosmic-cyan/10 border-cosmic-cyan text-cosmic-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]'
                                    : 'border-white/5 bg-white/5 text-gray-600 hover:text-white hover:border-white/10'
                                    }`}
                            >
                                <BookOpen size={12} className="inline mr-2" />
                                {set.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-96">
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-4">Neural Manifest</div>
                    <form onSubmit={handleGenerate} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New topic..."
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cosmic-cyan transition-all"
                        />
                        <button
                            disabled={status === 'generating'}
                            className="bg-cosmic-cyan text-black p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {status === 'generating' ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        </button>
                    </form>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {currentSet ? (
                    !sessionComplete ? (
                        <motion.div
                            key="session"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Header Stats */}
                            <div className="w-full max-w-2xl flex justify-between items-end mb-12 px-4">
                                <div className="text-left">
                                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-2">{currentSet.title}</div>
                                    <div className="text-3xl font-display font-bold text-white tracking-tighter">
                                        Card {currentIndex + 1}
                                        <span className="text-gray-800 font-light ml-4">/ {total}</span>
                                    </div>
                                </div>

                                <div className="text-right pb-1">
                                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2">Efficiency</div>
                                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cosmic-cyan"
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* The Card */}
                            {currentCard && (
                                <Flashcard
                                    card={currentCard}
                                    isFlipped={isFlipped}
                                    onFlip={flip}
                                />
                            )}

                            {/* Recall Controls */}
                            <div className="mt-16 h-20 flex items-center justify-center">
                                <AnimatePresence>
                                    {isFlipped && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-6"
                                        >
                                            <button
                                                onClick={() => rate('again')}
                                                className="px-8 py-3 rounded-xl border border-white/5 bg-white/5 text-gray-500 hover:text-cosmic-pink hover:border-cosmic-pink/30 hover:bg-cosmic-pink/5 transition-all text-xs uppercase font-bold tracking-widest"
                                            >
                                                Again
                                            </button>
                                            <button
                                                onClick={() => rate('good')}
                                                className="px-10 py-3 rounded-xl border border-cosmic-cyan/30 bg-cosmic-cyan/5 text-cosmic-cyan hover:bg-cosmic-cyan/10 transition-all text-xs uppercase font-bold tracking-widest shadow-[0_0_20px_rgba(0,245,255,0.1)]"
                                            >
                                                Good
                                            </button>
                                            <button
                                                onClick={() => rate('easy')}
                                                className="px-8 py-3 rounded-xl border border-white/5 bg-white/5 text-gray-500 hover:text-cosmic-gold hover:border-cosmic-gold/30 hover:bg-cosmic-gold/5 transition-all text-xs uppercase font-bold tracking-widest"
                                            >
                                                Easy
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-xl w-full text-center"
                        >
                            <GlassCard className="p-16 mb-12 border-t-4 border-t-cosmic-gold" glow glowColor="pink">
                                <Trophy className="w-16 h-16 text-cosmic-gold mx-auto mb-8" strokeWidth={1} />
                                <div className="text-[11px] uppercase tracking-[0.5em] font-bold text-gray-500 mb-6">Neural Sync Perfect</div>
                                <h2 className="text-4xl font-display font-bold text-white mb-8 tracking-tighter">Sector Mastered</h2>
                                <p className="text-gray-500 font-light leading-relaxed mb-10">
                                    Your recall efficiency has reached optimal levels for this knowledge cluster.
                                </p>
                            </GlassCard>

                            <div className="flex justify-center gap-8">
                                <button
                                    onClick={reset}
                                    className="flex items-center gap-2 text-xs uppercase font-bold tracking-[0.3em] text-gray-600 hover:text-white transition-colors"
                                >
                                    <RotateCcw size={14} /> // Recalibrate
                                </button>
                                <ParticleButton onClick={() => navigate('/dashboard')} className="rounded-none px-12">
                                    Terminate Session
                                </ParticleButton>
                            </div>
                        </motion.div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center pt-32">
                        <BookOpen className="w-20 h-20 text-white/5 mb-8" />
                        <h3 className="text-2xl font-bold text-white mb-4">No Neural Clusters Found</h3>
                        <p className="text-gray-500 max-w-sm text-center">Manifest a new topic or select a saved cluster to begin your knowledge verification.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

