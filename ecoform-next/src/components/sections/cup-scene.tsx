"use client";

import { useRef, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Cup data ─── */
const CUPS = [
  {
    id: "espresso",
    label: "4oz Espresso",
    sub: "Single & Double Layer",
    topRadius: 0.5,
    bottomRadius: 0.38,
    height: 1.0,
    color: "#F5F1ED",
    isKraft: false,
  },
  {
    id: "classic",
    label: "8oz Classic",
    sub: "Most Popular",
    topRadius: 0.65,
    bottomRadius: 0.48,
    height: 1.4,
    color: "#C4A77D",
    isKraft: true,
  },
  {
    id: "grande",
    label: "12oz Grande",
    sub: "Large Format",
    topRadius: 0.7,
    bottomRadius: 0.52,
    height: 1.6,
    color: "#B89A6A",
    isKraft: true,
  },
  {
    id: "white-classic",
    label: "8oz White",
    sub: "Clean & Minimal",
    topRadius: 0.65,
    bottomRadius: 0.48,
    height: 1.4,
    color: "#FFFFFF",
    isKraft: false,
  },
];

const CAROUSEL_RADIUS = 3.2;
const LERP_SPEED = 0.045;

/* ─── Single cup mesh ─── */
function CupMesh({
  topRadius,
  bottomRadius,
  height,
  color,
  isKraft,
}: {
  topRadius: number;
  bottomRadius: number;
  height: number;
  color: string;
  isKraft: boolean;
}) {
  const kraftTexture = useMemo(() => {
    if (!isKraft) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const shade = Math.random() * 30 - 15;
      ctx.fillStyle = `rgba(${164 + shade}, ${135 + shade}, ${100 + shade}, 0.25)`;
      ctx.fillRect(x, y, 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [color, isKraft]);

  const rimColor = isKraft ? "#D4C7A0" : "#F0EDE9";
  const midRadius = (topRadius + bottomRadius) / 2;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[topRadius, bottomRadius, height, 32, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} side={THREE.DoubleSide} map={kraftTexture} />
      </mesh>
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[topRadius, 0.035, 12, 32]} />
        <meshStandardMaterial color={rimColor} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, -height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[bottomRadius, 32]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} map={kraftTexture} />
      </mesh>
      <mesh position={[0, height * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[midRadius + 0.02, 0.018, 8, 64]} />
        <meshStandardMaterial color="#6B4F3A" roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0, -height * 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[midRadius - 0.01, 0.008, 8, 64]} />
        <meshStandardMaterial color="#8B6F5A" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

/* ─── Carousel ─── */
function Carousel({ targetIndex }: { targetIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentAngle = useRef(0);
  const cupRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const target = -(targetIndex * ((Math.PI * 2) / CUPS.length));
    const diff = target - currentAngle.current;
    currentAngle.current += diff * LERP_SPEED;
    groupRef.current.rotation.y = currentAngle.current;

    const t = clock.elapsedTime;
    cupRefs.current.forEach((cup, i) => {
      if (!cup) return;
      cup.position.y = Math.sin(t * 0.8 + i * 1.5) * 0.06;
      cup.rotation.y += 0.003;
    });
  });

  return (
    <group ref={groupRef}>
      {CUPS.map((cup, i) => {
        const angle = (i / CUPS.length) * Math.PI * 2;
        const x = Math.sin(angle) * CAROUSEL_RADIUS;
        const z = Math.cos(angle) * CAROUSEL_RADIUS;
        return (
          <group key={cup.id} ref={(el) => { cupRefs.current[i] = el; }} position={[x, 0, z]}>
            <CupMesh topRadius={cup.topRadius} bottomRadius={cup.bottomRadius} height={cup.height} color={cup.color} isKraft={cup.isKraft} />
          </group>
        );
      })}
    </group>
  );
}

/* ─── Particles ─── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C4A77D" size={0.025} transparent opacity={0.3} />
    </points>
  );
}

/* ─── Scene — carousel offset to the right so it sits beside the text ─── */
function Scene({ targetIndex }: { targetIndex: number }) {
  return (
    <>
      <ambientLight intensity={0.55} color="#E5DDD5" />
      <directionalLight position={[6, 10, 8]} intensity={0.9} castShadow />
      <directionalLight position={[-4, 3, 3]} intensity={0.35} color="#C4A77D" />
      <directionalLight position={[0, -4, -6]} intensity={0.2} color="#5A7A3D" />
      {/* Shift the whole carousel to the right in world space */}
      <group position={[3, -0.3, 0]}>
        <Carousel targetIndex={targetIndex} />
      </group>
      <Particles />
    </>
  );
}

/*
  Full-screen canvas that covers the entire hero section.
  Because it spans the whole viewport width, cups NEVER clip.
  The carousel is shifted right in 3D space so cups appear on the right half.
*/
export function CupSceneFullscreen({
  activeIndex,
  onNext,
  onPrev,
}: {
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [ready, setReady] = useState(false);
  const dragRef = useRef({ startX: 0, dragging: false });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, dragging: true };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      dragRef.current.dragging = false;
      if (Math.abs(dx) > 40) {
        if (dx < 0) onNext();
        else onPrev();
      }
    },
    [onNext, onPrev]
  );

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      style={{ zIndex: 1 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 1, 14], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", cursor: "grab" }}
        onCreated={() => setReady(true)}
        frameloop="always"
      >
        <Scene targetIndex={activeIndex} />
      </Canvas>
    </div>
  );
}

export { CUPS };
