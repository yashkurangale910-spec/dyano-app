import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Cpu, Zap, Info, Search, Send, Sparkles } from 'lucide-react';
import useQuizzes from '../hooks/useQuizzes';
import QuizTopicSelector from '../components/quiz/QuizTopicSelector';
import QuestionInterface from '../components/quiz/QuestionInterface';
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import CosmicInput from '../components/ui/CosmicInput';
import { QUIZ_TOPICS } from '../constants/landingContent';

export default function QuizLab() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topicParam = searchParams.get('topic');

    const [showReview, setShowReview] = useState(false);
    const [customTopic, setCustomTopic] = useState(topicParam || '');
    const {
        status,
        quizTitle,
        quizDescription,
        currentQuestion,
        questions,
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

    const [customDifficulty, setCustomDifficulty] = useState('medium');

    useEffect(() => {
        if (topicParam && status === 'idle') {
            startQuiz(topicParam, 'medium');
        }
    }, [topicParam, status, startQuiz]);

    const handleTopicSelect = (topicId) => {
        const topic = QUIZ_TOPICS.find(t => t.id === topicId);
        startQuiz(topic.title, topic.difficulty.toLowerCase());
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customTopic.trim()) {
            startQuiz(customTopic, customDifficulty);
        }
    };

    const synthesisLogs = [
        "Initializing synaptic mapping...",
        "Identifying domain assessment vectors...",
        "Applying objectivity safeguards...",
        "Structuring difficulty curve...",
        "Calibrating neural justifications..."
    ];

    const [logIndex, setLogIndex] = useState(0);
    useEffect(() => {
        if (status === 'generating') {
            const interval = setInterval(() => {
                setLogIndex(prev => (prev + 1) % synthesisLogs.length);
            }, 800);
            return () => clearInterval(interval);
        } else {
            setLogIndex(0);
        }
    }, [status]);

    return (
        <div className="container-cosmic py-12 min-h-[80vh]">
            {/* 1. SELECTION STATE */}
            {status === 'idle' && (
                <section>
                    <header className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-7">
                            <motion.h1
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-6xl font-display font-bold text-gradient-glow mb-4 tracking-tighter"
                            >
                                Neural Stream
                            </motion.h1>
                            <p className="text-gray-500 font-light max-w-lg text-lg">
                                Select a sector or manifest a custom topic to initiate your knowledge verification.
                            </p>
                        </div>

                        {/* Custom Topic manifest */}
                        <div className="lg:col-span-5 pb-1">
                            <form onSubmit={handleCustomSubmit} className="relative group space-y-4">
                                <CosmicInput
                                    label="Custom Topic Manifest"
                                    placeholder="Enter any domain (e.g. Cognitive Psychology, Rust Programming)"
                                    value={customTopic}
                                    onChange={(e) => setCustomTopic(e.target.value)}
                                    icon={Search}
                                />

                                <div className="flex gap-4 items-center pl-1">
                                    <div className="text-[10px] uppercase tracking-widest font-bold text-gray-700">Level:</div>
                                    <div className="flex gap-2">
                                        {['easy', 'medium', 'hard'].map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setCustomDifficulty(level)}
                                                className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full transition-all ${customDifficulty === level
                                                    ? 'bg-cosmic-cyan/10 border-cosmic-cyan text-cosmic-cyan'
                                                    : 'border-white/5 text-gray-600 hover:border-white/10'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!customTopic.trim()}
                                    className="absolute right-2 top-3 p-3 rounded-xl bg-cosmic-cyan/10 text-cosmic-cyan hover:bg-cosmic-cyan hover:text-cosmic-void transition-all disabled:opacity-0"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </header>

                    <QuizTopicSelector
                        topics={QUIZ_TOPICS}
                        onSelect={handleTopicSelect}
                    />
                </section>
            )}

            {/* 2. GENERATING STATE */}
            {status === 'generating' && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity }
                        }}
                        className="p-8 rounded-full border border-cosmic-cyan/30 bg-cosmic-cyan/5 mb-12 shadow-[0_0_50px_rgba(0,245,255,0.2)]"
                    >
                        <Sparkles className="w-16 h-16 text-cosmic-cyan" strokeWidth={1} />
                    </motion.div>

                    <h2 className="text-3xl font-display font-bold text-white mb-4 tracking-widest uppercase">
                        Neural Synthesis
                    </h2>
                    <div className="flex flex-col gap-4 items-center">
                        <div className="flex gap-2 items-center text-cosmic-cyan font-mono text-xs tracking-[0.3em] uppercase opacity-60">
                            <Zap size={14} className="animate-pulse" />
                            {synthesisLogs[logIndex]}
                            <span className="dot-pulse"></span>
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                            Bypass trivia filter // applying domain logic // assesing depth
                        </div>
                    </div>
                </div>
            )}

            {/* 3. ACTIVE STATE */}
            {status === 'active' && currentQuestion && (
                <div className="space-y-12">
                    {/* Quiz Context Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto px-4 border-l-2 border-cosmic-cyan/30 pl-8"
                    >
                        <h2 className="text-2xl font-display font-bold text-white mb-2">{quizTitle}</h2>
                        <div className="flex items-center gap-3 text-gray-500 text-xs uppercase tracking-widest font-bold">
                            <Info size={14} className="text-cosmic-cyan" />
                            {quizDescription}
                        </div>
                    </motion.div>

                    <QuestionInterface
                        question={currentQuestion}
                        currentIndex={currentIndex}
                        totalIndex={totalQuestions}
                        timeLeft={timeLeft}
                        selectedAnswer={answers[currentQuestion.id]}
                        onAnswer={submitAnswer}
                        onNext={nextQuestion}
                        isLast={isLast}
                    />
                </div>
            )}

            {/* 4. COMPLETE STATE */}
            {status === 'complete' && results && (
                <div className="max-w-4xl mx-auto py-12">
                    {!showReview ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto text-center pt-20"
                        >
                            <GlassCard className="p-16 mb-12" glow glowColor="cyan">
                                <div className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-8">
                                    Sequence Finalized
                                </div>

                                <div className="text-8xl md:text-9xl font-display font-light text-white mb-6 tracking-tighter">
                                    {results.score}%
                                </div>

                                <h2 className="text-2xl font-display font-bold text-cosmic-cyan mb-12 uppercase tracking-widest">
                                    Sync Rate Stable
                                </h2>

                                <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Accuracy</div>
                                        <div className="text-2xl text-white font-mono">{results.correct} / {results.total}</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Status</div>
                                        <div className="text-2xl text-cosmic-pink font-mono uppercase">
                                            {results.score >= 80 ? 'Mastered' : results.score >= 50 ? 'Stable' : 'Unstable'}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            <div className="flex justify-center gap-8">
                                <button
                                    onClick={() => setShowReview(true)}
                                    className="text-xs uppercase font-bold tracking-[0.3em] text-cosmic-cyan hover:text-white transition-colors"
                                >
                                    // Review Protocol
                                </button>
                                <button
                                    onClick={() => {
                                        resetQuiz();
                                        setCustomTopic('');
                                        setShowReview(false);
                                    }}
                                    className="text-xs uppercase font-bold tracking-[0.3em] text-gray-600 hover:text-white transition-colors"
                                >
                                    // Reset Protocol
                                </button>
                                <ParticleButton
                                    onClick={() => navigate('/dashboard')}
                                    className="rounded-none px-12"
                                >
                                    Mission Control
                                </ParticleButton>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <header className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-white tracking-tight uppercase">Data Review</h2>
                                    <p className="text-gray-500 font-mono text-[10px] tracking-widest mt-2 uppercase">analyzing synaptic gaps // knowledge verification log</p>
                                </div>
                                <button
                                    onClick={() => setShowReview(false)}
                                    className="px-6 py-3 border border-white/5 text-gray-400 hover:text-white hover:border-white/10 text-[10px] uppercase tracking-widest font-bold transition-all"
                                >
                                    Back to Summary
                                </button>
                            </header>

                            <div className="space-y-6">
                                {questions.map((q, idx) => (
                                    <GlassCard key={q.id} className="p-8 border-l-4" glow={false}
                                        style={{ borderLeftColor: answers[q.id] === q.correctAnswer ? 'rgba(0, 245, 255, 0.5)' : 'rgba(255, 0, 153, 0.5)' }}>
                                        <div className="flex justify-between items-start gap-4 mb-6">
                                            <h3 className="text-xl font-medium text-white/90 leading-snug">{q.text}</h3>
                                            <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded ${answers[q.id] === q.correctAnswer ? 'bg-cosmic-cyan/10 text-cosmic-cyan' : 'bg-cosmic-pink/10 text-cosmic-pink'
                                                }`}>
                                                {answers[q.id] === q.correctAnswer ? 'Correct' : 'Incorrect'}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-2">Your Signal</div>
                                                <div className={`text-sm ${answers[q.id] === q.correctAnswer ? 'text-cosmic-cyan' : 'text-cosmic-pink'}`}>
                                                    {q.options[answers[q.id]] || 'No selection'}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-cosmic-cyan/5 border border-cosmic-cyan/10">
                                                <div className="text-[9px] uppercase tracking-widest text-cosmic-cyan mb-2">Target Signal</div>
                                                <div className="text-sm text-white">{q.options[q.correctAnswer]}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 items-start pt-6 border-t border-white/5">
                                            <Info size={14} className="text-gray-600 mt-1" />
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Observation justification</div>
                                                <p className="text-gray-400 text-sm italic font-light leading-relaxed">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
