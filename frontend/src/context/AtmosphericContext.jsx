import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AtmosphericContext = createContext();

export const useAtmosphere = () => useContext(AtmosphericContext);

export function AtmosphericProvider({ children }) {
    const [intensity, setIntensity] = useState(1); // 1 = low, 2 = active, 3 = high-pulse
    const [statusText, setStatusText] = useState('Sync_Stable');

    const setProcessing = (isProcessing, text = 'Processing_Nodes') => {
        setIntensity(isProcessing ? 2 : 1);
        setStatusText(isProcessing ? text : 'Sync_Stable');
    };

    return (
        <AtmosphericContext.Provider value={{ intensity, setProcessing, statusText }}>
            <div className="relative min-h-screen bg-bg-main overflow-hidden">
                {/* Reactive Background Layers */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    {/* Primary Atmospheric Blur */}
                    <motion.div
                        animate={{
                            scale: intensity === 2 ? 1.1 : 1,
                            opacity: intensity === 2 ? 0.15 : 0.08,
                        }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-white blur-[180px] rounded-full"
                    />

                    {/* Secondary Reactive Pulse */}
                    <motion.div
                        animate={{
                            opacity: intensity === 2 ? [0.03, 0.08, 0.03] : 0.02,
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-slate-400 blur-[150px] rounded-full"
                    />

                    {/* Global Noise Layer - Reactive Grain */}
                    <motion.div
                        animate={{ opacity: intensity === 2 ? 0.04 : 0.02 }}
                        className="absolute inset-0 noise-layer pointer-events-none opacity-[0.02]"
                    />
                </div>

                {/* System Status HUD - Minimal */}
                <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-4 pointer-events-none hidden md:flex">
                    <div className="flex flex-col">
                        <span className="text-mono-data text-[8px] opacity-40">System_Status</span>
                        <motion.span
                            key={statusText}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-mono-data text-[9px] text-white/60 font-black"
                        >
                            {statusText}
                        </motion.span>
                    </div>
                    {intensity === 2 && (
                        <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                    )}
                </div>

                {/* App Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </AtmosphericContext.Provider>
    );
}
