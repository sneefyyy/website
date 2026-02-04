import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// @ts-ignore
import { unzipSync, strFromU8 } from 'three/examples/jsm/libs/fflate.module';

const Writing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writingCategories = [
    {
      title: 'Non-Fiction',
      color: 0xff9f4a,
      pieces: [
        {
          title: 'The Assault of Togetherness',
          date: 'January 2025',
          href: 'https://substack.com/home/post/p-173526439'
        },
        {
          title: 'Globular',
          date: 'November 2024',
          href: 'https://substack.com/home/post/p-152186859'
        }
      ]
    },
    {
      title: 'Poetry',
      color: 0x9fdb7b,
      pieces: [
        {
          title: 'Under the Bottle Cap',
          date: 'October 2025',
          href: 'https://substack.com/home/post/p-175838013'
        },
        {
          title: 'The Operator',
          date: 'September 2025',
          href: 'https://substack.com/home/post/p-173526516'
        },
        {
          title: 'The Peacock',
          date: 'September 2025',
          href: 'https://substack.com/home/post/p-173526439'
        }
      ]
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Ensure body and html can scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let bubbles: { group: THREE.Group; targetY: number; currentY: number; href: string }[] = [];
    let animationFrameId: number;
    const scrollY = { current: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onScroll() {
      scrollY.current = window.scrollY;
      console.log('Scroll Y:', scrollY.current);
    }

    function onClick(event: MouseEvent) {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      const allObjects: THREE.Object3D[] = [];
      bubbles.forEach(bubble => {
        bubble.group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            allObjects.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(allObjects);

      if (intersects.length > 0) {
        // Find which bubble was clicked
        const clickedObject = intersects[0].object;
        for (const bubble of bubbles) {
          if (bubble.group.children.includes(clickedObject) ||
              bubble.group.children.some(child => child.children.includes(clickedObject))) {
            window.open(bubble.href, '_blank');
            break;
          }
        }
      }
    }

    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const allObjects: THREE.Object3D[] = [];
      bubbles.forEach(bubble => {
        bubble.group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            allObjects.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(allObjects);

      // Change cursor
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    }

    function createGlassBubbleMaterial(color: number) {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.08,
        transmission: 0.9,
        thickness: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        ior: 1.45,
      });
    }

    function createBubbleWithText(text: string, yPosition: number, color: number, xPosition: number) {
      const group = new THREE.Group();

      // Create bubble (pill/capsule shape)
      const bubbleWidth = text.length * 0.4 + 1.5;
      const bubbleGeometry = new THREE.CapsuleGeometry(1.2, bubbleWidth, 32, 64);
      const bubbleMaterial = createGlassBubbleMaterial(color);
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      bubble.rotation.z = Math.PI / 2;
      group.add(bubble);

      // Inner colored glow
      const glowGeometry = new THREE.CapsuleGeometry(1.15, bubbleWidth - 0.1, 32, 64);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.rotation.z = Math.PI / 2;
      group.add(glow);

      // Main highlight (top-left shine)
      const shineGeometry = new THREE.SphereGeometry(0.35, 16, 16);
      const shineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      const shine = new THREE.Mesh(shineGeometry, shineMaterial);
      shine.position.set(-bubbleWidth * 0.25, 0.7, 0.8);
      group.add(shine);

      // Secondary smaller highlight
      const shine2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        shineMaterial.clone()
      );
      shine2.material.opacity = 0.7;
      shine2.position.set(-bubbleWidth * 0.15, 0.85, 0.8);
      group.add(shine2);

      // Bottom subtle reflection
      const shine3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        shineMaterial.clone()
      );
      shine3.material.opacity = 0.4;
      shine3.position.set(bubbleWidth * 0.2, -0.6, 0.6);
      group.add(shine3);

      group.position.set(xPosition, yPosition, 0);
      return group;
    }

    function init() {
      console.log('Initializing scene...');

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 12);
      camera.lookAt(0, 0, 0);
      console.log('Camera positioned at:', camera.position);

      scene = new THREE.Scene();

      // Gradient background (blue sky)
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#5b9bd5');
      gradient.addColorStop(1, '#8bb5d9');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 2, 512);

      const texture = new THREE.CanvasTexture(canvas);
      scene.background = texture;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.6);
      pointLight.position.set(-5, 5, 3);
      scene.add(pointLight);

      const backLight = new THREE.DirectionalLight(0xaaccff, 0.3);
      backLight.position.set(-3, -3, -3);
      scene.add(backLight);

      // Create simple bubbles first (without text) while font loads
      console.log('Creating bubbles...');
      let yOffset = 5;
      const xPositions = [-4, 4];

      writingCategories.forEach((category, catIndex) => {
        category.pieces.forEach((piece) => {
          const xPos = xPositions[catIndex % 2];
          const bubbleGroup = createBubbleWithText(piece.title, yOffset, category.color, xPos);

          scene.add(bubbleGroup);
          bubbles.push({
            group: bubbleGroup,
            targetY: yOffset,
            currentY: yOffset,
            href: piece.href
          });

          yOffset -= 3.5;
        });
      });
      console.log(`Created ${bubbles.length} bubbles`);

      // Log bubble positions for debugging
      bubbles.forEach((bubble, i) => {
        console.log(`Bubble ${i} at position:`, bubble.group.position);
      });

      // Load font and add text to bubbles
      new THREE.FileLoader()
        .setResponseType('arraybuffer')
        .load('/fonts/MPLUSRounded1c-Regular.typeface.json.zip', function (data) {
          console.log('Font loaded, adding text...');
          const zip = unzipSync(new Uint8Array(data as ArrayBuffer));
          const strArray = strFromU8(new Uint8Array(zip['MPLUSRounded1c-Regular.typeface.json'].buffer));
          const font = new FontLoader().parse(JSON.parse(strArray));

          // Add text to existing bubbles
          let bubbleIndex = 0;
          writingCategories.forEach((category) => {
            category.pieces.forEach((piece) => {
              if (bubbles[bubbleIndex]) {
                const textGeometry = new TextGeometry(piece.title, {
                  font,
                  size: 0.45,
                  depth: 0.12,
                  curveSegments: 12,
                  bevelEnabled: true,
                  bevelSize: 0.02,
                  bevelThickness: 0.015,
                  bevelSegments: 5
                });
                textGeometry.center();

                const textMaterial = new THREE.MeshBasicMaterial({
                  color: category.color,
                  transparent: false
                });

                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.z = 1.5;
                textMesh.renderOrder = 1000;
                bubbles[bubbleIndex].group.add(textMesh);
                console.log(`Added text "${piece.title}" to bubble ${bubbleIndex}`);
              }
              bubbleIndex++;
            });
          });

          console.log('Text added to bubbles');
        }, undefined, (error) => {
          console.error('Error loading font:', error);
        });

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      containerRef.current?.appendChild(renderer.domElement);

      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('click', onClick);
      window.addEventListener('mousemove', onMouseMove);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate(t: number) {
      animationFrameId = requestAnimationFrame(animate);

      // Convert scroll pixels to 3D units
      // Each 100px of scroll = 1 unit of movement
      const scrollOffset = scrollY.current / 100;

      bubbles.forEach((bubble) => {
        // Update position with scroll
        const newY = bubble.targetY - scrollOffset;
        bubble.group.position.y = newY;

        // Keep X position fixed
        const baseX = bubble.group.position.x > 0 ? 4 : -4;
        bubble.group.position.x = baseX;
      });

      renderer.render(scene, camera);
    }

    init();
    animate(0);

    const container = containerRef.current;
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      width: '100vw',
      minHeight: '300vh',
      margin: 0,
      padding: 0,
      position: 'relative'
    }}>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          pointerEvents: 'auto'
        }}
      />
    </div>
  );
};

export default Writing;
