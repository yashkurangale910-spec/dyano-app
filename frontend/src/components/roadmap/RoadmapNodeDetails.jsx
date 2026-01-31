import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Lock, BookOpen, Clock, ArrowRight, Code, PlayCircle, FileText, Gamepad2, ExternalLink, Layout, Save, PenTool } from 'lucide-react';

const RoadmapNodeDetails = ({ node, isOpen, onClose, onComplete, status = 'DEFAULT' }) => {
    const [localNotes, setLocalNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (node) {
            const savedNotes = localStorage.getItem(`dyano_notes_${node.id}`) || '';
            setLocalNotes(savedNotes);
        }
    }, [node]);

    const handleSaveNotes = () => {
        setIsSaving(true);
        localStorage.setItem(`dyano_notes_${node.id}`, localNotes);
        setTimeout(() => setIsSaving(false), 1000);
    };

    if (!node) return null;

    const isCompleted = status === 'MASTERED';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-0 bottom-0 w-full md:w-[480px] bg-[#050505]/95 border-l border-white/10 backdrop-blur-3xl z-50 flex flex-col shadow-[-20px_0_100px_rgba(0,0,0,0.8)]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-cyan/5 to-cosmic-purple/5 pointer-events-none" />

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${status === 'MASTERED' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                        status === 'LEARNING' ? 'bg-cosmic-cyan/10 border-cosmic-cyan/30 text-cosmic-cyan animate-pulse' :
                                            status === 'SKIPPED' ? 'bg-white/5 border-white/10 text-gray-500' :
                                                'bg-white/5 border-white/5 text-gray-400'
                                        }`}>
                                        {status === 'MASTERED' ? 'Module Mastered' :
                                            status === 'LEARNING' ? 'Active Sync' :
                                                status === 'SKIPPED' ? 'Postponed' :
                                                    'Module Standby'}
                                    </span>
                                    {node.importance === 'essential' && (
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/10 border border-red-500/30 text-red-400">
                                            Core
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-3xl font-display font-black text-white leading-tight mb-2">
                                    {node.title}
                                </h2>
                                <p className="text-gray-400 font-light text-sm">
                                    Module ID: {node.id.split('-').pop().toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* Description & Time */}
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <BookOpen size={14} /> Overview
                                    </h3>
                                    {node.timeEstimate && (
                                        <div className="flex items-center gap-2 text-cosmic-cyan text-xs font-bold bg-cosmic-cyan/10 px-3 py-1 rounded-full border border-cosmic-cyan/20">
                                            <Clock size={12} />
                                            {node.timeEstimate}
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-300 leading-relaxed font-light">
                                    {node.description || "Mastering this concept is crucial for your development journey. Understanding the core principles will enable you to build more robust and scalable applications."}
                                </p>
                            </div>

                            {/* Memory Bank (NEW) */}
                            <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <PenTool size={14} /> Memory Bank
                                    </h3>
                                    <button
                                        onClick={handleSaveNotes}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isSaving ? 'text-green-400' : 'text-cosmic-cyan hover:text-white'}`}
                                    >
                                        {isSaving ? <><CheckCircle size={12} /> Synced</> : <><Save size={12} /> Sync Notes</>}
                                    </button>
                                </div>
                                <textarea
                                    value={localNotes}
                                    onChange={(e) => setLocalNotes(e.target.value)}
                                    placeholder="Neural impressions for this module..."
                                    className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-gray-200 focus:border-cosmic-cyan/30 focus:outline-none transition-all placeholder:text-gray-700 resize-none"
                                />
                            </div>

                            {/* Recommended Project (NEW) */}
                            {node.project && (
                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                        <Code className="text-white" size={48} />
                                    </div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Code size={14} /> Recommended Project
                                    </h3>
                                    <h4 className="text-lg font-bold text-white mb-2">{node.project.title}</h4>
                                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{node.project.description}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${node.project.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                            node.project.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                                'border-red-500/30 text-red-400 bg-red-500/10'
                                            }`}>
                                            {node.project.difficulty}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Learning Resources (NEW) */}
                            {node.resources && node.resources.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Layout size={14} /> Learning Resources
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {node.resources.map((res, idx) => (
                                            <a
                                                key={idx}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                                                    {res.type === 'video' ? <PlayCircle size={14} /> :
                                                        res.type === 'game' ? <Gamepad2 size={14} /> :
                                                            <FileText size={14} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{res.label}</div>
                                                    <div className="text-[10px] text-gray-600 uppercase tracking-wider">{res.type}</div>
                                                </div>
                                                <ExternalLink size={12} className="text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Subtopics */}
                            {node.subtopics && node.subtopics.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ArrowRight size={14} /> Key Concepts
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {node.subtopics.map((topic, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cosmic-cyan/50 group-hover:bg-cosmic-cyan group-hover:shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all" />
                                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{topic}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Area */}
                            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Clock size={14} /> Progress Status
                                </h3>

                                <button
                                    onClick={() => onComplete(node.id)}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300 group ${isCompleted
                                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30'
                                        : 'bg-cosmic-cyan text-black hover:bg-cosmic-cyan/90 shadow-glow-cyan'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <>
                                            <CheckCircle size={16} /> Module Completed
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-4 h-4 rounded-full border-2 border-current opacity-40 group-hover:opacity-100 transition-opacity" />
                                            Mark as Complete
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-wider">
                                    {isCompleted ? 'Great job! Keep moving forward.' : 'Marking complete updates your global stats.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoadmapNodeDetails;
