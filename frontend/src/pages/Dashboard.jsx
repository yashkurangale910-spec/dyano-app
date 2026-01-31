import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import useProgress from '../hooks/useProgress';
import {
    Flame,
    Star,
    Award,
    TrendingUp,
    Zap,
    Activity,
    Check,
    BarChart,
    Target,
    BookOpen,
    Map,
    FileText,
    Bot,
    Info,
    Rocket,
    X,
    Shield
} from 'lucide-react';

import { Canvas } from '@react-three/fiber';
import KnowledgeUniverse from '../components/three/KnowledgeUniverse';
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import DashboardStats from '../components/dashboard/DashboardStats';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import Tooltip from '../components/ui/Tooltip';

import KnowledgeBadge from '../components/dashboard/KnowledgeBadge';
import NeuralDigitalTwin from '../components/dashboard/NeuralDigitalTwin';
import MemoryPalace from '../components/dashboard/MemoryPalace';
import DeepStudyOverlay from '../components/ui/DeepStudyOverlay';
import SingularityProtocol from '../components/special/SingularityProtocol';

export default function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { progressData, neuralDensity } = useProgress();
    const [isDeepStudyActive, setIsDeepStudyActive] = useState(false);
    const [dashboardView, setDashboardView] = useState('twin'); // 'twin' or 'palace'
    const [isSingularityActive, setIsSingularityActive] = useState(false);

    // ... stats logic ...
    const stats = (progressData && progressData.progress) ? [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: `${progressData.progress.dailyStreak?.count || 0} Days`, Icon: Flame, color: 'text-cosmic-gold', glow: 'gold', path: '/progress' },
        { id: 'xp', label: 'Neural XP', value: `${progressData.progress.stats?.totalXP || 0} / ${((progressData.progress.stats?.level || 1) * 1000)}`, Icon: Zap, color: 'text-cosmic-cyan', glow: 'cyan', path: '/progress' },
        { id: 'level', label: 'Symmetry Level', value: `LVL ${progressData.progress.stats?.level || 1}`, Icon: Rocket, color: 'text-cosmic-pink', glow: 'pink', path: '/progress' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '94%', Icon: TrendingUp, color: 'text-cosmic-purple', glow: 'purple', path: '/progress' }
    ] : [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: '0 Days', Icon: Flame, color: 'text-cosmic-gold', glow: 'gold', path: '/progress' },
        { id: 'xp', label: 'Neural XP', value: '0 / 1000', Icon: Zap, color: 'text-cosmic-cyan', glow: 'cyan', path: '/progress' },
        { id: 'level', label: 'Symmetry Level', value: 'LVL 1', Icon: Rocket, color: 'text-cosmic-pink', glow: 'pink', path: '/progress' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '--', Icon: TrendingUp, color: 'text-cosmic-purple', glow: 'purple', path: '/progress' }
    ];

    const hasNoActivity = !progressData || (progressData.progress?.stats?.totalQuizzesTaken === 0 && progressData.progress?.stats?.totalRoadmapsCompleted === 0);

    const xpPercentage = progressData ? ((progressData.progress.stats?.totalXP % 1000) / 10).toString() : '0';

    return (
        <div className="w-full relative min-h-screen">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <Canvas camera={{ position: [0, 0, 20] }}>
                    <KnowledgeUniverse count={2000} />
                </Canvas>
            </div>

            <main className="py-20 relative z-10">
                <div className="container-cosmic">
                    {/* Header */}
                    <header className="mb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/20 text-cosmic-cyan text-[8px] font-bold uppercase tracking-[0.3em] mb-4"
                                >
                                    <Activity size={10} className="animate-pulse" /> Unified Neural Interface Active
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-6xl md:text-7xl font-display font-black text-white tracking-tighter mb-4"
                                >
                                    Command <span className="text-gradient-cosmic">Center</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-gray-500 text-xl font-light tracking-wide max-w-xl"
                                >
                                    Welcome back, {user?.name || 'Explorer'}. Neural synchronization is at {xpPercentage}% for Level {progressData?.progress.stats?.level || 1}.
                                </motion.p>
                            </div>

                            {/* XP Progress Bar */}
                            <div className="md:w-72 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Neural Sync</span>
                                    <span className="text-[10px] font-bold text-cosmic-cyan">{xpPercentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${xpPercentage}%` }}
                                        className="h-full bg-gradient-to-r from-cosmic-cyan to-cosmic-purple shadow-glow-cyan"
                                    />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Stats Section */}
                    {stats && <DashboardStats stats={stats} />}

                    {/* Knowledge Vault (Badges) */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Knowledge Vault</h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {(progressData?.progress?.achievements || []).map((achievement, idx) => (
                                <KnowledgeBadge
                                    key={idx}
                                    id={achievement.name}
                                    unlocked={true}
                                    unlockedAt={achievement.unlockedAt}
                                />
                            ))}
                            {/* Placeholders for locked badges */}
                            {Array.from({ length: Math.max(0, 6 - (progressData?.progress?.achievements?.length || 0)) }).map((_, i) => (
                                <KnowledgeBadge key={`locked-${i}`} unlocked={false} />
                            ))}
                        </div>
                    </motion.section>

                    {/* Singularity Trigger (Phase 12) - Visible only if density is high */}
                    {neuralDensity >= 0.9 && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsSingularityActive(true)}
                            className="w-full mb-12 p-8 bg-gradient-to-r from-cosmic-cyan via-cosmic-purple to-cosmic-cyan bg-[length:200%_auto] animate-gradient text-black font-black uppercase tracking-[0.5em] rounded-[3rem] shadow-glow-cyan overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center justify-center gap-4 text-xl">
                                <Zap size={32} fill="currentColor" /> Initiate Final_Ascension_Protocol
                            </span>
                        </motion.button>
                    )}

                    {/* Neural Digital Twin Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-16"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-cyan/5 via-transparent to-cosmic-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            {/* 3D Visualization View */}
                            <div className="lg:col-span-7 h-[400px] md:h-[500px] relative">
                                <AnimatePresence mode="wait">
                                    {dashboardView === 'twin' ? (
                                        <motion.div
                                            key="twin"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            className="w-full h-full"
                                        >
                                            <NeuralDigitalTwin density={neuralDensity} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="palace"
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="w-full h-full"
                                        >
                                            <MemoryPalace progressData={progressData} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Metadata & Trigger */}
                            <div className="lg:col-span-5 space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/20 text-cosmic-cyan text-[8px] font-black uppercase tracking-[0.3em]">
                                            Cognitive Map Verified
                                        </div>
                                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                            <button
                                                onClick={() => setDashboardView('twin')}
                                                className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${dashboardView === 'twin' ? 'bg-cosmic-cyan text-black' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                Neural_Twin
                                            </button>
                                            <button
                                                onClick={() => setDashboardView('palace')}
                                                className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${dashboardView === 'palace' ? 'bg-cosmic-cyan text-black' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                Mem_Palace
                                            </button>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">
                                        {dashboardView === 'twin' ? 'Neural ' : 'Memory '}
                                        <span className="text-gradient-cosmic">{dashboardView === 'twin' ? 'Topology' : 'Sanctuary'}</span>
                                    </h2>
                                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                                        {dashboardView === 'twin'
                                            ? `Your digital twin reflects real-time synaptic density based on mastery across ${Object.keys(neuralDensity).length} specialized sectors.`
                                            : "Your knowledge is architectural. Each spire represents a mastered domain, glowing brighter as your synaptic density increases."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(neuralDensity).slice(0, 4).map(([cat, val]) => (
                                        <div key={cat} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                            <div className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-2">{cat} sector</div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${val * 100}%` }}
                                                    className="h-full bg-cosmic-cyan shadow-glow-cyan"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <ParticleButton
                                    onClick={() => setIsDeepStudyActive(true)}
                                    className="w-full py-5 text-sm font-black uppercase tracking-[0.2em] shadow-glow-cyan bg-gradient-to-r from-cosmic-cyan to-cosmic-cyan/80 text-black border-none"
                                >
                                    Initialize Deep Study Mode
                                </ParticleButton>
                            </div>
                        </div>
                    </motion.section>

                    {/* Onboarding / "Getting Started" Section */}
                    {hasNoActivity && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-16"
                        >
                            <GlassCard className="bg-gradient-to-br from-cosmic-purple/20 via-[#0f0326]/40 to-cosmic-pink/10 border-white/10 p-8 md:p-16 relative overflow-hidden group">
                                <div className="absolute -right-20 -top-20 w-96 h-96 bg-cosmic-cyan/10 blur-[120px] group-hover:bg-cosmic-cyan/20 transition-all duration-1000" />
                                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-cosmic-purple/10 blur-[120px] group-hover:bg-cosmic-purple/20 transition-all duration-1000" />

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            rotate: [0, 5, 0]
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="p-10 rounded-[3.5rem] bg-white/5 border border-white/10 shadow-2xl shadow-purple-500/20 backdrop-blur-3xl"
                                    >
                                        <Rocket className="w-20 h-20 text-cosmic-pink drop-shadow-glow-pink" strokeWidth={1} />
                                    </motion.div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-block px-4 py-1 rounded-full bg-cosmic-pink/10 border border-cosmic-pink/20 text-cosmic-pink text-[10px] font-mono tracking-[0.3em] uppercase mb-6">
                                            Mission Protocol Initialized
                                        </div>
                                        <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
                                            Initialise Your <span className="text-gradient-cosmic">Learning Vector</span>
                                        </h2>
                                        <p className="text-gray-400 text-xl font-light max-w-2xl mb-10 leading-relaxed">
                                            Welcome to Dyano. Your neural pathways are ready for synthesis. Launch your first adaptive challenge or explore professional roadmaps to begin your evolution.
                                        </p>
                                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                            <ParticleButton
                                                onClick={() => navigate('/quiz')}
                                                className="px-10 py-4"
                                            >
                                                Launch Quiz Lab
                                            </ParticleButton>
                                            <ParticleButton
                                                variant="outline"
                                                onClick={() => navigate('/roadmap')}
                                                className="px-10 py-4"
                                            >
                                                Explore Roadmaps
                                            </ParticleButton>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
                        {LEARNING_TOOLS && LEARNING_TOOLS.map((tool, index) => {
                            const ToolIcon = tool.Icon || Zap;
                            return (
                                <motion.div
                                    key={tool.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    className={index === 0 ? "md:col-span-8" : "md:col-span-4"}
                                >
                                    <Tooltip
                                        text={
                                            tool.id === 'pdf' ? "Neuro-Synthesis: " + tool.description :
                                                tool.id === 'quiz' ? "Adaptive Complexity: " + tool.description :
                                                    tool.description
                                        }
                                        position="bottom"
                                    >
                                        <GlassCard
                                            onClick={() => navigate(tool.path)}
                                            className={`h-full group cursor-pointer relative overflow-hidden transition-all duration-700 ${index === 0 ? 'p-8 md:p-16' : 'p-10'}`}
                                            glow={index === 0}
                                            glowColor={tool.id === 'quiz' ? 'pink' : 'cyan'}
                                        >
                                            {/* Decorative Background numbers */}
                                            <div className="absolute right-0 bottom-0 text-[120px] font-black text-white/[0.02] translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:scale-110 transition-transform duration-1000 uppercase italic">
                                                {tool.id}
                                            </div>

                                            <div className={`flex ${index === 0 ? 'flex-row' : 'flex-col'} items-start gap-10`}>
                                                <div className={`p-6 rounded-[2rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 group-hover:border-white/20 group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                                                    <ToolIcon className={`w-12 h-12 ${index === 0 ? 'text-cosmic-pink' : 'text-cosmic-cyan'}`} strokeWidth={1} />
                                                </div>
                                                <div className="flex-1 text-left relative z-10">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <h3 className={`font-display font-black text-white ${index === 0 ? 'text-5xl' : 'text-3xl'}`}>
                                                            {tool.title}
                                                        </h3>
                                                        <div className="w-2 h-2 rounded-full bg-cosmic-cyan opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity" />
                                                    </div>
                                                    <p className={`text-gray-400 leading-relaxed font-light ${index === 0 ? 'text-xl max-w-lg' : 'text-sm'}`}>
                                                        {tool.description}
                                                    </p>

                                                    <div className="mt-8 flex items-center gap-3">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cosmic-cyan group-hover:text-white transition-colors">Launch Module</span>
                                                        <Rocket className="w-3 h-3 text-cosmic-cyan -rotate-90 group-hover:translate-x-1 transition-transform" />
                                                    </div>

                                                    {tool.stats && (
                                                        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                                                            {Object.entries(tool.stats).map(([key, value]) => (
                                                                <div key={key}>
                                                                    <div className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">{key}</div>
                                                                    <div className="text-lg font-bold text-white group-hover:text-cosmic-pink transition-colors">{value}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </Tooltip>
                                </motion.div>
                            );
                        })}
                    </div>

                    {RECENT_ACTIVITY && <ActivityFeed activities={RECENT_ACTIVITY} />}

                    {/* Quick Action Bar */}
                    <footer className="mt-20 flex justify-center border-t border-white/5 pt-12">
                        <ParticleButton variant="outline" size="sm" onClick={() => navigate('/progress')} className="rounded-none tracking-[0.2em] font-bold text-[10px] uppercase">
                            Full Archive Access
                        </ParticleButton>
                    </footer>
                </div>
            </main>

            <AnimatePresence>
                {isDeepStudyActive && (
                    <DeepStudyOverlay onClose={() => setIsDeepStudyActive(false)} />
                )}
            </AnimatePresence>

            <SingularityProtocol
                isOpen={isSingularityActive}
                onClose={() => setIsSingularityActive(false)}
                userName={user?.name || "Learner"}
            />
        </div>
    );
}
