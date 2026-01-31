import React, { useState, useEffect } from 'react';
import { Film, Download, Share2, Play } from 'lucide-react';

const CinematicExporter = ({ onClose }) => {
    const [step, setStep] = useState('IDLE'); // IDLE, RENDERING, READY
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState([]);

    const handleRender = () => {
        setStep('RENDERING');
        setProgress(0);
        setLog([]);

        const logs = [
            "Initializing Neural Encoder...",
            "Baking Geometry Cache...",
            "Raytracing Progress Nodes...",
            "Compiling Timeline...",
            "Applying Color Grading (LUT: Matrix)...",
            "Finalizing MP4 container..."
        ];

        let i = 0;
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 2, 100)); // 5 seconds total

            if (Math.random() > 0.8 && i < logs.length) {
                setLog(prev => [...prev, logs[i++]]);
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setProgress(100);
            setStep('READY');
        }, 5000);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm">
            <div className="w-full max-w-3xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">×</button>

                <div className="flex h-[500px]">
                    {/* Preview Area */}
                    <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen" />
                        <div className="relative z-10 text-center">
                            {step === 'IDLE' && (
                                <button
                                    onClick={handleRender}
                                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_white]"
                                >
                                    <Play fill="black" className="ml-1" size={32} />
                                </button>
                            )}
                            {step === 'RENDERING' && (
                                <div className="text-cosmic-cyan font-mono text-xs animate-pulse">
                                    RENDERING FRAME {Math.floor(progress * 12)} / 1200
                                </div>
                            )}
                            {step === 'READY' && (
                                <div className="w-20 h-20 bg-cosmic-cyan rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_#06b6d4]">
                                    <Play fill="black" className="ml-1" size={32} />
                                </div>
                            )}
                        </div>

                        {/* Film Grain/Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')]" />
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 bg-[#111] p-6 flex flex-col border-l border-white/5">
                        <div className="mb-8">
                            <h2 className="text-2xl font-display font-bold text-white mb-1">Cinematic Export</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">4K • 60FPS • HDR</p>
                        </div>

                        {step === 'IDLE' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded border border-white/5 text-sm text-gray-400">
                                    Generates a high-impact video summary of your learning journey suitable for LinkedIn or Twitter/X.
                                </div>
                                <button onClick={handleRender} className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200">
                                    START RENDER
                                </button>
                            </div>
                        )}

                        {step === 'RENDERING' && (
                            <div className="flex-1 flex flex-col">
                                <div className="space-y-1 mb-4 font-mono text-[10px] text-gray-400">
                                    {log.map((l, i) => <div key={i}>{l}</div>)}
                                </div>
                                <div className="mt-auto">
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-cosmic-cyan transition-all duration-100" style={{ width: `${progress}%` }} />
                                    </div>
                                    <div className="text-right text-xs text-white uppercase">{Math.round(progress)}%</div>
                                </div>
                            </div>
                        )}

                        {step === 'READY' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm font-bold text-center">
                                    RENDER COMPLETE
                                </div>
                                <button className="w-full py-3 bg-cosmic-cyan text-black font-bold rounded hover:bg-cyan-400 flex items-center justify-center gap-2">
                                    <Download size={18} /> DOWNLOAD MP4
                                </button>
                                <button className="w-full py-3 bg-white/10 text-white font-bold rounded hover:bg-white/20 flex items-center justify-center gap-2">
                                    <Share2 size={18} /> SHARE
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CinematicExporter;
