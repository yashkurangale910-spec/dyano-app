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
    Bot
} from 'lucide-react';

// Components
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import DashboardStats from '../components/dashboard/DashboardStats';
import ActivityFeed from '../components/dashboard/ActivityFeed';

// Data
import { LEARNING_TOOLS, RECENT_ACTIVITY } from '../constants/landingContent';

export default function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { progressData } = useProgress();

    // Derive stats if available
    const stats = (progressData && progressData.progress) ? [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: `${progressData.progress.dailyStreak?.count || 0} Days`, Icon: Flame, color: 'text-cosmic-gold', glow: 'gold' },
        { id: 'index', label: t('dashboard.stats.index'), value: (progressData.progress.stats?.averageScore || 0).toString(), Icon: Star, color: 'text-cosmic-cyan', glow: 'cyan' },
        { id: 'modules', label: t('dashboard.stats.modules'), value: ((progressData.progress.stats?.totalQuizzesTaken || 0) + (progressData.progress.stats?.totalRoadmapsCompleted || 0)).toString(), Icon: Award, color: 'text-cosmic-pink', glow: 'pink' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '94%', Icon: TrendingUp, color: 'text-cosmic-purple', glow: 'purple' }
    ] : [
        { id: 'streak', label: t('dashboard.stats.uptime'), value: '0 Days', Icon: Flame, color: 'text-cosmic-gold', glow: 'gold' },
        { id: 'index', label: t('dashboard.stats.index'), value: '0', Icon: Star, color: 'text-cosmic-cyan', glow: 'cyan' },
        { id: 'modules', label: t('dashboard.stats.modules'), value: '0', Icon: Award, color: 'text-cosmic-pink', glow: 'pink' },
        { id: 'efficiency', label: t('dashboard.stats.efficiency'), value: '--', Icon: TrendingUp, color: 'text-cosmic-purple', glow: 'purple' }
    ];

    return (
        <div className="w-full">
            <main className="py-12">
                <div className="container-cosmic">
                    {/* Header */}
                    <header className="mb-12">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-display font-bold text-gradient-glow mb-2"
                        >
                            {t('dashboard.title')}
                        </motion.h1>
                        <p className="text-gray-400 font-light tracking-wide">
                            {t('dashboard.welcome', { name: user?.name || 'Explorer' })}
                        </p>
                    </header>

                    {/* Stats Section */}
                    {stats && <DashboardStats stats={stats} />}

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
                                    <GlassCard
                                        onClick={() => navigate(tool.path)}
                                        className={`h-full group cursor-pointer ${index === 0 ? 'p-8 md:p-12' : 'p-8'}`}
                                        glow={index === 0}
                                    >
                                        <div className={`flex ${index === 0 ? 'flex-row' : 'flex-col'} items-start gap-8`}>
                                            <div className="p-5 rounded-3xl bg-cosmic-purple/10 group-hover:bg-cosmic-purple/20 transition-all duration-500">
                                                <ToolIcon className="w-10 h-10 text-cosmic-cyan" strokeWidth={1} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-display font-bold text-white mb-3 ${index === 0 ? 'text-4xl' : 'text-2xl'}`}>
                                                    {tool.title}
                                                </h3>
                                                <p className={`text-gray-500 leading-relaxed font-light ${index === 0 ? 'text-lg max-w-md' : 'text-sm'}`}>
                                                    {tool.description}
                                                </p>

                                                {tool.stats && (
                                                    <div className="mt-8 flex gap-4 text-[10px] font-mono tracking-widest uppercase opacity-40">
                                                        {Object.entries(tool.stats).map(([key, value]) => (
                                                            <div key={key}>
                                                                {key}: <span className="text-white">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
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
