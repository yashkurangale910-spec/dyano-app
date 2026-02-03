import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LuxuryCard, { LuxuryContent } from '../ui/LuxuryCard';
import { ChevronRight } from 'lucide-react';

export default function FeatureGrid({ features }) {
    const navigate = useNavigate();

    const gridClasses = [
        'md:col-span-8 md:row-span-2', // Large Hero Card
        'md:col-span-4 md:row-span-1', // Compact 1
        'md:col-span-4 md:row-span-1', // Compact 2
        'md:col-span-4 md:row-span-2', // Tall Side Card
        'md:col-span-8 md:row-span-1', // Wide Bottom Card
    ];

    return (
        <div className="container-cosmic py-32 md:py-60 relative overflow-hidden">
            {/* 💎 Atmospheric Background Light (Minimal) */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.02] blur-[160px] rounded-full pointer-events-none" />

            {/* High-Spec Section Header */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">Neural Matrix Modules</span>
                    </div>
                    <h2 className="text-display font-black text-white leading-[1.05] tracking-tighter">
                        Engineered for <br />
                        <span className="text-gray-500">Cognitive Synthesis.</span>
                    </h2>
                </div>
                <div className="text-[10px] font-mono text-gray-800 tracking-[0.4em] mb-4">
                    [SEC_PROT_NU_15]
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-3 gap-6 md:gap-8 auto-rows-fr">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: index * 0.1
                        }}
                        className={`${gridClasses[index % gridClasses.length]} group cursor-pointer`}
                        onClick={() => navigate(feature.path)}
                    >
                        <LuxuryCard variant="glass" className="h-full group-hover:border-white/20 transition-all duration-700">
                            <LuxuryContent className="h-full flex flex-col justify-between p-8 md:p-12 relative">
                                <div className="absolute top-10 right-10 text-[60px] font-display font-black text-white/[0.01] select-none group-hover:text-white/[0.03] transition-colors pointer-events-none">
                                    0{index + 1}
                                </div>

                                <div className="relative">
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 inline-flex items-center justify-center mb-10 group-hover:bg-white/5 group-hover:border-white/10 transition-all duration-500">
                                        <feature.Icon className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" strokeWidth={1} />
                                    </div>

                                    <h3 className="text-h3 font-black text-white mb-6 tracking-tight group-hover:text-gray-300 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-body leading-relaxed font-light text-gray-600 group-hover:text-gray-500 transition-colors line-clamp-3">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="mt-auto pt-12 flex items-center justify-between">
                                    <div className="flex gap-6 text-[8px] font-mono tracking-[0.4em] text-gray-800 uppercase">
                                        <span>ACTIVE_SYNC</span>
                                        <span className="hidden sm:block">NODE_{feature.id}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                                        <ChevronRight size={16} className="text-white/60" />
                                    </div>
                                </div>
                            </LuxuryContent>
                        </LuxuryCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
