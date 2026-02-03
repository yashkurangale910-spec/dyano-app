import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search as SearchIcon,
    Plus,
    Layout,
    Code,
    ChevronRight,
    Terminal,
    BookOpen,
    RefreshCw,
    X,
    Sword,
    Loader2,
    Sparkles,
    Wind
} from 'lucide-react';
import { roadmapRegistry, getRoadmapsByCategory, getRoadmapById } from '../data/roadmapRegistry';
import HighFidelityRoadmap from '../components/roadmap/HighFidelityRoadmap';
import useRoadmaps from '../hooks/useRoadmaps';
import LuxuryCard, { LuxuryContent } from '../components/ui/LuxuryCard';
import BaseButton from '../components/ui/BaseButton';
import PageHeader from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EnhancedInput from '../components/ui/EnhancedInput';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';

export default function Roadmap() {
    const [viewMode, setViewMode] = useState('browser'); // browser | viewer | generator
    const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [activeCategory, setActiveCategory] = useState('Role based');

    const { status, userRoadmaps, generateRoadmap, error } = useRoadmaps();

    // Progress Persistence
    const [nodeProgress, setNodeProgress] = useState(() => {
        return JSON.parse(localStorage.getItem('dyano_node_progress') || '{}');
    });

    const handleNodeClick = (node) => {
        const states = ['DEFAULT', 'LEARNING', 'MASTERED'];
        const currentData = nodeProgress[node.id] || {};
        const currentStatus = currentData.status || (typeof nodeProgress[node.id] === 'string' ? nodeProgress[node.id] : 'DEFAULT');
        const nextIndex = (states.indexOf(currentStatus) + 1) % states.length;
        const nextStatus = states[nextIndex];

        const newProgress = {
            ...nodeProgress,
            [node.id]: {
                status: nextStatus,
                masteredAt: nextStatus === 'MASTERED' ? new Date().toISOString() : (currentData.masteredAt || null)
            }
        };

        setNodeProgress(newProgress);
        localStorage.setItem('dyano_node_progress', JSON.stringify(newProgress));
    };

    // Browser Data
    const availableRoadmaps = useMemo(() => {
        const filtered = getRoadmapsByCategory(activeCategory);
        if (searchQuery.trim()) {
            return filtered.filter(rm =>
                rm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rm.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [activeCategory, searchQuery]);

    const activeRoadmapData = useMemo(() => {
        if (!selectedRoadmapId) return null;
        return getRoadmapById(selectedRoadmapId);
    }, [selectedRoadmapId]);

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        if (customTopic.trim()) {
            await generateRoadmap(customTopic);
            setCustomTopic('');
        }
    };

    return (
        <div className="w-full relative min-h-screen">
            <main className="py-12 md:py-20 relative z-10">
                <div className="container-monolith">

                    {/* Navigation Context */}
                    <Breadcrumbs />

                    {/* Page Header */}
                    <motion.div layoutId="card-roadmap">
                        <PageHeader
                            title="Learning Paths"
                            subtitle="Select a cognitive trajectory or architect a custom neural roadmap tailored to your objectives."
                            helpText="Role-based paths are curated for professional mastery, while Skill-based paths focus on specific logic modules."
                            actions={
                                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                                    {['browser', 'generator'].map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setViewMode(mode)}
                                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${viewMode === mode ? 'bg-white text-black shadow-glow-white/10' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {mode === 'browser' ? 'Library' : 'Architect'}
                                        </button>
                                    ))}
                                </div>
                            }
                        />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {/* BROWSER VIEW */}
                        {viewMode === 'browser' && (
                            <motion.div
                                key="browser"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                {/* Filters & Search */}
                                <div className="flex flex-col md:flex-row gap-8 justify-between items-center bg-white/[0.02] border border-white/5 rounded-[2rem] p-4 backdrop-blur-3xl">
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                        {['Role based', 'Skill based'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={`px-6 py-2 rounded-lg text-[9px] uppercase font-black tracking-widest transition-all ${activeCategory === cat ? 'bg-white/10 text-white shadow-glow-white/5' : 'text-gray-600 hover:text-white'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-full md:w-96">
                                        <EnhancedInput
                                            placeholder="Search trajectory nodes..."
                                            value={searchQuery}
                                            onChange={setSearchQuery}
                                            icon={<SearchIcon size={16} />}
                                            variant="glass"
                                            size="sm"
                                            showClear
                                        />
                                    </div>
                                </div>

                                {/* Results Grid */}
                                {availableRoadmaps.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {availableRoadmaps.map((roadmap) => (
                                            <LuxuryCard
                                                key={roadmap.id}
                                                onClick={() => {
                                                    setSelectedRoadmapId(roadmap.id);
                                                    setViewMode('viewer');
                                                }}
                                                className="group cursor-pointer hover:border-accent-cyan/30 transition-colors"
                                            >
                                                <LuxuryContent className="p-10">
                                                    <div className="flex justify-between items-start mb-10">
                                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex-center text-gray-500 group-hover:text-accent-cyan group-hover:bg-accent-cyan/10 transition-all duration-500 group-hover:scale-110">
                                                            {roadmap.type === 'role' ? <Layout size={24} strokeWidth={1.5} /> : <Code size={24} strokeWidth={1.5} />}
                                                        </div>
                                                        {roadmap.isNew && (
                                                            <motion.span
                                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                className="text-mono text-[8px] text-accent-cyan border border-accent-cyan/30 px-3 py-1 rounded-full"
                                                            >
                                                                Alpha
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-h3 mb-3 group-hover:text-accent-cyan transition-colors">{roadmap.title}</h3>
                                                    <p className="text-caption mb-8">Systematic path for mastering {roadmap.title.toLowerCase()} paradigms.</p>
                                                    <div className="flex items-center justify-between text-mono text-gray-700 mt-auto">
                                                        <span className="group-hover:text-gray-400">{roadmap.type === 'role' ? 'System Topology' : 'Logic Framework'}</span>
                                                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </LuxuryContent>
                                            </LuxuryCard>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No trajectories found"
                                        description="Your search criteria did not match any available neural paths. Try adjusting your vocabulary."
                                        icon={SearchIcon}
                                        action={{
                                            label: "Refresh Archive",
                                            onClick: () => { setSearchQuery(''); setActiveCategory('Role based'); }
                                        }}
                                    />
                                )}
                            </motion.div>
                        )}

                        {/* GENERATOR VIEW */}
                        {viewMode === 'generator' && (
                            <motion.div
                                key="generator"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-4xl mx-auto space-y-16"
                            >
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 rounded-3xl bg-accent-cyan/5 border border-accent-cyan/20 flex-center text-accent-cyan mx-auto shadow-glow-cyan/10">
                                        <Terminal size={36} strokeWidth={1} />
                                    </div>
                                    <h2 className="text-display">Neural Architect.</h2>
                                    <p className="text-body-lg max-w-2xl mx-auto">
                                        Define your learning objective and let the engine map the synaptic path through
                                        unstructured knowledge domains.
                                    </p>
                                </div>

                                <div className="relative glass-premium p-10 rounded-[3rem] border-white/10">
                                    <form onSubmit={handleGenerate} className="space-y-8">
                                        <EnhancedInput
                                            label="Objective trajectory"
                                            placeholder="e.g. Distributed Consensus Algorithms or Quantum Cryptography"
                                            value={customTopic}
                                            onChange={setCustomTopic}
                                            size="lg"
                                            variant="glass"
                                            showClear
                                            helpText="Be specific for more granular trajectory mapping."
                                        />
                                        <BaseButton
                                            type="submit"
                                            variant="primary"
                                            size="xl"
                                            loading={status === 'generating'}
                                            className="w-full uppercase tracking-[0.3em] font-black"
                                            leftIcon={<Sparkles size={20} />}
                                            disabled={!customTopic.trim()}
                                        >
                                            Generate Neural Path
                                        </BaseButton>
                                    </form>
                                </div>

                                {status === 'generating' && (
                                    <LoadingState
                                        variant="progress"
                                        label="Mapping knowledge nodes..."
                                        message="Consulting the global cognitive archive to architect your unique path."
                                    />
                                )}

                                {userRoadmaps.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <Wind size={16} className="text-gray-700" />
                                            <h4 className="text-mono text-gray-700">Recent Architectures</h4>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {userRoadmaps.map((rm) => (
                                                <LuxuryCard
                                                    key={rm.id}
                                                    onClick={() => {
                                                        setSelectedRoadmapId(rm.id);
                                                        setViewMode('viewer');
                                                    }}
                                                    className="group cursor-pointer hover:bg-white/[0.02]"
                                                >
                                                    <LuxuryContent className="flex items-center gap-6 p-6">
                                                        <div className="w-10 h-10 rounded-xl bg-accent-cyan/5 border border-accent-cyan/10 flex-center text-accent-cyan group-hover:scale-110 transition-transform">
                                                            <BookOpen size={20} strokeWidth={1.5} />
                                                        </div>
                                                        <div className="flex-1 truncate">
                                                            <span className="text-sm font-bold text-white block group-hover:text-accent-cyan transition-colors">{rm.title}</span>
                                                            <span className="text-[10px] text-gray-600 uppercase tracking-widest">{new Date(rm.createdAt || Date.now()).toLocaleDateString()}</span>
                                                        </div>
                                                        <ChevronRight size={16} className="text-gray-800 group-hover:text-white transition-colors" />
                                                    </LuxuryContent>
                                                </LuxuryCard>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* VIEWER VIEW */}
                        {viewMode === 'viewer' && activeRoadmapData && (
                            <motion.div
                                key="viewer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[200] bg-bg-main flex flex-col"
                            >
                                <header className="p-6 md:px-12 md:py-8 border-b border-white/[0.05] flex items-center justify-between backdrop-blur-xl bg-bg-main/80 z-20">
                                    <div className="flex items-center gap-6">
                                        <BaseButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setViewMode('browser')}
                                            className="!px-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                        >
                                            <X size={20} />
                                        </BaseButton>
                                        <div className="h-10 w-px bg-white/10 hidden md:block" />
                                        <div className="space-y-1">
                                            <div className="text-mono text-[10px] text-accent-cyan flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                                                Active Trajectory Mapping
                                            </div>
                                            <h2 className="text-h3">{activeRoadmapData.title}</h2>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex gap-4">
                                        <BaseButton variant="outline" size="sm" leftIcon={<RefreshCw size={14} />}>
                                            Neural Rewind
                                        </BaseButton>
                                        <BaseButton variant="secondary" size="sm" leftIcon={<Sword size={14} />}>
                                            Combat Protocol
                                        </BaseButton>
                                    </div>
                                </header>

                                <div className="flex-1 overflow-auto bg-bg-main relative premium-grid">
                                    <div className="absolute inset-0 atmosphere-layer opacity-40 pointer-events-none" />
                                    <div className="p-12 md:p-24 min-h-full flex-center relative z-10">
                                        <div className="w-full max-w-6xl">
                                            <HighFidelityRoadmap
                                                roadmapData={activeRoadmapData}
                                                nodeProgress={nodeProgress}
                                                onNodeClick={handleNodeClick}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <footer className="p-4 border-t border-white/[0.05] bg-bg-surface text-center">
                                    <span className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">Synaptic Persistence Module Active • AES-256 Encrypted Session</span>
                                </footer>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
