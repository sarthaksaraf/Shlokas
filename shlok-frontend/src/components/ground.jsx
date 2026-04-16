import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Ground() {
  const groundRef = useRef();

  // Optional: Animate ground for subtle effect (e.g., slight rotation or pulsation)
  useFrame(({ clock }) => {
    if (groundRef.current) {
      // Example: Subtle vertical pulsation
      groundRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.02;
    }
  });

  return (
    <mesh
      ref={groundRef}
      rotation={[-Math.PI / 2, 0, 0]} // Flat plane
      position={[0, 0, 0]}
      receiveShadow // Allow shadows from jar and other objects
    >
      <planeGeometry args={[50, 50]} /> {/* Large plane */}
      <meshStandardMaterial
        color="#2c3e50" // Dark base color for contrast with lights
        roughness={0.5} // Moderate roughness for subtle reflections
        metalness={0.3} // Slight metallic sheen
        envMapIntensity={0.5} // Reflect environment slightly
      />
    </mesh>
  );
}

export default Ground;