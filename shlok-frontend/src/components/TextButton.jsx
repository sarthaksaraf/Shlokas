import React, { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TextButton({ text, position, onClick, color }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(hovered ? 1.1 : 1, hovered ? 1.1 : 1, 1),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry args={[1.6, 0.6]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
        <Text 
          position={[0, 0, 0.01]} 
          fontSize={0.25} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
        >
          {text}
        </Text>
      </mesh>
    </group>
  );
}
