import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';

const RoadmapNode = ({ node, className = "", onToggle }) => {
    const isCompleted = node.status === 'completed';
    const isCurrent = node.status === 'current';
    const isLocked = node.status === 'locked';

    // roadmap.sh actual tokens based on importance
    const getTheme = () => {
        if (isCompleted) return { border: '#ffd60a', bg: '#ffd60a', text: '#000000' };

        switch (node.importance) {
            case 'essential':
            case 'recommended':
                return {
                    border: '#ffd60a',
                    bg: isCurrent ? '#111111' : '#111111',
                    text: isLocked ? '#525252' : '#ffffff'
                };
            case 'optional':
                return {
                    border: '#404040',
                    bg: '#111111',
                    text: isLocked ? '#525252' : '#888888'
                };
            default:
                return {
                    border: '#262626',
                    bg: '#111111',
                    text: isLocked ? '#525252' : '#ffffff'
                };
        }
    };

    const theme = getTheme();

    return (
        <motion.div
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle && onToggle(node.id)}
            className={`relative group cursor-pointer font-sans select-none ${className}`}
        >
            <div
                className={`
          flex items-center gap-4 px-6 py-3.5 rounded-lg border-[2px] transition-all duration-150
          ${isCurrent ? 'shadow-[0_0_25px_rgba(255,214,10,0.15)]' : ''}
        `}
                style={{
                    borderColor: theme.border,
                    backgroundColor: theme.bg,
                }}
            >
                <div className="flex-1 min-w-0">
                    <span
                        className="text-[15px] font-bold leading-tight truncate block tracking-tight"
                        style={{ color: theme.text }}
                    >
                        {node.title}
                    </span>
                    {node.subtopics && (
                        <div className={`mt-2 flex flex-wrap gap-1.5 ${isCompleted ? 'opacity-40' : 'opacity-60'}`}>
                            {node.subtopics.map(sub => (
                                <span key={sub} className="text-[9px] px-1.5 py-0.5 bg-black/20 rounded-sm border border-white/5 whitespace-nowrap">
                                    {sub}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                            <Check size={12} strokeWidth={4} className="text-[#ffd60a]" />
                        </div>
                    ) : (
                        <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center transition-colors ${isLocked ? 'border-[#404040]' : 'border-gray-500 group-hover:border-white'}`}>
                            <Info
                                size={10}
                                strokeWidth={3}
                                className={`transition-colors ${isLocked ? 'text-[#404040]' : 'text-gray-500 group-hover:text-white'}`}
                            />
                        </div>
                    )}
                </div>
            </div>

            {node.importance === 'essential' && !isCompleted && !isLocked && (
                <div className="absolute -top-3 right-6 px-2 py-0.5 bg-[#404040] text-gray-200 text-[9px] font-black uppercase rounded-[4px] border border-[#525252] shadow-xl">
                    Must Know
                </div>
            )}
        </motion.div>
    );
};

export default RoadmapNode;
