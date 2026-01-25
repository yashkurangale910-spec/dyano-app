import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

/**
 * ProgressOrbit - Animated orbital rings representing progress tracking
 */
export default function ProgressOrbit({ progress = 0.5 }) {
    const orbitRef = useRef();
    const sphereRef = useRef();

    useFrame((state) => {
        if (orbitRef.current) {
            orbitRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            orbitRef.current.rotation.z = state.clock.elapsedTime * 0.1;
        }

        if (sphereRef.current) {
            sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
        }
    });

    return (
        <group ref={orbitRef}>
            {/* Central Sphere */}
            <Sphere ref={sphereRef} args={[1, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color="#7b2cbf"
                    emissive="#7b2cbf"
                    emissiveIntensity={0.5}
                    roughness={0.3}
                    metalness={0.8}
                />
            </Sphere>

            {/* Orbital Rings */}
            {[2, 3, 4].map((radius, index) => (
                <Ring
                    key={index}
                    args={[radius - 0.05, radius + 0.05, 64]}
                    rotation={[Math.PI / 2, 0, index * 0.3]}
                >
                    <meshStandardMaterial
                        color={index === 0 ? '#00f5ff' : index === 1 ? '#e0aaff' : '#ffd60a'}
                        emissive={index === 0 ? '#00f5ff' : index === 1 ? '#e0aaff' : '#ffd60a'}
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                    />
                </Ring>
            ))}

            {/* Progress Indicator Spheres */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 3;
                const isActive = i / 8 <= progress;

                return (
                    <Sphere
                        key={i}
                        args={[0.1, 16, 16]}
                        position={[
                            Math.cos(angle) * radius,
                            0,
                            Math.sin(angle) * radius,
                        ]}
                    >
                        <meshStandardMaterial
                            color={isActive ? '#00f5ff' : '#2d1b4e'}
                            emissive={isActive ? '#00f5ff' : '#000000'}
                            emissiveIntensity={isActive ? 0.8 : 0}
                        />
                    </Sphere>
                );
            })}
        </group>
    );
}
