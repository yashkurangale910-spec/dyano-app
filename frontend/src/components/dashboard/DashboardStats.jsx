import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <GlassCard
                        className="text-center"
                        glow
                        glowColor={stat.glow}
                    >
                        <div className="flex justify-center mb-2">
                            <stat.Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">{stat.label}</div>
                        <div className={`text-3xl font-display font-bold ${stat.color}`}>
                            {stat.value}
                        </div>
                    </GlassCard>
                </motion.div>
            ))}
        </div>
    );
}
