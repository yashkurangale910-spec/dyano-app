import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Center } from '@react-three/drei';
import * as THREE from 'three';

const BrainPoints = ({ density = {} }) => {
    const ref = useRef();

    // Generate point cloud in a brain-like shape (simplified ellipsoid with noise)
    const [positions, colors] = useMemo(() => {
        const count = 4000;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        // Define centers for different brain regions (Categories)
        const regions = {
            'Frontend': { center: new THREE.Vector3(1, 0.5, 0), color: new THREE.Color('#00f5ff') },
            'Backend': { center: new THREE.Vector3(-1, 0.5, 0), color: new THREE.Color('#7b2cbf') },
            'DevOps': { center: new THREE.Vector3(0, 1, -0.5), color: new THREE.Color('#d946ef') },
            'Mobile': { center: new THREE.Vector3(0, -0.5, 1), color: new THREE.Color('#fbbf24') },
            'Data Science': { center: new THREE.Vector3(0, 0, -1), color: new THREE.Color('#10b981') },
            'Security': { center: new THREE.Vector3(0, 0.5, 0.5), color: new THREE.Color('#dc2626') }
        };

        for (let i = 0; i < count; i++) {
            // Base ellipsoid shape
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.5 * Math.pow(Math.random(), 1 / 3);

            let x = r * Math.sin(phi) * Math.cos(theta);
            let y = r * Math.sin(phi) * Math.sin(theta) * 1.2; // Taller
            let z = r * Math.cos(phi) * 0.8; // Flat-ish back

            // Brain asymmetry
            if (x > 0) x *= 0.9;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            // Coloring based on proximity to region centers and their 'density'
            let finalColor = new THREE.Color('#110425'); // Base dark color
            let maxInluence = 0;

            const p = new THREE.Vector3(x, y, z);

            Object.entries(regions).forEach(([name, region]) => {
                const dist = p.distanceTo(region.center);
                const influence = Math.max(0, 1 - dist / 1.5) * (density[name] || 0.1);

                if (influence > maxInluence) {
                    maxInluence = influence;
                    finalColor.lerp(region.color, influence);
                }
            });

            col[i * 3] = finalColor.r;
            col[i * 3 + 1] = finalColor.g;
            col[i * 3 + 2] = finalColor.b;
        }
        return [pos, col];
    }, [density]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref.current.rotation.y = time * 0.1;
        ref.current.rotation.x = Math.sin(time * 0.2) * 0.1;

        // Pulse effect
        ref.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
    });

    return (
        <Points ref={ref} positions={positions} colors={colors} stride={3}>
            <PointMaterial
                transparent
                vertexColors
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

export default function NeuralDigitalTwin({ density }) {
    return (
        <div className="w-full h-full min-h-[400px] relative">
            <Canvas camera={{ position: [0, 0, 5], fmax: 75 }}>
                <ambientLight intensity={0.5} />
                <Center>
                    <BrainPoints density={density} />
                </Center>
            </Canvas>

            {/* Visual HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-6 left-6">
                    <div className="text-[10px] font-black text-cosmic-cyan uppercase tracking-[0.4em] mb-1">Neural_Interface_v7.0</div>
                    <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Biometric Cognitive Mapping Active</div>
                </div>

                <div className="absolute bottom-6 right-6 text-right">
                    <div className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em] mb-2">Synaptic Load</div>
                    <div className="flex gap-1 justify-end">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-4 h-1 bg-cosmic-cyan/20 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                    className="h-full bg-cosmic-cyan"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
