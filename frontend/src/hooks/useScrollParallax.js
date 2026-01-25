import { useEffect } from 'react';

/**
 * useScrollParallax - High performance scroll listener 
 * Updates a CSS variable --scroll-y on the document root
 * This avoids React re-renders on every scroll tick.
 */
export default function useScrollParallax() {
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            document.documentElement.style.setProperty('--scroll-y', `${scrolled}px`);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
}
