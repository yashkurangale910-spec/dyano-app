import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { Terminal, Activity, Zap } from 'lucide-react';

export default function ActivityFeed({ activities }) {
    return (
        <section className="relative py-20">
            {/* High-Spec Header */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-1.5 h-12 bg-cosmic-cyan rounded-full" />
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 mb-2">Cognitive Log</div>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">
                            Neural <span className="text-gradient-cosmic italic">Chronicle</span>
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-12">
                    <div className="text-right">
                        <div className="text-[8px] font-black text-gray-800 uppercase tracking-widest mb-1">Status</div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-mono text-white font-bold tracking-widest">LIVE_STREAM</span>
                        </div>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10 hidden md:block" />
                    <div className="text-right hidden md:block">
                        <div className="text-[8px] font-black text-gray-800 uppercase tracking-widest mb-1">Identifier</div>
                        <span className="text-[10px] font-mono text-gray-500 tracking-widest">NODE_SEC_7</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[2.4rem] before:top-4 before:bottom-4 before:w-[1px] before:bg-white/5">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative"
                    >
                        {/* Stream Node */}
                        <div className="absolute left-[2.15rem] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#020105] border border-white/20 group-hover:border-cosmic-cyan group-hover:bg-cosmic-cyan transition-all z-10" />

                        <GlassCard className="flex items-center justify-between p-8 pl-16 border-white/[0.02] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-700">
                            <div className="flex items-center gap-10">
                                <div className="text-[9px] font-mono font-black text-gray-800 tracking-[0.4em] rotate-180 [writing-mode:vertical-lr] opacity-40 group-hover:opacity-100 transition-opacity">
                                    LOGSEG_0{index + 1}
                                </div>

                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-gray-600 group-hover:text-cosmic-cyan transition-colors">
                                    {activity.action.includes('Quiz') ? <Zap size={18} /> : <Terminal size={18} />}
                                </div>

                                <div>
                                    <div className="text-[9px] font-black tracking-[0.4em] text-gray-700 uppercase mb-2">
                                        {activity.time} // {activity.action.split(' ')[0]}
                                    </div>
                                    <div className="font-bold text-white text-xl tracking-tight mb-1 group-hover:text-cosmic-cyan transition-colors">
                                        {activity.action}
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{activity.subject}</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="text-3xl font-display font-black text-white group-hover:text-cosmic-pink transition-colors">
                                    <span className="text-xs opacity-40 mr-1">+</span>{activity.score}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[7px] font-black uppercase tracking-[0.3em] text-gray-600">
                                    Neural_Accumulation
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
