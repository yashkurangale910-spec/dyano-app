import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Plus, Search, Sparkles, Loader2, Compass, Layout, Code, Database, Server, Smartphone, Globe, ArrowRight, X, BookOpen, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

// New Data & Components
import { roadmapRegistry, getRoadmapsByCategory, getRoadmapById } from '../data/roadmapRegistry';
import HighFidelityRoadmap from '../components/roadmap/HighFidelityRoadmap';
import useRoadmaps from '../hooks/useRoadmaps';

// UI
import { Canvas } from '@react-three/fiber';
import KnowledgeUniverse from '../components/three/KnowledgeUniverse';
import GlassCard from '../components/ui/GlassCard';
import CosmicInput from '../components/ui/CosmicInput';
import ParticleButton from '../components/ui/ParticleButton';
import LogicCombat from '../components/roadmap/LogicCombat';

export default function Roadmap() {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState('browser'); // browser | viewer | generator
    const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [activeCategory, setActiveCategory] = useState('Role based'); // Role based | Skill based

    // Dungeon Mode State
    const [isDungeonMode, setIsDungeonMode] = useState(false);
    const [activeBossQuiz, setActiveBossQuiz] = useState(null);

    // Custom AI Roadmaps
    const { status, userRoadmaps, generateRoadmap, error } = useRoadmaps();

    // Search Worker State
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Initialize Worker
    const searchWorker = useMemo(() => new Worker(new URL('../workers/SearchWorker.js', import.meta.url), { type: 'module' }), []);

    useEffect(() => {
        // Index roadmaps on mount
        const allRoadmaps = Object.entries(roadmapRegistry).map(([id, meta]) => ({
            id,
            title: meta.data?.title || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            category: meta.category,
            type: meta.type,
            data: meta.data,
            description: meta.data?.description || '',
            isNew: meta.isNew
        }));

        searchWorker.postMessage({ type: 'INDEX', payload: allRoadmaps, id: 'init' });

        searchWorker.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'SEARCH_COMPLETE') {
                const results = payload.map(r => allRoadmaps.find(rm => rm.id === r.id)).filter(Boolean);
                setSearchResults(results);
                setIsSearching(false);
            }
        };

        return () => searchWorker.terminate();
    }, [searchWorker]);

    // Handle Search
    useEffect(() => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            searchWorker.postMessage({ type: 'SEARCH', payload: searchQuery, id: Date.now() });
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, searchWorker]);

    // Browser Data
    const availableRoadmaps = useMemo(() => {
        // If there's a search query, use worker results
        if (searchQuery.trim()) {
            return searchResults;
        }

        // Otherwise, filter by active category
        return getRoadmapsByCategory(activeCategory);
    }, [activeCategory, searchQuery, searchResults]);

    // Helper to transform API steps to Viz nodes
    const transformApiRoadmap = (apiData) => {
        if (!apiData || !apiData.steps) return apiData;

        // Simple layout generator: Vertical path
        const nodes = apiData.steps.map((step, index) => {
            const x = 400; // Centered column
            const y = 100 + (index * 300); // 300px spacing

            return {
                id: `step-${index}`, // Ensure unique ID for viz
                originalId: step._id,
                title: step.title,
                description: step.description,
                phaseId: 'generated-phase',
                level: 'custom',
                x: x,
                y: y,
                children: index < apiData.steps.length - 1 ? [`step-${index + 1}`] : [], // Connect to next
                timeEstimate: 'Flexible',
                resources: [],
                checklist: []
            };
        });

        const maxY = nodes.length * 300 + 400;

        return {
            ...apiData,
            nodes,
            phases: [{
                id: 'generated-phase',
                title: 'Custom Learning Path',
                color: 'rgba(34, 211, 238, 0.05)',
                minY: 0,
                maxY: maxY
            }]
        };
    };

    // Viewer Data
    const activeRoadmapData = useMemo(() => {
        if (!selectedRoadmapId) return null;

        // 1. Check Registry (Static Data)
        const registryData = getRoadmapById(selectedRoadmapId);
        if (registryData && registryData.nodes && registryData.nodes.length > 0) {
            return registryData;
        }

        // 2. Check User Roadmaps (AI Generated / API)
        const apiRoadmap = userRoadmaps.find(rm => rm._id === selectedRoadmapId || rm.id === selectedRoadmapId);
        if (apiRoadmap) {
            return transformApiRoadmap(apiRoadmap);
        }

        // 3. Fallback for registry items without data (Coming Soon)
        if (registryData) return registryData;

        return null;
    }, [selectedRoadmapId, userRoadmaps]);

    // Progress Persistence (Multi-State)
    const [nodeProgress, setNodeProgress] = useState(() => {
        return JSON.parse(localStorage.getItem('dyano_node_progress') || '{}');
    });

    const handleNodeClick = async (node) => {
        // If Dungeon Mode is active, check for Boss encounter
        if (isDungeonMode) {
            const nodeIndex = activeRoadmapData.nodes.findIndex(n => n.id === node.id);
            const currentData = nodeProgress[node.id] || {};
            const currentStatus = currentData.status || (typeof nodeProgress[node.id] === 'string' ? nodeProgress[node.id] : 'DEFAULT');

            if ((nodeIndex + 1) % 4 === 0 && currentStatus !== 'MASTERED') {
                setIsRewinding(true); // Re-use loading state for boss generation
                try {
                    const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
                    const response = await axios.post(`${API_URL}/quiz`, {
                        prompt: node.title,
                        isBossEncounter: true,
                        framework: activeRoadmapData.title
                    }, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    if (response.data.success) {
                        setActiveBossQuiz(response.data.quiz);
                    }
                } catch (err) {
                    console.error("Boss Generation Failed:", err);
                } finally {
                    setIsRewinding(false);
                }
                return;
            }
        }

        const states = ['DEFAULT', 'LEARNING', 'MASTERED', 'SKIPPED'];
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

    const [rewindSummary, setRewindSummary] = useState(null);
    const [isRewinding, setIsRewinding] = useState(false);

    const handleRewind = async () => {
        if (!selectedRoadmapId || isRewinding) return;
        setIsRewinding(true);
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/roadmap/rewind/${selectedRoadmapId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setRewindSummary(response.data.summary);
            }
        } catch (err) {
            console.error("Neural Rewind Failed:", err);
        } finally {
            setIsRewinding(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (customTopic.trim()) {
            await generateRoadmap(customTopic);
            setCustomTopic('');
            // Optionally auto-open the new roadmap:
            // The hook updates userRoadmaps, but we don't strictly know the new ID here easily without waiting.
            // For now, just alerting is fine as per previous logic, or we can just let the list update.
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <Canvas camera={{ position: [0, 0, 20] }}>
                    <KnowledgeUniverse count={2000} />
                </Canvas>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

                {/* Header Navigation */}
                <header className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/5 pb-12 gap-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/20 text-cosmic-cyan text-[8px] font-bold uppercase tracking-[0.3em] mb-4"
                        >
                            <Compass size={10} className="animate-spin-slow" /> {t('roadmap.header.nav')}
                        </motion.div>
                        <h1 className="text-6xl md:text-7xl font-display font-black text-white tracking-tighter mb-4">
                            {t('roadmap.header.title_part1')} <span className="text-gradient-cosmic">{t('roadmap.header.title_part2')}</span>
                        </h1>
                        <p className="text-gray-500 text-xl font-light tracking-wide max-w-xl">
                            Select a cognitive path or architect your own custom neural roadmap.
                        </p>
                    </div>

                    <div className="flex bg-white/[0.03] p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <button
                            onClick={() => setViewMode('browser')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === 'browser' ? 'bg-white text-black shadow-glow-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {t('roadmap.tabs.browse')}
                        </button>
                        <button
                            onClick={() => setViewMode('generator')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === 'generator' ? 'bg-cosmic-cyan text-black shadow-glow-cyan' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {t('roadmap.tabs.architect')}
                        </button>
                    </div>
                </header>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl mb-8 flex items-center gap-3"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">{error} - Check Backend Connection</span>
                    </motion.div>
                )}

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
                                        {t(cat.key) || cat.id}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {availableRoadmaps.map((roadmap) => (
                                <motion.div
                                    key={roadmap.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <GlassCard
                                        onClick={() => {
                                            setSelectedRoadmapId(roadmap.id);
                                            setViewMode('viewer');
                                        }}
                                        className="p-8 cursor-pointer relative overflow-hidden transition-all duration-700 hover:border-cosmic-cyan/50 group h-full"
                                        glow
                                        glowColor={roadmap.type === 'role' ? 'purple' : 'cyan'}
                                    >
                                        <div className="absolute right-0 bottom-0 text-7xl font-black text-white/[0.03] translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:scale-125 transition-transform duration-1000 uppercase italic">
                                            {roadmap.type === 'role' ? 'SEC-A' : 'SEC-B'}
                                        </div>

                                        <div className="flex justify-between items-start mb-10">
                                            <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${roadmap.type === 'role' ? 'text-cosmic-purple' : 'text-cosmic-cyan'}`}>
                                                {roadmap.type === 'role' ? <Layout size={24} strokeWidth={1.5} /> : <Code size={24} strokeWidth={1.5} />}
                                            </div>
                                            {roadmap.isNew && (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-cosmic-gold/10 border border-cosmic-gold/30 rounded-full animate-float">
                                                    <span className="w-1 h-1 bg-cosmic-gold rounded-full animate-ping" />
                                                    <span className="text-[8px] font-black text-cosmic-gold uppercase tracking-[0.2em]">{t('roadmap.card.new')}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-display font-black text-white mb-2 tracking-tight group-hover:text-gradient-cosmic transition-all duration-500">
                                                {roadmap.title}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className="text-[9px] text-gray-600 uppercase font-black tracking-[0.4em]">
                                                    {roadmap.category === 'Role based' ? t('roadmap.filter.role') :
                                                        roadmap.category === 'Skill based' ? t('roadmap.filter.skill') :
                                                            roadmap.category === 'Frameworks' ? t('roadmap.filter.framework') :
                                                                roadmap.category}
                                                </div>
                                                <ArrowRight size={10} className="text-gray-800 group-hover:text-cosmic-cyan group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Protocol-Ready</div>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md" />)}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* VIEW 2: VIEWER */}
                {viewMode === 'viewer' && activeRoadmapData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        className={`bg-black/60 backdrop-blur-3xl rounded-[2.5rem] border transition-all duration-1000 overflow-hidden min-h-[85vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isDungeonMode ? 'border-red-950 shadow-red-900/20' : 'border-white/10'}`}
                    >
                        <div className={`border-b p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 transition-colors duration-1000 ${isDungeonMode ? 'border-red-950 bg-red-950/10' : 'border-white/5 bg-white/[0.02]'}`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-1.5 h-1.5 rounded-full animate-ping ${isDungeonMode ? 'bg-red-600' : 'bg-cosmic-cyan'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">{isDungeonMode ? 'Abyssal Cognitive View' : 'Live Cognitive View'}</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter mb-4">{activeRoadmapData.title}</h2>
                                <p className="text-gray-500 text-lg font-light leading-relaxed max-w-2xl">{activeRoadmapData.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsDungeonMode(!isDungeonMode)}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border duration-500 ${isDungeonMode ? 'bg-red-600/20 border-red-600 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    <Sword size={14} className={isDungeonMode ? 'animate-pulse' : ''} /> {isDungeonMode ? 'Dungeon_Active' : 'Dungeon_Protocol'}
                                </button>
                                <button
                                    onClick={handleRewind}
                                    disabled={isRewinding}
                                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cosmic-purple/10 to-cosmic-cyan/10 hover:from-cosmic-purple/20 hover:to-cosmic-cyan/20 border border-cosmic-cyan/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-cosmic-cyan transition-all disabled:opacity-50"
                                >
                                    {isRewinding ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />}
                                    Neural Rewind
                                </button>
                                <button
                                    onClick={() => setViewMode('browser')}
                                    className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all"
                                >
                                    <X size={14} className="group-hover:rotate-90 transition-transform" /> {t('roadmap.viewer.close')}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {rewindSummary && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.9, y: 20 }}
                                        className="max-w-2xl w-full bg-[#0a0a1a] border border-cosmic-cyan/30 rounded-[2rem] p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.2)]"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-cyan to-transparent animate-pulse" />

                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex items-center gap-3">
                                                <RefreshCw size={20} className="text-cosmic-cyan animate-spin-slow" />
                                                <span className="text-xs font-black uppercase tracking-[0.3em] text-cosmic-cyan">Cognitive Rewind Active</span>
                                            </div>
                                            <button onClick={() => setRewindSummary(null)} className="text-gray-500 hover:text-white transition-colors">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-lg text-gray-300 leading-relaxed font-light italic">
                                                {rewindSummary}
                                            </p>
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
                                            <button
                                                onClick={() => setRewindSummary(null)}
                                                className="px-8 py-3 bg-cosmic-cyan/10 hover:bg-cosmic-cyan/20 border border-cosmic-cyan/30 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-cosmic-cyan transition-all"
                                            >
                                                Resynchronization Complete
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 overflow-auto p-8 md:p-16 relative bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]">
                            <div className="w-full max-w-5xl mx-auto">
                                <HighFidelityRoadmap
                                    roadmapData={activeRoadmapData}
                                    nodeProgress={nodeProgress}
                                    onNodeClick={handleNodeClick}
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md" />)}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{Object.values(nodeProgress).filter(s => s === 'MASTERED').length} Mastered</div>
                            </div>
                            <div className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.5em] animate-pulse">
                                Sensory Feedback Enabled // Neural Link Active
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* VIEW 3: GENERATOR (Legacy Support) */}
                {viewMode === 'generator' && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center py-20"
                    >
                        <div className="mb-12 relative inline-block">
                            <div className="absolute inset-0 bg-cosmic-cyan/20 blur-[50px] rounded-full animate-pulse" />
                            <div className="relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 text-cosmic-cyan backdrop-blur-3xl shadow-2xl">
                                <Sparkles size={48} strokeWidth={1} className="animate-float" />
                            </div>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-8 tracking-tighter">
                            Neural <span className="text-gradient-cosmic">Architect</span>
                        </h2>
                        <p className="text-gray-500 text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed">
                            {t('roadmap.generator.subtitle')}. Define your destination and let Spark.E map the synaptic path.
                        </p>

                        <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto mb-24 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-cyan/20 to-cosmic-purple/20 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                            <input
                                type="text"
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                placeholder={t('roadmap.generator.placeholder')}
                                className="relative w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-10 py-8 text-white text-xl focus:border-cosmic-cyan/50 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-700"
                            />
                            <button
                                type="submit"
                                disabled={status === 'generating'}
                                className="absolute right-4 top-4 bottom-4 aspect-square rounded-[1.5rem] bg-cosmic-cyan text-black flex items-center justify-center hover:scale-95 active:scale-90 transition-all disabled:opacity-50 shadow-glow-cyan"
                            >
                                {status === 'generating' ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                            </button>

                            {/* Quick Pick Chips */}
                            <div className="mt-12">
                                <div className="text-[10px] uppercase tracking-[0.4em] text-gray-700 font-black mb-6">{t('roadmap.generator.quick_pick')}</div>
                                <div className="flex flex-wrap justify-center gap-4 px-10">
                                    {['Quantum Logic', 'Neural Networks', 'BladeRunner Stack', 'Rust Core', 'Cyber Security'].map(tech => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => setCustomTopic(tech)}
                                            className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>

                        {/* Recent Generations */}
                        {userRoadmaps.length > 0 && (
                            <div className="text-left mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-[1px] bg-white/10" />
                                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">{t('roadmap.generator.history')}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userRoadmaps.map(rm => (
                                        <GlassCard
                                            key={rm._id || rm.id}
                                            className="p-6 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all"
                                            onClick={() => {
                                                setSelectedRoadmapId(rm._id || rm.id);
                                                setViewMode('viewer');
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cosmic-cyan group-hover:bg-cosmic-cyan/10 transition-colors">
                                                    <BookOpen size={18} />
                                                </div>
                                                <span className="font-bold text-white group-hover:text-cosmic-cyan transition-colors">{rm.title}</span>
                                            </div>
                                            <span className="text-[8px] font-black text-cosmic-cyan px-3 py-1 rounded-full border border-cosmic-cyan/20">CUSTOM_SYNAPSE</span>
                                        </GlassCard>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                <AnimatePresence>
                    {activeBossQuiz && (
                        <LogicCombat
                            quiz={activeBossQuiz}
                            onVictory={(quiz) => {
                                const node = activeRoadmapData.nodes.find(n => n.title === quiz.topic);
                                if (node) {
                                    handleNodeClick(node);
                                }
                                setActiveBossQuiz(null);
                            }}
                            onDefeat={() => setActiveBossQuiz(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
