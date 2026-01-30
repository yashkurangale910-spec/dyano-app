import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bot,
    User,
    Plus,
    Search,
    Settings,
    Hash,
    Sparkles,
    Command,
    Loader2,
    MoreHorizontal
} from 'lucide-react';

export default function NexusChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Welcome to the Nexus. I am your neural assistant. How can I facilitate your learning today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll logic
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulated AI response delay
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                content: generateDummyResponse(input),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1500);
    };

    const generateDummyResponse = (query) => {
        const responses = [
            "Analyzing your request through the neural lattice... I've synthesized a solution that aligns with your current vector.",
            "That's a fascinating perspective. According to my current data streams, integrating that concept could accelerate your retention by 15%.",
            "Neural link stable. I've retrieved the relevant modules for your query. Shall we deep dive into the specifics?",
            "Processing... I've found a correlation between your last session and this topic. You're making significant progress in this knowledge domain.",
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#05010d] text-white font-sans overflow-hidden">
            {/* 1. ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* 2. SIDEBAR */}
            <aside className="hidden md:flex w-80 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl relative z-10">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">NEXUS AI</h1>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Protocol v4.0 Active</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-sm font-medium">
                        <Plus size={18} />
                        New Simulation
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <p className="px-3 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">Neural Fragments</p>
                    {[
                        "Quantum Physics Intro",
                        "React Architecture",
                        "Organic Chemistry Review",
                        "Latex Formatting Tips"
                    ].map((history, i) => (
                        <button key={i} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-left text-sm text-gray-400 hover:text-white transition-all group">
                            <Hash size={14} className="text-gray-600 group-hover:text-cyan-500" />
                            <span className="truncate">{history}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">YP</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate text-white">Guest Explorer</p>
                            <p className="text-[10px] text-gray-500 truncate lowercase">sync: online</p>
                        </div>
                        <Settings size={16} className="text-gray-500" />
                    </div>
                </div>
            </aside>

            {/* 3. MAIN CHAT AREA */}
            <main className="flex-1 flex flex-col relative z-20">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold tracking-tight">Current Trajectory: General Synthesis</h2>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                                Priority Level: Standard • <Sparkles size={10} className="text-cyan-500" />
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-white transition-all"><Search size={20} /></button>
                        <button className="p-2 text-gray-500 hover:text-white transition-all"><MoreHorizontal size={20} /></button>
                    </div>
                </header>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    }`}>
                                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>

                                <div className={`max-w-[80%] md:max-w-[70%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                    <div className={`
                                        p-4 md:p-5 rounded-[1.5rem] text-sm leading-relaxed border shadow-xl
                                        ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/10 border-purple-500/30 rounded-tr-none text-white'
                                            : 'bg-white/5 border-white/10 rounded-tl-none text-gray-200'
                                        }
                                    `}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest text-gray-600 font-bold px-4">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • NODE {idx.toString().padStart(3, '0')}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                                    <Loader2 size={20} className="animate-spin" />
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-[1.5rem] rounded-tl-none">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-cyan-500/70">Synthesizing</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 md:px-12 md:pb-10 pt-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            <form onSubmit={handleSend} className="relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Communicate with the Nexus engine..."
                                    rows={1}
                                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all rounded-3xl py-5 px-6 pr-32 text-sm text-white placeholder:text-gray-600 focus:outline-none resize-none shadow-2xl backdrop-blur-xl"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[10px] text-gray-500 font-mono">
                                        <Command size={10} />
                                        <span>Enter</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className={`
                                            p-3 rounded-2xl flex items-center justify-center transition-all
                                            ${!input.trim() || isLoading
                                                ? 'bg-gray-800 text-gray-600 grayscale cursor-not-allowed'
                                                : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black hover:scale-105 shadow-lg shadow-cyan-500/20'
                                            }
                                        `}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                            <p className="mt-3 text-[10px] text-center text-gray-600 uppercase tracking-widest font-bold">
                                Neural synthesis may produce artifacts. Verify critical data strings.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Custom CSS for Scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
