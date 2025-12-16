import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Function to create text sprite
function createTextSprite(text: string, color: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  // Set canvas size
  canvas.width = 1024;
  canvas.height = 256;

  // Adjust font size based on text length
  const fontSize = text.length > 10 ? 50 : 80;

  // Configure text
  context.font = `Bold ${fontSize}px monospace`;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Draw glow
  context.shadowColor = color;
  context.shadowBlur = 40;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.8
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(400, 100, 1);

  return sprite;
}

// Simplified Hilbert curve generation
function hilbert3D(center: THREE.Vector3, size: number, iterations: number, v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number): THREE.Vector3[] {
  const half = size / 2;
  const vec_s = [
    new THREE.Vector3(center.x - half, center.y + half, center.z - half),
    new THREE.Vector3(center.x - half, center.y + half, center.z + half),
    new THREE.Vector3(center.x - half, center.y - half, center.z + half),
    new THREE.Vector3(center.x - half, center.y - half, center.z - half),
    new THREE.Vector3(center.x + half, center.y - half, center.z - half),
    new THREE.Vector3(center.x + half, center.y - half, center.z + half),
    new THREE.Vector3(center.x + half, center.y + half, center.z + half),
    new THREE.Vector3(center.x + half, center.y + half, center.z - half)
  ];

  const vec = [vec_s[v0], vec_s[v1], vec_s[v2], vec_s[v3], vec_s[v4], vec_s[v5], vec_s[v6], vec_s[v7]];

  if (--iterations >= 0) {
    const tmp: THREE.Vector3[] = [];
    Array.prototype.push.apply(tmp, hilbert3D(vec[0], half, iterations, v0, v3, v4, v7, v6, v5, v2, v1));
    Array.prototype.push.apply(tmp, hilbert3D(vec[1], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
    Array.prototype.push.apply(tmp, hilbert3D(vec[2], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
    Array.prototype.push.apply(tmp, hilbert3D(vec[3], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
    Array.prototype.push.apply(tmp, hilbert3D(vec[4], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
    Array.prototype.push.apply(tmp, hilbert3D(vec[5], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
    Array.prototype.push.apply(tmp, hilbert3D(vec[6], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
    Array.prototype.push.apply(tmp, hilbert3D(vec[7], half, iterations, v6, v5, v2, v1, v0, v3, v4, v7));
    return tmp;
  }

  return vec;
}

interface ContactLink {
  label: string;
  href: string;
  color: string;
}

const contactLinks: ContactLink[] = [
  {
    label: 'EMAIL',
    href: 'mailto:jackokeefe0711@gmail.com',
    color: '#00FF7D'
  },
  {
    label: 'INSTAGRAM',
    href: 'https://instagram.com/jackmokeefe_',
    color: '#FF0072'
  },
  {
    label: 'TWITTER',
    href: 'https://twitter.com/jackmokeefe1',
    color: '#17BDD7'
  },
  {
    label: 'LINKEDIN',
    href: 'https://linkedin.com/in/jackokeefeoc',
    color: '#00FF7D'
  }
];

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current; // Copy ref to variable for cleanup

    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 2000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Generate Hilbert curve
    const hilbertPoints = hilbert3D(new THREE.Vector3(0, 0, 0), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);
    const subdivisions = 6;

    // Create a line and text sprite for each contact link
    const lines: THREE.Line[] = [];
    const textSprites: THREE.Sprite[] = [];

    // Calculate spacing based on viewport width
    const calculateSpacing = () => {
      const viewportFactor = Math.tan((camera.fov / 2) * (Math.PI / 180)) * camera.position.z * 2;
      const itemWidth = (viewportFactor * camera.aspect) / contactLinks.length;
      return itemWidth * 0.8; // 80% to add some padding
    };

    let spacingX = calculateSpacing();
    let offsetX = ((contactLinks.length - 1) * spacingX) / 2;

    contactLinks.forEach((contact, index) => {
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const colors: number[] = [];

      const point = new THREE.Vector3();
      const color = new THREE.Color();
      const spline = new THREE.CatmullRomCurve3(hilbertPoints);

      for (let i = 0; i < hilbertPoints.length * subdivisions; i++) {
        const t = i / (hilbertPoints.length * subdivisions);
        spline.getPoint(t, point);
        vertices.push(point.x, point.y, point.z);

        // Use the contact's color
        color.set(contact.color);
        colors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      const line = new THREE.Line(geometry, material);
      line.scale.set(0.8, 0.8, 0.8);
      line.position.x = index * spacingX - offsetX;
      line.position.y = 0;
      line.position.z = 0;

      scene.add(line);
      lines.push(line);

      // Create 3D text sprite
      const textSprite = createTextSprite(contact.label, contact.color);
      textSprite.position.x = index * spacingX - offsetX;
      textSprite.position.y = 0;
      textSprite.position.z = 0;
      (textSprite as any).userData = { index, href: contact.href, label: contact.label, color: contact.color };

      scene.add(textSprite);
      textSprites.push(textSprite);
    });

    // Mouse move handler
    const onPointerMove = (event: PointerEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    // Window resize handler
    const onWindowResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Recalculate spacing and reposition all objects
      spacingX = calculateSpacing();
      offsetX = ((contactLinks.length - 1) * spacingX) / 2;

      lines.forEach((line, index) => {
        line.position.x = index * spacingX - offsetX;
      });

      textSprites.forEach((sprite, index) => {
        sprite.position.x = index * spacingX - offsetX;
      });
    };

    document.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY + 200 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      const time = Date.now() * 0.0005;

      lines.forEach((line, i) => {
        line.rotation.y = time * (i % 2 ? 1 : -1);

        // Highlight hovered line
        const material = line.material as THREE.LineBasicMaterial;
        const textMaterial = textSprites[i].material as THREE.SpriteMaterial;
        const currentHovered = hoveredIndexRef.current;

        if (currentHovered === i) {
          material.opacity = 1;
          line.scale.set(0.9, 0.9, 0.9);
          textMaterial.opacity = 1;
          textSprites[i].scale.set(450, 112.5, 1);
        } else {
          material.opacity = 0.8;
          line.scale.set(0.8, 0.8, 0.8);
          textMaterial.opacity = currentHovered === null ? 0.8 : 0.5;
          textSprites[i].scale.set(400, 100, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Mouse click handler for sprites
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(textSprites);

      if (intersects.length > 0) {
        const sprite = intersects[0].object as THREE.Sprite;
        const userData = (sprite as any).userData;

        if (userData.label === 'EMAIL' && !userData.emailDisplayed) {
          // Change text to email address (only if not already displayed)
          const newSprite = createTextSprite('jackokeefe0711@gmail.com', userData.color);
          newSprite.position.copy(sprite.position);
          (newSprite as any).userData = {
            ...userData,
            emailDisplayed: true
          };

          scene.remove(sprite);
          sprite.material.dispose();
          if (sprite.material.map) sprite.material.map.dispose();

          scene.add(newSprite);
          textSprites[userData.index] = newSprite;
        } else if (userData.href) {
          if (userData.href.startsWith('mailto:')) {
            window.location.href = userData.href;
          } else {
            window.open(userData.href, '_blank');
          }
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(textSprites);

      if (intersects.length > 0) {
        const sprite = intersects[0].object as THREE.Sprite;
        const index = (sprite as any).userData.index;
        setHoveredIndex(index);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredIndex(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onWindowResize);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      lines.forEach(line => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      textSprites.forEach(sprite => {
        sprite.material.dispose();
        if (sprite.material.map) sprite.material.map.dispose();
      });
      renderer.dispose();
    };
  }, []); // Empty dependency array - only run once

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000000', overflow: 'hidden' }}>
      {/* Three.js Canvas */}
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '14px',
        fontFamily: 'monospace',
        textAlign: 'center',
        zIndex: 2,
        letterSpacing: '0.05em'
      }}>
        MOVE YOUR MOUSE • HOVER TO SELECT
      </div>
    </div>
  );
}
