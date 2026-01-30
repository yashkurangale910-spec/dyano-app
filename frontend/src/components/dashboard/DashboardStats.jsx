import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import { Activity } from 'lucide-react';

export default function DashboardStats({ stats }) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <GlassCard
                        className={`group relative p-10 h-full overflow-hidden transition-all duration-700 ${stat.path ? 'cursor-pointer' : ''}`}
                        onClick={() => stat.path && navigate(stat.path)}
                        glow={true}
                        glowColor={stat.glow}
                    >
                        {/* Senior Decorative Element: Tech Grid */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-12">
                                <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-700 group-hover:bg-white/[0.07] group-hover:border-white/20`}>
                                    <stat.Icon className={`w-8 h-8 ${stat.color}`} strokeWidth={1} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-[9px] uppercase font-black tracking-[0.4em] text-gray-700">SIG_CHANNEL_{index + 1}</div>
                                    <Activity size={10} className={`${stat.color} opacity-40 animate-pulse mt-2`} />
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-1 h-3 rounded-full ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
                                    <div className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-500 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </div>
                                </div>
                                <div className={`text-5xl font-display font-black tracking-[-0.05em] text-white flex items-baseline gap-2 group-hover:scale-105 origin-left transition-transform duration-700`}>
                                    {stat.value}
                                    {stat.id === 'index' && <span className="text-[10px] opacity-20 font-mono tracking-widest">SQ_UNIT</span>}
                                </div>
                            </div>
                        </div>

                        {/* Top Right "Live" Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.02] border border-white/[0.05]">
                            <div className={`w-1 h-1 rounded-full ${stat.color} animate-pulse`} />
                            <span className="text-[6px] font-black text-gray-800 tracking-widest uppercase">Live</span>
                        </div>
                    </GlassCard>
                </motion.div>
            ))}
        </div>
    );
}
