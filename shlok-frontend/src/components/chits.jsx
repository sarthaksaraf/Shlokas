// ChitBox.jsx
import { useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

const emotionColors = {
  Happy: '#f1c40f',
  Loneliness: '#8e44ad',
  Anxious: '#3498db',
  Protection: '#1abc9c',
  Peace: '#2ecc71',
  Sad: '#34495e',
  Laziness: '#95a5a6',
  Anger: '#8B0000',
};

const ChitBox = forwardRef(({ trigger, children, emotion }, ref) => {
  const meshRef = useRef();
  const chitColor = emotionColors[emotion] || '#ffffff';

  useImperativeHandle(ref, () => ({
    animateIn() {
      if (meshRef.current) {
        gsap.to(meshRef.current.position, {
          y: 6.5,
          z: 3,
          duration: 1.2,
          ease: 'power3.out',
        });
        gsap.to(meshRef.current.rotation, {
          x: 5.2,
          duration: 1.2,
          ease: 'power3.out',
        });
      }
    },
    animateOut() {
      if (meshRef.current) {
        gsap.to(meshRef.current.position, {
          y: 1.0,
          z: 0,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        gsap.to(meshRef.current.rotation, {
          x: 0,
          duration: 1.2,
          ease: 'power3.inOut',
        });
      }
    }
  }));

  useEffect(() => {
    if (trigger) {
      ref.current?.animateIn?.();
    }
  }, [trigger]);

  return (
    <group ref={meshRef} position={[0, 1.0, 0]}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color={chitColor} side={THREE.DoubleSide} />
      </mesh>

      {children && (
        <Html center transform distanceFactor={1.5}>
          {children}
        </Html>
      )}
    </group>
  );
});

export default ChitBox;
