"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface CupState {
  progress: number;
  section: number;
  opacity: number;
  scale: number;
}

/* ─── Clean Cup Mesh - No overlapping geometry ─── */
function CleanCup({
  color = "#C4A77D",
  isKraft = true,
  scale = 1,
}: {
  color?: string;
  isKraft?: boolean;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  // Create procedural kraft paper texture
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Base color
    const baseColor = isKraft ? "#C4A77D" : "#F5F1ED";
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    if (isKraft) {
      // Add subtle vertical fibers
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const length = 20 + Math.random() * 40;
        ctx.strokeStyle = `rgba(139, 111, 90, ${0.1 + Math.random() * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 3, y + length);
        ctx.stroke();
      }

      // Add paper grain dots
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const brightness = Math.random() > 0.5 ? 20 : -20;
        ctx.fillStyle = `rgba(${176 + brightness}, ${147 + brightness}, ${105 + brightness}, 0.3)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [isKraft]);

  // Cup dimensions
  const topRadius = 0.65;
  const bottomRadius = 0.48;
  const height = 1.4;
  const wallThickness = 0.04;
  const rimHeight = 0.08;
  const rimRadius = topRadius + 0.02;

  return (
    <group ref={meshRef} scale={scale}>
      {/* Main cup body - using LatheGeometry for smooth profile */}
      <mesh castShadow receiveShadow>
        <latheGeometry
          args={[
            // Profile points for outer wall
            [
              new THREE.Vector2(bottomRadius, 0),
              new THREE.Vector2(bottomRadius + 0.01, 0.02),
              new THREE.Vector2(topRadius - 0.02, height - rimHeight),
              new THREE.Vector2(topRadius, height - rimHeight / 2),
              new THREE.Vector2(rimRadius, height),
              new THREE.Vector2(rimRadius - 0.01, height + rimHeight * 0.3),
              new THREE.Vector2(topRadius - 0.02, height + rimHeight * 0.2),
              new THREE.Vector2(topRadius - wallThickness, height),
              new THREE.Vector2(bottomRadius + wallThickness, 0.05),
              new THREE.Vector2(bottomRadius, 0),
            ],
            64,
          ]}
        />
        <meshStandardMaterial
          color={color}
          map={texture}
          roughness={0.9}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom disc */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[bottomRadius - 0.01, 64]} />
        <meshStandardMaterial
          color={isKraft ? "#A08560" : "#E8E4E0"}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Subtle embossed logo band - using slight color variation instead of geometry */}
      <mesh position={[0, height * 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[(topRadius + bottomRadius) / 2 + 0.005, 0.008, 8, 64]} />
        <meshStandardMaterial
          color={isKraft ? "#8B6F5A" : "#D5D0CB"}
          roughness={0.8}
          metalness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

/* ─── Animated Cup Controller ─── */
function AnimatedCupScene({ cupState }: { cupState: CupState }) {
  const groupRef = useRef<THREE.Group>(null);
  const cupGroupRef = useRef<THREE.Group>(null);

  // Cinematic keyframes - telling a story with movement
  const keyframes = useMemo(
    () => [
      // Opening: Cup emerges from darkness, right side
      {
        position: [4, -0.5, 0] as [number, number, number],
        rotation: [0.1, -0.8, 0] as [number, number, number],
        scale: 0.9,
        cupColor: "#C4A77D",
        isKraft: true,
      },
      // Reveal: Cup moves center-left, showing front
      {
        position: [-1, 0, 2] as [number, number, number],
        rotation: [0.05, 0.3, 0.02] as [number, number, number],
        scale: 1.1,
        cupColor: "#C4A77D",
        isKraft: true,
      },
      // Sizes: Cup pulls back, smaller
      {
        position: [2, 0.5, -1] as [number, number, number],
        rotation: [0, Math.PI * 0.7, 0] as [number, number, number],
        scale: 0.85,
        cupColor: "#C4A77D",
        isKraft: true,
      },
      // Materials: Cup comes forward, showing texture
      {
        position: [-2.5, 0, 3] as [number, number, number],
        rotation: [0.15, Math.PI * 1.2, -0.05] as [number, number, number],
        scale: 1.3,
        cupColor: "#C4A77D",
        isKraft: true,
      },
      // CTA: Cup settles center, inviting
      {
        position: [1.5, 0, 1] as [number, number, number],
        rotation: [0, Math.PI * 1.8, 0] as [number, number, number],
        scale: 1,
        cupColor: "#C4A77D",
        isKraft: true,
      },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || !cupGroupRef.current) return;

    const { progress } = cupState;
    const totalFrames = keyframes.length - 1;

    // Calculate current position in keyframes
    const framePosition = progress * totalFrames;
    const currentFrame = Math.floor(framePosition);
    const nextFrame = Math.min(currentFrame + 1, totalFrames);
    const t = framePosition - currentFrame;

    // Smooth easing - cubic ease-in-out
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const current = keyframes[currentFrame];
    const next = keyframes[nextFrame];

    // Interpolate all values
    groupRef.current.position.x = THREE.MathUtils.lerp(current.position[0], next.position[0], eased);
    groupRef.current.position.y = THREE.MathUtils.lerp(current.position[1], next.position[1], eased);
    groupRef.current.position.z = THREE.MathUtils.lerp(current.position[2], next.position[2], eased);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(current.rotation[0], next.rotation[0], eased);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(current.rotation[1], next.rotation[1], eased);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(current.rotation[2], next.rotation[2], eased);

    const scale = THREE.MathUtils.lerp(current.scale, next.scale, eased);
    groupRef.current.scale.setScalar(scale);

    // Subtle continuous float
    cupGroupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.03;
    cupGroupRef.current.rotation.y += 0.001;
  });

  return (
    <group ref={groupRef}>
      <group ref={cupGroupRef}>
        <CleanCup isKraft={true} />
      </group>
    </group>
  );
}

/* ─── Ambient Particles ─── */
function Particles() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 25;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#C4A77D"
        size={0.015}
        transparent
        opacity={0.2}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Scene ─── */
function Scene({ cupState }: { cupState: CupState }) {
  return (
    <>
      {/* Dark background */}
      <color attach="background" args={["#1A1510"]} />
      <fog attach="fog" args={["#1A1510", 8, 30]} />

      {/* Dramatic lighting */}
      <ambientLight intensity={0.15} color="#E5DDD5" />

      {/* Key light - warm, from above-right */}
      <spotLight
        position={[8, 12, 8]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#FFF8F0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light - subtle warm */}
      <directionalLight position={[-6, 4, 4]} intensity={0.3} color="#C4A77D" />

      {/* Rim light - green accent from behind */}
      <directionalLight position={[0, 2, -8]} intensity={0.25} color="#5A7A3D" />

      {/* Bottom fill */}
      <directionalLight position={[0, -5, 0]} intensity={0.1} color="#3D2B1F" />

      {/* Contact shadow on ground plane */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.5}
        scale={15}
        blur={2.5}
        far={5}
        color="#1A1510"
      />

      <AnimatedCupScene cupState={cupState} />
      <Particles />
    </>
  );
}

/* ─── Export ─── */
export function CinematicCup({ cupState }: { cupState: CupState }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 30 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      shadows
      dpr={[1, 2]}
    >
      <Scene cupState={cupState} />
    </Canvas>
  );
}
