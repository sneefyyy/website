import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import './experiment.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Text3D, Center } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

interface FloatingTextProps {
  onNavigate: (path: string) => void;
  exploded: boolean;
  settled: boolean;
  targetX: number;
}

const FloatingTextItem = ({
  onNavigate,
  exploded,
  settled,
  targetX,
  label,
  path,
  color,
  moveFn,
}: FloatingTextProps & {
  label: string;
  path: string;
  color: number;
  moveFn: (time: number) => { x: number; y: number; rotY: number };
}) => {
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const velocityRef = useRef<Vector3 | null>(null);

  useFrame(() => {
    if (!textRef.current) return;

    if (settled) {
      // Smoothly lerp to final position in a row
      textRef.current.position.x += (targetX - textRef.current.position.x) * 0.06;
      textRef.current.position.y += (0 - textRef.current.position.y) * 0.06;
      textRef.current.position.z += (0 - textRef.current.position.z) * 0.06;
      textRef.current.rotation.x += (0 - textRef.current.rotation.x) * 0.06;
      textRef.current.rotation.y += (0 - textRef.current.rotation.y) * 0.06;
      textRef.current.rotation.z += (0 - textRef.current.rotation.z) * 0.06;
    } else if (exploded) {
      if (!velocityRef.current) {
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * Math.PI;
        const speed = 15 + Math.random() * 25;
        velocityRef.current = new Vector3(
          Math.cos(angle) * Math.cos(elevation) * speed,
          Math.sin(elevation) * speed,
          Math.sin(angle) * Math.cos(elevation) * speed
        );
      }
      const v = velocityRef.current;
      textRef.current.position.x += v.x * 0.016;
      textRef.current.position.y += v.y * 0.016;
      textRef.current.position.z += v.z * 0.016;
      textRef.current.rotation.x += 0.1;
      textRef.current.rotation.z += 0.15;
    } else {
      const now = Date.now();
      const { x, y, rotY } = moveFn(now);
      textRef.current.position.x = x;
      textRef.current.position.y = y;
      textRef.current.rotation.y = rotY;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onNavigate(path)}
        >
          {label.toLowerCase()}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.6 : 0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

// Order: Writing, Projects, Research, About, Contact
const TEXT_CONFIGS = [
  {
    label: 'Writing',
    path: '/writing',
    color: 0x2fe8f5,
    moveFn: (t: number) => ({
      x: Math.sin(t * 0.0005) * 3,
      y: Math.cos(t * 0.0003) * 1.5,
      rotY: Math.sin(t * 0.0002) * 0.3,
    }),
  },
  {
    label: 'Projects',
    path: '/projects',
    color: 0x4ED9A4,
    moveFn: (t: number) => ({
      x: Math.cos(t * 0.0004) * 4,
      y: Math.sin(t * 0.0006) * 2,
      rotY: Math.cos(t * 0.0003) * 0.5,
    }),
  },
  {
    label: 'Research',
    path: '/research',
    color: 0x9b59b6,
    moveFn: (t: number) => ({
      x: Math.sin(t * 0.0006) * 4.5,
      y: Math.cos(t * 0.0005) * 1.8,
      rotY: Math.sin(t * 0.0004) * 0.35,
    }),
  },
  {
    label: 'About',
    path: '/about',
    color: 0xe03470,
    moveFn: (t: number) => ({
      x: Math.sin(t * 0.0007) * 2.5,
      y: Math.cos(t * 0.0004) * 3,
      rotY: Math.sin(t * 0.0005) * 0.4,
    }),
  },
  {
    label: 'Contact',
    path: '/contact',
    color: 0xffa500,
    moveFn: (t: number) => ({
      x: Math.cos(t * 0.0003) * 3.5,
      y: Math.sin(t * 0.0007) * 2.5,
      rotY: Math.cos(t * 0.0004) * 0.6,
    }),
  },
];

// Target X positions for the settled row (evenly spaced, centered)
const SPACING = 3.0;
const TARGET_XS = TEXT_CONFIGS.map((_, i) => {
  const offset = ((TEXT_CONFIGS.length - 1) * SPACING) / 2;
  return i * SPACING - offset;
});

const Spheres = ({ exploded, settled }: { exploded: boolean; settled: boolean }) => {
  const { camera } = useThree();
  const groupRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const velocitiesRef = useRef<Vector3[]>([]);

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

    if (settled) {
      // Smoothly return camera to dead center
      camera.position.x += (0 - camera.position.x) * 0.05;
      camera.position.y += (0 - camera.position.y) * 0.05;
      camera.position.z += (8 - camera.position.z) * 0.05;
    } else {
      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05;
    }
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      if (exploded) {
        if (velocitiesRef.current.length === 0) {
          groupRef.current.children.forEach((sphere: Mesh) => {
            const pos = sphere.position;
            const dir = new Vector3(pos.x, pos.y, pos.z).normalize();
            if (dir.length() < 0.01) dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            const speed = 20 + Math.random() * 40;
            velocitiesRef.current.push(dir.multiplyScalar(speed));
          });
        }
        groupRef.current.children.forEach((sphere: Mesh, i: number) => {
          const v = velocitiesRef.current[i];
          if (v) {
            sphere.position.x += v.x * 0.016;
            sphere.position.y += v.y * 0.016;
            sphere.position.z += v.z * 0.016;
          }
        });
      } else {
        groupRef.current.children.forEach((sphere: Mesh, i: number) => {
          sphere.position.x = 5 * Math.cos(timer + i);
          sphere.position.y = 5 * Math.sin(timer + i * 1.1);
        });
      }
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
  const [exploded, setExploded] = useState(false);
  const [settled, setSettled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  const triggerExplosion = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setExploded(true);
    // After the explosion clears, settle text into a row
    setTimeout(() => setSettled(true), 1000);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          timer = setTimeout(triggerExplosion, 5000);
        }
      },
      { threshold: 0.5 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
      clearTimeout(timer);
    };
  }, [triggerExplosion]);

  return (
    <section className="experiment-container" ref={sectionRef} style={{ cursor: 'pointer' }}>
      <Canvas camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 5] }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={50} />
        <pointLight position={[-10, -10, -10]} intensity={300} color="#4488ff" />
        <pointLight position={[0, 10, 0]} intensity={4000} color="#ffffff" />
        <Spheres exploded={exploded} settled={settled} />
        {TEXT_CONFIGS.map((cfg, i) => (
          <FloatingTextItem
            key={cfg.label}
            onNavigate={navigate}
            exploded={exploded}
            settled={settled}
            targetX={TARGET_XS[i]}
            {...cfg}
          />
        ))}
      </Canvas>
    </section>
  );
};

export default Experiment;
