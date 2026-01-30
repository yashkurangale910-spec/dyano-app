import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Book, Map, FileText, X, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
    { id: 'quiz', title: 'Start Quiz', description: 'Initiate a new neural stream', icon: Zap, path: '/quiz' },
    { id: 'flashcards', title: 'Study Flashcards', description: 'Review neural clusters', icon: Book, path: '/flashcards' },
    { id: 'roadmap', title: 'View Roadmap', description: 'Navigate knowledge path', icon: Map, path: '/roadmap' },
    { id: 'pdf', title: 'PDF Lab', description: 'Extract document intelligence', icon: FileText, path: '/pdf' },
    { id: 'chatbot', title: 'Spark.E Tutor', description: '24/7 Vision-aware personal tutor', icon: Bot, path: '/chatbot' },
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const toggle = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', toggle);
        return () => window.removeEventListener('keydown', toggle);
    }, [toggle]);

    const filteredActions = ACTIONS.filter(action =>
        action.title.toLowerCase().includes(query.toLowerCase()) ||
        action.description.toLowerCase().includes(query.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Palette */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="relative w-full max-w-2xl bg-[#0a0118] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center gap-4">
                        <Search className="text-gray-500" size={20} />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-white text-lg placeholder:text-gray-700 focus:outline-none"
                        />
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-500 font-bold">
                            ESC
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-2">
                        {filteredActions.length > 0 ? (
                            filteredActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => { navigate(action.path); setIsOpen(false); }}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group text-left"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cosmic-cyan/10 group-hover:text-cosmic-cyan transition-colors">
                                        <action.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white mb-0.5">{action.title}</div>
                                        <div className="text-[11px] text-gray-500">{action.description}</div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-[10px] text-cosmic-cyan font-bold tracking-widest uppercase">Select</div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Search className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                <p className="text-gray-600">No results found for "{query}"</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-400">↑↓</span>
                                <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">Navigate</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-400">ENTER</span>
                                <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">Select</span>
                            </div>
                        </div>
                        <div className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
                            Dyano Command Interface v0.1
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
