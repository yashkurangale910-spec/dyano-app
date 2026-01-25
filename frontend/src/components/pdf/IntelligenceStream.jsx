import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, User, Sparkles, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';

export default function IntelligenceStream({ messages, onSend, isProcessing }) {
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isProcessing) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-6 pr-4 mb-6 custom-scrollbar"
            >
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                    ${msg.role === 'ai' ? 'bg-cosmic-cyan/20 text-cosmic-cyan' :
                                        msg.role === 'system' ? 'bg-white/5 text-gray-500' :
                                            'bg-cosmic-pink/20 text-cosmic-pink'}
                                `}>
                                    {msg.role === 'ai' ? <Sparkles size={16} /> :
                                        msg.role === 'system' ? <Terminal size={16} /> :
                                            <User size={16} />}
                                </div>

                                <GlassCard className={`
                                    py-3 px-5 rounded-2xl
                                    ${msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-cosmic-deep/40'}
                                `}>
                                    {msg.role === 'system' && (
                                        <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block mb-1">
                                            System_Log //
                                        </span>
                                    )}
                                    <p className={`text-sm leading-relaxed ${msg.role === 'system' ? 'font-mono text-gray-500' : 'text-gray-300'}`}>
                                        {msg.content}
                                    </p>
                                </GlassCard>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isProcessing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-cosmic-cyan/10 flex items-center justify-center animate-pulse">
                            <Sparkles size={16} className="text-cosmic-cyan" />
                        </div>
                        <div className="flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="relative">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the intelligence..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-white focus:outline-none focus:border-cosmic-cyan transition-all"
                />
                <button
                    disabled={isProcessing || !input.trim()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-cosmic-cyan text-cosmic-void flex items-center justify-center disabled:opacity-20 transition-all hover:scale-105 active:scale-95"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
