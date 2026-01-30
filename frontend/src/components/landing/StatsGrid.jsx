import { motion } from 'framer-motion';

export default function StatsGrid({ stats }) {
    return (
        <div className="py-60 relative overflow-hidden">
            {/* Background Sensory Layer */}
            <div className="absolute inset-0 bg-white/[0.01] border-y border-white/[0.03]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

            <div className="container-cosmic relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative group"
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-4 opacity-40">
                                    <div className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sensor_{index + 1}</span>
                                </div>

                                <div className="text-8xl md:text-9xl font-display font-black text-white mb-6 tracking-[-0.08em] leading-none group-hover:text-gradient-kinetic transition-all duration-1000">
                                    {stat.value}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-[2px] w-8 bg-gradient-to-r from-cosmic-pink to-transparent" />
                                    <div className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-600 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
