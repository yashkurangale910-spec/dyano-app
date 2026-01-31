import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Star, Shield, Zap as Flash } from 'lucide-react';

const BADGE_CONFIG = {
    'roadmap_master': {
        icon: Award,
        color: 'cyan',
        label: 'Roadmap Master',
        description: 'Synchronized an entire neural roadmap.'
    },
    'week_warrior': {
        icon: Flame,
        color: 'gold',
        label: 'Week Warrior',
        description: '7-day neural sync streak maintenance.'
    },
    'quiz_pro': {
        icon: Star,
        color: 'pink',
        label: 'Logic Titan',
        description: 'Achieved 90%+ average in Quiz Lab.'
    },
    'early_adopter': {
        icon: Rocket,
        color: 'purple',
        label: 'Vanguard',
        description: 'Early adopter of the Spark.E ecosystem.'
    }
};

const KnowledgeBadge = ({ id, unlocked = false, unlockedAt }) => {
    const config = BADGE_CONFIG[id] || { icon: Shield, color: 'gray', label: 'Unknown Node', description: 'Hidden neural encryption.' };
    const Icon = config.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`relative group cursor-help p-4 rounded-2xl border backdrop-blur-md transition-all duration-500 ${unlocked
                ? `bg-cosmic-${config.color}/10 border-cosmic-${config.color}/30 text-cosmic-${config.color}`
                : 'bg-white/5 border-white/10 text-gray-600 grayscale opacity-50'}`}
        >
            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-3 rounded-xl bg-black/90 border border-white/10 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="text-[10px] font-black uppercase tracking-tighter text-white mb-1">{config.label}</div>
                <div className="text-[9px] text-gray-400 font-light leading-tight">{config.description}</div>
                {unlockedAt && <div className="mt-2 text-[8px] text-cosmic-cyan font-mono">SYNCED: {new Date(unlockedAt).toLocaleDateString()}</div>}
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-xl ${unlocked ? `bg-cosmic-${config.color}/20` : 'bg-white/5'}`}>
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                <div className="text-[8px] font-bold uppercase tracking-[0.2em]">{config.label}</div>
            </div>

            {/* Shine Effect */}
            {unlocked && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full skew-x-12"
                    />
                </div>
            )}
        </motion.div>
    );
};

export default KnowledgeBadge;
