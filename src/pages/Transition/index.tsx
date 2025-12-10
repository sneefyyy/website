import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Transition.css';

interface Ball {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  radius: number;
}

// Global singleton to share the same renderer across instances
let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedScene: THREE.Scene | null = null;
let sharedCamera: THREE.PerspectiveCamera | null = null;
let animationFrameId: number | null = null;

const Transition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ballsRef = useRef<Ball[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // If we already have a scene, just attach the renderer to the new container
    if (sharedRenderer && sharedScene && sharedCamera) {
      containerRef.current.appendChild(sharedRenderer.domElement);
      return () => {
        // Don't cleanup on unmount, keep the scene running
      };
    }

    // First time initialization

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sharedScene = scene;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    sharedCamera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    sharedRenderer = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create balls
    const balls: Ball[] = [];
    const ballCount = 80;
    const ballRadius = 0.5;

    // Reuse geometry and material for better performance
    const sharedGeometry = new THREE.SphereGeometry(ballRadius, 16, 16); // Reduced segments from 32 to 16
    const sharedMaterial = new THREE.MeshStandardMaterial({
      color: 0xcc3333,
      roughness: 0.3,
      metalness: 0.2,
    });

    for (let i = 0; i < ballCount; i++) {
      const mesh = new THREE.Mesh(sharedGeometry, sharedMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Random starting position above the screen
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        10 + Math.random() * 10,
        (Math.random() - 0.5) * 5
      );

      scene.add(mesh);

      balls.push({
        mesh,
        velocity: new THREE.Vector3(0, 0, 0),
        radius: ballRadius,
      });
    }

    ballsRef.current = balls;

    // Ground plane (invisible but for collision)
    const groundY = -8;
    const gravity = -0.015;
    const damping = 0.5;
    const friction = 0.95;
    const restitution = 0.3;

    // Invisible wall boundaries
    // Calculate walls based on viewport and camera
    const aspect = window.innerWidth / window.innerHeight;
    const vFOV = (camera.fov * Math.PI) / 180;
    const planeHeightAtDistance = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
    const planeWidthAtDistance = planeHeightAtDistance * aspect;

    const wallLeft = -planeWidthAtDistance / 2;
    const wallRight = planeWidthAtDistance / 2;
    const wallBack = -3; // Behind the screen (away from camera)
    const wallFront = 10; // In front of screen (toward camera)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Multiple iterations for better collision resolution
      for (let iteration = 0; iteration < 2; iteration++) {
        balls.forEach((ball, index) => {
          // Apply gravity only on first iteration
          if (iteration === 0) {
            ball.velocity.y += gravity;
          }

          // Update position
          if (iteration === 0) {
            ball.mesh.position.add(ball.velocity);
          }

          // Ground collision
          if (ball.mesh.position.y - ball.radius < groundY) {
            ball.mesh.position.y = groundY + ball.radius;

            if (Math.abs(ball.velocity.y) > 0.02) {
              ball.velocity.y *= -restitution; // Bounce with restitution
            } else {
              ball.velocity.y = 0; // Stop bouncing
            }

            ball.velocity.x *= friction;
            ball.velocity.z *= friction;
          }

          // Wall collisions (left, right, back, front)
          // Left wall
          if (ball.mesh.position.x - ball.radius < wallLeft) {
            ball.mesh.position.x = wallLeft + ball.radius;
            ball.velocity.x *= -restitution;
          }

          // Right wall
          if (ball.mesh.position.x + ball.radius > wallRight) {
            ball.mesh.position.x = wallRight - ball.radius;
            ball.velocity.x *= -restitution;
          }

          // Back wall (behind the screen)
          if (ball.mesh.position.z - ball.radius < wallBack) {
            ball.mesh.position.z = wallBack + ball.radius;
            ball.velocity.z *= -restitution;
          }

          // Front wall (toward camera)
          if (ball.mesh.position.z + ball.radius > wallFront) {
            ball.mesh.position.z = wallFront - ball.radius;
            ball.velocity.z *= -restitution;
          }

          // Ball-to-ball collision with better stacking
          for (let j = 0; j < balls.length; j++) {
            if (index === j) continue;

            const other = balls[j];
            const dx = ball.mesh.position.x - other.mesh.position.x;
            const dy = ball.mesh.position.y - other.mesh.position.y;
            const dz = ball.mesh.position.z - other.mesh.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const minDistance = ball.radius + other.radius;

            if (distance < minDistance && distance > 0) {
              // Normalized direction
              const nx = dx / distance;
              const ny = dy / distance;
              const nz = dz / distance;

              // Overlap amount
              const overlap = minDistance - distance;

              // Push balls apart based on their velocities
              const totalVel = Math.abs(ball.velocity.length()) + Math.abs(other.velocity.length());
              const pushRatio = totalVel > 0 ? Math.abs(ball.velocity.length()) / totalVel : 0.5;

              ball.mesh.position.x += nx * overlap * pushRatio;
              ball.mesh.position.y += ny * overlap * pushRatio;
              ball.mesh.position.z += nz * overlap * pushRatio;

              other.mesh.position.x -= nx * overlap * (1 - pushRatio);
              other.mesh.position.y -= ny * overlap * (1 - pushRatio);
              other.mesh.position.z -= nz * overlap * (1 - pushRatio);

              // Velocity transfer only on first iteration
              if (iteration === 0) {
                // Relative velocity
                const relVelX = ball.velocity.x - other.velocity.x;
                const relVelY = ball.velocity.y - other.velocity.y;
                const relVelZ = ball.velocity.z - other.velocity.z;

                // Relative velocity in collision normal direction
                const velAlongNormal = relVelX * nx + relVelY * ny + relVelZ * nz;

                // Don't resolve if velocities are separating
                if (velAlongNormal < 0) {
                  const impulse = -(1 + restitution) * velAlongNormal / 2;

                  ball.velocity.x += impulse * nx;
                  ball.velocity.y += impulse * ny;
                  ball.velocity.z += impulse * nz;

                  other.velocity.x -= impulse * nx;
                  other.velocity.y -= impulse * ny;
                  other.velocity.z -= impulse * nz;
                }
              }
            }
          }
        });
      }

      // Add slight rotation for visual effect
      balls.forEach(ball => {
        ball.mesh.rotation.x += ball.velocity.y * 0.05;
        ball.mesh.rotation.z += ball.velocity.x * 0.05;

        // Apply velocity damping
        ball.velocity.multiplyScalar(0.995);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      // Don't dispose shared resources, keep them for reuse
    };
  }, []);

  return (
    <div className="transition-page" ref={containerRef}>
    </div>
  );
};

export default Transition;