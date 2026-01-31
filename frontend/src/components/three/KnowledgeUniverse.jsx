import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * KnowledgeUniverse - A cosmic particle field representing knowledge nodes
 */
export default function KnowledgeUniverse({ count = 5000 }) {
    const pointsRef = useRef();

    // Generate random positions in a sphere
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const radius = Math.random() * 25 + 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }

        return positions;
    }, [count]);

    // Animate the particle field
    useFrame((state) => {
        if (pointsRef.current) {
            // Base rotation
            pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;

            // Mouse Parallax
            const targetX = state.mouse.x * 0.5;
            const targetY = state.mouse.y * 0.5;

            pointsRef.current.rotation.x += (targetY - pointsRef.current.rotation.x) * 0.05;
            pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;

            // Neural Noise (subtle jitter)
            pointsRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 0.02;
            pointsRef.current.position.y = Math.cos(state.clock.elapsedTime * 1.5) * 0.02;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#00f5ff"
                size={0.15}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}
