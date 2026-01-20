import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const [stats, setStats] = useState({
        quizzesCompleted: 0,
        flashcardsCreated: 0,
        roadmapsStarted: 0,
        streak: 1
    });
    const [recentRoadmaps, setRecentRoadmaps] = useState([]);
    const [recentDecks, setRecentDecks] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const savedRoadmaps = JSON.parse(localStorage.getItem('dyano_roadmaps') || '[]');
        const savedDecks = JSON.parse(localStorage.getItem('dyano_flashcards') || '[]');
        const savedStats = JSON.parse(localStorage.getItem('dyano_stats') || 'null');

        setRecentRoadmaps(savedRoadmaps.slice(0, 3));
        setRecentDecks(savedDecks.slice(0, 3));

        if (savedStats) {
            setStats(savedStats);
        } else {
            const initialStats = {
                quizzesCompleted: 0,
                flashcardsCreated: savedDecks.length,
                roadmapsStarted: savedRoadmaps.length,
                streak: 1
            };
            setStats(initialStats);
            localStorage.setItem('dyano_stats', JSON.stringify(initialStats));
        }
    }, []);

    const resumeRoadmap = (roadmap) => {
        navigate('/roadmap', { state: { roadmap: roadmap.data, topic: roadmap.topic } });
    };

    const openDeck = (deck) => {
        navigate('/flashcards', { state: { flashcards: deck.cards, topic: deck.topic } });
    };

    return (
        <div className="min-h-screen relative pt-40 pb-20 px-20">
            {/* Kinetic Background */}
            <div className="kinetic-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            {/* Abstract Decorative Shards */}
            <div className="shard-container">
                <div className="shard w-40 h-40 -top-10 left-[10%] opacity-20"></div>
                <div className="shard w-80 h-20 bottom-20 right-[5%] opacity-10 blur-sm"></div>
            </div>

            <main className="max-w-[1600px] mx-auto relative z-10">

                {/* --- Kinetic Header Section --- */}
                <div className="mb-32 flex flex-col items-start">
                    <div className="label-track mb-4">{t('dashboard.project_workspace')} // v1.0.4</div>
                    <h1 className="title-hero">{t('dashboard.alpha_base')}</h1>
                    <div className="flex items-center gap-10 mt-12 pl-2">
                        <div className="flex gap-4">
                            <Link to="/learn" className="btn-abstract">{t('dashboard.init_task')}</Link>
                            <Link to="/pdf" className="btn-abstract">{t('dashboard.data_sync')}</Link>
                        </div>
                        <div className="h-[1px] w-64 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase">
                            {t('dashboard.status_integrated')} {stats.streak}D
                        </div>
                    </div>
                </div>

                {/* --- Abstract Composition --- */}
                <div className="grid grid-cols-12 gap-10 items-stretch">

                    {/* HUB: Primary Metric */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="kinetic-card p-16 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            {/* Abstract Kinetic Ring */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                                <div className="w-80 h-80 border-2 border-white/10 rounded-full animate-[spin_12s_linear_infinite]"></div>
                                <div className="w-64 h-64 border border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite_reverse] absolute"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="text-8xl font-black text-white italic tracking-tighter mb-2">{stats.streak}</div>
                                <div className="label-track">{t('dashboard.consecutive_cycles')}</div>
                                <div className="mt-16 text-5xl">🌑</div>
                            </div>
                        </div>
                    </div>

                    {/* HUB: Module Metrics */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-10">

                        {/* Summary Metrics */}
                        <div className="grid grid-cols-2 gap-10">
                            <div className="kinetic-card p-12 h-[240px] flex items-center justify-between group">
                                <div>
                                    <div className="text-7xl font-black text-white mb-2 leading-none group-hover:scale-110 transition-transform origin-left">{stats.quizzesCompleted}</div>
                                    <div className="label-track">{t('dashboard.fragments_solved')}</div>
                                </div>
                                <div className="text-5xl opacity-20 group-hover:opacity-100 transition-opacity">✦</div>
                            </div>

                            <div className="kinetic-card p-12 h-[240px] flex items-center justify-between group">
                                <div>
                                    <div className="text-7xl font-black text-white mb-2 leading-none group-hover:scale-110 transition-transform origin-left">{stats.flashcardsCreated}</div>
                                    <div className="label-track">{t('dashboard.neurons_mapped')}</div>
                                </div>
                                <div className="text-5xl opacity-20 group-hover:opacity-100 transition-opacity">⌬</div>
                            </div>
                        </div>

                        {/* Collections */}
                        <div className="grid grid-cols-2 gap-10">

                            <div className="kinetic-card p-12 h-[420px] flex flex-col">
                                <div className="flex justify-between items-center mb-12 px-2">
                                    <h3 className="label-track text-white/60">{t('dashboard.active_sequences')}</h3>
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                    {recentRoadmaps.length > 0 ? recentRoadmaps.map((rm, i) => (
                                        <button
                                            key={i}
                                            onClick={() => resumeRoadmap(rm)}
                                            className="w-full text-left p-6 rounded-[28px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all flex justify-between items-center group/item"
                                        >
                                            <div className="text-sm font-bold text-white uppercase tracking-tight group-hover/item:italic transition-all">{rm.topic}</div>
                                            <div className="text-[10px] font-black text-white/20 tracking-tighter">0x{i + 1}</div>
                                        </button>
                                    )) : (
                                        <div className="h-full flex items-center justify-center opacity-10 label-track">{t('dashboard.void_state')}</div>
                                    )}
                                </div>
                            </div>

                            <div className="kinetic-card p-12 h-[420px] flex flex-col">
                                <div className="flex justify-between items-center mb-12 px-2">
                                    <h3 className="label-track text-white/60">{t('dashboard.neural_stacks')}</h3>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-white/20 rounded-full"></div>)}
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                    {recentDecks.length > 0 ? recentDecks.map((deck, i) => (
                                        <button
                                            key={i}
                                            onClick={() => openDeck(deck)}
                                            className="w-full text-left p-6 rounded-[28px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-purple-500/30 transition-all flex items-center gap-8 group/item"
                                        >
                                            <span className="text-3xl font-black text-white/10 group-hover/item:text-white/40 group-hover/item:scale-110 transition-all">{deck.cards.length}</span>
                                            <span className="text-sm font-bold text-white uppercase tracking-tight group-hover/item:italic transition-all">{deck.topic}</span>
                                        </button>
                                    )) : (
                                        <div className="h-full flex items-center justify-center opacity-10 label-track">{t('dashboard.void_state')}</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
