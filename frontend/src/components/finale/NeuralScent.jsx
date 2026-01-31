import React, { useState } from 'react';
import { Wind, Wifi, Power } from 'lucide-react';

const NeuralScent = () => {
    const [activeScent, setActiveScent] = useState(null);
    const [intensity, setIntensity] = useState(50);
    const [connected, setConnected] = useState(false);

    const scents = [
        { id: 'OZONE', label: 'High Voltage Ozone', color: 'text-blue-400' },
        { id: 'SILICON', label: 'Burning Silicon', color: 'text-orange-400' },
        { id: 'PETRICHOR', label: 'Digital Petrichor', color: 'text-green-400' },
        { id: 'COFFEE', label: 'Dark Roast #000000', color: 'text-amber-700' }
    ];

    const connect = () => {
        setConnected(true);
        // Simulate hardware handshake
        setTimeout(() => setActiveScent('OZONE'), 1000);
    };

    return (
        <div className="p-4 bg-black/80 border border-gray-800 rounded-xl max-w-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Wind size={18} className="text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-200">Olfactory Synth v1.0</h3>
                </div>
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
            </div>

            {!connected ? (
                <button
                    onClick={connect}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs font-mono text-gray-300 flex items-center justify-center gap-2 transition-colors"
                >
                    <Wifi size={14} /> CONNECT HARDWARE
                </button>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        {scents.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveScent(s.id)}
                                className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-all flex justify-between items-center ${activeScent === s.id ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 opacity-50'}`}
                            >
                                <span className={activeScent === s.id ? s.color : 'text-gray-500'}>{s.label}</span>
                                {activeScent === s.id && <div className="animate-pulse w-1.5 h-1.5 rounded-full bg-current" />}
                            </button>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-gray-800">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>INTENSITY</span>
                            <span>{intensity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={intensity}
                            onChange={(e) => setIntensity(e.target.value)}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeuralScent;
