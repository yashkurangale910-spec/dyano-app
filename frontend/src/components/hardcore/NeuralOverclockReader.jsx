import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, RotateCcw } from 'lucide-react';

const NeuralOverclockReader = ({ text, initialWpm = 500 }) => {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [wpm, setWpm] = useState(initialWpm);

    useEffect(() => {
        if (text) {
            setWords(text.split(/\s+/));
            setIndex(0);
        }
    }, [text]);

    useEffect(() => {
        if (!isPlaying || index >= words.length) {
            if (index >= words.length) setIsPlaying(false);
            return;
        }

        const intervalMs = 60000 / wpm; // 60 sec / words per min
        const timer = setTimeout(() => {
            setIndex(prev => prev + 1);
        }, intervalMs);

        return () => clearTimeout(timer);
    }, [isPlaying, index, wpm, words.length]);

    // Focus Point Optimization (Red letter in center)
    const currentWord = words[index] || "";
    const pivot = Math.floor(currentWord.length / 2);
    const leftPart = currentWord.slice(0, pivot);
    const centerChar = currentWord.slice(pivot, pivot + 1);
    const rightPart = currentWord.slice(pivot + 1);

    return (
        <div className="w-full max-w-md bg-black border border-white/10 rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl">
            <div className="text-xs font-black uppercase text-cosmic-cyan tracking-widest">
                Neural Overclock :: {wpm} WPM
            </div>

            {/* Display Box */}
            <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center text-4xl font-mono relative overflow-hidden ring-1 ring-white/10">
                {/* Guides */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500/20 -translate-x-1/2" />
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500/20 -translate-y-1/2" />

                {/* Word */}
                <div className="z-10 bg-black/50 px-4 py-2 rounded">
                    <span className="text-gray-300">{leftPart}</span>
                    <span className="text-red-500 font-bold">{centerChar}</span>
                    <span className="text-gray-300">{rightPart}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-cosmic-cyan transition-all duration-100"
                    style={{ width: `${(index / words.length) * 100}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button onClick={() => setIndex(0)} className="p-2 text-gray-500 hover:text-white"><RotateCcw size={20} /></button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                >
                    {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                </button>
                <button
                    onClick={() => setWpm(prev => prev + 100)}
                    className="p-2 text-gray-500 hover:text-white flex flex-col items-center"
                    title="Boost Speed"
                >
                    <FastForward size={20} />
                    <span className="text-[10px] font-bold">+100</span>
                </button>
            </div>
        </div>
    );
};

export default NeuralOverclockReader;
