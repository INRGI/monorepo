import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Container } from './Hero3D.styled';
import axios from 'axios';

interface Hero3DProps {
  heroId: string
}


const Hero3D: React.FC<Hero3DProps> = ({heroId}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [modelPath, setModelPath] = useState<string | null>(null);


  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/heroSetting/${heroId}`);
        const { hero3DModel } = response.data;
        setModelPath(`/${hero3DModel}.glb`);
      } catch (error) {
        console.error('Error fetching hero settings:', error);
      }
    };

    fetchHeroSettings();
  }, []);

  useEffect(() => {
    if(!modelPath) return;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);
    camera.position.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) {
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        const scale = modelPath.endsWith('woman.glb') ? [0.8, 0.8, 0.8]: modelPath.endsWith('man.glb') ?[0.4, 0.4, 0.4] : [0.1, 0.1, 0.1];
        const position = modelPath.endsWith('woman.glb') ? [0, -1.3, 0]: modelPath.endsWith('man.glb') ? [0, 0, 0]: [0, -0.2, 0];
        model.scale.set(scale[0], scale[1], scale[2]);
        model.position.set(position[0], position[1], position[2]);
        
        scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current) {
        const { clientWidth, clientHeight } = mountRef.current;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [modelPath]);

  return (
    <Container>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </Container>
  );
};

export default Hero3D;
