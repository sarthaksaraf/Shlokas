import { Suspense, useRef, useState, useEffect } from 'react';
import './App.css';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ChitBox from './components/chits.jsx';
import Jar from './components/jar.jsx';
import Ground from './components/ground.jsx';
import TextButton from './components/TextButton.jsx';
import Shloks from './components/shlok.jsx';
import Chits from './components/chitGroup.jsx';
import Starfield from './components/starField.jsx';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function TextInputField({ onSubmit, position }) {
  const [inputValue, setInputValue] = useState('');

  return (
    <Html position={position} transform occlude>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type emotion"
          className="emotion-input"
        />
        <button
          className="submit-button"
          onClick={() => {
            if (inputValue.trim()) {
              onSubmit(inputValue.trim());
              setInputValue('');
            }
          }}
        >
          Submit
        </button>
      </div>
    </Html>
  );
}

function CameraController({ targetRef, trigger, onComplete }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!trigger || !targetRef.current || !targetRef.current.position) return;

    const targetPos = targetRef.current.position;

    gsap.to(camera.rotation, {
      x: Math.PI * 0.5,
      duration: 1,
      ease: 'power3.inOut',
    });

    gsap.to(camera.position, {
      x: targetPos.x,
      y: targetPos.y + 6.8,
      z: targetPos.z + 3.7,
      duration: 1,
      ease: 'power3.inOut',
      onUpdate: () => {
        camera.lookAt(targetPos);
      },
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  }, [trigger]);

  return null;
}

function ResetCameraController({ reset }) {
  const { camera } = useThree();

  useEffect(() => {
    if (reset) {
      gsap.to(camera.rotation, {
        x: -0.4,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'power3.inOut',
      });
      gsap.to(camera.position, {
        x: 0,
        y: 9,
        z: 13,
        duration: 1,
        ease: 'power3.inOut',
      });
    }
  }, [reset]);

  return null;
}

function App() {
  const [triggerChit, setTriggerChit] = useState(false);
  const [triggerShlok, setTriggerShlok] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [resetCamera, setResetCamera] = useState(false);
  const chitRef = useRef();

  const handleShlok = () => {
    setTriggerShlok(true);
  };

  const handleButtonClick = (selectedEmotion) => {
    setEmotion(selectedEmotion);
    setTriggerChit(false);
    setTimeout(() => setTriggerChit(true), 50);
  };

  const resetCameraAndChit = () => {
    setResetCamera(true);
    chitRef.current?.animateOut();
    setTriggerShlok(false);
    setTriggerChit(false);
    setEmotion(null);
    setTimeout(() => setResetCamera(false), 1200);
  };

  return (
    <div className="app-wrapper">
      <div className="canvas-container">
        <Canvas
          style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
        >
          <color attach="background" args={['#000000']} />
          <PerspectiveCamera
            makeDefault
            fov={50}
            position={[0, 9, 13]}
            rotation={[-0.4, 0, 0]}
            near={0.1}
            far={2000}
          />
          <Suspense fallback={null}>
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.3}
                intensity={0.2}
                radius={0.7}
              />
            </EffectComposer>
            <Starfield count={900} />
            <ambientLight intensity={0.3} color="#ffffff" />
            <directionalLight
              position={[7, 20, 10]}
              intensity={2}
              castShadow
              color="#f0e7d8"
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight
              position={[0, 2, 0]}
              intensity={1.5}
              distance={10}
              decay={2}
              color="#ff6b6b"
            />
            <pointLight
              position={[3, 2, 3]}
              intensity={1}
              distance={8}
              decay={2}
              color="#4ecdc4"
            />
            <pointLight
              position={[-3, 2, -3]}
              intensity={1}
              distance={8}
              decay={2}
              color="#a29bfe"
            />
            <Jar />
            <Ground />
            <ChitBox ref={chitRef} trigger={triggerChit} emotion={emotion}>
              {triggerShlok && emotion && (
                <Shloks
                  trigger={triggerShlok}
                  emotion={emotion}
                  onClick={resetCameraAndChit}
                />
              )}
            </ChitBox>
            <Chits />
            <>
              <TextButton
                text="Happy"
                position={[-6, 0.09, 3.6]}
                onClick={() => handleButtonClick('Happy')}
                color="#f1c40f"
              />
              <TextButton
                text="Loneliness"
                position={[-4, 0.09, 3.6]}
                onClick={() => handleButtonClick('Loneliness')}
                color="#8e44ad"
              />
              <TextButton
                text="Anxious"
                position={[-2, 0.09, 3.6]}
                onClick={() => handleButtonClick('Anxious')}
                color="#3498db"
              />
              <TextButton
                text="Protection"
                position={[0, 0.09, 3.6]}
                onClick={() => handleButtonClick('Protection')}
                color="#1abc9c"
              />
              <TextButton
                text="Peace"
                position={[1.6, 0.09, 3.6]}
                onClick={() => handleButtonClick('Peace')}
                color="#2ecc71"
              />
              <TextButton
                text="Sad"
                position={[3, 0.09, 3.6]}
                onClick={() => handleButtonClick('Sad')}
                color="#34495e"
              />
              <TextButton
                text="Laziness"
                position={[4.5, 0.09, 3.6]}
                onClick={() => handleButtonClick('Laziness')}
                color="#95a5a6"
              />
              <TextButton
                text="Anger"
                position={[6, 0.09, 3.6]}
                onClick={() => handleButtonClick('Anger')}
                color="#8B0000"
              />
            </>
            <CameraController
              targetRef={chitRef}
              trigger={triggerChit}
              onComplete={handleShlok}
            />
            <ResetCameraController reset={resetCamera} />
          </Suspense>
        </Canvas>
      </div>
      {/* Optional: Add a sign-out button somewhere in your UI, e.g., as an Html overlay */}
      {/* <Html position={[0, 0, 0]}><button onClick={handleSignOut}>Sign Out</button></Html> */}
    </div>
  );
}

export default App;