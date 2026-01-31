import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import RoadmapNode from './RoadmapNode';
import RoadmapNodeDetails from './RoadmapNodeDetails';

const RoadmapVisualization = ({ roadmapData, nodeProgress, onNodeClick }) => {
    const [selectedNode, setSelectedNode] = useState(null);

    // Use the coordinates directly from our high-fidelity data
    const positionedNodes = roadmapData.nodes || [];

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        // Also call parent handler if needed (though we handle display internally now)
        if (onNodeClick) onNodeClick(node);
    };

    const handleCompleteNode = (nodeId) => {
        if (onNodeClick) onNodeClick({ id: nodeId }); // Re-use the click handler from parent to toggle completion
    };

    // Draw connections between nodes
    const renderConnections = () => {
        const connections = [];

        positionedNodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
                node.children.forEach((childId) => {
                    const childNode = positionedNodes.find(n => n.id === childId);
                    if (childNode) {
                        // Offset coordinates based on node size (180px width)
                        const x1 = node.x + 90; // center of node
                        const y1 = node.y + 80; // bottom of node approx
                        const x2 = childNode.x + 90;
                        const y2 = childNode.y - 10; // top of node approx

                        // Create a smooth cubic Bezier curve
                        const midY = (y1 + y2) / 2;
                        const pathData = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                        connections.push(
                            <g key={`${node.id}-${childId}`}>
                                {/* Outer glow path */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="url(#line-gradient)"
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    className="opacity-20 blur-[2px]"
                                />
                                {/* Main path with animation */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="url(#line-gradient)"
                                    strokeWidth={2}
                                    strokeDasharray="10,10"
                                    className="road-line-animation opacity-60"
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
    const centerX = (minX + maxX) / 2;
    // const viewBox = `${minX - padding} ${minY - padding} ${viewWidth} ${viewHeight}`;

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

            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={2}
                centerOnInit={true}
                initialPositionX={0}
                initialPositionY={0}
                limitToBounds={false}
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
                            <div style={{ width: viewWidth, height: viewHeight }}>
                                <svg width={viewWidth} height={viewHeight} viewBox={`${minX - padding} ${minY - padding} ${viewWidth} ${viewHeight}`} className="w-full h-full">
                                    <defs>
                                        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                        <style>
                                            {`
                                            .road-line-animation {
                                                animation: dash 30s linear infinite;
                                            }
                                            @keyframes dash {
                                                to {
                                                    stroke-dashoffset: -1000;
                                                }
                                            }
                                        `}
                                        </style>
                                    </defs>

                                    {renderPhases()}
                                    {renderConnections()}

                                </svg>
                                {/* Render Nodes as HTML divs over the SVG for better interactivity */}
                                {positionedNodes.map((node) => (
                                    <RoadmapNode
                                        key={node.id}
                                        node={node}
                                        onClick={handleNodeClick}
                                        status={nodeProgress[node.id] || 'DEFAULT'}
                                    />
                                ))}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>

            {/* Node Details Slide-over */}
            <RoadmapNodeDetails
                node={selectedNode}
                isOpen={!!selectedNode}
                onClose={() => setSelectedNode(null)}
                status={selectedNode ? (nodeProgress[selectedNode.id] || 'DEFAULT') : 'DEFAULT'}
                onComplete={handleCompleteNode}
            />
        </div>
    );
};

export default RoadmapVisualization;
