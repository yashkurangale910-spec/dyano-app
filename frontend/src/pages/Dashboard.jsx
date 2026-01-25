import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Components
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import DashboardStats from '../components/dashboard/DashboardStats';
import ActivityFeed from '../components/dashboard/ActivityFeed';

// Data
import { DASHBOARD_STATS, LEARNING_TOOLS, RECENT_ACTIVITY } from '../constants/landingContent';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <main className="py-12">
                <div className="container-cosmic">
                    {/* Header */}
                    <header className="mb-12">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-display font-bold text-gradient-glow mb-2"
                        >
                            Mission Control
                        </motion.h1>
                        <p className="text-gray-400 font-light tracking-wide">Welcome back, Explorer. Accessing neural stream...</p>
                    </header>

                    <DashboardStats stats={DASHBOARD_STATS} />

                    {/* Tools Grid - Using Asymmetric logic here too */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
                        {LEARNING_TOOLS.map((tool, index) => (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                                className={index === 0 ? "md:col-span-8" : "md:col-span-4"}
                            >
                                <GlassCard
                                    onClick={() => navigate(tool.path)}
                                    className={`h-full group ${index === 0 ? 'p-8 md:p-12' : 'p-8'}`}
                                    glow={index === 0}
                                >
                                    <div className={`flex ${index === 0 ? 'flex-row' : 'flex-col'} items-start gap-8`}>
                                        <div className="p-5 rounded-3xl bg-cosmic-purple/10 group-hover:bg-cosmic-purple/20 transition-all duration-500">
                                            <tool.Icon className="w-10 h-10 text-cosmic-cyan" strokeWidth={1} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-display font-bold text-white mb-3 ${index === 0 ? 'text-4xl' : 'text-2xl'}`}>
                                                {tool.title}
                                            </h3>
                                            <p className={`text-gray-500 leading-relaxed font-light ${index === 0 ? 'text-lg max-w-md' : 'text-sm'}`}>
                                                {tool.description}
                                            </p>

                                            <div className="mt-8 flex gap-4 text-[10px] font-mono tracking-widest uppercase opacity-40">
                                                {Object.entries(tool.stats).map(([key, value]) => (
                                                    <div key={key}>
                                                        {key}: <span className="text-white">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>

                    <ActivityFeed activities={RECENT_ACTIVITY} />

                    {/* Quick Action Bar */}
                    <footer className="mt-20 flex justify-center border-t border-white/5 pt-12">
                        <ParticleButton variant="outline" size="sm" onClick={() => navigate('/progress')} className="rounded-none tracking-[0.2em] font-bold text-[10px] uppercase">
                            Full Archive Access
                        </ParticleButton>
                    </footer>
                </div>
            </main>
        </div>
    );
}
