import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Search } from 'lucide-react';

const ChromeCognitiveOverlay = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString();

            if (text && text.length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Position above the selection
                setCoords({
                    x: rect.left + (rect.width / 2),
                    y: rect.top - 10 + window.scrollY
                });
                setSelectedText(text);
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, []);

    const handleAction = (action) => {
        console.log(`Neural Action: ${action} -> "${selectedText}"`);
        setVisible(false);
        window.getSelection().removeAllRanges();
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    style={{
                        position: 'absolute',
                        left: coords.x,
                        top: coords.y,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 9999
                    }}
                    className="pointer-events-auto"
                >
                    <div className="bg-black/90 backdrop-blur-md border border-cosmic-cyan/50 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.3)] flex items-center p-1 gap-1">
                        <div className="w-6 h-6 rounded-full bg-cosmic-cyan/20 flex items-center justify-center">
                            <Brain size={12} className="text-cosmic-cyan animate-pulse" />
                        </div>

                        <div className="h-4 w-[1px] bg-white/20 mx-1" />

                        <button
                            onClick={() => handleAction('SEARCH')}
                            className="p-1.5 hover:bg-white/10 rounded-full text-white transition-colors tooltip"
                            title="Analyze in Roadmap"
                        >
                            <Search size={14} />
                        </button>

                        <button
                            onClick={() => handleAction('ADD')}
                            className="p-1.5 hover:bg-white/10 rounded-full text-white transition-colors"
                            title="Add to Flashcards"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    {/* Little arrow */}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/90 absolute left-1/2 -translate-x-1/2 bottom-[-5px]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChromeCognitiveOverlay;
