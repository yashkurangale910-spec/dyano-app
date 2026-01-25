import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

export default function FeatureGrid({ features }) {
    const navigate = useNavigate();

    return (
        <div className="container-cosmic py-40">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.15 }}
                        className={`${index === 0 ? 'md:col-span-3' : 'md:col-span-2'} cursor-pointer`}
                        onClick={() => navigate(feature.path)}
                    >
                        <GlassCard className={`h-full group flex flex-col justify-between ${index === 0 ? 'p-12' : 'p-8'} hover:border-cosmic-cyan/30 transition-all duration-500`}>
                            <div>
                                <div className="mb-10 flex items-center gap-6">
                                    <div className="p-5 rounded-[2rem] bg-cosmic-purple/10 border border-white/5 group-hover:border-cosmic-cyan/20 transition-all duration-700">
                                        <feature.Icon className="w-10 h-10 text-cosmic-cyan" strokeWidth={1} />
                                    </div>
                                    {index === 0 && (
                                        <h3 className="text-3xl font-display font-bold text-white tracking-tight">
                                            {feature.title}
                                        </h3>
                                    )}
                                </div>

                                {index !== 0 && (
                                    <h3 className="text-2xl font-display font-semibold mb-4 text-white">
                                        {feature.title}
                                    </h3>
                                )}

                                <p className={`text-gray-500 leading-relaxed font-light ${index === 0 ? 'text-xl max-w-md' : 'text-base'}`}>
                                    {feature.description}
                                </p>
                            </div>

                            {index === 0 && (
                                <div className="mt-16 flex gap-6 text-[9px] font-mono tracking-widest text-cosmic-cyan underline underline-offset-8 decoration-cosmic-cyan/20">
                                    <span>SYSTEM_CORE_V1</span>
                                    <span>LATENCY_STABLE</span>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
