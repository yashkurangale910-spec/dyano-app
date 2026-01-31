import React, { useState } from 'react';
import { FileCode, Lock, CheckCircle, AlertOctagon, GitCommit, RefreshCw } from 'lucide-react';

const VsCodeNeuralLink = () => {
    const [activeFile, setActiveFile] = useState('UserAuth.js');
    const [status, setStatus] = useState('BLOCKED'); // BLOCKED, ALLOWED
    const [scanning, setScanning] = useState(false);

    const prerequisites = [
        { id: 'jwt-basics', label: 'JWT Implementation', mastered: true },
        { id: 'oauth-flow', label: 'OAuth 2.0 Flow', mastered: false },
        { id: 'bcrypt', label: 'Password Hashing', mastered: true },
    ];

    const handleScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            // Toggle for simulation purposes
            setStatus(prev => prev === 'BLOCKED' ? 'ALLOWED' : 'BLOCKED');
        }, 1500);
    };

    return (
        <div className="w-80 h-96 bg-[#252526] border-l border-[#3e3e42] flex flex-col font-sans text-white overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="bg-[#333333] px-4 py-2 text-[11px] font-bold uppercase tracking-wider flex justify-between items-center text-[#cccccc]">
                <span>NEURAL LINK</span>
                <span className={`w-2 h-2 rounded-full ${status === 'BLOCKED' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-4 text-[#cccccc]">
                    <FileCode size={16} />
                    <span className="text-sm font-mono">{activeFile}</span>
                </div>

                <div className="space-y-2 mb-6">
                    <p className="text-[10px] text-[#858585] uppercase font-bold mb-1">Detected Concepts</p>
                    {prerequisites.map(req => (
                        <div key={req.id} className="flex items-center justify-between bg-[#3c3c3c] p-2 rounded text-xs border border-[#454545]">
                            <span className="text-[#cccccc]">{req.label}</span>
                            {req.mastered ?
                                <CheckCircle size={14} className="text-[#89d185]" /> :
                                <Lock size={14} className="text-[#f48771]" />
                            }
                        </div>
                    ))}
                </div>

                {/* Status Block */}
                <div className={`p-3 border-l-2 ${status === 'BLOCKED' ? 'bg-[#3a2d2d] border-[#f48771]' : 'bg-[#2d3a2d] border-[#89d185]'} mb-4`}>
                    <div className="flex items-center gap-2 mb-1">
                        {status === 'BLOCKED' ? <AlertOctagon size={16} className="text-[#f48771]" /> : <GitCommit size={16} className="text-[#89d185]" />}
                        <span className={`font-bold text-xs ${status === 'BLOCKED' ? 'text-[#f48771]' : 'text-[#89d185]'}`}>
                            {status === 'BLOCKED' ? 'COMMIT REJECTED' : 'COMMIT ALLOWED'}
                        </span>
                    </div>
                    <p className="text-[10px] text-[#cccccc] opacity-80 leading-tight">
                        {status === 'BLOCKED'
                            ? "Neural Link has detected unmastered concepts in this file. Please master 'OAuth 2.0 Flow' to unlock write access."
                            : "All prerequisite concepts mastered. Neural Link active and syncing."}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#333333] border-t border-[#3e3e42]">
                <button
                    onClick={handleScan}
                    className="w-full flex items-center justify-center gap-2 bg-[#0e639c] hover:bg-[#1177bb] text-white py-1.5 rounded text-xs transition-colors"
                >
                    {scanning ? <RefreshCw size={12} className="animate-spin" /> : <GitCommit size={12} />}
                    {scanning ? 'Analyzing Syntax Tree...' : 'Force Re-Scan'}
                </button>
            </div>
        </div>
    );
};

export default VsCodeNeuralLink;
