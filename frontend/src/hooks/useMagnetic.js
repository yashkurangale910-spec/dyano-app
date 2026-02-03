import { useRef, useState, useEffect } from 'react';
import { useSpring } from 'framer-motion';

export function useMagnetic() {
    const ref = useRef(null);
    const x = useSpring(0, { stiffness: 250, damping: 20, mass: 0.5 });
    const y = useSpring(0, { stiffness: 250, damping: 20, mass: 0.5 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Magetic pull radius (e.g., 50px)
        const radius = 60;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < radius) {
            // Apply pull (max 15px shift)
            x.set(distanceX * 0.35);
            y.set(distanceY * 0.35);
        } else {
            x.set(0);
            y.set(0);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return { ref, x, y, handleMouseMove, handleMouseLeave };
}
