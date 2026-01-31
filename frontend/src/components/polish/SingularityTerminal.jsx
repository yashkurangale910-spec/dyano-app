import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const SingularityTerminal = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState([
        { type: 'info', text: 'Welcome to Singularity OS v0.9.9' },
        { type: 'info', text: 'Type "help" for a list of commands.' }
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => {
        if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            setHistory(prev => [...prev, { type: 'user', text: `> ${cmd}` }]);
            processCommand(cmd);
            setInput('');
        }
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            onClose();
        }
    };

    const processCommand = (cmd) => {
        const lower = cmd.toLowerCase();
        let response = { type: 'system', text: `Command not found: ${cmd}` };

        if (lower === 'help') {
            response = { type: 'system', text: 'Available commands: help, clear, status, predict, override, exit' };
        } else if (lower === 'clear') {
            setHistory([]);
            return;
        } else if (lower === 'status') {
            response = { type: 'success', text: 'SYSTEM OPTIMAL. CORE TEMP: 42°C. NEURAL LINK: ACTIVE.' };
        } else if (lower === 'predict') {
            response = { type: 'warn', text: 'Calculating trajectory... 98% Probability of Mastering "GraphQL" next.' };
        } else if (lower === 'override') {
            response = { type: 'error', text: 'ACCESS DENIED. ADMIN PRIVILEGES REQUIRED.' };
        } else if (lower === 'exit') {
            onClose();
            return;
        } else if (lower === 'sudo override') {
            response = { type: 'success', text: 'ACCESS GRANTED. GOD MODE ENABLED.' };
        }

        setTimeout(() => {
            setHistory(prev => [...prev, response]);
        }, 200);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 right-0 h-1/2 bg-black/95 border-b-2 border-green-500 shadow-2xl z-[9999] font-mono text-sm p-4 overflow-hidden flex flex-col backdrop-blur-md">
            {/* CRT Lines */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

            <div className="flex-1 overflow-auto space-y-1 pb-4">
                {history.map((line, i) => (
                    <div key={i} className={`${line.type === 'user' ? 'text-white' :
                            line.type === 'error' ? 'text-red-500' :
                                line.type === 'warn' ? 'text-yellow-500' :
                                    line.type === 'success' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                        {line.text}
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            <div className="flex items-center gap-2 text-green-500 border-t border-green-900/50 pt-2">
                <Terminal size={14} />
                <span>user@dyano:~$</span>
                <input
                    autoFocus
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    className="bg-transparent border-none outline-none flex-1 text-white"
                />
            </div>
        </div>
    );
};

export default SingularityTerminal;
