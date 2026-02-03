import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Sparkles,
    Brain,
    Code,
    Gauge,
    ArrowLeft,
    RefreshCcw,
    Activity,
    ChevronRight,
    Layout,
    Trophy,
    Target,
    Zap,
    Clock
} from 'lucide-react';
import useQuizzes from '../hooks/useQuizzes';
import LuxuryCard, { LuxuryContent, LuxuryHeader } from '../components/ui/LuxuryCard';
import BaseButton from '../components/ui/BaseButton';
import QuestionInterface from '../components/quiz/QuestionInterface';
import PageHeader from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EnhancedInput from '../components/ui/EnhancedInput';
import LoadingState from '../components/ui/LoadingState';
import ProgressBar from '../components/ui/ProgressIndicator';

const TOPICS = [
    { id: 'react', title: 'React Ecosystem', difficulty: 'Adaptive', duration: '15m', tag: 'Core', icon: <Code size={20} /> },
    { id: 'node', title: 'Node.js Architecture', difficulty: 'Hard', duration: '20m', tag: 'Internal', icon: <Activity size={20} /> },
    { id: 'system', title: 'System Design', difficulty: 'Expert', duration: '25m', tag: 'Scaling', icon: <Layout size={20} /> },
    { id: 'algo', title: 'Algorithms', difficulty: 'Medium', duration: '15m', tag: 'Logic', icon: <Zap size={20} /> }
];

