import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapNode from './RoadmapNode';
import RoadmapNodeDetails from './RoadmapNodeDetails';

const HighFidelityRoadmap = ({ roadmapData, nodeProgress = {}, onNodeClick }) => {
    const [selectedNode, setSelectedNode] = useState(null);
    const positionedNodes = roadmapData.nodes || [];

    if (positionedNodes.length === 0) return <div className="p-20 text-text-muted font-mono uppercase tracking-widest">No nodes available in current trajectory.</div>;

    const allX = positionedNodes.map(n => n.x);
    const allY = positionedNodes.map(n => n.y);
    const minX = Math.min(...allX, 0);
    const maxX = Math.max(...allX, 1000);
    const minY = Math.min(...allY, 0);
    const maxY = Math.max(...allY, 1000);

    const padding = 200;
    const viewWidth = maxX - minX + (padding * 2);
    const viewHeight = maxY - minY + (padding * 2);

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        if (onNodeClick) onNodeClick(node);
    };

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
                            <g key={`${node.id}-${childId}`} className="opacity-20 hover:opacity-40 transition-opacity">
                                <path d={pathData} fill="none" stroke="white" strokeWidth={1} />
                                <circle cx={x1} cy={y1} r={2} fill="white" />
                                <circle cx={x2} cy={y2} r={2} fill="white" />
                            </g>
                        );
                    }
                });
            }
        });
        return connections;
    };

    const renderPhases = () => {
        if (!roadmapData.phases) return null;
        return roadmapData.phases.map(phase => (
            <g key={phase.id}>
                <rect
                    x={minX - padding}
                    y={phase.minY}
                    width={viewWidth}
                    height={phase.maxY - phase.minY}
                    fill="white"
                    opacity={0.02}
                />
                <text
                    x={minX - padding + 40}
                    y={phase.minY + 60}
                    fill="white"
                    opacity={0.1}
                    fontSize="48px"
                    fontWeight="900"
                    className="uppercase tracking-tighter"
                >
                    {phase.title}
                </text>
            </g>
        ));
    };

    return (
        <div className="relative w-full h-full min-h-[700px] overflow-hidden">
            <TransformWrapper
                initialScale={1}
                minScale={0.4}
                maxScale={2}
                centerOnInit={true}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div className="absolute top-6 right-6 z-30 flex flex-col gap-2">
                            <button onClick={() => zoomIn()} className="p-3 bg-white/[0.05] border border-white/10 rounded-xl text-white backdrop-blur-md hover:bg-white/10 transition-all">
                                <ZoomIn size={18} />
                            </button>
                            <button onClick={() => zoomOut()} className="p-3 bg-white/[0.05] border border-white/10 rounded-xl text-white backdrop-blur-md hover:bg-white/10 transition-all">
                                <ZoomOut size={18} />
                            </button>
                            <button onClick={() => resetTransform()} className="p-3 bg-white/[0.05] border border-white/10 rounded-xl text-white backdrop-blur-md hover:bg-white/10 transition-all">
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        <div className="absolute top-6 left-6 z-30 flex items-center gap-6 bg-white/[0.05] border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
                            <Activity size={18} className="text-accent-cyan" />
                            <div>
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Path Progress</div>
                                <div className="text-xl font-black text-white">
                                    {Math.round((Object.values(nodeProgress).filter(s => s === 'MASTERED' || s.status === 'MASTERED').length / positionedNodes.length) * 100)}%
                                </div>
                            </div>
                        </div>

                        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                            <div style={{ width: viewWidth, height: viewHeight }}>
                                <svg width={viewWidth} height={viewHeight} viewBox={`${minX - padding} ${minY - padding} ${viewWidth} ${viewHeight}`} className="w-full h-full">
                                    {renderPhases()}
                                    {renderConnections()}
                                </svg>

                                {positionedNodes.map((node) => {
                                    const progress = nodeProgress[node.id] || {};
                                    const status = progress.status || (typeof progress === 'string' ? progress : 'DEFAULT');
                                    return (
                                        <RoadmapNode
                                            key={node.id}
                                            node={node}
                                            onClick={handleNodeClick}
                                            status={status}
                                        />
                                    );
                                })}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>

            <RoadmapNodeDetails
                node={selectedNode}
                isOpen={!!selectedNode}
                onClose={() => setSelectedNode(null)}
                status={selectedNode ? (nodeProgress[selectedNode.id]?.status || (typeof nodeProgress[selectedNode.id] === 'string' ? nodeProgress[selectedNode.id] : 'DEFAULT')) : 'DEFAULT'}
                onComplete={(id) => {
                    if (onNodeClick) onNodeClick({ id });
                }}
            />
        </div>
    );
};

export default HighFidelityRoadmap;
