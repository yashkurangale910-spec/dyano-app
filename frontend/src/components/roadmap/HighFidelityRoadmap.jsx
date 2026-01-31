import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import axios from 'axios';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Share2, Eye, Flame } from 'lucide-react';
import RoadmapNode from './RoadmapNode';
import RoadmapNodeDetails from './RoadmapNodeDetails';
import HeatmapOverlay from './HeatmapOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Swords, Zap, Lock, Film, Monitor, Box } from 'lucide-react';

// Phase 24: Mental Callus
import CognitiveCageMatch from '../hardcore/CognitiveCageMatch';
import IsolationMode from '../hardcore/IsolationMode';
import NeuralOverclockReader from '../hardcore/NeuralOverclockReader';
// Phase 25: Cinematic Reality
import CinematicExporter from '../polish/CinematicExporter';
import NeuralWallpaper from '../polish/NeuralWallpaper';
import SingularityTerminal from '../polish/SingularityTerminal';
// Phase 26: The Finale
import NeuralScent from '../finale/NeuralScent';
import VrZenithLibrary from '../finale/VrZenithLibrary';
import BciInterface from '../finale/BciInterface';
import FinalUplink from '../finale/FinalUplink';

import { useHighFrequencyState, scheduleBackgroundTask } from '../../utils/HighFrequencyScheduler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

