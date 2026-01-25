import { motion } from 'framer-motion';

export default function StatPodium({ value, label, subvalue, color = 'cyan' }) {
    return (
        <div className="text-left group cursor-default">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`text-[120px] md:text-[180px] font-display font-light leading-none tracking-tighter text-white group-hover:text-cosmic-${color} transition-colors duration-1000`}
            >
                {value}
            </motion.div>

            <div className="flex items-center gap-6 mt-4">
                <div className={`w-12 h-[2px] bg-cosmic-${color}`}></div>
                <div>
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-1">
                        {label}
                    </div>
                    {subvalue && (
                        <div className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">
                            {subvalue}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
