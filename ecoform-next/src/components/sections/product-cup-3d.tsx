"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Types ─── */
export interface CupTarget {
  topRadius: number;
  bottomRadius: number;
  height: number;
}

export interface CupVariant {
  color: string;
  rimColor: string;
  isKraft: boolean;
}

/* ─── Morphing Cup — geometry rebuilt each frame during transitions ─── */
function MorphingCup({
  target,
  variant,
}: {
  target: CupTarget;
  variant: CupVariant;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);
  const bottomRef = useRef<THREE.Mesh>(null);
  const band1Ref = useRef<THREE.Mesh>(null);
  const band2Ref = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);

  /* animated values */
  const a = useRef({
    tr: target.topRadius,
    br: target.bottomRadius,
    h: target.height,
    bodyColor: new THREE.Color(variant.color),
    rimColor: new THREE.Color(variant.rimColor),
  });
  /* track last-built geometry to avoid rebuilding every frame once settled */
  const lastGeo = useRef({ tr: 0, br: 0, h: 0 });
  const prevKraft = useRef(variant.isKraft);

  const targetColor = useMemo(() => new THREE.Color(variant.color), [variant.color]);
  const targetRim = useMemo(() => new THREE.Color(variant.rimColor), [variant.rimColor]);

  /* kraft texture — created once */
  const kraftTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#C4A77D";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const s = Math.random() * 30 - 15;
      ctx.fillStyle = `rgba(${164 + s},${135 + s},${100 + s},0.25)`;
      ctx.fillRect(x, y, 1, 1);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);

  useFrame((state, delta) => {
    const v = a.current;
    const spd = 4.5 * delta;

    /* lerp dimensions */
    v.tr += (target.topRadius - v.tr) * spd;
    v.br += (target.bottomRadius - v.br) * spd;
    v.h += (target.height - v.h) * spd;
    v.bodyColor.lerp(targetColor, spd);
    v.rimColor.lerp(targetRim, spd);

    /* rebuild geometry only when values have visibly changed */
    const dtr = Math.abs(v.tr - lastGeo.current.tr);
    const dbr = Math.abs(v.br - lastGeo.current.br);
    const dh = Math.abs(v.h - lastGeo.current.h);

    if (dtr > 0.0005 || dbr > 0.0005 || dh > 0.0005) {
      /* body */
      if (bodyRef.current) {
        bodyRef.current.geometry.dispose();
        bodyRef.current.geometry = new THREE.CylinderGeometry(v.tr, v.br, v.h, 48, 1, true);
      }
      /* rim */
      if (rimRef.current) {
        rimRef.current.geometry.dispose();
        rimRef.current.geometry = new THREE.TorusGeometry(v.tr, 0.035, 16, 48);
        rimRef.current.position.y = v.h / 2;
      }
      /* bottom */
      if (bottomRef.current) {
        bottomRef.current.geometry.dispose();
        bottomRef.current.geometry = new THREE.CircleGeometry(v.br, 48);
        bottomRef.current.position.y = -v.h / 2;
      }
      /* bands */
      const mr = (v.tr + v.br) / 2;
      if (band1Ref.current) {
        band1Ref.current.geometry.dispose();
        band1Ref.current.geometry = new THREE.TorusGeometry(mr + 0.02, 0.018, 8, 64);
        band1Ref.current.position.y = v.h * 0.05;
      }
      if (band2Ref.current) {
        band2Ref.current.geometry.dispose();
        band2Ref.current.geometry = new THREE.TorusGeometry(mr - 0.01, 0.008, 8, 64);
        band2Ref.current.position.y = -v.h * 0.15;
      }
      /* shadow scale tracks cup width */
      if (shadowRef.current) {
        const s = v.tr / 0.65;
        shadowRef.current.scale.set(s, s, 1);
      }
      lastGeo.current = { tr: v.tr, br: v.br, h: v.h };
    }

    /* color — always update (cheap) */
    if (bodyRef.current) {
      (bodyRef.current.material as THREE.MeshStandardMaterial).color.copy(v.bodyColor);
    }
    if (rimRef.current) {
      (rimRef.current.material as THREE.MeshStandardMaterial).color.copy(v.rimColor);
    }
    if (bottomRef.current) {
      (bottomRef.current.material as THREE.MeshStandardMaterial).color.copy(v.bodyColor);
    }

    /* kraft texture toggle */
    if (variant.isKraft !== prevKraft.current) {
      if (bodyRef.current) {
        const m = bodyRef.current.material as THREE.MeshStandardMaterial;
        m.map = variant.isKraft ? kraftTexture : null;
        m.needsUpdate = true;
      }
      if (bottomRef.current) {
        const m = bottomRef.current.material as THREE.MeshStandardMaterial;
        m.map = variant.isKraft ? kraftTexture : null;
        m.needsUpdate = true;
      }
      prevKraft.current = variant.isKraft;
    }

    /* auto-rotate + float */
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.007;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh ref={bodyRef} castShadow>
        <cylinderGeometry args={[target.topRadius, target.bottomRadius, target.height, 48, 1, true]} />
        <meshStandardMaterial
          color={variant.color}
          roughness={0.82}
          metalness={0}
          side={THREE.DoubleSide}
          map={variant.isKraft ? kraftTexture : null}
        />
      </mesh>

      {/* Rim */}
      <mesh ref={rimRef} position={[0, target.height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[target.topRadius, 0.035, 16, 48]} />
        <meshStandardMaterial color={variant.rimColor} roughness={0.55} metalness={0.08} />
      </mesh>

      {/* Bottom */}
      <mesh ref={bottomRef} position={[0, -target.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[target.bottomRadius, 48]} />
        <meshStandardMaterial
          color={variant.color}
          roughness={0.82}
          map={variant.isKraft ? kraftTexture : null}
        />
      </mesh>

      {/* Decorative bands */}
      <mesh ref={band1Ref} position={[0, target.height * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[(target.topRadius + target.bottomRadius) / 2 + 0.02, 0.018, 8, 64]} />
        <meshStandardMaterial color="#6B4F3A" roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh ref={band2Ref} position={[0, -target.height * 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[(target.topRadius + target.bottomRadius) / 2 - 0.01, 0.008, 8, 64]} />
        <meshStandardMaterial color="#8B6F5A" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Ground shadow */}
      <mesh
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -target.height / 2 - 0.01, 0]}
      >
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

/* ─── Ambient particles ─── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(25 * 3);
    for (let i = 0; i < 25; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C4A77D" size={0.018} transparent opacity={0.2} />
    </points>
  );
}

/* ─── Scene ─── */
function Scene({ target, variant }: { target: CupTarget; variant: CupVariant }) {
  return (
    <>
      <ambientLight intensity={0.55} color="#E5DDD5" />
      <directionalLight position={[5, 8, 6]} intensity={1.0} castShadow color="#FFF8F0" />
      <directionalLight position={[-4, 4, 2]} intensity={0.35} color="#C4A77D" />
      <directionalLight position={[0, -3, -5]} intensity={0.15} color="#5A7A3D" />
      <group position={[0, 0.1, 0]}>
        <MorphingCup target={target} variant={variant} />
      </group>
      <Particles />
    </>
  );
}

/* ─── Exported canvas ─── */
export function ProductCupCanvas({
  target,
  variant,
}: {
  target: CupTarget;
  variant: CupVariant;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 4.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <Scene target={target} variant={variant} />
    </Canvas>
  );
}
