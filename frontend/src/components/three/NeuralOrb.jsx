import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function OrbMesh({ status, personality }) {
    const meshRef = useRef();

    // Mapping colors to personalities
    const colors = {
        friendly: '#00f5ff',
        strict: '#ff4d4d',
        creative: '#e0aaff',
        socratic: '#7b2cbf',
        professional: '#3b82f6',
        robotic: '#ffffff'
    };

    const activeColor = colors[personality] || colors.friendly;

    useFrame((state) => {
        if (meshRef.current) {
            const speedMultiplier = status === 'loading' ? 4 : 1;
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speedMultiplier;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speedMultiplier;

            // Pulse effect when loading
            if (status === 'loading') {
                const s = 1.1 + Math.sin(state.clock.elapsedTime * 15) * 0.05;
                meshRef.current.scale.set(s, s, s);
            } else {
                meshRef.current.scale.set(1, 1, 1);
            }
        }
    });

    return (
        <Float speed={status === 'loading' ? 10 : 2} rotationIntensity={status === 'loading' ? 2 : 1} floatIntensity={status === 'loading' ? 4 : 2}>
            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color={status === 'loading' ? '#ffffff' : activeColor}
                    speed={status === 'loading' ? 10 : 2}
                    distort={status === 'loading' ? 0.8 : 0.4}
                    radius={1}
                />
            </Sphere>
        </Float>
    );
}

export default function NeuralOrb({ status, personality }) {
    return (
        <div className="w-full h-48 relative cursor-pointer group">
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbMesh status={status} personality={personality} />
            </Canvas>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] group-hover:text-white/40 transition-colors">
                    Neural Core
                </div>
            </div>
        </div>
    );
}
