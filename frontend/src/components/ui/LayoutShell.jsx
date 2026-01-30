import { Suspense } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Navigation from './Navigation';
import CommandPalette from './CommandPalette';
<<<<<<< HEAD
import CustomCursor from './CustomCursor';
=======
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
import KnowledgeUniverse from '../three/KnowledgeUniverse';

export default function LayoutShell() {
    const location = useLocation();

    return (
        <div className="cosmic-bg min-h-screen relative overflow-hidden bg-[#05010d]">
<<<<<<< HEAD
            <CustomCursor />
=======
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
            <CommandPalette />
            {/* 1. PERSISTENT ATMOSPHERIC LAYER (Disciplined Tonal Depth) */}
            <div className="nebula-blob nebula-purple w-[1000px] h-[1000px] -top-[400px] -left-[400px]" />
            <div className="nebula-blob nebula-cyan w-[800px] h-[800px] top-[20%] -right-[200px]" />
            <div className="nebula-blob nebula-blue w-[700px] h-[700px] bottom-[10%] left-[5%]" />


            {/* 2. PERSISTENT 3D UNIVERSE (NO RE-RENDERS ON PAGE CHANGE) */}
            <div className="canvas-container fixed inset-0 z-0 opacity-30 pointer-events-none">
                <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <KnowledgeUniverse count={1200} />
                </Canvas>
            </div>

            {/* 3. PERSISTENT NAVIGATION */}
            <Navigation />

            {/* 4. ANIMATED CONTENT STAGE */}
            <main className="relative z-10 w-full pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Suspense fallback={<div className="h-screen" />}>
                            <Outlet />
                        </Suspense>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* GLOBAL GRAIN TEXTURE */}
            <div className="grain-overlay opacity-[0.02] fixed inset-0 z-[100] pointer-events-none" />
        </div>
    );
}
