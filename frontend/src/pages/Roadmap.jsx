import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Plus, Search, Sparkles, Loader2, Compass, Layout, Code, Database, Server, Smartphone, Globe, ArrowRight } from 'lucide-react';

// New Data & Components
import { roadmapRegistry, getRoadmapsByCategory, getRoadmapById } from '../data/roadmapRegistry';
import HighFidelityRoadmap from '../components/roadmap/HighFidelityRoadmap';
import useRoadmaps from '../hooks/useRoadmaps';

// UI
import GlassCard from '../components/ui/GlassCard';
import CosmicInput from '../components/ui/CosmicInput';
import ParticleButton from '../components/ui/ParticleButton';

export default function Roadmap() {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState('browser'); // browser | viewer | generator
    const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [activeCategory, setActiveCategory] = useState('Role based'); // Role based | Skill based

    // Custom AI Roadmaps
    const { status, userRoadmaps, generateRoadmap } = useRoadmaps();

    // Browser Data
    const availableRoadmaps = useMemo(() => {
        // If there's a search query, search all roadmaps regardless of category
        if (searchQuery.trim()) {
            return Object.entries(roadmapRegistry).map(([id, meta]) => ({
                id,
                title: meta.data?.title || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                category: meta.category,
                type: meta.type,
                isNew: meta.isNew
            })).filter(rm =>
                rm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rm.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Otherwise, filter by active category
        return getRoadmapsByCategory(activeCategory);
    }, [activeCategory, searchQuery]);

    // Viewer Data
    const activeRoadmapData = useMemo(() => {
        if (!selectedRoadmapId) return null;
        return getRoadmapById(selectedRoadmapId);
    }, [selectedRoadmapId]);

    // Progress Persistence
    const [completedNodes, setCompletedNodes] = useState(() => {
        return new Set(JSON.parse(localStorage.getItem('dyano_roadmap_progress') || '[]'));
    });

    const handleNodeClick = (node) => {
        const newSet = new Set(completedNodes);
        if (newSet.has(node.id)) {
            newSet.delete(node.id);
        } else {
            newSet.add(node.id);
        }
        setCompletedNodes(newSet);
        localStorage.setItem('dyano_roadmap_progress', JSON.stringify([...newSet]));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (customTopic.trim()) {
            await generateRoadmap(customTopic);
            setCustomTopic('');
            // TODO: Switch to a custom viewer for AI roadmaps (simplified view)
            alert("AI Roadmap Generated! Check the 'My Knowledge Paths' section.");
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

                {/* Header Navigation */}
                <header className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/5 pb-8 gap-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-2 text-cosmic-cyan"
                        >
                            <Compass size={20} />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('roadmap.header.nav')}</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                            {t('roadmap.header.title_part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-cyan to-cosmic-purple">{t('roadmap.header.title_part2')}</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setViewMode('browser')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${viewMode === 'browser' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            {t('roadmap.tabs.browse')}
                        </button>
                        <button
                            onClick={() => setViewMode('generator')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${viewMode === 'generator' ? 'bg-cosmic-cyan text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            {t('roadmap.tabs.architect')}
                        </button>
                    </div>
                </header>

                {/* VIEW 1: BROWSER */}
                {viewMode === 'browser' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="flex bg-black/40 p-1 rounded-xl">
                                {[
                                    { id: 'Role based', key: 'roadmap.filter.role' },
                                    { id: 'Skill based', key: 'roadmap.filter.skill' },
                                    { id: 'Frameworks', key: 'roadmap.filter.framework' }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {t(cat.key)}
                                    </button>
                                ))}
                            </div>
                            <div className="w-full md:w-96">
                                <CosmicInput
                                    icon={Search}
                                    placeholder={t('roadmap.search_placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableRoadmaps.map((roadmap) => (
                                <GlassCard
                                    key={roadmap.id}
                                    onClick={() => {
                                        setSelectedRoadmapId(roadmap.id);
                                        setViewMode('viewer');
                                    }}
                                    className="p-6 cursor-pointer hover:border-cosmic-cyan/50 group h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-lg ${roadmap.type === 'role' ? 'bg-cosmic-purple/10 text-cosmic-purple' : 'bg-cosmic-cyan/10 text-cosmic-cyan'}`}>
                                            {roadmap.type === 'role' ? <Layout size={20} /> : <Code size={20} />}
                                        </div>
                                        {roadmap.isNew && (
                                            <span className="px-2 py-1 bg-cosmic-gold/20 text-cosmic-gold text-[9px] font-bold uppercase rounded border border-cosmic-gold/30">{t('roadmap.card.new')}</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cosmic-cyan transition-colors">
                                        {roadmap.title}
                                    </h3>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                        {roadmap.category === 'Role based' ? t('roadmap.filter.role') :
                                            roadmap.category === 'Skill based' ? t('roadmap.filter.skill') :
                                                roadmap.category === 'Frameworks' ? t('roadmap.filter.framework') :
                                                    roadmap.category}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* VIEW 2: VIEWER */}
                {viewMode === 'viewer' && activeRoadmapData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden min-h-[80vh] flex flex-col"
                    >
                        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{activeRoadmapData.title}</h2>
                                <p className="text-gray-500 text-sm mt-1">{activeRoadmapData.description}</p>
                            </div>
                            <button
                                onClick={() => setViewMode('browser')}
                                className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm text-gray-400 transition-colors"
                            >
                                {t('roadmap.viewer.close')}
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4 md:p-8 relative bg-grid-pattern">
                            <div className="w-full max-w-4xl mx-auto flex justify-center">
                                <HighFidelityRoadmap
                                    roadmapData={activeRoadmapData}
                                    completedNodes={completedNodes}
                                    onNodeClick={handleNodeClick}
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/5 bg-[#0a0a0a] text-center text-xs text-gray-600 uppercase tracking-widest">
                            {t('roadmap.viewer.progress', { count: completedNodes.size })} // {t('roadmap.viewer.hint')}
                        </div>
                    </motion.div>
                )}

                {/* VIEW 3: GENERATOR (Legacy Support) */}
                {viewMode === 'generator' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto text-center py-20"
                    >
                        <div className="mb-8 inline-flex p-4 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/30 text-cosmic-cyan">
                            <Sparkles size={32} />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6">{t('roadmap.generator.title')}</h2>
                        <p className="text-gray-400 mb-12 text-lg">
                            {t('roadmap.generator.subtitle')}
                        </p>

                        <form onSubmit={handleGenerate} className="relative max-w-lg mx-auto mb-16">
                            <input
                                type="text"
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                placeholder={t('roadmap.generator.placeholder')}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan outline-none transition-all placeholder:text-gray-600"
                            />
                            <button
                                type="submit"
                                disabled={status === 'generating'}
                                className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-cosmic-cyan text-black flex items-center justify-center hover:scale-95 transition-all disabled:opacity-50"
                            >
                                {status === 'generating' ? <Loader2 className="animate-spin" /> : <Plus />}
                            </button>

                            {/* Quick Pick Chips */}
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <span className="w-full text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{t('roadmap.generator.quick_pick')}</span>
                                {['React', 'Next.js', 'Node.js', 'Flutter', 'Django', 'Rust', 'DevOps'].map(tech => (
                                    <button
                                        key={tech}
                                        type="button"
                                        onClick={() => setCustomTopic(tech)}
                                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 hover:bg-cosmic-cyan/20 hover:text-cosmic-cyan hover:border-cosmic-cyan/30 transition-all active:scale-90"
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>
                        </form>

                        {/* Recent Generations */}
                        {userRoadmaps.length > 0 && (
                            <div className="text-left">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t('roadmap.generator.history')}</h3>
                                <div className="space-y-4">
                                    {userRoadmaps.map(rm => (
                                        <div key={rm._id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                                            <span className="font-bold text-white">{rm.title}</span>
                                            <span className="text-xs text-cosmic-cyan px-2 py-1 rounded bg-cosmic-cyan/10">Custom</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

            </div>
        </div>
    );
}
