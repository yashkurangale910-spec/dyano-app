import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LuxuryCard, { LuxuryContent } from '../ui/LuxuryCard';
import { Activity } from 'lucide-react';

export default function DashboardStats({ stats }) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 }}
                >
                    <LuxuryCard
                        variant="glass"
                        className={`group relative h-full overflow-hidden border-white/5 transition-all duration-700 ${stat.path ? 'cursor-pointer' : ''}`}
                        onClick={() => stat.path && navigate(stat.path)}
                    >
                        <LuxuryContent className="p-8 md:p-10">
                            {/* Senior Decorative Element: Tech Grid */}
                            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-700 group-hover:bg-white/5 group-hover:border-white/20 text-white/40 group-hover:text-white">
                                        <stat.Icon className="w-8 h-8" strokeWidth={1} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-[9px] uppercase font-black tracking-[0.4em] text-white/10 group-hover:text-white/30 transition-colors">CH_{index + 1}</div>
                                        <Activity size={10} className="text-white/20 animate-pulse mt-2" />
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-3 rounded-full bg-white/10 group-hover:bg-white transition-colors" />
                                        <div className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 group-hover:text-white transition-colors uppercase">
                                            {stat.label}
                                        </div>
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black tracking-[-0.05em] text-white flex items-baseline gap-2 group-hover:scale-105 origin-left transition-transform duration-700">
                                        {stat.value}
                                        {stat.id === 'index' && <span className="text-[9px] opacity-20 font-mono tracking-widest">SQ_UNIT</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Top Right "Live" Indicator */}
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.02] border border-white/[0.05]">
                                <div className="w-1 h-1 rounded-full bg-white/20 animate-pulse" />
                                <span className="text-[6px] font-black text-white/20 tracking-widest uppercase">Live</span>
                            </div>
                        </LuxuryContent>
                    </LuxuryCard>
                </motion.div>
            ))}
        </div>
    );
}
