import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text3D } from '@react-three/drei';
import * as THREE from 'three';

/**
 * PDFSpace - 3D visualization of PDF documents floating in space
 */
export default function PDFSpace({ pdfCount = 5 }) {
    const groupRef = useRef();

    // Generate random positions for PDF cards
    const pdfPositions = useMemo(() => {
        return Array.from({ length: pdfCount }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6,
            ],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
            ],
            scale: 0.8 + Math.random() * 0.4,
        }));
    }, [pdfCount]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {pdfPositions.map((pdf, index) => (
                <group
                    key={index}
                    position={pdf.position}
                    rotation={pdf.rotation}
                    scale={pdf.scale}
                >
                    {/* PDF Card */}
                    <Box args={[2, 2.8, 0.1]}>
                        <meshStandardMaterial
                            color="#1a0b2e"
                            emissive="#7b2cbf"
                            emissiveIntensity={0.2}
                            roughness={0.4}
                            metalness={0.6}
                            transparent
                            opacity={0.8}
                        />
                    </Box>

                    {/* PDF Icon Lines */}
                    {[0.5, 0, -0.5].map((y, i) => (
                        <Box
                            key={i}
                            args={[1.2, 0.05, 0.05]}
                            position={[0, y, 0.06]}
                        >
                            <meshStandardMaterial
                                color="#e0aaff"
                                emissive="#e0aaff"
                                emissiveIntensity={0.5}
                            />
                        </Box>
                    ))}
                </group>
            ))}

            {/* Floating Particles */}
            {Array.from({ length: 50 }).map((_, i) => {
                const angle = (i / 50) * Math.PI * 2;
                const radius = 8 + Math.random() * 4;

                return (
                    <Box
                        key={`particle-${i}`}
                        args={[0.05, 0.05, 0.05]}
                        position={[
                            Math.cos(angle) * radius,
                            (Math.random() - 0.5) * 10,
                            Math.sin(angle) * radius,
                        ]}
                    >
                        <meshStandardMaterial
                            color="#00f5ff"
                            emissive="#00f5ff"
                            emissiveIntensity={1}
                        />
                    </Box>
                );
            })}
        </group>
    );
}
