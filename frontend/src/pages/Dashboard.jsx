import { motion } from 'framer-motion';
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
    Rocket
} from 'lucide-react';

import { Canvas } from '@react-three/fiber';
import KnowledgeUniverse from '../components/three/KnowledgeUniverse';
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import DashboardStats from '../components/dashboard/DashboardStats';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import Tooltip from '../components/ui/Tooltip';

// Data
import { LEARNING_TOOLS, RECENT_ACTIVITY } from '../constants/landingContent';

export default function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { progressData } = useProgress();

    // Derive stats if available
    const stats = (progressData && progressData.progress) ? [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: `${progressData.progress.dailyStreak?.count || 0} Days`, Icon: Flame, color: 'text-cosmic-gold', glow: 'gold', path: '/progress' },
        { id: 'index', label: t('dashboard.stats.index'), value: (progressData.progress.stats?.averageScore || 0).toString(), Icon: Star, color: 'text-cosmic-cyan', glow: 'cyan', path: '/progress' },
        { id: 'modules', label: t('dashboard.stats.modules'), value: ((progressData.progress.stats?.totalQuizzesTaken || 0) + (progressData.progress.stats?.totalRoadmapsCompleted || 0)).toString(), Icon: Award, color: 'text-cosmic-pink', glow: 'pink', path: '/progress' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '94%', Icon: TrendingUp, color: 'text-cosmic-purple', glow: 'purple', path: '/progress' }
    ] : [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: '0 Days', Icon: Flame, color: 'text-cosmic-gold', glow: 'gold', path: '/progress' },
        { id: 'index', label: t('dashboard.stats.index'), value: '0', Icon: Star, color: 'text-cosmic-cyan', glow: 'cyan', path: '/progress' },
        { id: 'modules', label: t('dashboard.stats.modules'), value: '0', Icon: Award, color: 'text-cosmic-pink', glow: 'pink', path: '/progress' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '--', Icon: TrendingUp, color: 'text-cosmic-purple', glow: 'purple', path: '/progress' }
    ];

    const hasNoActivity = !progressData || (progressData.progress?.stats?.totalQuizzesTaken === 0 && progressData.progress?.stats?.totalRoadmapsCompleted === 0);

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
                                    {t('dashboard.title')}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-gray-500 text-xl font-light tracking-wide max-w-xl"
                                >
                                    {t('dashboard.welcome', { name: user?.name || 'Explorer' })}. Synthesis protocols are ready for initialization.
                                </motion.p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">Sector-07 // NODE-DYN</div>
                                <div className="text-2xl font-display font-bold text-white/20">v4.2.0-STABLE</div>
                            </div>
                        </div>
                    </header>

                    {/* Stats Section */}
                    {stats && <DashboardStats stats={stats} />}

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
        </div>
    );
}
