import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Trophy,
    RotateCcw,
    Plus,
    BookOpen,
    Loader2,
    Sparkles,
    Terminal,
    Layers,
    Brain,
    Zap,
    History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFlashcards from '../hooks/useFlashcards';
import Flashcard from '../components/flashcard/Flashcard';
import LuxuryCard, { LuxuryContent, LuxuryHeader } from '../components/ui/LuxuryCard';
import BaseButton from '../components/ui/BaseButton';
import PageHeader from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EnhancedInput from '../components/ui/EnhancedInput';
import LoadingState from '../components/ui/LoadingState';
import ProgressBar from '../components/ui/ProgressIndicator';
import EmptyState from '../components/ui/EmptyState';

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
        if (e) e.preventDefault();
        if (newTopic.trim()) {
            await generateSet(newTopic);
            setNewTopic('');
        }
    };

    const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

    return (
        <div className="w-full relative min-h-screen">
            <main className="py-12 md:py-20 relative z-10">
                <div className="container-monolith">

                    {/* Navigation Context */}
                    <Breadcrumbs />

                    <AnimatePresence mode="wait">
                        {!currentSet && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-16"
                            >
                                {/* Page Header */}
                                <motion.div layoutId="card-flashcards">
                                    <PageHeader
                                        title="Neural Flashcards"
                                        subtitle="Manifest new knowledge clusters or select stored synaptic pods to reinforce long-term recall."
                                        helpText="Spaced repetition algorithms optimize your study sessions based on previous recall latency."
                                    />
                                </motion.div>

                                <div className="grid lg:grid-cols-12 gap-12">
                                    {/* Manifest Form */}
                                    <div className="lg:col-span-4">
                                        <LuxuryCard variant="glass" className="h-full border-white/10">
                                            <LuxuryContent className="p-10 space-y-8">
                                                <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex-center text-accent-cyan">
                                                    <Brain size={28} strokeWidth={1.5} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-h3">Manifest Pod</h3>
                                                    <p className="text-caption">Synthesize a new cluster from the global archive.</p>
                                                </div>
                                                <form onSubmit={handleGenerate} className="space-y-4">
                                                    <EnhancedInput
                                                        placeholder="Topic (e.g. Docker Internals)"
                                                        value={newTopic}
                                                        onChange={setNewTopic}
                                                        variant="glass"
                                                        size="sm"
                                                    />
                                                    <BaseButton
                                                        type="submit"
                                                        variant="primary"
                                                        size="md"
                                                        loading={status === 'generating'}
                                                        className="w-full uppercase tracking-widest font-black"
                                                        leftIcon={<Plus size={16} />}
                                                        disabled={!newTopic.trim()}
                                                    >
                                                        Manifest
                                                    </BaseButton>
                                                </form>
                                            </LuxuryContent>
                                        </LuxuryCard>
                                    </div>

                                    {/* Cluster Archive */}
                                    <div className="lg:col-span-8 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <History size={16} className="text-gray-700" />
                                            <h4 className="text-mono text-gray-700">Stored Clusters</h4>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>

                                        {flashcardSets.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {flashcardSets.map((set) => (
                                                    <LuxuryCard
                                                        key={set._id}
                                                        onClick={() => { setCurrentSet(set); reset(); }}
                                                        className="group cursor-pointer hover:bg-white/[0.02] border-white/5"
                                                    >
                                                        <LuxuryContent className="p-8 flex items-center justify-between">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex-center text-gray-500 group-hover:text-accent-cyan group-hover:bg-accent-cyan/10 transition-all duration-500">
                                                                    <Layers size={21} strokeWidth={1.5} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{set.title}</div>
                                                                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">{set.cards?.length || 0} Synapses</div>
                                                                </div>
                                                            </div>
                                                            <ChevronRight size={18} className="text-gray-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                        </LuxuryContent>
                                                    </LuxuryCard>
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                title="Archive Empty"
                                                description="No local knowledge clusters detected. Manifest your first pod to begin."
                                                icon={Layers}
                                            />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentSet && !sessionComplete && (
                            <motion.div
                                key="active-session"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto space-y-16"
                            >
                                <div className="flex justify-between items-end">
                                    <div className="space-y-4">
                                        <BaseButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { setCurrentSet(null); }}
                                            className="!px-0 text-gray-500 hover:text-white"
                                            leftIcon={<ChevronLeft size={16} />}
                                        >
                                            Return to Archive
                                        </BaseButton>
                                        <div>
                                            <div className="text-mono text-[10px] text-accent-cyan flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                                                Active Session // {currentSet.title}
                                            </div>
                                            <h2 className="text-h2">
                                                Card {currentIndex + 1}
                                                <span className="text-gray-700 ml-4 font-light text-3xl">/ {total}</span>
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-48 mb-2">
                                        <div className="flex justify-between text-mono text-[10px] text-gray-600 mb-2">
                                            <span>Retention Progress</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <ProgressBar value={progress} size="xs" color="cyan" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    {currentCard && (
                                        <Flashcard
                                            card={currentCard}
                                            isFlipped={isFlipped}
                                            onFlip={flip}
                                        />
                                    )}

                                    <div className="mt-20 h-24 flex-center">
                                        <AnimatePresence>
                                            {isFlipped && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex gap-6 p-2 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-3xl"
                                                >
                                                    <BaseButton variant="secondary" size="lg" onClick={() => rate('again')} className="w-40 uppercase tracking-widest font-black">Again</BaseButton>
                                                    <BaseButton variant="primary" size="lg" onClick={() => rate('good')} className="w-56 uppercase tracking-widest font-black" leftIcon={<Trophy size={18} />}>Mastered</BaseButton>
                                                    <BaseButton variant="secondary" size="lg" onClick={() => rate('easy')} className="w-40 uppercase tracking-widest font-black">Easy</BaseButton>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {sessionComplete && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-2xl mx-auto pt-10"
                            >
                                <LuxuryCard variant="glass" className="overflow-hidden border-white/10">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-cyan animate-gradient" />
                                    <LuxuryContent className="p-16 text-center">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-accent-cyan/10 border border-accent-cyan/20 flex-center text-accent-cyan mx-auto mb-12 shadow-glow-cyan/10">
                                            <Trophy size={48} strokeWidth={1} />
                                        </div>
                                        <h1 className="text-display mb-4">Recall <span className="text-gradient-monolith">Complete.</span></h1>
                                        <p className="text-body-lg mb-16 max-w-sm mx-auto">Knowledge cluster has been resynchronized to optimal retention levels.</p>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <BaseButton onClick={reset} variant="secondary" size="lg" className="flex-1 uppercase tracking-widest font-black" leftIcon={<RotateCcw size={18} />}>
                                                Relaunch Sequence
                                            </BaseButton>
                                            <BaseButton onClick={() => navigate('/dashboard')} variant="primary" size="lg" className="flex-1 uppercase tracking-widest font-black" leftIcon={<Terminal size={18} />}>
                                                Return to Command
                                            </BaseButton>
                                        </div>
                                    </LuxuryContent>
                                </LuxuryCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {status === 'generating' && (
                        <div className="fixed inset-0 z-[300] bg-bg-main/80 backdrop-blur-md flex-center">
                            <LoadingState
                                variant="progress"
                                label="Manifesting Knowledge Cluster"
                                message="Synthesizing discrete information grains into a cohesive study pod."
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
