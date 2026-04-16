import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function Jar(props) {
  const { scene } = useGLTF('/jar2.glb');

  // Clone the scene so it can be reused without mutating the original useGLTF cache,
  // although we only use it once here, it's good practice.
  return (
    <group {...props}>
      <primitive object={scene} scale={5} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload('/jar2.glb');
