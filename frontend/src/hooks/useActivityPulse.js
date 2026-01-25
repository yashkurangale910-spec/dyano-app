import { useState, useEffect } from 'react';

/**
 * useActivityPulse - Hook for creating activity-based pulse animations
 */
export default function useActivityPulse(isActive = false, interval = 2000) {
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setPulse(false);
            return;
        }

        const pulseInterval = setInterval(() => {
            setPulse(true);
            setTimeout(() => setPulse(false), 300);
        }, interval);

        return () => clearInterval(pulseInterval);
    }, [isActive, interval]);

    return pulse;
}