export default function QuizLab() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topicParam = searchParams.get('topic');

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
        resetQuiz,
        error
    } = useQuizzes();

    const [customTopic, setCustomTopic] = useState('');
    const [customDifficulty, setCustomDifficulty] = useState('medium');
    const [customFramework, setCustomFramework] = useState('General');

    useEffect(() => {
        if (topicParam && status === 'idle') {
            startQuiz(topicParam, 'medium');
        }
    }, [topicParam, status, startQuiz]);

    const handleCustomGenerate = (e) => {
        if (e) e.preventDefault();
        if (!customTopic.trim()) return;
        startQuiz(customTopic, customDifficulty, customFramework);
    };

    return (
        <div className="w-full relative min-h-screen">
            <main className="py-12 md:py-20 relative z-10">
                <div className="container-monolith">

                    {/* Navigation Context */}
                    <Breadcrumbs />

                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-16"
                            >
                                {/* Page Header */}
                                <motion.div layoutId="card-quiz">
                                    <PageHeader
                                        title="Quiz Lab"
                                        subtitle="Configure a custom assessment matrix or select a pre-verified neural sequence to validate your cognitive synchronization."
                                        helpText="Adaptive assessments adjust difficulty in real-time based on your response latency and accuracy."
                                    />
                                </motion.div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span>Neural Synthesis Failed: {error}</span>
                                    </motion.div>
                                )}

                                {/* Custom Protocol Form */}
                                <LuxuryCard variant="glass" className="overflow-hidden border-white/10">
                                    <LuxuryContent className="p-8 md:p-12">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex-center text-accent-cyan">
                                                <Target size={24} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h2 className="text-h3">Custom Synthesis</h2>
                                                <p className="text-caption">Architect a unique assessment module.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleCustomGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                                            <div className="md:col-span-1">
                                                <EnhancedInput
                                                    label="Subject Objective"
                                                    placeholder="e.g. Distributed Systems"
                                                    value={customTopic}
                                                    onChange={setCustomTopic}
                                                    size="sm"
                                                    variant="glass"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-mono text-gray-700 mb-3 block">Complexity Grade</label>
                                                <select
                                                    value={customDifficulty}
                                                    onChange={(e) => setCustomDifficulty(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-accent-cyan outline-none cursor-pointer backdrop-blur-md transition-all appearance-none"
                                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                                >
                                                    <option value="easy">Introductory</option>
                                                    <option value="medium">Professional</option>
                                                    <option value="hard">Executive</option>
                                                    <option value="expert">Expert</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-mono text-gray-700 mb-3 block">Logical Context</label>
                                                <select
                                                    value={customFramework}
                                                    onChange={(e) => setCustomFramework(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-accent-cyan outline-none cursor-pointer backdrop-blur-md transition-all appearance-none"
                                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                                >
                                                    <option value="General">Agnostic</option>
                                                    <option value="React">React</option>
                                                    <option value="Node">Node.js</option>
                                                    <option value="System">Architecture</option>
                                                </select>
                                            </div>
                                            <BaseButton
                                                type="submit"
                                                variant="primary"
                                                className="w-full h-[52px] uppercase tracking-[0.2em] font-black"
                                                disabled={!customTopic.trim()}
                                                leftIcon={<Sparkles size={18} />}
                                            >
                                                Initialize
                                            </BaseButton>
                                        </form>
                                    </LuxuryContent>
                                </LuxuryCard>

                                {/* Presets Section */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                                        <span className="text-mono text-gray-700">Verified Protocols</span>
                                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {TOPICS.map((topic, i) => (
                                            <LuxuryCard
                                                key={i}
                                                variant="glass"
                                                onClick={() => startQuiz(topic.title, topic.difficulty)}
                                                className="group cursor-pointer hover:border-accent-cyan/30 transition-all duration-500"
                                            >
                                                <LuxuryContent className="p-8">
                                                    <div className="flex justify-between items-start mb-10">
                                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-500 group-hover:text-accent-cyan group-hover:bg-accent-cyan/10 transition-colors">
                                                            {topic.icon}
                                                        </div>
                                                        <span className="text-mono text-[8px] text-accent-cyan bg-accent-cyan/5 border border-accent-cyan/20 px-2.5 py-1 rounded-full">{topic.tag}</span>
                                                    </div>
                                                    <h3 className="text-h3 mb-6 group-hover:text-white transition-colors">{topic.title}</h3>
                                                    <div className="flex items-center justify-between text-mono text-gray-700 pt-6 border-t border-white/5">
                                                        <span>{topic.difficulty}</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} />
                                                            <span>{topic.duration}</span>
                                                        </div>
                                                    </div>
                                                </LuxuryContent>
                                            </LuxuryCard>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {status === 'generating' && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="min-h-[60vh] flex flex-center"
                            >
                                <LoadingState
                                    variant="progress"
                                    label="Compiling Assessment Matrix"
                                    message="Synthesizing unique neural probes based on your selected trajectory."
                                />
                            </motion.div>
                        )}

                        {status === 'active' && currentQuestion && (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-w-4xl mx-auto space-y-12"
                            >
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <div className="text-mono text-[10px] text-accent-cyan flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                                            Synchronizing {currentIndex + 1} of {totalQuestions}
                                        </div>
                                        <h2 className="text-h2">{quizTitle || 'Assessment Protocol'}</h2>
                                    </div>
                                    <div className="hidden md:block w-48 mb-2">
                                        <div className="flex justify-between text-mono text-[10px] text-gray-600 mb-2">
                                            <span>Linear Completion</span>
                                            <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
                                        </div>
                                        <ProgressBar value={((currentIndex + 1) / totalQuestions) * 100} size="xs" />
                                    </div>
                                </div>

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

                        {status === 'complete' && results && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto py-12"
                            >
                                <LuxuryCard variant="glass" className="overflow-hidden border-white/10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 via-transparent to-accent-cyan/5 pointer-events-none" />
                                    <LuxuryContent className="p-12 md:p-20 text-center relative z-10">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-accent-indigo/10 border border-accent-indigo/20 flex-center text-accent-indigo mx-auto mb-12 shadow-glow-indigo/10">
                                            <Trophy size={48} strokeWidth={1} />
                                        </div>

                                        <span className="text-mono text-gray-500 uppercase tracking-[0.4em] block mb-4">Neural Synthesis Finalized</span>
                                        <h2 className="text-display mb-12">Performance <span className="text-gradient-monolith">Vector.</span></h2>

                                        <div className="inline-flex flex-col items-center mb-16">
                                            <div className="text-9xl font-black text-white tracking-tighter mb-4">{results.score}%</div>
                                            <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${results.score}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-indigo"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left border-t border-white/10 pt-16">
                                            <div className="space-y-2">
                                                <div className="text-mono text-[10px] text-gray-700 uppercase tracking-widest">Accuracy</div>
                                                <div className="text-h3 font-black">{results.correct} / {results.total}</div>
                                                <p className="text-caption">Correct cognitive responses.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-mono text-[10px] text-gray-700 uppercase tracking-widest">Efficiency</div>
                                                <div className="text-h3 font-black">OPTIMAL</div>
                                                <p className="text-caption">Response latency within bounds.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-mono text-[10px] text-gray-700 uppercase tracking-widest">Reward</div>
                                                <div className="text-h3 font-black text-accent-cyan">+{results.score * 10} XP</div>
                                                <p className="text-caption">Synaptic persistence bonus.</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <BaseButton onClick={resetQuiz} variant="secondary" size="lg" className="flex-1 uppercase tracking-widest font-black" leftIcon={<RefreshCcw size={18} />}>
                                                Relaunch Protocol
                                            </BaseButton>
                                            <BaseButton onClick={() => navigate('/dashboard')} variant="outline" size="lg" className="flex-1 uppercase tracking-widest font-black" leftIcon={<ArrowLeft size={18} />}>
                                                Return to Command
                                            </BaseButton>
                                        </div>
                                    </LuxuryContent>
                                </LuxuryCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
