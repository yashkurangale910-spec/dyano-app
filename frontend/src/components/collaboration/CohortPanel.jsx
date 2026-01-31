import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, MessageSquare, ShieldCheck } from 'lucide-react';

const LearnerAvatar = ({ user }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-cosmic-cyan/30 transition-all cursor-pointer">
        <div className="relative">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-black text-xs shadow-lg`}>
                {user.initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#050505] animate-pulse" />
        </div>
        <div className="flex-1">
            <div className="text-xs font-bold text-white group-hover:text-cosmic-cyan transition-colors">{user.name}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{user.status}</div>
        </div>
        <div className="flex gap-1">
            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-cosmic-cyan hover:text-black transition-all">
                <MessageSquare size={12} />
            </button>
        </div>
    </div>
);

export default function CohortPanel({ activeNodeId }) {
    // Mocking real-time peer learners on the same node
    const parallelLearners = [
        { name: 'Alex_Nova', initials: 'AN', color: 'from-cosmic-cyan to-blue-600', status: 'Syncing_Core', pulse: true },
        { name: 'Sora_99', initials: 'S9', color: 'from-cosmic-purple to-pink-600', status: 'In_Deep_Study', pulse: false },
        { name: 'Zenith_Dev', initials: 'ZD', color: 'from-green-400 to-cyan-500', status: 'Analyzing_Logic', pulse: true }
    ];

    return (
        <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex justify-between items-center relative z-10">
                <h3 className="text-xs font-black text-cosmic-cyan uppercase tracking-[0.3em] flex items-center gap-2">
                    <Users size={14} /> Parallel_Learners
                </h3>
                <div className="px-2 py-0.5 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/20 text-[8px] font-black text-cosmic-cyan uppercase tracking-widest">
                    3 Units Live
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {parallelLearners.map((user, idx) => (
                    <LearnerAvatar key={idx} user={user} />
                ))}
            </div>

            <div className="pt-4 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-cosmic-cyan/5 border border-cosmic-cyan/20">
                    <div className="p-2 rounded-lg bg-cosmic-cyan/10 text-cosmic-cyan">
                        <Zap size={14} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-white uppercase tracking-widest">Global Consensus</div>
                        <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                            82% of units bypass this logic using "Edge_Case_Protocols".
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-[8px] text-gray-700 font-black uppercase tracking-[0.4em] text-center pt-2">
                Neural_Hive_Sync_Active
            </div>
        </div>
    );
}
