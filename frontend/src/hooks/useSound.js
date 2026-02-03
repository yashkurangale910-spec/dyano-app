import { useRef, useCallback } from 'react';

// Recommended asset paths (place in public/sounds/)
const SOUNDS = {
    TICK: '/sounds/ui-tick.mp3',
    CONFIRM: '/sounds/ui-confirm.mp3',
    OPEN: '/sounds/ui-open.mp3',
    ERROR: '/sounds/ui-error.mp3'
};

export function useSound() {
    const audioRefs = useRef({});

    const play = useCallback((soundKey) => {
        const soundPath = SOUNDS[soundKey];
        if (!soundPath) return;

        if (!audioRefs.current[soundKey]) {
            audioRefs.current[soundKey] = new Audio(soundPath);
            audioRefs.current[soundKey].volume = 0.1; // Default -85% to -90% volume
        }

        const audio = audioRefs.current[soundKey];
        audio.currentTime = 0;
        audio.play().catch(e => {
            // Browsers block autoplay/sound without interaction
            // console.log("Sound blocked by browser policy");
        });
    }, []);

    return { play };
}