const RoadmapVisualization = ({ roadmapData, nodeProgress, onNodeClick, isDungeonMode = false }) => {
    // Neural Speed: Use RAF scheduler for interaction state
    const [selectedNode, setSelectedNode] = useHighFrequencyState(null);
    const [isFractalActive, setIsFractalActive] = useState(false);
    const [fractalNode, setFractalNode] = useState(null);
    const [expertMesh, setExpertMesh] = useState(null);
    const [showExpertMesh, setShowExpertMesh] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [hiveUsers, setHiveUsers] = useState([]);
    const [lastActivityTime, setLastActivityTime] = useState(Date.now());
    const [isIdle, setIsIdle] = useState(false);

    // Hacker Tier Overlay State
    const [activeOverlay, setActiveOverlay] = useState(null); // 'PVP', 'TERMINAL', 'FINALE', etc.

    // Optimistic UI State
    const [optimisticUpdates, setOptimisticUpdates] = useState({});

    // Cognitive Load Detection (Phase 13 Hardcore)
    useEffect(() => {
        const handleActivity = () => {
            setLastActivityTime(Date.now());
            // Neural Speed: Defer non-critical idle checks
            scheduleBackgroundTask(() => {
                if (isIdle) setIsIdle(false);
            });
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('scroll', handleActivity);

        const checkIdle = setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivityTime;
            if (timeSinceLastActivity > 30000 && !isIdle) {
                setIsIdle(true);
            }
        }, 1000);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            clearInterval(checkIdle);
        };
    }, [lastActivityTime, isIdle]);

    // Use the coordinates directly from our high-fidelity data
    const positionedNodes = roadmapData.nodes || [];

    // Simulate Hive Presence (Phase 10)
    useEffect(() => {
        if (!positionedNodes.length) return;

        // Initial set of users
        const initialUsers = Array.from({ length: 12 }).map((_, i) => ({
            id: `hive-${i}`,
            nodeId: positionedNodes[Math.floor(Math.random() * positionedNodes.length)].id,
            color: i % 3 === 0 ? '#00f5ff' : i % 3 === 1 ? '#d946ef' : '#fbbf24',
            offset: { x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 40 }
        }));
        setHiveUsers(initialUsers);

        // Periodically move some users to simulate activity
        const interval = setInterval(() => {
            setHiveUsers(prev => prev.map(u => Math.random() > 0.8 ? {
                ...u,
                nodeId: positionedNodes[Math.floor(Math.random() * positionedNodes.length)].id
            } : u));
        }, 10000);
        return () => clearInterval(interval);
    }, [positionedNodes.length]);

    useEffect(() => {
        const fetchExpertMesh = async () => {
            // Neural Speed: Defer heavy mesh calculation
            scheduleBackgroundTask(async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
                    const category = roadmapData.title?.includes('Frontend') ? 'Frontend' :
                        roadmapData.title?.includes('Backend') ? 'Backend' : 'Frontend';
                    const response = await axios.get(`${API_URL}/progress/expert-mesh/${category}`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    if (response.data.success) {
                        setExpertMesh(response.data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch expert mesh:", err);
                }
            });
        };
        if (roadmapData.nodes) fetchExpertMesh();
    }, [roadmapData.title]);


    const handleNodeClick = (node) => {
        setSelectedNode(node);
        if (onNodeClick) onNodeClick(node);
    };

    const handleCompleteNode = (nodeId) => {
        // Optimistic UI: Mark as done immediately
        setOptimisticUpdates(prev => ({
            ...prev,
            [nodeId]: 'MASTERED'
        }));

        if (onNodeClick) onNodeClick({ id: nodeId });
    };

    // Draw connections between nodes (Volumetric Neural Tubes)
    const renderConnections = () => {
        const connections = [];

        positionedNodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
                node.children.forEach((childId) => {
                    const childNode = positionedNodes.find(n => n.id === childId);
                    if (childNode) {
                        const x1 = node.x + 90;
                        const y1 = node.y + 80;
                        const x2 = childNode.x + 90;
                        const y2 = childNode.y - 10;
                        const midY = (y1 + y2) / 2;
                        const pathData = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                        connections.push(
                            <g key={`${node.id}-${childId}`} className="neural-connection">
                                {/* Core Tube (Dark) */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="rgba(0,0,0,0.5)"
                                    strokeWidth={8}
                                    strokeLinecap="round"
                                />
                                {/* Outer Glow (Volumetric) */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="url(#line-gradient)"
                                    strokeWidth={6}
                                    strokeLinecap="round"
                                    className="opacity-20 blur-[4px]"
                                />
                                {/* Inner Core (Bright) */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="url(#line-gradient)"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    className="opacity-80"
                                />
                                {/* Data Pulse (Ray) */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth={2}
                                    strokeDasharray="20,100"
                                    className="road-line-animation opacity-100 mix-blend-overlay"
                                />
                            </g>
                        );
                    }
                });
            }
        });

        return connections;
    };

    // Calculate bounds
    if (positionedNodes.length === 0) return <div>No nodes to display</div>;

    const allX = positionedNodes.map(n => n.x);
    const allY = positionedNodes.map(n => n.y);
    const minX = Math.min(...allX, 0);
    const maxX = Math.max(...allX, 1000);
    const minY = Math.min(...allY, 0);
    const maxY = Math.max(...allY, 1000);

    // Add padding
    const padding = 200;
    const viewWidth = maxX - minX + (padding * 2);
    const viewHeight = maxY - minY + (padding * 2);

    // Render phase backgrounds
    const renderPhases = () => {
        if (!roadmapData.phases || roadmapData.phases.length === 0) return null;

        return roadmapData.phases.map(phase => (
            <g key={phase.id}>
                <rect
                    x={minX - padding}
                    y={phase.minY}
                    width={viewWidth}
                    height={phase.maxY - phase.minY}
                    fill={phase.color}
                    rx={40}
                    opacity={0.05}
                />
                <text
                    x={minX - padding + 50}
                    y={phase.minY + 60}
                    fill="rgba(255,255,255,0.2)"
                    fontSize="4rem"
                    fontWeight="900"
                    textTransform="uppercase"
                    className="font-display select-none pointer-events-none"
                >
                    {phase.title}
                </text>
            </g>
        ));
    };

    return (
        <div className="relative w-full h-full min-h-[800px] bg-black/20 overflow-hidden rounded-[2.5rem]">

            <AnimatePresence>
                {isFractalActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-center p-20"
                    >
                        <div className="absolute top-10 right-10">
                            <button
                                onClick={() => setIsFractalActive(false)}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                            >
                                <RotateCcw size={24} />
                            </button>
                        </div>

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-96 h-96 border-2 border-cosmic-cyan/30 rounded-full flex items-center justify-center relative mb-12"
                        >
                            <div className="absolute inset-0 bg-cosmic-cyan/5 blur-3xl rounded-full" />
                            <div className="text-4xl font-display font-black text-cosmic-cyan uppercase italic tracking-tighter">
                                {fractalNode?.title || 'Neural_Core'}
                            </div>
                        </motion.div>

                        <div className="space-y-6 max-w-2xl">
                            <div className="text-xs font-black text-gray-500 uppercase tracking-[0.5em]">Fractal Dimension Accessed</div>
                            <h2 className="text-6xl font-display font-black text-white tracking-tighter">
                                DEEP <span className="text-gradient-cosmic">SYNAPSE</span>
                            </h2>
                            <p className="text-gray-400 text-xl font-light leading-relaxed">
                                You have zoomed into the internal architecture of <b>{fractalNode?.title}</b>. Procudural sub-modules are being synthesized from the Dyano swarm.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-12">
                                {['Core Logic', 'Edge Cases', 'Optimization', 'Security'].map(sub => (
                                    <div key={sub} className="p-6 bg-white/5 border border-white/5 rounded-3xl text-left group hover:border-cosmic-cyan/50 transition-all cursor-pointer">
                                        <div className="text-[8px] text-gray-600 font-black uppercase mb-2">Module</div>
                                        <div className="text-sm font-bold text-white group-hover:text-cosmic-cyan">{sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={2.5}
                centerOnInit={true}
                limitToBounds={false}
                onTransformed={(p) => {
                    const scale = p.state.scale;
                    if (scale > 2.2 && !isFractalActive) {
                        const mockNode = selectedNode || positionedNodes[0];
                        setFractalNode(mockNode);
                        setIsFractalActive(true);
                    }
                }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        {/* Controls */}
                        <div className="absolute top-6 right-6 z-30 flex flex-col gap-2">
                            <button onClick={() => zoomIn()} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-all shadow-lg border border-white/5">
                                <ZoomIn size={20} />
                            </button>
                            <button onClick={() => zoomOut()} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-all shadow-lg border border-white/5">
                                <ZoomOut size={20} />
                            </button>
                            <button onClick={() => resetTransform()} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-all shadow-lg border border-white/5">
                                <RotateCcw size={20} />
                            </button>
                        </div>

                        {/* Global Progress Header (NEW) */}
                        <div className="absolute top-6 left-6 z-30 flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 pl-4 rounded-xl border border-white/5 shadow-lg">
                            <button
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={`p-2 rounded-lg transition-all ${showHeatmap ? 'bg-orange-500 text-white shadow-glow-orange' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Toggle Forgetting Heatmap"
                            >
                                <Flame size={18} fill={showHeatmap ? "currentColor" : "none"} className={showHeatmap ? "animate-pulse" : ""} />
                            </button>
                            <button
                                onClick={() => setShowExpertMesh(!showExpertMesh)}
                                className={`p-2 rounded-lg transition-all ${showExpertMesh ? 'bg-cosmic-cyan text-black shadow-glow-cyan' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Toggle Cerebral Mesh"
                            >
                                <Eye size={18} />
                            </button>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Progress</div>
                                <div className="text-xl font-display font-black text-white leading-none">
                                    {Math.round((Object.values(nodeProgress).filter(s => s === 'MASTERED').length / Math.max(positionedNodes.length, 1)) * 100)}%
                                </div>
                            </div>
                            <div className="h-10 w-1 bg-white/10 rounded-full" />
                            <div className="w-24">
                                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cosmic-cyan to-cosmic-purple transition-all duration-1000 ease-out"
                                        style={{ width: `${(Object.values(nodeProgress).filter(s => s === 'MASTERED').length / Math.max(positionedNodes.length, 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="text-[8px] text-gray-500 mt-1 font-bold text-right">
                                    {Object.values(nodeProgress).filter(s => s === 'MASTERED').length}/{positionedNodes.length} NODES
                                </div>
                            </div>
                        </div>

                        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                            <motion.div
                                animate={{ filter: isIdle ? 'blur(15px) grayscale(0.8) brightness(0.5)' : 'blur(0px) grayscale(0) brightness(1)' }}
                                transition={{ duration: 2 }}
                                style={{ width: viewWidth, height: viewHeight }}
                            >
                                <svg width={viewWidth} height={viewHeight} viewBox={`${minX - padding} ${minY - padding} ${viewWidth} ${viewHeight}`} className="w-full h-full">
                                    <defs>
                                        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor={isDungeonMode ? "#7f1d1d" : "#06b6d4"} />
                                            <stop offset="100%" stopColor={isDungeonMode ? "#ef4444" : "#8b5cf6"} />
                                        </linearGradient>
                                        <filter id="expert-glow">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                        <style>
                                            {`
                                            .road-line-animation {
                                                animation: dash ${isDungeonMode ? '15s' : '30s'} linear infinite;
                                            }
                                            @keyframes dash {
                                                to {
                                                    stroke-dashoffset: -1000;
                                                }
                                            }
                                            .expert-mesh-pulse {
                                                animation: expertPulse 4s ease-in-out infinite;
                                            }
                                            @keyframes expertPulse {
                                                0%, 100% { opacity: 0.1; }
                                                50% { opacity: 0.3; }
                                            }
                                        `}
                                        </style>
                                    </defs>

                                    {renderPhases()}

                                    {showHeatmap && (
                                        <HeatmapOverlay nodes={positionedNodes} nodeProgress={nodeProgress} />
                                    )}

                                    {showExpertMesh && expertMesh && (
                                        <g className="expert-mesh-overlay pointer-events-none">
                                            {expertMesh.connections.map(([id1, id2], idx) => {
                                                // Simplified expert positioning - offset from real nodes or arbitrary
                                                const x1 = 200 + idx * 100;
                                                const y1 = 100 + idx * 150;
                                                const x2 = x1 + 50;
                                                const y2 = y1 + 100;
                                                return (
                                                    <line
                                                        key={`exp-conn-${idx}`}
                                                        x1={x1} y1={y1} x2={x2} y2={y2}
                                                        stroke="white"
                                                        strokeWidth={1}
                                                        strokeDasharray="5,5"
                                                        className="expert-mesh-pulse"
                                                    />
                                                );
                                            })}
                                            {expertMesh.meshNodes.map((enode, idx) => (
                                                <g key={enode.id} transform={`translate(${200 + idx * 100}, ${100 + idx * 150})`}>
                                                    <circle r={30} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                                                    <text
                                                        y={45}
                                                        textAnchor="middle"
                                                        fill="rgba(255,255,255,0.3)"
                                                        fontSize="10px"
                                                        className="font-black uppercase tracking-widest"
                                                    >
                                                        {enode.title}
                                                    </text>
                                                </g>
                                            ))}
                                        </g>
                                    )}
                                    {renderConnections()}

                                    {/* Neural Hive-Link: Real-time user presence */}
                                    {hiveUsers.map(user => {
                                        const node = positionedNodes.find(n => n.id === user.nodeId);
                                        if (!node) return null;
                                        return (
                                            <motion.g
                                                key={user.id}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                    x: node.x + 90 + user.offset.x,
                                                    y: node.y + 40 + user.offset.y
                                                }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                            >
                                                <circle r={3} fill={user.color} className="animate-pulse shadow-[0_0_10px_white]" />
                                                <circle r={8} fill="none" stroke={user.color} strokeWidth={0.5} opacity={0.3} className="animate-ping" />
                                            </motion.g>
                                        );
                                    })}
                                </svg>
                                {/* Render Nodes as HTML divs over the SVG for better interactivity */}
                                {positionedNodes.map((node, index) => {
                                    // Neural Speed: Check Optimistic State first
                                    const progressData = nodeProgress[node.id] || {};
                                    let status = progressData.status || (typeof nodeProgress[node.id] === 'string' ? nodeProgress[node.id] : 'DEFAULT');

                                    if (optimisticUpdates[node.id]) {
                                        status = optimisticUpdates[node.id];
                                    }

                                    const masteredAt = progressData.masteredAt || null;

                                    return (
                                        <RoadmapNode
                                            key={node.id}
                                            node={node}
                                            onClick={handleNodeClick}
                                            status={status}
                                            masteredAt={masteredAt}
                                            isDungeonMode={isDungeonMode}
                                            isBoss={(index + 1) % 4 === 0}
                                        />
                                    );
                                })}
                            </motion.div>
                        </TransformComponent>

                        {/* Cognitive Disconnect Overlay (Phase 13 Hardcore) */}
                        <AnimatePresence>
                            {isIdle && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center p-12 border border-cosmic-cyan/20 bg-black/60 rounded-[3rem] shadow-glow-cyan"
                                    >
                                        <div className="text-cosmic-cyan mb-6 flex justify-center">
                                            <Eye size={64} className="animate-pulse" />
                                        </div>
                                        <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">Cognitive_Disconnect</h3>
                                        <p className="text-gray-400 text-sm font-light uppercase tracking-widest">Neural focus lost. Interaction required to maintain sync.</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </TransformWrapper>

            {/* ================================================================================== */}
            {/* HACKER TIER INTEGRATIONS (PHASE 24-26)                                         */}
            {/* ================================================================================== */}

            {/* 1. Hardware/Environment Overlays */}
            {activeOverlay === 'ISOLATION' && (
                <IsolationMode onExit={() => setActiveOverlay(null)}>
                    <div className="flex items-center justify-center h-screen text-gray-500 font-mono">
                        ISOLATION MODE ACTIVE. NO DISTRACTIONS.
                    </div>
                </IsolationMode>
            )}
            {activeOverlay === 'WALLPAPER' && <NeuralWallpaper onExit={() => setActiveOverlay(null)} />}
            {activeOverlay === 'TERMINAL' && <SingularityTerminal isOpen={true} onClose={() => setActiveOverlay(null)} />}

            {/* 2. Modals/Popups */}
            {activeOverlay === 'PVP' && <CognitiveCageMatch onClose={() => setActiveOverlay(null)} />}
            {activeOverlay === 'SPEED_READ' && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center" onClick={() => setActiveOverlay(null)}>
                    <div onClick={e => e.stopPropagation()}>
                        <NeuralOverclockReader text={"React Fiber reconcile diff algorithm virtual DOM hooks suspense concurrent mode hydration"} />
                    </div>
                </div>
            )}
            {activeOverlay === 'EXPORT' && <CinematicExporter onClose={() => setActiveOverlay(null)} />}
            {activeOverlay === 'VR_ZENITH' && <VrZenithLibrary onClose={() => setActiveOverlay(null)} />}
            {activeOverlay === 'BCI' && <BciInterface />}
            {activeOverlay === 'FINALE' && <FinalUplink />}

            {/* 3. Widgets (Always visible or toggled) */}
            <div className="absolute bottom-6 left-6 z-30">
                <NeuralScent />
            </div>

            {/* 4. Hacker System Tray (Controls) */}
            <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <button onClick={() => setActiveOverlay('TERMINAL')} className="p-2 hover:bg-white/10 rounded text-green-500" title="Singularity Terminal (~)">
                        <Terminal size={20} />
                    </button>
                    <button onClick={() => setActiveOverlay('PVP')} className="p-2 hover:bg-white/10 rounded text-red-500" title="Cognitive Cage Match">
                        <Swords size={20} />
                    </button>
                    <button onClick={() => setActiveOverlay('SPEED_READ')} className="p-2 hover:bg-white/10 rounded text-blue-400" title="Neural Overclock">
                        <Zap size={20} />
                    </button>
                    <button onClick={() => setActiveOverlay('ISOLATION')} className="p-2 hover:bg-white/10 rounded text-gray-400" title="Isolation Mode">
                        <Lock size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <button onClick={() => setActiveOverlay('EXPORT')} className="p-2 hover:bg-white/10 rounded text-purple-400" title="Cinematic Export">
                        <Film size={20} />
                    </button>
                    <button onClick={() => setActiveOverlay('WALLPAPER')} className="p-2 hover:bg-white/10 rounded text-indigo-400" title="Neural Wallpaper">
                        <Monitor size={20} />
                    </button>
                    <button onClick={() => setActiveOverlay('VR_ZENITH')} className="p-2 hover:bg-white/10 rounded text-teal-400" title="VR Zenith Library">
                        <Box size={20} />
                    </button>
                </div>

                <button
                    onClick={() => setActiveOverlay('FINALE')}
                    className="mt-2 px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_white]"
                >
                    INITIATE FINAL UPLINK
                </button>
            </div>


            {/* Node Details Slide-over */}
            <RoadmapNodeDetails
                node={selectedNode}
                isOpen={!!selectedNode}
                onClose={() => setSelectedNode(null)}
                status={selectedNode ? (optimisticUpdates[selectedNode.id] || nodeProgress[selectedNode.id]?.status || (typeof nodeProgress[selectedNode.id] === 'string' ? nodeProgress[selectedNode.id] : 'DEFAULT')) : 'DEFAULT'}
                onComplete={handleCompleteNode}
                allNodes={positionedNodes}
                nodeProgress={nodeProgress}
            />
        </div>
    );
};

export default RoadmapVisualization;
