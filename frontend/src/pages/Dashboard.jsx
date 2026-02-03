import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import useProgress from '../hooks/useProgress';
import { LEARNING_TOOLS, RECENT_ACTIVITY } from '../constants/landingContent';
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
import LuxuryCard, { LuxuryContent } from '../components/ui/LuxuryCard';
import PageHeader from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { ProgressBar } from '../components/ui/ProgressIndicator';

import LoadingState from '../components/ui/LoadingState';
import NeuralSkeleton from '../components/ui/NeuralSkeleton';
import KnowledgeBadge from '../components/dashboard/KnowledgeBadge';
import NeuralDigitalTwin from '../components/dashboard/NeuralDigitalTwin';
import MemoryPalace from '../components/dashboard/MemoryPalace';
import DeepStudyOverlay from '../components/ui/DeepStudyOverlay';
import SingularityProtocol from '../components/special/SingularityProtocol';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import BaseButton from '../components/ui/BaseButton';
import DashboardStats from '../components/dashboard/DashboardStats';

export default function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { progressData, neuralDensity } = useProgress();
    const [isDeepStudyActive, setIsDeepStudyActive] = useState(false);
    const [dashboardView, setDashboardView] = useState('twin'); // 'twin' or 'palace'
    const [isSingularityActive, setIsSingularityActive] = useState(false);

    // stats logic - Minimalist Pivot
    const stats = (progressData && progressData.progress) ? [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: `${progressData.progress.dailyStreak?.count || 0} Days`, Icon: Flame, color: 'text-white/60', glow: 'gray', path: '/progress' },
        { id: 'xp', label: 'Neural XP', value: `${progressData.progress.stats?.totalXP || 0} / ${((progressData.progress.stats?.level || 1) * 1000)}`, Icon: Zap, color: 'text-white/60', glow: 'gray', path: '/progress' },
        { id: 'level', label: 'Symmetry Level', value: `LVL ${progressData.progress.stats?.level || 1}`, Icon: Rocket, color: 'text-white/60', glow: 'gray', path: '/progress' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '94%', Icon: TrendingUp, color: 'text-white/60', glow: 'gray', path: '/progress' }
    ] : [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: '0 Days', Icon: Flame, color: 'text-white/40', glow: 'gray', path: '/progress' },
        { id: 'xp', label: 'Neural XP', value: '0 / 1000', Icon: Zap, color: 'text-white/40', glow: 'gray', path: '/progress' },
        { id: 'level', label: 'Symmetry Level', value: 'LVL 1', Icon: Rocket, color: 'text-white/40', glow: 'gray', path: '/progress' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '--', Icon: TrendingUp, color: 'text-white/40', glow: 'gray', path: '/progress' }
    ];

    const hasNoActivity = !progressData || (progressData.progress?.stats?.totalQuizzesTaken === 0 && progressData.progress?.stats?.totalRoadmapsCompleted === 0);
    const xpPercentage = progressData ? ((progressData.progress.stats?.totalXP % 1000) / 10) : 0;

    return (
        <div className="w-full relative min-h-screen">
            <main className="py-20 relative z-10">
                <div className="container-monolith">
                    {/* Navigation Context */}
                    <Breadcrumbs />

                    {/* Enhanced Page Header */}
                    <PageHeader
                        title="Command Center"
                        subtitle={`Synchronization stable for ${user?.name || 'Explorer'}. Advanced cognitive metrics active.`}
                        helpText="Access core modules and monitor neural topology from this interface."
                        actions={
                            <div className="hidden md:flex gap-4">
                                <BaseButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => navigate('/progress')}
                                    leftIcon={<Star size={14} />}
                                >
                                    Archives
                                </BaseButton>
                                <BaseButton
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setIsDeepStudyActive(true)}
                                >
                                    Initialize Deep Study
                                </BaseButton>
                            </div>
                        }
                    />

                    {/* XP Progress Integration - Minimalist */}
                    <div className="mb-16 max-w-md">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Neural Sync Status</span>
                            <span className="text-[10px] font-mono font-black text-white/60">Level {progressData?.progress.stats?.level || 1} • {Math.round(xpPercentage)}%</span>
                        </div>
                        <ProgressBar
                            value={xpPercentage}
                            max={100}
                            size="md"
                            className="bg-white/5"
                        />
                    </div>

                    {/* Stats Section or Skeleton */}
                    {!progressData ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
                            <NeuralSkeleton count={4} className="h-32" />
                        </div>
                    ) : (
                        <div className="mb-20">
                            <DashboardStats stats={stats} />
                        </div>
                    )}

                    {/* Neural Interface Section - High Density Bento */}
                    <motion.section
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="mb-24"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-premium rounded-[3rem] p-8 md:p-12 overflow-hidden relative group border-white/5">
                            <div className="lg:col-span-8 h-[450px] relative order-2 lg:order-1">
                                <AnimatePresence mode="wait">
                                    {dashboardView === 'twin' ? (
                                        <motion.div
                                            key="twin"
                                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                                            className="w-full h-full"
                                        >
                                            <NeuralDigitalTwin density={neuralDensity} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="palace"
                                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                                            className="w-full h-full"
                                        >
                                            <MemoryPalace progressData={progressData} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="lg:col-span-4 space-y-10 order-1 lg:order-2">
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-6">
                                        <span className="text-[10px] font-black tracking-[0.6em] text-white/20 uppercase">System_View</span>
                                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                                            <button
                                                onClick={() => setDashboardView('twin')}
                                                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${dashboardView === 'twin' ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}
                                            >
                                                Topology
                                            </button>
                                            <button
                                                onClick={() => setDashboardView('palace')}
                                                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${dashboardView === 'palace' ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}
                                            >
                                                Sanctuary
                                            </button>
                                        </div>
                                    </div>

                                    <h2 className="text-h2 font-black text-white tracking-tighter">
                                        Neural <br />
                                        <span className="text-white/40">{dashboardView === 'twin' ? 'Topology' : 'Sanctuary'}</span>
                                    </h2>

                                    <p className="text-body text-white/50 leading-relaxed font-light">
                                        {dashboardView === 'twin'
                                            ? `Visualizing synaptic density across ${Object.keys(neuralDensity).length} sectors. Digital twin remains synchronized.`
                                            : "A spatial representation of acquired knowledge. Spires evolve with deep integration."}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(neuralDensity).slice(0, 3).map(([cat, val]) => (
                                        <div key={cat} className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest">
                                                <span>{cat}</span>
                                                <span>{Math.round(val * 100)}%</span>
                                            </div>
                                            <ProgressBar value={val * 100} size="xs" className="bg-white/[0.02]" />
                                        </div>
                                    ))}
                                </div>

                                <BaseButton
                                    variant="primary"
                                    size="lg"
                                    onClick={() => setIsDeepStudyActive(true)}
                                    className="w-full tracking-[0.2em]"
                                    leftIcon={<Zap size={16} />}
                                >
                                    Activate Study
                                </BaseButton>
                            </div>
                        </div>
                    </motion.section>

                    {/* Modules Grid - High Density Bento Override */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
                        {LEARNING_TOOLS && LEARNING_TOOLS.map((tool, index) => {
                            const ToolIcon = tool.Icon || Zap;
                            // Bento Strategy: 8-span, 4-span, 4-span, 8-span pattern
                            const bentoClass = index % 4 === 0 || index % 4 === 3 ? "md:col-span-8" : "md:col-span-4";

                            return (
                                <motion.div
                                    key={tool.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: index * 0.1
                                    }}
                                    className={bentoClass}
                                >
                                    <LuxuryCard
                                        variant="glass"
                                        layoutId={`card-${tool.id}`}
                                        onClick={() => navigate(tool.path)}
                                        className="h-full cursor-pointer group border-white/5"
                                        data-cursor="neural"
                                    >
                                        <LuxuryContent className="p-10 md:p-14">
                                            <div className="flex flex-col h-full">
                                                <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/5 group-hover:text-white group-hover:border-white/20 transition-all duration-700 mb-10 shadow-2xl">
                                                    <ToolIcon size={28} strokeWidth={1} />
                                                </div>
                                                <h3 className="text-h3 font-black text-white mb-4 group-hover:text-gray-300 transition-colors uppercase tracking-tight">{tool.title}</h3>
                                                <p className="text-body text-white/50 font-light leading-relaxed mb-10 group-hover:text-white/70 transition-colors">
                                                    {tool.description}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="text-[9px] font-mono text-white/20 tracking-[0.4em] uppercase group-hover:text-white/40 transition-colors">
                                                        Protocol_0{index + 1}
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                                                        <Rocket size={14} className="-rotate-90 text-white/40" />
                                                    </div>
                                                </div>
                                            </div>
                                        </LuxuryContent>
                                    </LuxuryCard>
                                </motion.div>
                            );
                        })}
                    </div>

                    {RECENT_ACTIVITY && (
                        <div className="border-t border-white/5 pt-24">
                            <ActivityFeed activities={RECENT_ACTIVITY} />
                        </div>
                    )}

                    {/* Bottom Utility Bar - Minimalist */}
                    <footer className="mt-32 py-16 border-t border-white/5 flex flex-col items-center gap-10">
                        <div className="flex items-center gap-4 text-[9px] font-mono text-white/20 tracking-[0.5em] uppercase">
                            <Shield size={12} className="opacity-40" />
                            <span>Node Segment Alpha Active</span>
                        </div>
                        <BaseButton
                            variant="secondary"
                            size="md"
                            onClick={() => navigate('/progress')}
                            className="bg-transparent border-white/5 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white hover:text-black"
                        >
                            Open Neural Archives
                        </BaseButton>
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
