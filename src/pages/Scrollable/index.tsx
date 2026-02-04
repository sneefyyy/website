import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const Scrollable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Text material
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1493,
      metalness: 0,
      roughness: 0.35,
      emissive: 0x66083a,
      transparent: false,
      opacity: 1
    });

    const textGroups: THREE.Group[] = [];
    const textHeight = 50;
    const texts = [
      { content: 'PLACEHOLDER TEXT 1', size: 0.35 },
      { content: 'PLACEHOLDER TEXT 2', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 3', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 4', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 5', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 6', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 7', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 8', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 9', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 10', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 11', size: 0.25 },
      { content: 'PLACEHOLDER TEXT 12', size: 0.25 }
    ];

    // Load font and create text
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(font) {
      const degreeStep = 2;
      const xOffset = 1.5;
      const zDepth = 50;

      [-xOffset, xOffset].forEach((xPos) => {
        const textGroup = new THREE.Group();
        textGroup.position.set(xPos, 0, -zDepth);

        const angleToOrigin = Math.atan2(xPos, zDepth);
        textGroup.rotation.y = angleToOrigin;

        texts.forEach((textData, index) => {
          const textGeometry = new TextGeometry(textData.content, {
            font: font,
            size: textData.size,
            depth: textHeight,
            curveSegments: 12,
            bevelEnabled: false
          });

          textGeometry.center();
          textGeometry.translate(0, 0, textHeight / 2);
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);

          const angleOffset = (index * degreeStep * Math.PI) / 180;
          textMesh.rotation.x = angleOffset;

          textGroup.add(textMesh);
        });

        textGroups.push(textGroup);
        scene.add(textGroup);

        // Invisible hit area for hover detection
        const hitPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(5, 9),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide })
        );
        hitPlane.position.set(xPos, 0, -25);
        hitPlane.userData.group = textGroup;
        scene.add(hitPlane);
      });
    });

    // Lighting
    const pointLight = new THREE.PointLight(0xe8f4f8, 150);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    let hoveredGroup: THREE.Group | null = null;

    function onPointerMove(event: MouseEvent) {
      const mouseX = event.clientX;
      const windowWidth = window.innerWidth;

      if (mouseX < windowWidth / 2) {
        hoveredGroup = textGroups[0];
      } else if (mouseX > windowWidth / 2) {
        hoveredGroup = textGroups[1];
      }
    }

    function onWheel(event: WheelEvent) {
      if (!hoveredGroup) return;
      event.preventDefault();
      const scrollScale = 0.003;
      hoveredGroup.rotation.x -= event.deltaY * scrollScale;
    }

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('wheel', onWheel, { passive: false });

    // Handle resize
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    // Animation loop
    let animationId: number;
    function animate() {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    const container = containerRef.current;
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#000000',
        overflow: 'hidden',
        zIndex: 9999,
        margin: 0,
        padding: 0
      }}
    />
  );
};

export default Scrollable;
