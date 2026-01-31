import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, Minimize } from 'lucide-react';

const IsolationMode = ({ children, onExit }) => {
    const [isIsolated, setIsIsolated] = useState(false);
    const [penalty, setPenalty] = useState(false);

    const activateIsolation = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsIsolated(true);
            setPenalty(false);
        } catch (e) {
            console.error("Fullscreen blocked:", e);
        }
    };

    const handleExit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsIsolated(false);
        onExit && onExit();
    };

    // Listen for "Alt-Tab" or Escape (Fullscreen Exit)
    useEffect(() => {
        const handleChange = () => {
            if (!document.fullscreenElement && isIsolated) {
                // User broke isolation!
                setPenalty(true);
                setIsIsolated(false);
            }
        };

        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, [isIsolated]);

    if (penalty) {
        return (
            <div className="fixed inset-0 z-[200] bg-red-950 flex flex-col items-center justify-center text-center p-8">
                <AlertTriangle size={80} className="text-red-500 mb-6 animate-pulse" />
                <h1 className="text-5xl font-black text-red-500 uppercase tracking-tighter mb-4">FOCUS BROKEN</h1>
                <p className="text-red-300 text-xl font-mono mb-8">
                    Isolation Protocol Violated.<br />
                    XP Penalty Applied.
                </p>
                <button
                    onClick={handleExit}
                    className="px-8 py-3 bg-red-900/50 border border-red-500 text-red-300 rounded hover:bg-red-900 transition-colors"
                >
                    ACCEPT PENALTY
                </button>
            </div>
        );
    }

    if (!isIsolated) {
        return (
            <button
                onClick={activateIsolation}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-gray-700 text-gray-300 rounded hover:bg-black/60 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
                <Lock size={14} /> Enter Isolation Mode
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[150] bg-[#050505] overflow-auto">
            <div className="absolute top-4 right-4 z-[160]">
                <button
                    onClick={handleExit}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"
                >
                    <Minimize size={20} />
                </button>
            </div>
            <div className="max-w-4xl mx-auto min-h-screen py-10 px-4">
                <div className="mb-8 text-center">
                    <span className="text-green-500 font-mono text-xs border border-green-500/30 px-2 py-1 rounded">ISOLATION ACTIVE</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default IsolationMode;
