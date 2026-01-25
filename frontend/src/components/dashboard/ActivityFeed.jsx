import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function ActivityFeed({ activities }) {
    return (
        <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-[1px] bg-cosmic-purple"></span>
                Recent Activity
            </h2>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                    >
                        <GlassCard className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors">
                            <div>
                                <div className="font-semibold text-cosmic-cyan">{activity.action}</div>
                                <div className="text-gray-500 text-sm">{activity.subject}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-cosmic-pink font-bold">{activity.score}</div>
                                <div className="text-gray-600 text-xs">{activity.time}</div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
