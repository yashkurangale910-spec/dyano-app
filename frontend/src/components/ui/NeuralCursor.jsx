import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function NeuralCursor() {
    const [cursorType, setCursorType] = useState('default');
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring configuration for that "Magnetic / Fluid" feel
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleOver = (e) => {
            const target = e.target.closest('[data-cursor]');
            if (target) {
                setCursorType(target.getAttribute('data-cursor'));
            } else if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button')) {
                setCursorType('pointer');
            } else {
                setCursorType('default');
            }
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseover', handleOver);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleOver);
        };
    }, [mouseX, mouseY, isVisible]);

    if (typeof window === 'undefined') return null;

    const variants = {
        default: {
            width: 8,
            height: 8,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
        },
        pointer: {
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
        },
        neural: {
            width: 60,
            height: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            rotate: 45
        },
        precision: {
            width: 2,
            height: 40,
            backgroundColor: '#ffffff',
            borderRadius: '0%',
        },
        danger: {
            width: 30,
            height: 30,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '50%',
        }
    };

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
            style={{
                x: springX,
                y: springY,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            <motion.div
                animate={variants[cursorType] || variants.default}
                initial="default"
                className="relative flex items-center justify-center transition-colors duration-300"
            >
                {/* Visual Feedback for Activity */}
                {cursorType === 'neural' && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 border border-white/20 rounded-inherit"
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
