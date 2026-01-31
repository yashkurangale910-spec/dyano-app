import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CheckCircle,
    BookOpen,
    Clock,
    ArrowRight,
    PlayCircle,
    FileText,
    ExternalLink,
    Code,
    Gamepad2,
    Layout,
    Zap,
    PenTool,
    Save,
    Lock,
    Shield
} from 'lucide-react';
import { MemoryDecayService } from '../../utils/MemoryDecayService';
import { EncryptionService } from '../../utils/EncryptionService';
import axios from 'axios';
import { crdtService } from '../../utils/CRDTService';
import { FallacyService } from '../../utils/FallacyService';
import { CohortPanel } from './CohortPanel';

const RoadmapNodeDetails = ({ node, isOpen, onClose, onComplete, status = 'DEFAULT', allNodes = [], nodeProgress = {} }) => {
    // State
    const [localNotes, setLocalNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isOverclocking, setIsOverclocking] = useState(false);
    const [isExtinct, setIsExtinct] = useState(false);
    const [retention, setRetention] = useState(1.0);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [encryptionKey, setEncryptionKey] = useState(false); // Flag if unlocked
    const [analyzingFallacies, setAnalyzingFallacies] = useState(false);
    const [fallacyAnalysis, setFallacyAnalysis] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [ghostCursors, setGhostCursors] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

    useEffect(() => {
        if (node) {
            // CRDT: Connect to the hive
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            crdtService.connect('global-mind-hive', user.username || 'Anonymous');

            // CRDT: Listen for cursors
            crdtService.onCursorUpdate((others) => {
                setGhostCursors(others);
            });

            // Initial load strategy: Check CRDT first, then local storage
            const remoteNote = crdtService.getNote(node.id);
            const savedNotes = localStorage.getItem(`dyano_notes_${node.id}`) || '';

            if (remoteNote && remoteNote.content) {
                setLocalNotes(remoteNote.content);
            } else {
                setLocalNotes(savedNotes);
            }

            // Check encryption
            const currentNotes = remoteNote?.content || savedNotes;
            if (currentNotes.length > 20 && !currentNotes.includes(' ') && currentNotes.endsWith('=')) {
                setIsEncrypted(true);
            } else {
                setIsEncrypted(false);
            }

            // Calc retention
            if (nodeProgress && nodeProgress.status === 'MASTERED') {
                const rData = MemoryDecayService.calculateRetention(node.id, nodeProgress);
                setRetention(rData.retention);
                setIsExtinct(rData.isExtinct);
            } else {
                setRetention(1.0);
                setIsExtinct(false);
            }

            // Mock Quantum Predictions (Phase 10)
            if (status === 'MASTERED') {
                setPredictions([
                    { id: 1, title: 'Next Optimal Node', probability: 0.98, reason: 'High conceptual overlap' },
                    { id: 2, title: 'Potential Barrier', probability: 0.85, reason: 'Requires recursive depth' }
                ]);
            }
        }

        return () => {
            // Cleanup if needed
        };

    }, [node, nodeProgress, status]); // Added status/nodeProgress to dependency

    const handleMouseMove = (e) => {
        if (node && isOpen) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            crdtService.updateCursor(x, y, node.id);
        }
    };

    const handleEncrypt = async () => {
        const password = window.prompt("Set a secure password for this node's Memory Bank:");
        if (!password) return;

        try {
            const encrypted = await EncryptionService.encrypt(localNotes, password);
            setLocalNotes(encrypted);
            localStorage.setItem(`dyano_notes_${node.id}`, encrypted);
            crdtService.setNote(node.id, encrypted); // Sync encrypted
            setIsEncrypted(true);
            setEncryptionKey(true);
        } catch (err) {
            alert("Encryption failed.");
        }
    };

    const handleDecrypt = async () => {
        const password = window.prompt("Enter password to decrypt:");
        if (!password) return;

        try {
            const decrypted = await EncryptionService.decrypt(localNotes, password);
            setLocalNotes(decrypted);
            setIsEncrypted(false);
        } catch (err) {
            alert("Incorrect password or corrupted data.");
        }
    };

    const handleFallacyScan = async () => {
        if (isEncrypted) {
            alert("Decrypt notes before scanning for fallacies.");
            return;
        }

        setAnalyzingFallacies(true);
        try {
            // Local Hacker-Tier Analysis (No API latency)
            await new Promise(r => setTimeout(r, 500)); // Simulate "Thinking"
            const results = FallacyService.analyze(localNotes);

            setFallacyAnalysis({
                logicalScore: Math.max(0, 100 - (results.length * 15)),
                fallacies: results
            });

        } catch (err) {
            console.error(err);
            alert("Fallacy analysis failed.");
        } finally {
            setAnalyzingFallacies(false);
        }
    };

    const handleSaveNotes = () => {
        setIsSaving(true);
        localStorage.setItem(`dyano_notes_${node.id}`, localNotes);

        // CRDT: Broadcast
        if (!isEncrypted) {
            crdtService.setNote(node.id, localNotes);
        }

        setTimeout(() => setIsSaving(false), 1000);
    };

    // RSVP Speed Reader Component
    const SpeedReader = ({ text }) => {
        const words = text.split(/\s+/);
        const [index, setIndex] = useState(0);

        useEffect(() => {
            if (!isOverclocking) return;
            const interval = setInterval(() => {
                setIndex(prev => (prev + 1) % words.length);
            }, 120);
            return () => clearInterval(interval);
        }, [isOverclocking, words.length]);

        return (
            <div className="flex flex-col items-center justify-center h-24 bg-cosmic-cyan/10 rounded-2xl border border-cosmic-cyan/30 my-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-cosmic-cyan animate-pulse" />
                <div className="text-4xl font-display font-black text-white tracking-widest uppercase">
                    {words[index]}
                </div>
                <div className="text-[8px] text-cosmic-cyan font-black mt-2 tracking-[0.5em] animate-pulse">NEURAL_OVERCLOCK_ACTIVE</div>
            </div>
        );
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
                                    {/* Sub-Header Actions */}
                                    <button
                                        onClick={() => setIsOverclocking(!isOverclocking)}
                                        className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border transition-all flex items-center gap-2 ${isOverclocking ? 'bg-cosmic-cyan text-black border-cosmic-cyan shadow-glow-cyan' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'}`}
                                    >
                                        <Zap size={10} fill={isOverclocking ? "currentColor" : "none"} /> {isOverclocking ? 'Overclock_ON' : 'Overclock_OFF'}
                                    </button>
                                </div>

                                <h2 className="text-3xl font-display font-black text-white leading-tight mb-2">
                                    {node.title}
                                </h2>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-400 font-light text-sm">
                                        Module ID: {node.id.split('-').pop().toUpperCase()}
                                    </p>
                                    {isExtinct && (
                                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse flex items-center gap-2">
                                            <Zap size={12} /> MEMORY_EXTINCTION_ACTIVE
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* Neural Overclocking RSVP View */}
                            {isOverclocking && <SpeedReader text={node.description || "Mastering this concept is crucial for your development journey."} />}

                            {/* Description & Time */}
                            <div style={MemoryDecayService.getExtinctStyle(isExtinct)}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <BookOpen size={14} /> Overview
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mr-2">Retention: {Math.round(retention * 100)}%</div>
                                        {node.timeEstimate && (
                                            <div className="flex items-center gap-2 text-cosmic-cyan text-xs font-bold bg-cosmic-cyan/10 px-3 py-1 rounded-full border border-cosmic-cyan/20">
                                                <Clock size={12} />
                                                {node.timeEstimate}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-300 leading-relaxed font-light">
                                    {node.description || "Mastering this concept is crucial for your development journey. Understanding the core principles will enable you to build more robust and scalable applications."}
                                </p>
                            </div>

                            {/* Memory Bank */}
                            <div
                                className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 space-y-4 relative transition-all duration-300"
                                style={isExtinct ? { filter: 'blur(10px) brightness(0.2)', pointerEvents: 'none' } : isEncrypted ? { borderColor: '#8b5cf6', boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)' } : {}}
                                onMouseMove={handleMouseMove}
                            >
                                {/* Ghost Cursors Overlay */}
                                {ghostCursors.filter(c => c.cursor && c.cursor.nodeId === node.id).map((c, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-4 h-4 pointer-events-none z-50 transition-all duration-100 ease-linear"
                                        style={{
                                            left: c.cursor.x,
                                            top: c.cursor.y,
                                            color: c.user.color
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-lg">
                                            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.45.45 0 0 0 .32-.78l-12.42-12.43a.45.45 0 0 0-.83.28Z" />
                                        </svg>
                                        <div className="absolute left-4 top-4 bg-black/80 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider whitespace-nowrap border border-white/10" style={{ color: c.user.color }}>
                                            {c.user.name}
                                        </div>
                                    </div>
                                ))}

                                {isExtinct && (
                                    <div className="absolute inset-0 flex items-center justify-center z-[100] p-8 text-center bg-black/80 backdrop-blur-md rounded-2xl border border-red-900/50 pointer-events-auto">
                                        <div className="space-y-6">
                                            <div className="text-4xl animate-bounce">🔒</div>
                                            <div className="text-xs font-black text-red-500 uppercase tracking-[0.3em] animate-pulse">Neural Lock Active</div>
                                            <p className="text-[10px] text-gray-400 uppercase leading-relaxed max-w-xs mx-auto">
                                                Retention dropped to 0%. Access to this memory sector is blocked to prevent corruption.
                                            </p>
                                            <button
                                                onClick={() => alert("Simulating High-Intensity Recovery Quiz... Protocol Initiated.")}
                                                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] transition-all transform hover:scale-105"
                                            >
                                                Initiate Recovery Protocol
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <PenTool size={14} /> Memory Bank
                                        {isEncrypted && <Lock size={12} className="text-purple-400" />}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {/* Encryption Toggle */}
                                        <button
                                            onClick={isEncrypted ? handleDecrypt : handleEncrypt}
                                            className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${isEncrypted ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'}`}
                                            title={isEncrypted ? "Decrypt Notes" : "Encrypt Notes"}
                                        >
                                            <Lock size={10} /> {isEncrypted ? 'Locked' : 'Secure'}
                                        </button>

                                        {/* Fallacy Check */}
                                        <button
                                            onClick={handleFallacyScan}
                                            disabled={analyzingFallacies || isEncrypted}
                                            className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${analyzingFallacies ? 'animate-pulse text-yellow-400' : 'bg-white/5 text-gray-400 hover:text-yellow-400 border border-white/5'}`}
                                            title="Scan for Logical Fallacies"
                                        >
                                            <Zap size={10} /> {analyzingFallacies ? 'Analysing...' : 'Logic Check'}
                                        </button>

                                        <button
                                            onClick={handleSaveNotes}
                                            disabled={isEncrypted}
                                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isSaving ? 'text-green-400' : 'text-cosmic-cyan hover:text-white'} ${isEncrypted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isSaving ? <><CheckCircle size={12} /> Synced</> : <><Save size={12} /> Sync Notes</>}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={isEncrypted ? '•'.repeat(localNotes.length > 50 ? 50 : localNotes.length) + ' [ENCRYPTED DATA]' : localNotes}
                                    onChange={(e) => !isEncrypted && setLocalNotes(e.target.value)}
                                    readOnly={isEncrypted}
                                    placeholder={isEncrypted ? "Decryption required to view notes." : "Neural impressions for this module..."}
                                    className={`w-full h-32 bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-gray-200 focus:border-cosmic-cyan/30 focus:outline-none transition-all placeholder:text-gray-700 resize-none ${isEncrypted ? 'text-purple-400 font-mono tracking-widest select-none cursor-not-allowed' : ''}`}
                                />

                                {/* Fallacy Results */}
                                {fallacyAnalysis && (
                                    <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Logic Integrity Report</h4>
                                            <span className="text-xs font-bold text-white">{fallacyAnalysis.logicalScore}/100</span>
                                        </div>
                                        {fallacyAnalysis.fallacies.length > 0 ? (
                                            <div className="space-y-2">
                                                {fallacyAnalysis.fallacies.map((f, i) => (
                                                    <div key={i} className="text-xs text-gray-400">
                                                        <span className="text-yellow-400 font-bold">{f.name}:</span> {f.description}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-green-400">No logical fallacies detected. Solid reasoning.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Recommended Project */}
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

                            {/* Learning Resources */}
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

                            {/* Quantum Logic Predictions */}
                            {predictions.length > 0 && (
                                <div className="bg-cosmic-cyan/5 rounded-2xl p-6 border border-cosmic-cyan/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Zap className="text-cosmic-cyan" size={48} />
                                    </div>
                                    <h3 className="text-xs font-bold text-cosmic-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Zap size={14} className="animate-pulse" /> Quantum Logic Predictions
                                    </h3>
                                    <div className="space-y-3">
                                        {predictions.map((pred, idx) => (
                                            <div key={pred.id} className="flex flex-col gap-1 p-3 rounded-xl bg-black/40 border border-white/5 hover:border-cosmic-cyan/30 transition-all cursor-pointer group/item">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-white group-hover/item:text-cosmic-cyan transition-colors">{pred.title}</span>
                                                    <span className="text-[8px] font-black text-cosmic-cyan/60 uppercase tracking-tighter">Prob: {Math.round(pred.probability * 100)}%</span>
                                                </div>
                                                <div className="text-[10px] text-gray-600 uppercase tracking-widest">{pred.reason}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[8px] text-gray-700 mt-4 uppercase tracking-[0.3em] font-black">AI_PREDICTION_ENGINE_ACTIVE // SINGULARITY_MODE</p>
                                </div>
                            )}

                            {/* Parallel Learners */}
                            <CohortPanel activeNodeId={node.id} />

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
