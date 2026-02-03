import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Activity, Circle } from 'lucide-react';

const RoadmapNode = ({ node, status = 'DEFAULT', onClick }) => {

    const getStatusStyles = () => {
        switch (status) {
            case 'MASTERED':
                return {
                    bg: 'bg-white',
                    border: 'border-white',
                    iconColor: 'text-black',
                    textColor: 'text-black font-black',
                    icon: <Check size={14} strokeWidth={4} />
                };
            case 'LEARNING':
                return {
                    bg: 'bg-accent-cyan/20',
                    border: 'border-accent-cyan/60',
                    iconColor: 'text-accent-cyan',
                    textColor: 'text-white font-bold',
                    icon: <Activity size={14} className="animate-pulse" />
                };
            default:
                return {
                    bg: 'bg-white/[0.05]',
                    border: 'border-white/10',
                    iconColor: 'text-white/30',
                    textColor: 'text-white/80',
                    icon: <Circle size={10} fill="currentColor" />
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick && onClick(node)}
            className="absolute cursor-pointer"
            style={{
                left: node.x,
                top: node.y,
                width: 200,
                zIndex: 10
            }}
        >
            <div className={`
                relative overflow-hidden
                backdrop-blur-xl rounded-xl p-5
                border transition-all duration-300
                ${styles.bg} ${styles.border}
                group hover:bg-white/[0.05]
            `}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-8 h-8 rounded-lg flex-center border border-white/10 ${styles.iconColor}`}>
                        {styles.icon}
                    </div>
                    {node.level === 'essential' && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent-cyan px-2 py-0.5 border border-accent-cyan/30 rounded">Core</span>
                    )}
                </div>

                <h3 className={`text-sm font-bold leading-snug mb-3 tracking-tight ${styles.textColor}`}>
                    {node.title}
                </h3>

                <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${status === 'MASTERED' ? 'bg-white' : 'bg-accent-cyan'}`}
                            style={{ width: status === 'MASTERED' ? '100%' : status === 'LEARNING' ? '50%' : '5%' }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RoadmapNode;
