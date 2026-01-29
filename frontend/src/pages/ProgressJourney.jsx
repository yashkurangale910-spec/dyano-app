import { motion } from 'framer-motion';
import { Award, TrendingUp, Zap, FileText, Loader2 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import StatPodium from '../components/progress/StatPodium';
import useProgress from '../hooks/useProgress';

export default function ProgressJourney() {
    const { status, progressData, achievements } = useProgress();

    if (status === 'loading' || !progressData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#05010d]">
                <Loader2 className="w-12 h-12 text-cosmic-cyan animate-spin mb-4" />
                <p className="text-gray-500 font-mono tracking-widest uppercase text-xs">Synchronizing Neural Metrics...</p>
            </div>
        );
    }

    const { progress, breakdown } = progressData;
    const { stats, dailyStreak } = progress;

    // Derived Metrics
    const totalNodes = stats.totalQuizzesTaken + stats.totalFlashcardsLearned + stats.totalRoadmapsCompleted;
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const velocity = dailyStreak.count > 0 ? `+${dailyStreak.count * 10}%` : '0%';

    return (
        <div className="container-cosmic py-24 min-h-screen">
            {/* HERO SECTION: The Expansion Metric */}
            <section className="mb-40 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-12 opacity-40">
                        <div className="w-10 h-[1px] bg-cosmic-cyan"></div>
                        <span className="text-[10px] font-display tracking-[0.4em] font-bold text-cosmic-cyan uppercase">
                            Expansion Log // sector_alpha_9
                        </span>
                    </div>

                    <StatPodium
                        value={totalNodes.toString()}
                        label="Neural Connectivity"
                        subvalue={`Syncing with ${breakdown.quizzes.total} quizzes & ${breakdown.flashcards.sets} decks`}
                        color="cyan"
                    />
                </div>

                <div className="lg:col-span-4 pb-4">
                    <p className="text-xl text-gray-500 font-light leading-relaxed italic border-l border-white/5 pl-8">
                        "Your knowledge universe is expanding. Current average recall efficiency is at {breakdown.quizzes.averageScore}%."
                    </p>
                </div>
            </section>

            {/* SECONDARY METRICS: High-Contrast Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-40">
                <GlassCard className="p-10 border-t-2 border-t-cosmic-pink">
                    <div className="flex justify-between items-start mb-8">
                        <Award className="text-cosmic-pink" size={32} strokeWidth={1} />
                        <span className="text-[10px] font-mono text-gray-700">ACHIEVEMENT_INDEX</span>
                    </div>
                    <div className="text-5xl font-display font-bold text-white mb-2">{unlockedCount}/{achievements.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Unlocks Realized</div>
                </GlassCard>

                <GlassCard className="p-10 border-t-2 border-t-cosmic-purple">
                    <TrendingUp className="text-cosmic-purple mb-8" size={32} strokeWidth={1} />
                    <div className="text-5xl font-display font-bold text-white mb-2">{velocity}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Weekly Velocity</div>
                </GlassCard>

                <GlassCard className="p-10 border-t-2 border-t-cosmic-gold">
                    <Zap className="text-cosmic-gold mb-8" size={32} strokeWidth={1} />
                    <div className="text-5xl font-display font-bold text-white mb-2">{dailyStreak.count}d</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">System Uptime</div>
                </GlassCard>
            </div>

            {/* ACHIEVEMENTS GRID */}
            <section className="max-w-4xl">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-12 flex items-center gap-6">
                    Badges & Protocols <div className="flex-1 h-[1px] bg-white/5"></div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {achievements.map((ach, idx) => (
                        <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex items-center gap-6 p-6 rounded-xl border ${ach.unlocked ? 'border-cosmic-cyan/30 bg-cosmic-cyan/5' : 'border-white/5 bg-white/[0.02] opacity-50'}`}
                        >
                            <div className="text-3xl">{ach.icon}</div>
                            <div>
                                <div className={`text-lg font-display font-bold ${ach.unlocked ? 'text-white' : 'text-gray-600'}`}>{ach.name}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest">{ach.description}</div>
                            </div>
                            {ach.unlocked && (
                                <div className="ml-auto text-cosmic-cyan">
                                    <Award size={16} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
