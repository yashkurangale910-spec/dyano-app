import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import { ChevronRight } from 'lucide-react';

export default function FeatureGrid({ features }) {
    const navigate = useNavigate();

    return (
        <div className="container-cosmic py-60">
            {/* High-Spec Section Header */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 bg-cosmic-cyan rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Core Cognitive Modules</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-display font-black text-white leading-tight tracking-tighter">
                        Engineered for <br />
                        <span className="text-gradient-cosmic">Deep Learning.</span>
                    </h2>
                </div>
                <div className="text-[10px] font-mono text-gray-700 tracking-[0.4em] mb-4">
                    [SEC_PROT_ALPHA]
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {features.map((feature, index) => {
                    const isMain = index === 0;
                    return (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`${isMain ? 'md:col-span-8' : 'md:col-span-4'} group cursor-pointer`}
                            onClick={() => navigate(feature.path)}
                        >
                            <GlassCard className={`h-full relative overflow-hidden flex flex-col justify-between ${isMain ? 'p-12 md:p-20' : 'p-10'} border-white/[0.03] hover:border-cosmic-cyan/30 transition-all duration-700`}>
                                {/* Background Watermark */}
                                <div className="absolute top-10 right-10 text-[60px] font-display font-black text-white/[0.02] select-none group-hover:text-cosmic-cyan/[0.03] transition-colors pointer-events-none">
                                    0{index + 1}
                                </div>

                                <div>
                                    <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/5 inline-flex items-center justify-center mb-10 group-hover:bg-cosmic-cyan/5 group-hover:border-cosmic-cyan/20 transition-all duration-500`}>
                                        <feature.Icon className="w-8 h-8 text-cosmic-cyan" strokeWidth={1} />
                                    </div>

                                    <h3 className={`${isMain ? 'text-4xl md:text-5xl' : 'text-2xl'} font-display font-black text-white mb-6 tracking-tight group-hover:text-cosmic-cyan transition-colors`}>
                                        {feature.title}
                                    </h3>

                                    <p className={`text-gray-500 leading-relaxed font-light ${isMain ? 'text-xl max-w-xl' : 'text-base'}`}>
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="mt-12 flex items-center justify-between">
                                    <div className="flex gap-6 text-[8px] font-mono tracking-[0.4em] text-gray-700 uppercase">
                                        <span>PROT_STABLE</span>
                                        <span className="hidden sm:block">NEURAL_ID_0{index + 1}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                                        <ChevronRight size={16} className="text-cosmic-cyan" />
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
