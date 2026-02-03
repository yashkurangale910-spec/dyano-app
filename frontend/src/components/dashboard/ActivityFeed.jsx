import { motion } from 'framer-motion';
import LuxuryCard, { LuxuryContent } from '../ui/LuxuryCard';
import { Terminal, Activity, Zap } from 'lucide-react';

export default function ActivityFeed({ activities }) {
    return (
        <section className="relative py-20">
            {/* High-Spec Header */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-1.5 h-12 bg-white/20 rounded-full" />
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-800 mb-2">Cognitive Log</div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Neural <span className="text-gray-500 italic">Chronicle</span>
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-12 text-right">
                    <div className="hidden md:block">
                        <div className="text-[8px] font-black text-gray-800 uppercase tracking-widest mb-1">Status</div>
                        <div className="flex items-center gap-2 justify-end">
                            <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" />
                            <span className="text-[10px] font-mono text-white/60 font-black tracking-widest uppercase">Streaming</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[2.4rem] before:top-4 before:bottom-4 before:w-[1px] before:bg-white/5">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 }}
                        className="group relative"
                    >
                        {/* Stream Node */}
                        <div className="absolute left-[2.15rem] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border border-white/10 group-hover:border-white/40 group-hover:bg-white transition-all z-10" />

                        <LuxuryCard variant="glass" className="border-white/[0.02] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-700">
                            <LuxuryContent className="flex items-center justify-between p-8 pl-16">
                                <div className="flex items-center gap-10">
                                    <div className="text-[9px] font-mono font-black text-gray-800 tracking-[0.4em] rotate-180 [writing-mode:vertical-lr] opacity-30 group-hover:opacity-100 transition-opacity">
                                        SEG_0{index + 1}
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-white/20 group-hover:text-white transition-colors">
                                        {activity.action.includes('Quiz') ? <Zap size={18} strokeWidth={1} /> : <Terminal size={18} strokeWidth={1} />}
                                    </div>

                                    <div>
                                        <div className="text-[9px] font-black tracking-[0.4em] text-gray-800 uppercase mb-2">
                                            {activity.time} // {activity.action.split(' ')[0]}
                                        </div>
                                        <div className="font-bold text-white text-xl tracking-tight mb-1 group-hover:text-gray-300 transition-colors">
                                            {activity.action}
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{activity.subject}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-3xl font-black text-white group-hover:text-gray-400 transition-colors">
                                        <span className="text-xs opacity-20 mr-1">+</span>{activity.score}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[7px] font-black uppercase tracking-[0.3em] text-gray-800">
                                        SYNAPSE_GAIN
                                    </div>
                                </div>
                            </LuxuryContent>
                        </LuxuryCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
