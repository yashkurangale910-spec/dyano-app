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
    const color = isCompleted ? '#ffd60a' : '#262626';

    if (type === 'vertical') {
        return (
            <div className={`flex flex-col items-center flex-shrink-0 relative ${className}`} style={{ height: `${height}px` }}>
                <div className="w-[3.5px] h-full" style={{ backgroundColor: color }} />
                {/* Connection Dot */}
                <div className="absolute top-0 w-[9px] h-[9px] rounded-full border-[2.5px] -translate-y-1/2"
                    style={{ backgroundColor: '#111111', borderColor: color }} />
            </div>
        );
    }

    if (type === 'curve') {
        // direction determines if it branches right or left
        const strokeWidth = 3.5;
        const cornerRadius = 24;

        // Exact L-shaped curve with rounded corner
        const d = direction === 'right'
            ? `M 2 0 L 2 ${height - cornerRadius} Q 2 ${height} ${cornerRadius} ${height} L ${width} ${height}`
            : `M ${width - 2} 0 L ${width - 2} ${height - cornerRadius} Q ${width - 2} ${height} ${width - cornerRadius} ${height} L 0 ${height}`;

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
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Joint Dot at start */}
                    <circle
                        cx={direction === 'right' ? 2 : width - 2}
                        cy={0}
                        r={strokeWidth + 1}
                        fill="#111111"
                        stroke={color}
                        strokeWidth="2"
                    />
                </svg>
            </div>
        );
    }

    return null;
};

export default RoadmapConnector;
