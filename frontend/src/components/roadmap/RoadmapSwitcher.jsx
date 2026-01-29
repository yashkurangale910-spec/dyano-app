import React from 'react';
import { Search } from 'lucide-react';

const RoadmapSwitcher = ({ tabs, activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
    return (
        <div className="mb-12 flex flex-col md:flex-row items-center gap-6 w-full max-w-4xl">
            <div className="flex bg-[#111111] border border-[#262626] p-1 rounded-xl">
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

            <div className="flex-1 w-full relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ffd60a] transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111111] border border-[#262626] rounded-xl py-3 pl-12 pr-4 text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd60a] focus:ring-1 focus:ring-[#ffd60a] transition-all"
                />
            </div>
        </div>
    );
};

export default RoadmapSwitcher;
