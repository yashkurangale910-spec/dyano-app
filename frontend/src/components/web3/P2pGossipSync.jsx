import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Share2 } from 'lucide-react';

const P2pGossipSync = () => {
    const [peers, setPeers] = useState([]);
    const canvasRef = useRef(null);

    // Simulate Peer Discovery
    useEffect(() => {
        const interval = setInterval(() => {
            setPeers(prev => {
                if (prev.length > 8) return prev; // Max 8 peers
                return [...prev, {
                    id: Math.random().toString(36).substr(2, 5),
                    x: Math.random() * 200,
                    y: Math.random() * 100,
                    status: 'SYNCING'
                }];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-black/40 border border-white/5 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Share2 size={16} className="text-cosmic-pink" />
                    <span className="text-xs font-bold text-gray-300">Swarm Sync</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {peers.length} PEERS
                </div>
            </div>

            <div className="h-32 bg-black/50 rounded-lg relative border border-white/5 overflow-hidden">
                {/* Me Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] relative">
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                    </div>
                </div>

                {/* Peers */}
                {peers.map((peer, i) => (
                    <motion.div
                        key={peer.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute w-2 h-2 bg-cosmic-pink rounded-full shadow-[0_0_10px_#d946ef]"
                        style={{
                            top: `${peer.y}%`,
                            left: `${peer.x}%`
                        }}
                    >
                        {/* Simulation Link Line to Center */}
                        <svg className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible">
                            <line
                                x1="100" y1="100"
                                x2={100 + (100 - peer.x * 2)} // Rough calc to point to center (50%) from peer pos
                                y2={100 + (50 - peer.y * 2)}
                                stroke="rgba(217, 70, 239, 0.2)"
                                strokeWidth="1"
                            />
                        </svg>
                    </motion.div>
                ))}
            </div>

            <p className="text-[10px] text-center mt-2 text-gray-500 font-mono">
                Running GossipSub Protocol v1.1
            </p>
        </div>
    );
};

export default P2pGossipSync;
