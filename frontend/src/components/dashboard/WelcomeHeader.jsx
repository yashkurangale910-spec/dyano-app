import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Welcome Header with personalized greeting and quick stats
 */
export default function WelcomeHeader({ userName = 'Explorer', stats = {} }) {
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTimeAndGreeting = () => {
            const now = new Date();
            const hour = now.getHours();

            // Set greeting based on time
            if (hour < 12) setGreeting('Good Morning');
            else if (hour < 18) setGreeting('Good Afternoon');
            else setGreeting('Good Evening');

            // Format time
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }));
        };

        updateTimeAndGreeting();
        const interval = setInterval(updateTimeAndGreeting, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const defaultStats = {
        streak: 0,
        points: 0,
        level: 1,
        ...stats
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cosmic-purple/10 via-transparent to-cosmic-cyan/10 border border-white/10 p-8 mb-8"
        >
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-cosmic-cyan/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Greeting Section */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cosmic-cyan animate-pulse" />
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                            {currentTime} • Neural Sync Active
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2">
                        {greeting}, <span className="text-gradient-kinetic">{userName}</span>
                    </h1>

                    <p className="text-gray-500 font-light">
                        Ready to expand your knowledge universe today?
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-6">
                    <StatBadge
                        value={defaultStats.streak}
                        label="Day Streak"
                        icon="🔥"
                        color="cyan"
                    />
                    <StatBadge
                        value={defaultStats.points}
                        label="XP Points"
                        icon="⚡"
                        color="purple"
                    />
                    <StatBadge
                        value={defaultStats.level}
                        label="Level"
                        icon="🎯"
                        color="pink"
                    />
                </div>
            </div>
        </motion.div>
    );
}

WelcomeHeader.propTypes = {
    userName: PropTypes.string,
    stats: PropTypes.shape({
        streak: PropTypes.number,
        points: PropTypes.number,
        level: PropTypes.number
    })
};

// Stat Badge Component
function StatBadge({ value, label, icon, color }) {
    const colorClasses = {
        cyan: 'from-cosmic-cyan/20 to-cosmic-cyan/5 border-cosmic-cyan/30',
        purple: 'from-cosmic-purple/20 to-cosmic-purple/5 border-cosmic-purple/30',
        pink: 'from-cosmic-pink/20 to-cosmic-pink/5 border-cosmic-pink/30'
    };

    return (
        <div className={`
      px-6 py-3 rounded-2xl border backdrop-blur-xl
      bg-gradient-to-br ${colorClasses[color]}
      hover:scale-105 transition-transform duration-300
    `}>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{icon}</span>
                <span className="text-2xl font-display font-black text-white">
                    {value.toLocaleString()}
                </span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                {label}
            </div>
        </div>
    );
}

StatBadge.propTypes = {
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['cyan', 'purple', 'pink']).isRequired
};
