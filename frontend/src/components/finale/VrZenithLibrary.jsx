import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const VrZenithLibrary = ({ onClose }) => {
    const containerRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 20; // -10 to 10 deg
            const y = (e.clientY / innerHeight - 0.5) * 20;
            setRotation({ x: -y, y: x });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    const monoliths = [
        { title: 'Frontend Mastery', color: '#06b6d4', height: 300 },
        { title: 'Backend Architecture', color: '#8b5cf6', height: 350 },
        { title: 'Cyber Security', color: '#ef4444', height: 200 },
        { title: 'AI/ML Systems', color: '#10b981', height: 150 },
        { title: 'Blockchain', color: '#f59e0b', height: 250 },
    ];

    return (
        <div className="fixed inset-0 z-[150] bg-black perspective-[1000px] overflow-hidden flex items-center justify-center">
            <div className="absolute top-4 right-4 z-50">
                <button onClick={onClose} className="text-gray-500 hover:text-white">EXIT SIMULATION</button>
            </div>

            {/* Stars */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />

            {/* 3D Scene */}
            <motion.div
                className="relative w-full h-full transform-style-3d"
                animate={{
                    rotateX: rotation.x,
                    rotateY: rotation.y
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            >
                {/* Floor Grid */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] transform-style-3d origin-center"
                    style={{ transform: 'rotateX(90deg) translateZ(-200px)' }}
                />

                {/* Monoliths */}
                <div className="absolute top-1/2 left-1/2 transform-style-3d">
                    {monoliths.map((m, i) => {
                        const angle = (i / monoliths.length) * Math.PI * 2;
                        const radius = 400;
                        const x = Math.cos(angle) * radius;
                        const z = Math.sin(angle) * radius;

                        return (
                            <div
                                key={i}
                                className="absolute transform-style-3d"
                                style={{
                                    transform: `translate3d(${x}px, -${m.height / 2}px, ${z}px) rotateY(${-angle + Math.PI / 2}rad)`
                                }}
                            >
                                <div
                                    className="w-40 bg-black/80 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-shadow cursor-pointer group"
                                    style={{
                                        height: `${m.height}px`,
                                        borderColor: m.color,
                                        boxShadow: `0 0 20px ${m.color}20`
                                    }}
                                >
                                    <div className="text-2xl font-black text-white/10 group-hover:text-white/80 transition-colors uppercase break-words w-full">
                                        {m.title}
                                    </div>
                                    <div className="absolute bottom-4 text-[10px] items-center gap-1 flex text-gray-400 font-mono">
                                        <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                                        ARCHIVED
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
                <h1 className="text-4xl font-display font-black text-white tracking-[1em] uppercase opacity-20">Zenith Library</h1>
            </div>
        </div>
    );
};

export default VrZenithLibrary;
