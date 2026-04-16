import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Starfield({ count = 900 }) {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const minDistance = 20;
    const maxDistance = 60;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        let x, y, z, distance;
        do {
            x = (Math.random() - 0.5) * 2 * maxDistance;
            y = (Math.random() - 0.5) * 2 * maxDistance;
            z = (Math.random() - 0.5) * 2 * maxDistance;
            distance = Math.sqrt(x * x + y * y + z * z);
        } while (distance < minDistance || distance > maxDistance);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.05;
      points.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
