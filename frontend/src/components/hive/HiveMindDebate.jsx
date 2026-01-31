import React, { useState, useEffect, useRef } from 'react';
import { AiService } from '../../utils/AiService';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Code, Terminal, Zap, Shield } from 'lucide-react';

const HiveMindDebate = ({ topic, isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [isDebating, setIsDebating] = useState(false);
    const [turn, setTurn] = useState(0);
    const scrollRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');

    const startDebate = async () => {
        setIsDebating(true);
        setMessages([]);

        // Round 1: Architect opens
        await processTurn('architect', `Analyze this topic/code from a clean code perspective: ${topic}`);
    };

    const processTurn = async (persona, prompt) => {
        const response = await AiService.summonHive(persona, prompt, user.token);

        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: persona,
            text: response
        }]);

        // Auto-trigger next turn if < 4 turns
        setTurn(prev => {
            const nextTurn = prev + 1;
            if (nextTurn < 4) {
                setTimeout(() => {
                    const nextPersona = persona === 'architect' ? 'hacker' : 'architect';
                    // The next persona responds to the previous argument
                    const rebuttalPrompt = `Respond to the previous point. Disagree with it. Your opponent said: "${response.substring(0, 100)}..."`;
                    processTurn(nextPersona, rebuttalPrompt);
                }, 2000); // Dramatic pause
            } else {
                setIsDebating(false);
                setTurn(0);
            }
            return nextTurn;
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
            <div className="w-full max-w-4xl h-[80vh] bg-cosmic-void border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cosmic-cyan to-cosmic-purple uppercase tracking-widest">
                            Hive Mind Consensus
                        </h2>
                        <p className="text-gray-400 text-sm font-mono mt-1">Simulating neuro-divergent optimization paths...</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                        <AlertTriangle className="text-red-500" />
                    </button>
                </div>

                {/* Debate Arena */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                    {messages.length === 0 && !isDebating && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                            <Terminal size={48} className="mb-4 text-cosmic-cyan" />
                            <p>Ready to simulate logic paths for: <br /><span className="text-white font-bold">"{topic}"</span></p>
                            <button
                                onClick={startDebate}
                                className="mt-6 px-8 py-3 bg-cosmic-purple hover:bg-cosmic-pink text-white font-bold rounded-lg transition-all"
                            >
                                INITIATE DEBATE
                            </button>
                        </div>
                    )}

                    <AnimatePresence>
                        {messages.map(msg => (
                            <motion.div
                                key={msg.id}
                                initial={{ x: msg.sender === 'architect' ? -50 : 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className={`flex ${msg.sender === 'architect' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[70%] p-6 rounded-2xl relative border ${msg.sender === 'architect'
                                        ? 'bg-blue-900/20 border-blue-500/30 text-blue-100 rounded-tl-none'
                                        : 'bg-red-900/20 border-red-500/30 text-red-100 rounded-tr-none'
                                    }`}>
                                    <div className="absolute -top-3 left-6 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black border border-white/10 flex items-center gap-2">
                                        {msg.sender === 'architect' ? <Shield size={10} className="text-blue-400" /> : <Zap size={10} className="text-red-400" />}
                                        {msg.sender === 'architect' ? 'The Architect' : 'The Hacker'}
                                    </div>
                                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                        {JSON.parse(msg.text).response || msg.text}
                                        {/* Handle both JSON string response or raw text */}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isDebating && (
                        <div className="text-center text-xs font-mono text-cosmic-cyan animate-pulse">
                            &lt; NEURAL SYNC IN PROGRESS... /&gt;
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default HiveMindDebate;
