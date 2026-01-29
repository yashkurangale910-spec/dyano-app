import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RoadmapNode = ({ node, onClick, isCompleted, isInProgress }) => {
    const getLevelColor = (level) => {
        switch (level) {
            case 'beginner':
                return '#22c55e';
            case 'intermediate':
                return '#3b82f6';
            case 'advanced':
                return '#a855f7';
            default:
                return '#64748b';
        }
    };

    const getStatusClass = () => {
        if (isCompleted) return 'node-completed';
        if (isInProgress) return 'node-in-progress';
        return 'node-default';
    };

    return (
        <motion.g
            whileHover={{ scale: 1.05 }}
            onClick={() => onClick(node)}
            style={{ cursor: 'pointer' }}
        >
            <rect
                x={node.x - 80}
                y={node.y - 25}
                width={160}
                height={50}
                rx={12}
                className={`roadmap-node ${getStatusClass()}`}
                stroke={getLevelColor(node.level)}
                strokeWidth={2}
                fill="var(--card-bg)"
                style={{
                    filter: `drop-shadow(0 0 8px ${getLevelColor(node.level)}44)`,
                    backdropFilter: 'blur(4px)'
                }}
            />
            <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="node-text"
                fill="var(--text-primary)"
                fontSize={14}
                fontWeight={700}
                style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.5)'
                }}
            >
                {node.title}
            </text>
        </motion.g>
    );
};

export default RoadmapNode;
