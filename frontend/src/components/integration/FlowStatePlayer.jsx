import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Music } from 'lucide-react';

const FlowStatePlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(60); // Resting heart rate / Lo-Fi

    // Simulate cognitive load increasing BPM
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            // Random flux
            setBpm(prev => {
                const noise = Math.random() > 0.5 ? 1 : -1;
                return Math.min(140, Math.max(60, prev + noise));
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col gap-4 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-green-500/5 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />

            {/* Album Art / Visualizer */}
            <div className="h-32 w-full bg-black/50 rounded-lg overflow-hidden relative flex items-center justify-center border border-white/5">
                {isPlaying ? (
                    <div className="flex items-end justify-center gap-1 h-1/2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div
                                key={i}
                                className="w-2 bg-green-400/80 rounded-t-sm animate-music-bar"
                                style={{
                                    animationDuration: `${(150 / bpm) * (0.5 + Math.random())}s`,
                                    height: `${20 + Math.random() * 80}%`
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <Music size={32} className="text-gray-600" />
                )}
            </div>

            {/* Track Info */}
            <div>
                <h3 className="text-white font-bold text-sm truncate">Neural Focus - Theta Waves</h3>
                <p className="text-green-400 text-xs flex justify-between items-center">
                    <span>Spotify Linked</span>
                    <span className="font-mono">{Math.round(bpm)} BPM</span>
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button className="text-gray-400 hover:text-white"><SkipForward size={16} className="rotate-180" /></button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                >
                    {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-1" />}
                </button>
                <button className="text-gray-400 hover:text-white"><SkipForward size={16} /></button>
            </div>
        </div>
    );
};

export default FlowStatePlayer;
