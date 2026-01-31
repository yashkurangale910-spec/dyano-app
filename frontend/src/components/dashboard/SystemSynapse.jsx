import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Wifi, Shield, Lock, Terminal } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, unit, color, graphData }) => (
    <div className="bg-black/40 border border-white/5 rounded-xl p-4 relative overflow-hidden group hover:border-white/10 transition-all">
        <div className={`absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity text-${color}-400`}>
            <Icon size={48} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={`text-${color}-400`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
            </div>
            <div className="text-2xl font-display font-black text-white">
                {value} <span className="text-xs text-gray-600 font-bold">{unit}</span>
            </div>
        </div>

        {/* Micro-Graph */}
        <div className="mt-4 h-8 flex items-end gap-[2px] opacity-50">
            {graphData.map((d, i) => (
                <div
                    key={i}
                    className={`w-1 rounded-t-sm bg-${color}-500/50 transition-all duration-300`}
                    style={{ height: `${d}%` }}
                />
            ))}
        </div>
    </div>
);

const SystemSynapse = ({ isOpen, onClose }) => {
    const [metrics, setMetrics] = useState({
        heapUsed: 0,
        heapTotal: 0,
        eventLoopLag: 0,
        fps: 60,
        throughput: 0
    });

    // Simulate historical data for graphs
    const [history, setHistory] = useState({
        cpu: Array(20).fill(10),
        mem: Array(20).fill(20),
        net: Array(20).fill(5),
        lag: Array(20).fill(0)
    });

    const frameRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    useEffect(() => {
        if (!isOpen) return;

        const updateMetrics = () => {
            const now = performance.now();
            const delta = now - lastTimeRef.current;

            // Simulated Metrics (since actual JS heap API is restricted in standard browsers)
            // But we can approximate based on object counts or just "Simulate" the vibe
            const mockHeap = 45 + Math.random() * 5;
            const mockLag = Math.random() * 2;
            const mockThroughput = Math.random() * 100; // KB/s

            setMetrics(prev => ({
                heapUsed: Math.round(mockHeap),
                heapTotal: 128, // MB
                eventLoopLag: mockLag.toFixed(2),
                fps: Math.round(1000 / delta),
                throughput: Math.round(mockThroughput)
            }));

            // Shift graphs
            setHistory(prev => ({
                cpu: [...prev.cpu.slice(1), Math.random() * 40 + 10], // Idle-ish
                mem: [...prev.mem.slice(1), mockHeap],
                net: [...prev.net.slice(1), mockThroughput / 5],
                lag: [...prev.lag.slice(1), mockLag * 10]
            }));

            lastTimeRef.current = now;
            frameRef.current = requestAnimationFrame(updateMetrics);
        };

        frameRef.current = requestAnimationFrame(updateMetrics);
        return () => cancelAnimationFrame(frameRef.current);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[100] w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-cosmic-cyan" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">System Synapse <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded ml-2">KERNEL MODE</span></h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors">
                    <Shield size={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <MetricCard
                    icon={Cpu}
                    label="Event Loop"
                    value={metrics.eventLoopLag}
                    unit="ms"
                    color="green"
                    graphData={history.lag}
                />
                <MetricCard
                    icon={HardDrive}
                    label="Heap Check"
                    value={metrics.heapUsed}
                    unit="MB"
                    color="blue"
                    graphData={history.mem}
                />
                <MetricCard
                    icon={Activity}
                    label="Render Core"
                    value={metrics.fps}
                    unit="FPS"
                    color="purple"
                    graphData={history.cpu} // Inverting FPS slightly for visual correlation
                />
                <MetricCard
                    icon={Wifi}
                    label="Neural Net"
                    value={metrics.throughput}
                    unit="KB/s"
                    color="orange"
                    graphData={history.net}
                />
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase">
                    <span>WASM Engine: <span className="text-green-400">ONLINE</span></span>
                    <span>Encryption: <span className="text-purple-400">AES-GCM-256</span></span>
                </div>
                <div className="mt-2 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cosmic-cyan"
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default SystemSynapse;
