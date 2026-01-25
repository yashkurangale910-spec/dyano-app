import { motion } from 'framer-motion';
import { Award, TrendingUp, Zap, FileText } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import StatPodium from '../components/progress/StatPodium';
import { RECENT_ACTIVITY } from '../constants/landingContent';

export default function ProgressJourney() {
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
                        value="84"
                        label="Neural Connectivity"
                        subvalue="Syncing with 12 cloud sectors"
                        color="cyan"
                    />
                </div>

                <div className="lg:col-span-4 pb-4">
                    <p className="text-xl text-gray-500 font-light leading-relaxed italic border-l border-white/5 pl-8">
                        "Your knowledge universe is expanding at a rate of 4.2 sectors per gigacycle. Stability is high."
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
                    <div className="text-5xl font-display font-bold text-white mb-2">12/30</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Unlocks Realized</div>
                </GlassCard>

                <GlassCard className="p-10 border-t-2 border-t-cosmic-purple">
                    <TrendingUp className="text-cosmic-purple mb-8" size={32} strokeWidth={1} />
                    <div className="text-5xl font-display font-bold text-white mb-2">+12%</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Weekly Velocity</div>
                </GlassCard>

                <GlassCard className="p-10 border-t-2 border-t-cosmic-gold">
                    <Zap className="text-cosmic-gold mb-8" size={32} strokeWidth={1} />
                    <div className="text-5xl font-display font-bold text-white mb-2">14d</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">System Uptime</div>
                </GlassCard>
            </div>

            {/* ACTIVITY FEED: System Protocol Style */}
            <section className="max-w-4xl">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-12 flex items-center gap-6">
                    Recent Transmissions <div className="flex-1 h-[1px] bg-white/5"></div>
                </h2>

                <div className="space-y-6">
                    {RECENT_ACTIVITY.map((activity, idx) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-12 py-6 border-b border-white/5 group"
                        >
                            <div className="text-[10px] font-mono text-gray-700 w-24">0{idx + 1} // {activity.time}</div>
                            <div className="flex-1 flex items-center gap-6">
                                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cosmic-cyan/10 transition-colors">
                                    <FileText className="text-gray-600 group-hover:text-cosmic-cyan transition-colors" size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <div className="text-lg font-display text-white group-hover:text-cosmic-cyan transition-colors">{activity.subject}</div>
                                    <div className="text-xs text-gray-600 uppercase tracking-widest">{activity.action}</div>
                                </div>
                            </div>
                            <div className="text-3xl font-display font-bold text-white italic opacity-20 group-hover:opacity-100 transition-opacity">
                                {activity.score}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
