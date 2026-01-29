import React, { useState, useEffect } from 'react';
import RoadmapNode from './HighFidelityNode';

const RoadmapVisualization = ({ roadmapData, completedNodes, onNodeClick }) => {
    const [selectedNode, setSelectedNode] = useState(null);
    const [inProgressNodes, setInProgressNodes] = useState(new Set());

    // Use the coordinates directly from our high-fidelity data
    const positionedNodes = roadmapData.nodes;

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        // Call external handler for modal
        if (onNodeClick) onNodeClick(node);
    };

    // Draw connections between nodes
    const renderConnections = () => {
        const connections = [];

        positionedNodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
                node.children.forEach((childId) => {
                    const childNode = positionedNodes.find(n => n.id === childId);
                    if (childNode) {
                        const x1 = node.x;
                        const y1 = node.y + 25;
                        const x2 = childNode.x;
                        const y2 = childNode.y - 25;

                        // Create a smooth cubic Bezier curve
                        // The control points are placed vertically between the nodes
                        const midY = (y1 + y2) / 2;
                        const pathData = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                        connections.push(
                            <path
                                key={`${node.id}-${childId}`}
                                d={pathData}
                                fill="none"
                                stroke="url(#line-gradient)"
                                strokeWidth={3}
                                strokeDasharray="10,5"
                                markerEnd="url(#arrowhead)"
                                className="transition-all duration-700 ease-in-out hover:stroke-cosmic-cyan/50"
                                style={{ strokeDashoffset: 0 }}
                            />
                        );
                    }
                });
            }
        });

        return connections;
    };

    // Calculate bounds
    const allX = positionedNodes.map(n => n.x);
    const allY = positionedNodes.map(n => n.y);
    const minX = Math.min(...allX, 0);
    const maxX = Math.max(...allX, 1000);
    const minY = Math.min(...allY, 0);
    const maxY = Math.max(...allY, 1000);

    // Add padding
    const padding = 150;
    const viewWidth = maxX - minX + (padding * 2);
    const viewHeight = maxY - minY + (padding * 2);
    const viewBox = `${minX - padding} ${minY - padding} ${viewWidth} ${viewHeight}`;

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
                    rx={20}
                    opacity={0.3}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                />
                <text
                    x={70}
                    y={phase.minY + 30}
                    className="phase-label"
                    fill="var(--text-secondary)"
                    fontSize="0.85rem"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                >
                    {phase.title}
                </text>
            </g>
        ));
    };


    return (
        <div className="roadmap-visualization">
            <svg width="100%" height="auto" viewBox={viewBox} preserveAspectRatio="xMidYMin meet" className="drop-shadow-2xl">
                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--cosmic-cyan)" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="var(--cosmic-purple)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--cosmic-cyan)" stopOpacity="0.2" />
                    </linearGradient>
                    <marker
                        id="arrowhead"
                        markerWidth="12"
                        markerHeight="8"
                        refX="11"
                        refY="4"
                        orient="auto"
                    >
                        <polygon points="0 0, 12 4, 0 8" fill="var(--cosmic-cyan)" opacity="0.6" />
                    </marker>
                </defs>
                {renderPhases()}
                {renderConnections()}
                {positionedNodes.map((node) => (
                    <RoadmapNode
                        key={node.id}
                        node={node}
                        onClick={handleNodeClick}
                        isCompleted={completedNodes.has(node.id)}
                        isInProgress={inProgressNodes.has(node.id)}
                    />
                ))}
            </svg>

            {selectedNode && (
                <div className="node-details">
                    <h3>{selectedNode.title}</h3>
                    <p>{selectedNode.description}</p>
                    <span className={`level-badge ${selectedNode.level}`}>
                        {selectedNode.level}
                    </span>
                </div>
            )}
        </div>
    );
};

export default RoadmapVisualization;
