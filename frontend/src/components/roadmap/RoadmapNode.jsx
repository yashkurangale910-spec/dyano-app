import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Lock, Activity, RotateCcw, Sword } from 'lucide-react';
import { MemoryDecayService } from '../../utils/MemoryDecayService';

const RoadmapNode = ({ node, className = "", onToggle, status = 'DEFAULT', masteredAt, onClick, isDungeonMode = false, isBoss = false }) => {
    // Status-based Styles
    const getStatusStyles = () => {
        if (isDungeonMode && isBoss) {
            return {
                bg: status === 'MASTERED' ? 'bg-red-500/20' : 'bg-red-950/40',
                border: status === 'MASTERED' ? 'border-red-500' : 'border-red-900/50',
                glow: status === 'MASTERED' ? 'shadow-[0_0_50px_rgba(220,38,38,0.4)]' : 'shadow-[0_0_30px_rgba(0,0,0,0.5)]',
                iconColor: 'text-red-500',
                textColor: 'text-white font-black italic',
                icon: <Sword size={16} className={status !== 'MASTERED' ? 'animate-pulse' : ''} />
            };
        }

        switch (status) {
            case 'MASTERED':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/40',
                    glow: 'shadow-[0_0_40px_-5px_rgba(34,197,94,0.4)]',
                    iconColor: 'text-green-400',
                    textColor: 'text-white',
                    icon: <Check size={14} strokeWidth={4} />
                };
            case 'LEARNING':
                return {
                    bg: 'bg-cosmic-cyan/10',
                    border: 'border-cosmic-cyan/40',
                    glow: 'shadow-[0_0_40px_-5px_rgba(6,182,212,0.4)]',
                    iconColor: 'text-cosmic-cyan',
                    textColor: 'text-white',
                    icon: <Activity size={14} className="animate-pulse" />,
                    animation: 'animate-pulse'
                };
            case 'SKIPPED':
                return {
                    bg: 'bg-white/[0.02]',
                    border: 'border-white/5 border-dashed',
                    glow: 'opacity-40',
                    iconColor: 'text-gray-600',
                    textColor: 'text-gray-500',
                    icon: <RotateCcw size={14} />
                };
            default:
                return {
                    bg: 'bg-white/[0.03]',
                    border: 'border-white/10',
                    glow: '',
                    iconColor: 'text-gray-400',
                    textColor: 'text-gray-300',
                    icon: <Info size={14} />
                };
        }
    };

    const styles = getStatusStyles();
    const retentionScore = status === 'MASTERED' ? MemoryDecayService.getRetentionScore(masteredAt) : 1.0;
    const palimpsestStyle = status === 'MASTERED' ? MemoryDecayService.getPalimpsestStyle(retentionScore) : {};

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick ? onClick(node) : (onToggle && onToggle(node.id))}
            className={`absolute cursor-pointer ${className}`}
            style={{
                left: node.x,
                top: node.y,
                width: 180, // Fixed width for consistency
                zIndex: 10,
                ...palimpsestStyle
            }}
        >
            {/* Glass Card */}
            <div className={`
                relative overflow-hidden
                backdrop-blur-xl rounded-2xl p-4
                border transition-all duration-500
                ${styles.bg} ${styles.border} ${styles.glow}
                group hover:border-white/30 hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.15)]
            `}>
                {/* Gradient Overlay for hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header / Icon */}
                <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${styles.iconColor} ${styles.animation || ''}`}>
                        {styles.icon}
                    </div>
                    {node.importance === 'essential' && (
                        <div className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-[8px] font-black tracking-widest text-red-400 uppercase">
                            Core
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className={`text-sm font-bold leading-tight mb-2 relative z-10 transition-colors ${styles.textColor}`}>
                    {node.title}
                </h3>

                {/* Subtext */}
                <div className="flex items-center gap-2 opacity-50 relative z-10">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${status === 'MASTERED' ? 'bg-green-400' : status === 'LEARNING' ? 'bg-cosmic-cyan animate-pulse' : 'bg-gray-600'} w-[${status === 'MASTERED' ? '100%' : status === 'LEARNING' ? '60%' : '10%'}]`} />
                    </div>
                </div>
            </div>

            {/* Connecting Lines Anchor Points (Invisible) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-transparent" id={`anchor-top-${node.id}`} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-transparent" id={`anchor-bottom-${node.id}`} />
        </motion.div>
    );
};

export default RoadmapNode;
