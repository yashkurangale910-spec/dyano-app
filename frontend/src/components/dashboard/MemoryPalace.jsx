import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, RoundedBox, Center, Text, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

const Building = ({ position, height, color, label, progress }) => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Subtle hover/pulse
        if (progress > 0.8) {
            meshRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.05;
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <RoundedBox
                    ref={meshRef}
                    args={[1, height, 1]}
                    radius={0.05}
                    smoothness={4}
                >
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={progress * 2}
                        transparent
                        opacity={0.8}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </RoundedBox>
            </Float>

            {/* Windows (Glowing Dots) */}
            <group position={[0, 0, 0.51]}>
                {Array.from({ length: Math.floor(height * 4) }).map((_, i) => (
                    <mesh key={i} position={[0, (i / 4) - (height / 2) + 0.1, 0]}>
                        <planeGeometry args={[0.2, 0.1]} />
                        <meshBasicMaterial color={progress > 0.5 ? "#fff" : "#333"} />
                    </mesh>
                ))}
            </group>

            <Text
                position={[0, height / 2 + 0.5, 0]}
                fontSize={0.2}
                color="white"
                font="/fonts/Inter-Bold.woff" // Assuming font exists or fallback
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
};

const City = ({ progressData }) => {
    const categories = [
        { name: 'Frontend', color: '#00f5ff', progress: 0.8 },
        { name: 'Backend', color: '#7b2cbf', progress: 0.6 },
        { name: 'DevOps', color: '#d946ef', progress: 0.3 },
        { name: 'Mobile', color: '#fbbf24', progress: 0.1 },
        { name: 'Data', color: '#10b981', progress: 0.4 },
        { name: 'Security', color: '#dc2626', progress: 0.9 }
    ];

    return (
        <group>
            {categories.map((cat, i) => {
                const angle = (i / categories.length) * Math.PI * 2;
                const radius = 4;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const height = 1 + cat.progress * 4;

                return (
                    <Building
                        key={cat.name}
                        position={[x, height / 2, z]}
                        height={height}
                        color={cat.color}
                        label={cat.name}
                        progress={cat.progress}
                    />
                );
            })}

            {/* Ground Grid */}
            <gridHelper args={[20, 20, '#ffffff05', '#ffffff05']} position={[0, 0, 0]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[25, 25]} />
                <meshStandardMaterial color="#05010a" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
};

export default function MemoryPalace({ progressData }) {
    return (
        <div className="w-full h-full min-h-[500px] relative bg-[#05010a] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
            <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
                <color attach="background" args={['#05010a']} />
                <fog attach="fog" args={['#05010a', 10, 25]} />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#d946ef" />

                <Center top>
                    <City progressData={progressData} />
                </Center>

                <Environment preset="city" />
            </Canvas>

            {/* Cinematic HUD */}
            <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-[10px] font-black text-cosmic-cyan uppercase tracking-[0.5em] mb-2">Spatial_Memory_Archive</div>
                        <h3 className="text-2xl font-display font-black text-white italic">MEM_PALACE_V1.0</h3>
                    </div>
                    <div className="text-right">
                        <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Atmosphere Density</div>
                        <div className="text-xs font-mono text-white/40">1013.25 hPa</div>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">District status</div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-cosmic-cyan/20 border border-cosmic-cyan/40" />
                            ))}
                        </div>
                    </div>
                    <div className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em]">Rendering Cognitive Cityscape...</div>
                </div>
            </div>
        </div>
    );
}
