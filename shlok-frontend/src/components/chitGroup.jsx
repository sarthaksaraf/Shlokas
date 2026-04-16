import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Chits() {
  const group = useRef();
  
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.5;
    }
  });

  const colors = ['#f1c40f', '#8e44ad', '#3498db', '#1abc9c', '#2ecc71', '#34495e'];

  return (
    <group ref={group} position={[0, 4, 0]}>
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 3, 
            (Math.random() - 0.5) * 4, 
            (Math.random() - 0.5) * 3
          ]} 
          rotation={[
            Math.random() * Math.PI, 
            Math.random() * Math.PI, 
            0
          ]}
        >
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial 
            color={colors[Math.floor(Math.random() * colors.length)]} 
            side={THREE.DoubleSide} 
            roughness={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
