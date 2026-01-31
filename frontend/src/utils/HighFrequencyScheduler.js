import { useState, useCallback, useRef, useEffect } from 'react';

// "Neural Speed" Scheduler (Phase 23)
// Enforces 60/120 FPS by batching low-priority updates

export const useHighFrequencyState = (initialValue) => {
    const [state, setState] = useState(initialValue);
    const rafRef = useRef(null);
    const valueRef = useRef(initialValue);

    const setHighFreqState = useCallback((newValue) => {
        valueRef.current = newValue;

        // Debounce/Batch updates to the next Animation Frame
        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(() => {
                setState(valueRef.current);
                rafRef.current = null;
            });
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return [state, setHighFreqState];
};

// Scheduler for non-critical background tasks (using requestIdleCallback)
export const scheduleBackgroundTask = (task) => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => task(), { timeout: 1000 });
    } else {
        // Fallback for Safari/others
        setTimeout(task, 1);
    }
};
