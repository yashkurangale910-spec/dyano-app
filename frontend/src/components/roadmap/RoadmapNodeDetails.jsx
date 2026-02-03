import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CheckCircle,
    BookOpen,
    Clock,
    Layout,
    Code,
    ExternalLink,
    PlayCircle,
    FileText,
    Terminal
} from 'lucide-react';
import BaseButton from '../ui/BaseButton';

const RoadmapNodeDetails = ({ node, isOpen, onClose, onComplete, status = 'DEFAULT' }) => {
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-bg-surface border-l border-white/10 z-[301] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/[0.05]">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex-center text-accent-cyan">
                                    <Terminal size={20} />
                                </div>
                                <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan">Module Specifics</div>
                                <h1 className="text-3xl font-black text-white tracking-tighter leading-tight">{node.title}</h1>
                                <div className="flex items-center gap-4 pt-2">
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                                        <Clock size={12} /> {node.timeEstimate || '2-4 Hours'}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${status === 'MASTERED' ? 'bg-white text-black' : 'bg-white/[0.03] text-white/30 border border-white/10'}`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10">

                            {/* Description */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                                    <BookOpen size={14} /> Overview
                                </h3>
                                <p className="text-sm text-white/60 leading-relaxed font-light">
                                    {node.description || "Synthesizing this module is essential for achieving the next trajectory level. Focus on core architectural patterns and implementational details."}
                                </p>
                            </section>

                            {/* Resources */}
                            {node.resources && node.resources.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                                        <Layout size={14} /> Knowledge Nodes
                                    </h3>
                                    <div className="grid gap-2">
                                        {node.resources.map((res, i) => (
                                            <a
                                                key={i}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-white/30 group-hover:text-white transition-colors">
                                                        {res.type === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                                    </div>
                                                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{res.label}</span>
                                                </div>
                                                <ExternalLink size={14} className="text-white/30 opacity-0 group-hover:opacity-100 transition-all" />
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Key Concepts */}
                            {node.subtopics && node.subtopics.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                                        <Code size={14} /> Synaptic Anchors
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {node.subtopics.map((topic, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] font-bold text-white/60">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 border-t border-white/[0.05] bg-bg-surface-light">
                            <BaseButton
                                onClick={() => onComplete(node.id)}
                                variant={isCompleted ? 'secondary' : 'primary'}
                                className="w-full py-6 uppercase tracking-widest text-[10px] font-black"
                            >
                                {isCompleted ? (
                                    <span className="flex items-center gap-2"><CheckCircle size={14} /> Module Synchronized</span>
                                ) : (
                                    "Commit to Memory"
                                )}
                            </BaseButton>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoadmapNodeDetails;
