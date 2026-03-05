"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Cup Mesh Component ─── */
function CupMesh({
  topRadius = 0.65,
  bottomRadius = 0.48,
  height = 1.4,
  color = "#C4A77D",
  isKraft = true,
}: {
  topRadius?: number;
  bottomRadius?: number;
  height?: number;
  color?: string;
  isKraft?: boolean;
}) {
  const kraftTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    // Add paper grain
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const shade = Math.random() * 40 - 20;
      ctx.fillStyle = `rgba(${164 + shade}, ${135 + shade}, ${100 + shade}, 0.2)`;
      ctx.fillRect(x, y, 1, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [color]);

  const rimColor = isKraft ? "#D4C7A0" : "#F0EDE9";
  const midRadius = (topRadius + bottomRadius) / 2;

  return (
    <group>
      {/* Cup body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[topRadius, bottomRadius, height, 64, 1, true]} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
          map={isKraft ? kraftTexture : null}
        />
      </mesh>
      {/* Rim */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[topRadius, 0.04, 16, 64]} />
        <meshStandardMaterial color={rimColor} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[bottomRadius, 64]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} map={isKraft ? kraftTexture : null} />
      </mesh>
      {/* Logo band */}
      <mesh position={[0, height * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[midRadius + 0.02, 0.022, 8, 64]} />
        <meshStandardMaterial color="#6B4F3A" roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Accent band */}
      <mesh position={[0, -height * 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[midRadius - 0.01, 0.01, 8, 64]} />
        <meshStandardMaterial color="#8B6F5A" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

/* ─── Blender GLB Cup Model ─── */
function BlenderCup({ scale = 10 }: { scale?: number }) {
  const { scene } = useGLTF("/cups.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={clonedScene} scale={scale} />;
}

/* ─── Animated Cup with Scroll Control ─── */
function AnimatedCup({ scrollProgress, useGLB = false }: { scrollProgress: number; useGLB?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  // Define cinematic keyframes for cup animation based on scroll
  const keyframes = useMemo(
    () => [
      // Hero: Cup enters from far right, large and dramatic
      { position: [3, 0, 2], rotation: [0, -0.3, 0], scale: 1 },
      // Story: Cup swings to left, tilts forward
      { position: [-2, 0.3, 1], rotation: [0.15, 1.2, 0.05], scale: 1.15 },
      // Features: Cup centers, spins to show all sides
      { position: [0, 0, 3], rotation: [0.1, Math.PI * 0.8, 0], scale: 1.4 },
      // Products: Cup moves right, multiple sizes implied
      { position: [2.5, -0.2, 1], rotation: [-0.1, Math.PI * 1.4, -0.05], scale: 1.2 },
      // CTA: Cup settles center, inviting
      { position: [0, 0.5, 2], rotation: [0, Math.PI * 2, 0], scale: 1.1 },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Map scroll progress to keyframe index
    const totalFrames = keyframes.length - 1;
    const frameIndex = Math.min(scrollProgress * totalFrames, totalFrames - 0.001);
    const currentFrame = Math.floor(frameIndex);
    const nextFrame = Math.min(currentFrame + 1, totalFrames);
    const frameLerp = frameIndex - currentFrame;

    // Smooth easing (ease-in-out cubic)
    const eased = frameLerp < 0.5
      ? 4 * frameLerp * frameLerp * frameLerp
      : 1 - Math.pow(-2 * frameLerp + 2, 3) / 2;

    const current = keyframes[currentFrame];
    const next = keyframes[nextFrame];

    // Interpolate position
    groupRef.current.position.x = THREE.MathUtils.lerp(current.position[0], next.position[0], eased);
    groupRef.current.position.y = THREE.MathUtils.lerp(current.position[1], next.position[1], eased);
    groupRef.current.position.z = THREE.MathUtils.lerp(current.position[2], next.position[2], eased);

    // Interpolate rotation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(current.rotation[0], next.rotation[0], eased);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(current.rotation[1], next.rotation[1], eased);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(current.rotation[2], next.rotation[2], eased);

    // Interpolate scale
    const scale = THREE.MathUtils.lerp(current.scale, next.scale, eased);
    groupRef.current.scale.setScalar(scale);

    // Add subtle floating animation
    if (innerRef.current) {
      innerRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.05;
      innerRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        {useGLB ? (
          <Suspense fallback={<CupMesh />}>
            <BlenderCup scale={8} />
          </Suspense>
        ) : (
          <CupMesh />
        )}
      </group>
    </group>
  );
}

/* ─── Floating Particles ─── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.008;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C4A77D" size={0.04} transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

/* ─── Scene Component ─── */
function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={["#E5DDD5"]} />
      <fog attach="fog" args={["#E5DDD5", 10, 30]} />

      {/* Ambient fill */}
      <ambientLight intensity={0.4} color="#E5DDD5" />

      {/* Key light - warm, from top-right */}
      <directionalLight
        position={[8, 15, 10]}
        intensity={1.2}
        castShadow
        color="#fff8f0"
      />

      {/* Fill light - warm kraft tone */}
      <directionalLight position={[-8, 5, 5]} intensity={0.5} color="#C4A77D" />

      {/* Rim light - green accent */}
      <directionalLight position={[0, -6, -10]} intensity={0.3} color="#5A7A3D" />

      {/* Top spotlight for drama */}
      <spotLight
        position={[0, 15, 5]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />

      {/* Ground contact shadow */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
        color="#6B4F3A"
      />

      {/* Use GLB model from Blender */}
      <AnimatedCup scrollProgress={scrollProgress} useGLB={true} />

      <Particles />
    </>
  );
}

/* ─── Main Canvas Export ─── */
export function CinematicCanvas({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        shadows
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
