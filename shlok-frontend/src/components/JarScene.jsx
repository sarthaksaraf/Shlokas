import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // ✅ Note the `.js` extension

const JarScene = () => {
  const mountRef = useRef();

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // Scene setup
    const scene = new THREE.Scene();
    const width = mountEl.clientWidth;
    const height = mountEl.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountEl.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Load GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/jar.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);

        // Render once after model is loaded
        renderer.render(scene, camera);
      },
      undefined,
      (error) => {
        console.error('Error loading GLB model:', error);
      }
    );

    // Cleanup
    return () => {
      renderer.dispose();
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default JarScene;
