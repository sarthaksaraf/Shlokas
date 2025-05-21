import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const EMOTIONS = [
  'Happy',
  'Loneliness',
  'Anxious',
  'Protection',
  'Peace',
  'Sad',
  'Laziness',
  'Anger',
];

const EMOTION_COLORS = [
  0xf1c40f, // Happy - Yellow
  0x8e44ad, // Loneliness - Purple
  0x3498db, // Anxious - Blue
  0x1abc9c, // Protection - Teal
  0x2ecc71, // Peace - Green
  0x34495e, // Sad - Dark Blue
  0x95a5a6, // Laziness - Gray
  0x8b0000, // Anger - Dark Red
];

const JarScene = ({ onEmotionClick }) => {
  const mountRef = useRef();
  const threeObjectsRef = useRef([]);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) {
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const width = mountEl.clientWidth;
    const height = mountEl.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountEl.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, 10, 10);
    scene.add(dirLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.enablePan = false;

    // Create 3D chits (tiles) for each emotion
    const tileWidth = 3;
    const tileHeight = 1.5;
    const gap = 0.7;
    const objects = [];
    // Arrange tiles in a grid
    const cols = 4;
    const rows = Math.ceil(EMOTIONS.length / cols);
    for (let i = 0; i < EMOTIONS.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const geometry = new THREE.BoxGeometry(tileWidth, tileHeight, 0.4);
      const material = new THREE.MeshPhongMaterial({ color: EMOTION_COLORS[i], shininess: 80 });
      const tile = new THREE.Mesh(geometry, material);
      tile.position.x = (col - (cols - 1) / 2) * (tileWidth + gap);
      tile.position.y = ((rows - 1) / 2 - row) * (tileHeight + gap);
      tile.userData = { emotion: EMOTIONS[i], index: i };
      scene.add(tile);
      objects.push(tile);

      // Add emotion label as a sprite
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 8;
      ctx.fillText(EMOTIONS[i], 128, 32);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(2.5, 0.6, 1);
      sprite.position.set(tile.position.x, tile.position.y, tile.position.z + 0.7);
      scene.add(sprite);
    }
    threeObjectsRef.current = objects;

    // Raycaster for click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function onClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(threeObjectsRef.current);
      if (intersects.length > 0) {
        const { emotion } = intersects[0].object.userData;
        if (onEmotionClick) {
          onEmotionClick(emotion);
        }
      }
    }
    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      renderer.domElement.removeEventListener('click', onClick);
      if (renderer.domElement && mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [onEmotionClick]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default JarScene;
