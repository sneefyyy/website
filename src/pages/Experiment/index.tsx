import React, { useRef, useMemo, useState } from 'react';
import './Experiment.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh } from 'three';
import { Text3D, Center } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

const FloatingText = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.x = Math.sin(Date.now() * 0.0005) * 3;
      textRef.current.position.y = Math.cos(Date.now() * 0.0003) * 1.5;
      textRef.current.rotation.y = Math.sin(Date.now() * 0.0002) * 0.3;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onNavigate('/writing')}
        >
          writing
          <meshStandardMaterial
            color={0x2fe8f5}
            emissive={0x2fe8f5}
            emissiveIntensity={hovered ? 0.6 : 0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

const FloatingTextProjects = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.x = Math.cos(Date.now() * 0.0004) * 4;
      textRef.current.position.y = Math.sin(Date.now() * 0.0006) * 2;
      textRef.current.rotation.y = Math.cos(Date.now() * 0.0003) * 0.5;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onNavigate('/projects')}
        >
          projects
          <meshStandardMaterial
            color={0x4ED9A4}
            emissive={0x4ED9A4}
            emissiveIntensity={hovered ? 0.6 : 0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

const FloatingTextAbout = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.x = Math.sin(Date.now() * 0.0007) * 2.5;
      textRef.current.position.y = Math.cos(Date.now() * 0.0004) * 3;
      textRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.4;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onNavigate('/about')}
        >
          about
          <meshStandardMaterial
            color={0xe03470}
            emissive={0xe03470}
            emissiveIntensity={hovered ? 0.6 : 0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

const FloatingTextContact = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.x = Math.cos(Date.now() * 0.0003) * 3.5;
      textRef.current.position.y = Math.sin(Date.now() * 0.0007) * 2.5;
      textRef.current.rotation.y = Math.cos(Date.now() * 0.0004) * 0.6;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onNavigate('/contact')}
        >
          contact
          <meshStandardMaterial
            color={0xffa500}
            emissive={0xffa500}
            emissiveIntensity={hovered ? 0.6 : 0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

const FloatingTextResearch = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.x = Math.sin(Date.now() * 0.0006) * 4.5;
      textRef.current.position.y = Math.cos(Date.now() * 0.0005) * 1.8;
      textRef.current.rotation.y = Math.sin(Date.now() * 0.0004) * 0.35;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onNavigate('/research')}
        >
          research
          <meshStandardMaterial
            color={0x9b59b6}
            emissive={0x9b59b6}
            emissiveIntensity={hovered ? 0.6 : 0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

const Spheres = () => {
  const { camera } = useThree();
  const groupRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const sphereData = useMemo(() => {
    return Array.from({ length: 500 }, (_, i) => ({
      id: i,
      position: [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      ] as [number, number, number],
      scale: Math.random() * 3 + 1,
    }));
  }, []);

  useFrame(() => {
    const timer = 0.0001 * Date.now();

    camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05;
    camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.children.forEach((sphere: Mesh, i: number) => {
        sphere.position.x = 5 * Math.cos(timer + i);
        sphere.position.y = 5 * Math.sin(timer + i * 1.1);
      });
    }
  });

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX - window.innerWidth / 2) * 0.01;
      mouseRef.current.y = (event.clientY - window.innerHeight / 2) * 0.01;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <group ref={groupRef}>
      {sphereData.map((sphere) => (
        <mesh key={sphere.id} position={sphere.position} scale={sphere.scale}>
          <sphereGeometry args={[0.1, 32, 16]} />
          <meshStandardMaterial color={0xe01f63} metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const Experiment: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="experiment-container" style={{ cursor: 'pointer' }}>
      <Canvas camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 5] }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={50} />
        <pointLight position={[-10, -10, -10]} intensity={300} color="#4488ff" />
        <pointLight position={[0, 10, 0]} intensity={4000} color="#ffffff" />
        <Spheres />
        <FloatingText onNavigate={navigate} />
        <FloatingTextProjects onNavigate={navigate} />
        <FloatingTextAbout onNavigate={navigate} />
        <FloatingTextContact onNavigate={navigate} />
        <FloatingTextResearch onNavigate={navigate} />
      </Canvas>
    </section>
  );
};

export default Experiment;
