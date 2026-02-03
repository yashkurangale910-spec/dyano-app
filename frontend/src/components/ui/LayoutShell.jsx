import { Suspense } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './Navigation';
import CommandPalette from './CommandPalette';

export default function LayoutShell() {
    const location = useLocation();

    return (
        <div className="relative min-h-screen bg-bg-main overflow-x-hidden">
            {/* 1. ATMospheric FOUNDATION (CSS Only, High Perf) */}
            <div className="fixed inset-0 pointer-events-none atmosphere-layer z-0" />
            <div className="fixed inset-0 pointer-events-none premium-grid z-0" />
            <div className="noise-layer" />

            {/* 2. GLOBAL OVERLAYS */}
            <CommandPalette />

            {/* 3. PERSISTENT NAVIGATION */}
            <Navigation />

            {/* 4. CONTENT STAGE */}
            <main className="relative z-10 w-full pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
                        transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <Suspense fallback={<div className="h-screen" />}>
                            <div className="container-cosmic pb-24">
                                <Outlet />
                            </div>
                        </Suspense>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
