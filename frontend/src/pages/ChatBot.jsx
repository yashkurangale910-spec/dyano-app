import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bot,
    User,
    Loader2,
    Plus,
    MessageSquare,
    LayoutGrid,
    History,
    MoreVertical,
    Settings,
    Image as ImageIcon,
    Mic,
    MicOff,
    Volume2,
    X,
    FileText,
    ChevronLeft,
    ChevronRight,
    Search,
    Share2,
    HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import BaseButton from '../components/ui/BaseButton';
import useTutor from '../hooks/useTutor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

const ChatBot = () => {
    const { t, i18n } = useTranslation();
    const {
        messages,
        setMessages,
        status,
        sendMessage,
        language,
        setLanguage,
        personality,
        setPersonality,
        depth,
        setDepth,
        selectedPdf,
        setSelectedPdf,
        pdfList,
        setPdfList
    } = useTutor();

    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, status]);

    const handleChatSubmit = async (e) => {
        if (e) e.preventDefault();
        if ((!input.trim() && !imagePreview) || status === 'loading') return;

        const currentInput = input;
        const currentImage = imageFile;

        // Add user message to state immediately
        const userMessage = {
            role: 'user',
            content: currentInput,
            imageUrl: imagePreview,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        setInput('');
        setImagePreview(null);
        setImageFile(null);

        try {
            const response = await sendMessage({
                message: currentInput,
                image: currentImage,
                personality,
                depth,
                language,
                documentId: selectedPdf,
                isDeepContext: !!selectedPdf
            });

            // Add assistant response to state
            if (response?.response) {
                const content = typeof response.response === 'string'
                    ? response.response
                    : response.response.response || 'No response received';

                const assistantMessage = {
                    role: 'assistant',
                    content,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            // Add error message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            }]);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatSubmit();
        }
    };

    return (
        <div className="flex h-screen bg-[#0f1117] text-slate-200 font-sans overflow-hidden">
            {/* SIDEBAR */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 0 }}
                className="bg-[#090a0d] border-r border-white/5 flex flex-col shrink-0 overflow-hidden"
            >
                <div className="p-4 flex items-center gap-3 border-b border-white/5 h-16 shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <Bot className="text-white" size={18} />
                    </div>
                    <span className="font-semibold text-white tracking-tight">AI Workspace</span>
                </div>

                <div className="p-3">
                    <button
                        onClick={() => setMessages([])}
                        className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg transition-colors font-medium text-sm"
                    >
                        <Plus size={16} />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-4">AI Configuration</div>

                    {/* Personality Selector */}
                    <div className="px-3 mb-6">
                        <label className="text-[10px] text-slate-500 font-bold mb-2 block uppercase tracking-tighter">Personality</label>
                        <select
                            value={personality}
                            onChange={(e) => setPersonality(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                        >
                            <option value="friendly">Friendly Assistant</option>
                            <option value="strict">Strict Coach</option>
                            <option value="socratic">Socratic Master</option>
                            <option value="professional">Pro Consultant</option>
                            <option value="creative">Neural Fusion</option>
                            <option value="robotic">Protocol Unit</option>
                            <option value="feynman">Richard Feynman</option>
                            <option value="lovelace">Ada Lovelace</option>
                            <option value="hacker">Cyber Hacker</option>
                            <option value="architect">System Architect</option>
                        </select>
                    </div>

                    {/* Depth Selector */}
                    <div className="px-3 mb-6">
                        <label className="text-[10px] text-slate-500 font-bold mb-2 block uppercase tracking-tighter">Response Depth</label>
                        <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                            {['brief', 'standard', 'detailed', 'comprehensive'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDepth(level)}
                                    className={`text-[10px] py-1.5 rounded transition-all capitalize font-medium ${depth === level
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-4">Recent</div>
                    {/* Placeholder History Items */}
                    {[1, 2, 3].map((item) => (
                        <button key={item} className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors text-left group">
                            <MessageSquare size={16} className="shrink-0" />
                            <span className="text-sm truncate">Previous Conversation {item}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5">
                    <button className="w-full flex items-center gap-3 p-2 text-slate-400 hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                            <User size={14} />
                        </div>
                        <div className="text-sm font-medium text-left flex-1">
                            <div className="text-white">User Account</div>
                            <div className="text-xs text-slate-500">Pro Plan</div>
                        </div>
                        <Settings size={16} />
                    </button>
                </div>
            </motion.aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col relative h-full">
                {/* HEADER */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f1117] shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-slate-200">General Assistant</div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-400 uppercase tracking-wide">
                                {personality}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                            <Search size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                            <HelpCircle size={18} />
                        </button>
                    </div>
                </header>

                {/* CHAT AREA */}
                <div className="flex-1 overflow-y-auto px-4 md:px-0 py-6 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 opacity-0 animate-in fade-in duration-700">
                                <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                                    <Bot size={32} />
                                </div>
                                <h1 className="text-2xl font-semibold text-white">How can I help you today?</h1>
                                <p className="text-slate-400 max-w-md">
                                    I am your advanced AI assistant powered by Groq. Ask me anything!
                                </p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                                            <Bot size={16} className="text-white" />
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                                        <div className={`px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap break-words ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-sm'
                                            }`}>
                                            {msg.imageUrl && (
                                                <img src={msg.imageUrl} alt="Uploaded" className="max-w-sm rounded-lg mb-3 border border-white/10" />
                                            )}
                                            {typeof msg.content === 'string'
                                                ? msg.content
                                                : msg.content?.text || ''}
                                        </div>
                                        {/* Status / Timestamp */}
                                        <div className="text-[10px] text-slate-500 font-medium px-1">
                                            {msg.role === 'assistant' ? 'Groq AI' : 'You'} • {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                                            <User size={14} className="text-slate-300" />
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                        {status === 'loading' && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                                    <Loader2 size={16} className="text-white animate-spin" />
                                </div>
                                <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
                                    <span className="text-sm text-slate-400 animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* INPUT AREA */}
                <div className="p-6 shrink-0 bg-[#0f1117]">
                    <div className="max-w-3xl mx-auto">
                        {imagePreview && (
                            <div className="mb-3 relative inline-block">
                                <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border border-white/10" />
                                <button
                                    onClick={() => {
                                        setImagePreview(null);
                                        setImageFile(null);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        <div className="relative bg-[#1e2129] border border-white/10 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-blue-600/50 focus-within:border-blue-500/50 transition-all">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message AI Assistant..."
                                className="w-full bg-transparent text-white placeholder:text-slate-500 px-4 py-4 min-h-[56px] max-h-48 focus:outline-none resize-none custom-scrollbar text-sm"
                                rows={1}
                            />
                            <div className="flex items-center justify-between px-3 pb-3 pt-1">
                                <div className="flex items-center gap-2">
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        title="Attach Image"
                                    >
                                        <ImageIcon size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <Mic size={18} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-slate-600 font-mono hidden md:inline-block">RETURN to send</span>
                                    <button
                                        onClick={handleChatSubmit}
                                        disabled={!input.trim() && !imagePreview}
                                        className={`p-2 rounded-lg transition-all ${input.trim() || imagePreview
                                            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'
                                            : 'bg-white/5 text-slate-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-slate-600 mt-3">
                            AI can make mistakes. Please verify important information.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatBot;
