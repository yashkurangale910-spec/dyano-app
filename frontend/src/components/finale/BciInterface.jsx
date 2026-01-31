import React, { useEffect, useRef, useState } from 'react';

const BciInterface = () => {
    const canvasRef = useRef(null);
    const [calibration, setCalibration] = useState(0);
    const [status, setStatus] = useState('CALIBRATING'); // CALIBRATING, SYNCED

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frameId;
        let t = 0;

        const render = () => {
            if (!canvas) return;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const waves = 5;
            for (let i = 0; i < waves; i++) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = i % 2 === 0 ? '#0fa' : '#0af';

                for (let x = 0; x < canvas.width; x++) {
                    const y = canvas.height / 2 +
                        Math.sin(x * 0.01 + t + i) * 50 * Math.sin(t * 0.5) +
                        (Math.random() - 0.5) * 5; // Noise

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            t += 0.05;
            frameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameId);
    }, []);

    useEffect(() => {
        if (status === 'CALIBRATING') {
            const interval = setInterval(() => {
                setCalibration(prev => {
                    if (prev >= 100) {
                        setStatus('SYNCED');
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 0.5;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <div className="fixed inset-0 z-[160] bg-black flex flex-col items-center justify-center">
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                className="absolute inset-0 opacity-50"
            />

            <div className="relative z-10 text-center space-y-8">
                <div>
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-tighter mb-2">
                        NEURAL UPLINK
                    </h1>
                    <p className="text-gray-400 font-mono uppercase tracking-[0.3em]">Direct Cortex Interface v2.0</p>
                </div>

                <div className="w-96 mx-auto">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>SIGNAL STRENGTH</span>
                        <span>{Math.round(calibration)}%</span>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                        <div
                            className="h-full bg-green-500 shadow-[0_0_10px_#22c55e] transition-all duration-100"
                            style={{ width: `${calibration}%` }}
                        />
                    </div>
                </div>

                {status === 'CALIBRATING' && (
                    <div className="text-lg text-white font-light bg-black/50 px-6 py-2 rounded-full border border-white/10 animate-pulse">
                        Please clear your mind...
                    </div>
                )}

                {status === 'SYNCED' && (
                    <button className="px-8 py-4 bg-white text-black font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_white]">
                        INITIATE DOWNLOAD
                    </button>
                )}
            </div>
        </div>
    );
};

export default BciInterface;
