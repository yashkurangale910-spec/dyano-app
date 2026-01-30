
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({ children, text, position = 'bottom' }) {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
        left: 'right-full top-1/2 -translate-y-1/2 mr-3',
        right: 'left-full top-1/2 -translate-y-1/2 ml-3'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className={`absolute z-[100] whitespace-nowrap ${positions[position]}`}
                    >
                        <div className="bg-[#0f0326]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-2xl shadow-black/50">
                            <span className="text-[10px] font-mono font-bold tracking-widest text-cosmic-cyan uppercase">
                                {text}
                            </span>
                            {/* Little Arrow */}
                            <div className={`absolute w-2 h-2 bg-[#0f0326] border-r border-b border-white/10 rotate-45 
                                ${position === 'top' ? 'left-1/2 -translate-x-1/2 -bottom-1' : ''}
                                ${position === 'bottom' ? 'left-1/2 -translate-x-1/2 -top-1 border-l border-t border-r-0 border-b-0' : ''}
                            `} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
