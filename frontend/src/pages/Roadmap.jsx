import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROADMAP_MAP } from '../constants/roadmapData';
import RoadmapNode from '../components/roadmap/RoadmapNode';
import RoadmapConnector from '../components/roadmap/RoadmapConnector';

export default function Roadmap() {
    const [activeTab, setActiveTab] = useState('frontend');
    const roadmapData = ROADMAP_MAP[activeTab];

    const tabs = [
        { id: 'frontend', label: 'Frontend' },
        { id: 'backend', label: 'Backend' },
    ];

    return (
        <div className="w-full min-h-screen relative bg-[#000000] py-24 font-sans text-white">
            {/* Absolute flat background like roadmap.sh */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:48px_48px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* Roadmap Switcher */}
                <div className="mb-12 flex bg-[#111111] border border-[#262626] p-1 rounded-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-[#ffd60a] text-black shadow-[0_0_20px_rgba(255,214,10,0.2)]'
                                    : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <header className="mb-24 text-center w-full max-w-3xl px-4">
                    <motion.div
                        key={`${activeTab}-phase`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-3 py-1 bg-[#1a1a1a] text-[#ffd60a] text-[11px] font-bold uppercase rounded-md mb-6 tracking-widest border border-[#262626]"
                    >
                        {activeTab === 'frontend' ? 'Frontend Specialist Path' : 'Backend Engineering Path'}
                    </motion.div>

                    <motion.h1
                        key={`${activeTab}-title`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none"
                    >
                        {activeTab === 'frontend' ? 'Frontend' : 'Backend'} <span className="text-gray-500">Developer</span>
                    </motion.h1>

                    <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Step by step guide to becoming a modern {activeTab} developer in 2026.
                    </p>

                    {/* Legend */}
                    <div className="mt-14 flex flex-wrap justify-center gap-8 py-6 border-y border-[#1a1a1a]">
                        {[
                            { label: 'Done', color: 'bg-[#ffd60a]' },
                            { label: 'In Progress', color: 'border border-[#ffd60a]' },
                            { label: 'To Do', color: 'bg-[#262626]' },
                            { label: 'Recommended', color: 'bg-[#ffd60a]', isNode: true },
                            { label: 'Optional', color: 'bg-[#404040]', isNode: true }
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                {item.isNode ? (
                                    <div
                                        className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-sm border ${item.label === 'Recommended' ? 'border-[#ffd60a] text-white' : 'border-[#404040] text-gray-500'}`}
                                    >
                                        {item.label}
                                    </div>
                                ) : (
                                    <div className={`w-3.5 h-3.5 rounded-full ${item.color}`} />
                                )}
                                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Roadmap Content */}
                <div className="flex flex-col items-center w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col items-center"
                        >
                            {roadmapData.map((section, sIdx) => {
                                const hasTopics = section.topics && section.topics.length > 0;

                                if (!hasTopics) return null;

                                return (
                                    <React.Fragment key={section.id}>
                                        {/* Milestone Section Header */}
                                        <div className="w-full flex flex-col items-center">
                                            <div className="bg-black border-[2.5px] border-[#262626] px-16 py-8 rounded-2xl shadow-2xl relative z-10 hover:border-[#ffd60a] transition-all duration-300">
                                                <h2 className="text-white font-black text-4xl uppercase tracking-tighter text-center">
                                                    {section.title}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Topics Path */}
                                        <div className="flex flex-col items-center w-full">
                                            {section.topics.length <= 3 ? (
                                                // Single Path
                                                section.topics.map((topic, tIdx) => (
                                                    <React.Fragment key={topic.id}>
                                                        <RoadmapConnector status={topic.status} height={60} />
                                                        <RoadmapNode node={topic} className="w-[420px]" />
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                // Branching Path
                                                <>
                                                    {section.topics.slice(0, 2).map((topic) => (
                                                        <React.Fragment key={topic.id}>
                                                            <RoadmapConnector status={topic.status} height={60} />
                                                            <RoadmapNode node={topic} className="w-[420px]" />
                                                        </React.Fragment>
                                                    ))}

                                                    <RoadmapConnector status={section.status} height={80} />

                                                    <div className="flex flex-wrap justify-center gap-x-24 gap-y-16 w-full relative pt-4">
                                                        <div className="absolute top-0 left-1/4 right-1/4 h-[4px] bg-[#262626]" />

                                                        {[
                                                            section.topics.slice(2, Math.ceil(section.topics.length / 2) + 1),
                                                            section.topics.slice(Math.ceil(section.topics.length / 2) + 1)
                                                        ].map((group, gIdx) => (
                                                            <div key={gIdx} className="flex flex-col items-center relative pt-12">
                                                                <div className="absolute top-0 w-[4px] h-12 bg-[#262626]" />
                                                                <div className="absolute top-0 w-[11px] h-[11px] rounded-full bg-black border-[3px] border-[#262626]" />

                                                                <div className="flex flex-col items-center w-[320px]">
                                                                    {group.map((topic, tIdx) => (
                                                                        <React.Fragment key={topic.id}>
                                                                            {tIdx > 0 && <RoadmapConnector status={topic.status} height={32} />}
                                                                            <RoadmapNode node={topic} className="w-full" />
                                                                        </React.Fragment>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Connector between major sections */}
                                        {sIdx < roadmapData.length - 1 && (
                                            <div className="w-full flex flex-col items-center">
                                                <RoadmapConnector status={roadmapData[sIdx + 1].status === 'locked' ? 'locked' : 'completed'} height={120} />
                                                <div className="w-5 h-5 rounded-full bg-[#111111] border-[4px] border-[#262626]" />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <footer className="mt-96 pb-40 w-full max-w-3xl border-t border-[#1a1a1a] pt-24 text-center opacity-40">
                    <div className="flex justify-center gap-1.5 mb-10">
                        {[...Array(32)].map((_, i) => (
                            <div key={i} className={`w-1 h-8 ${i % 4 === 0 ? 'bg-[#ffd60a]' : 'bg-[#262626]'}`} />
                        ))}
                    </div>
                    <p className="text-[14px] font-black uppercase tracking-[0.8em] text-white">
                        Official {activeTab} Curriculum // 2026.01.25
                    </p>
                </footer>
            </div>
        </div>
    );
}
