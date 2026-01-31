
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Brain, Code, Gauge, ArrowLeft, RefreshCcw, Search } from 'lucide-react';
import useQuizzes from '../hooks/useQuizzes';

// Components
import QuizTopicSelector from '../components/quiz/QuizTopicSelector';
import QuestionInterface from '../components/quiz/QuestionInterface';
import ParticleButton from '../components/ui/ParticleButton';
import GlassCard from '../components/ui/GlassCard';

// Quick Access Modules
const TOPICS = [
    { id: 'react', title: 'React Ecosystem', difficulty: 'Adaptive', duration: '15m', color: 'cyan' },
    { id: 'node', title: 'Node.js Architecture', difficulty: 'Hard', duration: '20m', color: 'pink' },
    { id: 'system', title: 'System Design', difficulty: 'Expert', duration: '25m', color: 'purple' },
    { id: 'algo', title: 'Algorithms', difficulty: 'Medium', duration: '15m', color: 'gold' }
];

export default function QuizLab() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topicParam = searchParams.get('topic');

    // Core state from useQuizzes hook
    const {
        status,
        quizTitle,
        currentQuestion,
        currentIndex,
        totalQuestions,
        answers,
        results,
        timeLeft,
        isLast,
        startQuiz,
        submitAnswer,
        nextQuestion,
        resetQuiz
    } = useQuizzes();

    // Custom Configuration State
    const [customTopic, setCustomTopic] = useState('');
    const [customDifficulty, setCustomDifficulty] = useState('medium');
    const [customFramework, setCustomFramework] = useState('General');

    useEffect(() => {
        if (topicParam && status === 'idle') {
            startQuiz(topicParam, 'medium');
        }
    }, [topicParam, status, startQuiz]);

    const handleTopicSelect = (topicId) => {
        const topic = TOPICS.find(t => t.id === topicId);
        startQuiz(topic.title, topic.difficulty, 'General');
    };

    const handleCustomGenerate = (e) => {
        e.preventDefault();
        if (!customTopic.trim()) return;
        startQuiz(customTopic, customDifficulty, customFramework);
    };

    return (
        <div className="w-full min-h-screen">
            <main className="py-12">
                <div className="container-cosmic">

                    {/* Header - Only visible in IDLE mode */}
                    {status === 'idle' && (
                        <header className="mb-12">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-5xl font-display font-bold text-gradient-glow mb-2"
                            >
                                Quiz Lab
                            </motion.h1>
                            <p className="text-gray-400 font-light tracking-wide">
                                Configure your assessment matrix or select a neural preset.
                            </p>
                        </header>
                    )}

                    <AnimatePresence mode="wait">
                        {/* 1. SELECTION MODE */}
                        {status === 'idle' && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <section>
                                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-cosmic-purple" />
                                        <span>Custom Assessment Protocol</span>
                                    </div>

                                    <GlassCard className="p-8 md:p-10">
                                        <form onSubmit={handleCustomGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

                                            <div className="md:col-span-5 space-y-3">
                                                <label className="text-[10px] font-mono text-cosmic-cyan tracking-[0.3em] block uppercase">Target Subject</label>
                                                <div className="relative group">
                                                    <Brain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cosmic-cyan transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={customTopic}
                                                        onChange={(e) => setCustomTopic(e.target.value)}
                                                        placeholder="e.g. Docker, Rust, Macro Economics..."
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cosmic-cyan/50 focus:ring-1 focus:ring-cosmic-cyan/50 transition-all font-light"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-3 space-y-3">
                                                <label className="text-[10px] font-mono text-cosmic-purple tracking-[0.3em] block uppercase">Complexity</label>
                                                <div className="relative group">
                                                    <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cosmic-purple transition-colors" />
                                                    <select
                                                        value={customDifficulty}
                                                        onChange={(e) => setCustomDifficulty(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-cosmic-purple/50 cursor-pointer transition-all font-light font-dislpay"
                                                    >
                                                        <option value="easy">Beginner</option>
                                                        <option value="medium">Intermediate</option>
                                                        <option value="hard">Advanced</option>
                                                        <option value="expert">Expert</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-mono text-cosmic-gold tracking-[0.3em] block uppercase">Context</label>
                                                <div className="relative group">
                                                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cosmic-gold transition-colors" />
                                                    <select
                                                        value={customFramework}
                                                        onChange={(e) => setCustomFramework(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-cosmic-gold/50 cursor-pointer transition-all font-light"
                                                    >
                                                        <option value="General">General</option>
                                                        <option value="React">React</option>
                                                        <option value="Node">Node.js</option>
                                                        <option value="Python">Python</option>
                                                        <option value="Go">Go</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <ParticleButton
                                                    type="submit"
                                                    className="w-full h-[58px] rounded-xl font-bold tracking-[0.2em] uppercase text-xs"
                                                >
                                                    INITIALISE
                                                </ParticleButton>
                                            </div>
                                        </form>
                                    </GlassCard>
                                </section>

                                <section>
                                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-pulse"></div>
                                        <span>Quick Access Neural Presets</span>
                                    </div>
                                    <QuizTopicSelector topics={TOPICS} onSelect={handleTopicSelect} />
                                </section>
                            </motion.div>
                        )}

                        {/* 2. GENERATING MODE */}
                        {status === 'generating' && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-96 flex flex-col items-center justify-center gap-8"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-2 border-cosmic-cyan/20 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-24 h-24 border-2 border-cosmic-cyan border-t-transparent rounded-full animate-spin"></div>
                                    <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cosmic-cyan animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <div className="text-cosmic-cyan animate-pulse font-mono tracking-[0.4em] text-lg uppercase mb-2">
                                        Synthesizing Assessment...
                                    </div>
                                    <div className="text-gray-600 text-[10px] tracking-widest font-bold uppercase">Establishing Neural Link</div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3. ACTIVE QUIZ MODE */}
                        {status === 'active' && currentQuestion && (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <QuestionInterface
                                    question={{
                                        ...currentQuestion,
                                        type: customFramework !== 'General' ? customFramework.toLowerCase() : 'universal'
                                    }}
                                    currentIndex={currentIndex}
                                    totalIndex={totalQuestions}
                                    timeLeft={timeLeft}
                                    onAnswer={submitAnswer}
                                    selectedAnswer={answers[currentQuestion.id]}
                                    onNext={nextQuestion}
                                    isLast={isLast}
                                />
                            </motion.div>
                        )}

                        {/* 4. COMPLETE MODE */}
                        {status === 'complete' && results && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-3xl mx-auto pt-10"
                            >
                                <GlassCard className="p-16 text-center overflow-visible" glow glowColor="purple">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-cosmic-deep border border-cosmic-purple/30 p-6 rounded-full shadow-glow-purple">
                                        <RefreshCcw className="w-10 h-10 text-cosmic-purple" />
                                    </div>

                                    <div className="mb-10 pt-4">
                                        <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-cosmic-purple mb-4">Assessment Matrix Finalized</div>
                                        <h2 className="text-5xl font-display font-bold text-white tracking-tighter mb-4">
                                            {quizTitle}
                                        </h2>
                                    </div>

                                    <div className="flex justify-center items-center gap-4 mb-8">
                                        <div className="text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-kinetic animate-pulse">
                                            {results.score}%
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mb-16 max-w-sm mx-auto">
                                        <div className="text-left border-l-2 border-cosmic-cyan pl-6">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Success Rate</div>
                                            <div className="text-2xl text-white font-bold">{results.correct} / {results.total}</div>
                                        </div>
                                        <div className="text-left border-l-2 border-cosmic-pink pl-6">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Time Efficiency</div>
                                            <div className="text-2xl text-white font-bold">OPTIMAL</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                                        <ParticleButton onClick={resetQuiz} variant="secondary" className="px-10">
                                            New Assessment
                                        </ParticleButton>
                                        <ParticleButton onClick={() => navigate('/dashboard')} variant="outline" className="px-10">
                                            Back to Core
                                        </ParticleButton>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main >
        </div >
    );
}
