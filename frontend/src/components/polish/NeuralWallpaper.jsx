import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const NeuralWallpaper = ({ onExit }) => {

    // Request Fullscreen on mount
    useEffect(() => {
        document.documentElement.requestFullscreen().catch(e => console.log(e));

        const handleKeys = (e) => {
            if (e.key === 'Escape') onExit();
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, []);

    return (
        <div className="fixed inset-0 z-[200] bg-black overflow-hidden flex items-center justify-center cursor-none">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#000000_100%)]" />

            {/* Central Neural Structure */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                className="w-[800px] h-[800px] border border-white/5 rounded-full relative"
            >
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                        transition={{ duration: 60 + i * 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 border border-white/5 rounded-full"
                        style={{ padding: `${i * 50}px` }}
                    />
                ))}

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-cosmic-cyan rounded-full blur-[50px] animate-pulse" />
                </div>
            </motion.div>

            {/* Minimal HUD */}
            <div className="absolute bottom-10 left-10 font-mono text-xs text-gray-600 tracking-[0.5em] uppercase">
                System Status :: Optimal
            </div>
            <div className="absolute bottom-10 right-10 font-mono text-xs text-gray-600">
                {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
};

export default NeuralWallpaper;
