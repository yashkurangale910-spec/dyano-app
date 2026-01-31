import React from 'react';

const RoadmapConnector = ({
    type = 'vertical',
    status = 'locked',
    height = 40,
    width = 150,
    direction = 'right',
    className = ""
}) => {
    const isCompleted = status === 'completed';
    // Use gradient IDs defined in HighFidelityRoadmap
    const stroke = isCompleted ? '#22c55e' : 'url(#line-gradient)';
    const opacity = isCompleted ? 0.8 : 0.3;

    if (type === 'vertical') {
        return (
            <div className={`flex flex-col items-center flex-shrink-0 relative ${className}`} style={{ height: `${height}px` }}>
                <div className="w-[2px] h-full bg-gradient-to-b from-cosmic-cyan/20 to-cosmic-purple/20" />
                {/* Connection Dot */}
                <div className="absolute top-0 w-2 h-2 rounded-full border border-white/20 bg-black -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            </div>
        );
    }

    if (type === 'curve') {
        // direction determines if it branches right or left
        const strokeWidth = 2;
        const cornerRadius = 24;

        // Exact L-shaped curve with rounded corner
        const d = direction === 'right'
            ? `M 0 0 L 0 ${height - cornerRadius} Q 0 ${height} ${cornerRadius} ${height} L ${width} ${height}`
            : `M ${width} 0 L ${width} ${height - cornerRadius} Q ${width} ${height} ${width - cornerRadius} ${height} L 0 ${height}`;

        return (
            <div className={`relative flex-shrink-0 ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 left-0 overflow-visible"
                >
                    <path
                        d={d}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={opacity}
                        fill="none"
                    />
                    {/* Joint Dot at start */}
                    <circle
                        cx={direction === 'right' ? 0 : width}
                        cy={0}
                        r={3}
                        fill="#000"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                    />
                </svg>
            </div>
        );
    }

    return null;
};

export default RoadmapConnector;
