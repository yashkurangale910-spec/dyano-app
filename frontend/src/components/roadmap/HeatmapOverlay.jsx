import React from 'react';

const HeatmapOverlay = ({ nodes, nodeProgress }) => {
    const now = Date.now();
    const DAY_MS = 1000 * 60 * 60 * 24;

    return (
        <g className="heatmap-layer pointer-events-none">
            {/* Global blur filter for thermal look */}
            <defs>
                <filter id="thermal-blur">
                    <feGaussianBlur stdDeviation="15" />
                </filter>
                <radialGradient id="heat-hot">
                    <stop offset="0%" stopColor="rgba(255, 50, 50, 0.6)" />
                    <stop offset="100%" stopColor="rgba(255, 50, 50, 0)" />
                </radialGradient>
                <radialGradient id="heat-cold">
                    <stop offset="0%" stopColor="rgba(50, 100, 255, 0.6)" />
                    <stop offset="100%" stopColor="rgba(50, 100, 255, 0)" />
                </radialGradient>
            </defs>

            {nodes.map(node => {
                const progress = nodeProgress[node.id] || {};
                let intensity = 0; // 0 (Neutral) to 1 (Hot) or -1 (Cold)
                let radius = 120;

                if (progress.status === 'MASTERED' && progress.masteredAt) {
                    const daysSince = (now - new Date(progress.masteredAt).getTime()) / DAY_MS;

                    if (daysSince < 1) {
                        intensity = 1; // Burning Hot (Just mastered)
                    } else if (daysSince < 3) {
                        intensity = 0.6; // Warm
                    } else if (daysSince > 7) {
                        intensity = -0.5; // Cooling
                    } else if (daysSince > 14) {
                        intensity = -1; // Frozen
                        radius = 180; // Spread out the cold
                    }
                } else if (progress.status === 'SKIPPED') {
                    intensity = -0.8; // Cold spot
                }

                if (intensity === 0) return null;

                return (
                    <circle
                        key={node.id}
                        cx={node.x + 90} // Center X
                        cy={node.y + 40} // Center Y
                        r={radius}
                        fill={`url(#${intensity > 0 ? 'heat-hot' : 'heat-cold'})`}
                        opacity={Math.abs(intensity)}
                        style={{ mixBlendMode: 'screen', filter: 'url(#thermal-blur)' }}
                    />
                );
            })}
        </g>
    );
};

export default HeatmapOverlay;
