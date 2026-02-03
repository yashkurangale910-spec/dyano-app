import { motion } from 'framer-motion';
import { Award, TrendingUp, Zap, FileText, Loader2, Target, BarChart3, ShieldCheck, Star } from 'lucide-react';
import LuxuryCard, { LuxuryContent } from '../components/ui/LuxuryCard';
import StatPodium from '../components/progress/StatPodium';
import useProgress from '../hooks/useProgress';
import PageHeader from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import LoadingState from '../components/ui/LoadingState';
import ProgressBar from '../components/ui/ProgressIndicator';

export default function ProgressJourney() {
    const { status, progressData, achievements } = useProgress();

    if (status === 'loading' || !progressData) {
        return (
            <div className="flex flex-center min-h-screen atmosphere-layer">
                <LoadingState variant="progress" label="Accessing Neural Archive" message="Retrieving your cognitive trajectory and performance metrics..." />
            </div>
        );
    }

    const { progress, breakdown } = progressData;
    const { stats, dailyStreak } = progress;

    // Derived Metrics
    const totalNodes = stats.totalQuizzesTaken + stats.totalFlashcardsLearned + stats.totalRoadmapsCompleted;
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const velocity = dailyStreak.count > 0 ? `+${dailyStreak.count * 10}%` : '0%';
    const masteryPercentage = Math.round((unlockedCount / achievements.length) * 100);

    return (
        <div className="w-full relative min-h-screen atmosphere-layer">
            <main className="py-12 md:py-20 relative z-10">
                <div className="container-cosmic">

                    {/* Navigation Context */}
                    <Breadcrumbs />

                    {/* Page Header */}
                    <PageHeader
                        title="Neural Archive"
                        subtitle="Detailed analytics of your cognitive expansion, skill trajectories, and achievement protocols."
                        helpText="Persistence metrics are updated every 24 hours to reflect real-time synaptic growth."
                        actions={
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-xl group hover:border-accent-cyan/20 transition-all">
                                <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan">
                                    <Star size={16} className="animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mastery Index</div>
                                    <div className="text-sm font-bold text-white">{masteryPercentage}% Synchronized</div>
                                </div>
                            </div>
                        }
                    />

                    {/* HERO SECTION: The Expansion Metric */}
                    <section className="mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-8">
                            <LuxuryCard variant="glass" className="overflow-hidden border-white/5 bg-gradient-to-br from-accent-cyan/5 to-transparent">
                                <LuxuryContent className="p-10 md:p-16">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex-center text-accent-cyan">
                                            <BarChart3 size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <span className="text-mono text-[10px] text-accent-cyan uppercase tracking-[0.4em] block">expansion_log_0x42f</span>
                                            <h2 className="text-h2">Neural Connectivity</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                                        <StatPodium
                                            value={totalNodes.toString()}
                                            label="Connectivity Nodes"
                                            subvalue={`Syncing with ${breakdown.quizzes.total} quizzes & ${breakdown.flashcards.sets} decks`}
                                            color="cyan"
                                        />
                                        <div className="space-y-6">
                                            <p className="text-body-lg text-gray-400 font-light border-l border-white/10 pl-8 italic">
                                                "Your knowledge universe is expanding. Current average recall efficiency is at {breakdown.quizzes.averageScore}% across all domains."
                                            </p>
                                            <div className="pl-8">
                                                <div className="flex justify-between text-mono text-[10px] text-gray-600 mb-2">
                                                    <span>Recall Precision</span>
                                                    <span>{breakdown.quizzes.averageScore}%</span>
                                                </div>
                                                <ProgressBar value={breakdown.quizzes.averageScore} size="xs" className="shadow-glow-cyan/5" />
                                            </div>
                                        </div>
                                    </div>
                                </LuxuryContent>
                            </LuxuryCard>
                        </div>

                        <div className="lg:col-span-4 space-y-8">
                            <LuxuryCard variant="glass" className="p-8 border-t-2 border-t-accent-indigo">
                                <LuxuryContent>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-xl bg-accent-indigo/10 text-accent-indigo">
                                            <TrendingUp size={24} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-mono text-[10px] text-gray-700">VELOCITY_VECTOR</span>
                                    </div>
                                    <div className="text-5xl font-black text-white mb-2">{velocity}</div>
                                    <div className="text-caption">Weekly cognitive velocity growth.</div>
                                </LuxuryContent>
                            </LuxuryCard>

                            <LuxuryCard variant="glass" className="p-8 border-t-2 border-t-accent-cyan">
                                <LuxuryContent>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                                            <Zap size={24} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-mono text-[10px] text-gray-700">SYSTEM_UPTIME</span>
                                    </div>
                                    <div className="text-5xl font-black text-white mb-2">{dailyStreak.count} Days</div>
                                    <div className="text-caption">Continuous neural session streak.</div>
                                </LuxuryContent>
                            </LuxuryCard>
                        </div>
                    </section>

                    {/* METRIC GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                        <LuxuryCard variant="glass" className="group">
                            <LuxuryContent className="p-10 flex items-center gap-10">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex-center text-accent-indigo group-hover:scale-110 group-hover:bg-accent-indigo/10 transition-all duration-500">
                                    <Award size={40} strokeWidth={1} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-mono text-[10px] text-gray-600 uppercase tracking-widest mb-1">Achievement Index</div>
                                    <div className="text-4xl font-black text-white mb-2">{unlockedCount} / {achievements.length}</div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${masteryPercentage}%` }}
                                            className="h-full bg-accent-indigo"
                                        />
                                    </div>
                                </div>
                            </LuxuryContent>
                        </LuxuryCard>

                        <LuxuryCard variant="glass" className="group">
                            <LuxuryContent className="p-10 flex items-center gap-10">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex-center text-accent-cyan group-hover:scale-110 group-hover:bg-accent-cyan/10 transition-all duration-500">
                                    <Target size={40} strokeWidth={1} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-mono text-[10px] text-gray-600 uppercase tracking-widest mb-1">Success Matrix</div>
                                    <div className="text-4xl font-black text-white mb-2">{breakdown.quizzes.averageScore}%</div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${breakdown.quizzes.averageScore}%` }}
                                            className="h-full bg-accent-cyan"
                                        />
                                    </div>
                                </div>
                            </LuxuryContent>
                        </LuxuryCard>
                    </div>

                    {/* ACHIEVEMENTS GRID */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                            <h2 className="text-mono text-gray-700">Synaptic Badges & Protocols</h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements.map((ach, idx) => (
                                <motion.div
                                    key={ach.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <LuxuryCard
                                        variant={ach.unlocked ? "default" : "glass"}
                                        className={`h-full group transition-all duration-500 ${ach.unlocked ? 'border-accent-cyan/20 bg-accent-cyan/5' : 'opacity-40 grayscale'}`}
                                    >
                                        <LuxuryContent className="p-8">
                                            <div className="flex justify-between items-start mb-8 text-4xl">
                                                <div className="group-hover:scale-110 transition-transform duration-500">
                                                    {ach.icon}
                                                </div>
                                                {ach.unlocked && <ShieldCheck size={18} className="text-accent-cyan" />}
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 transition-colors ${ach.unlocked ? 'text-white group-hover:text-accent-cyan' : 'text-gray-600'}`}>
                                                {ach.name}
                                            </h3>
                                            <p className="text-caption leading-relaxed">{ach.description}</p>
                                            {ach.unlocked && (
                                                <div className="mt-6 pt-4 border-t border-accent-cyan/10 flex items-center justify-between text-[8px] text-mono text-accent-cyan uppercase tracking-widest">
                                                    <span>Verified Protocol</span>
                                                    <span>Active</span>
                                                </div>
                                            )}
                                        </LuxuryContent>
                                    </LuxuryCard>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Utility */}
                    <footer className="mt-32 pt-12 border-t border-white/5 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-mono text-[9px] text-gray-700">
                            <ShieldCheck size={12} />
                            ALL DATA IS SYNCRONIZED WITH THE GLOBAL COGNITIVE LEDGER
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
