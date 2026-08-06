import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------------
// Visibility hook — pauses the render loop while off-screen.
// ---------------------------------------------------------------
const useInViewport = ({ rootMargin = "300px" } = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, isInView];
};

// ---------------------------------------------------------------
// Glow texture (radial gradient) used for soft halos
// ---------------------------------------------------------------
const makeGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
};

const GlowSprite = ({ position = [0, 0, 0], color = '#ffffff', scale = 3, opacity = 0.7, spriteRef }) => {
  const texture = useMemo(makeGlowTexture, []);
  return (
    <sprite ref={spriteRef} position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
};

// ---------------------------------------------------------------
// Aurora — a large colour field that drifts slowly behind the
// scene. Pure light, no geometry: atmosphere without noise.
// ---------------------------------------------------------------
const Aurora = ({ position, color, scale, opacity, drift = 1 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.x = position[0] + Math.sin(t * 0.09 * drift) * 0.4;
    ref.current.position.y = position[1] + Math.cos(t * 0.07 * drift) * 0.3;
  });
  return <GlowSprite spriteRef={ref} position={position} color={color} scale={scale} opacity={opacity} />;
};

// ---------------------------------------------------------------
// Refractive core — a dark polished sphere ("black pearl") lit by
// blue / gold / indigo lights so it glints as it turns. No
// cartoon primitives: pure material, light and a soft pulsing halo.
// ---------------------------------------------------------------
const RefractiveCore = () => {
  const core = useRef();
  const haloMat = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (core.current) {
      core.current.rotation.y = t * 0.3;
      core.current.rotation.x = Math.sin(t * 0.16) * 0.08;
    }
    if (haloMat.current) {
      haloMat.current.opacity = 0.3 + Math.sin(t * 1.1) * 0.08;
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshPhysicalMaterial
          color="#0a0e1a"
          metalness={0.55}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.12}
          specularIntensity={1.2}
          emissive="#2a2a6e"
          emissiveIntensity={0.4}
        />
      </mesh>
      <GlowSprite scale={3.6} color="#6366f1" opacity={0.28} />
      <GlowSprite spriteRef={haloMat} scale={1.25} color="#c7d2fe" opacity={0.55} />
      <GlowSprite scale={5.5} color="#1e3a8a" opacity={0.14} />
    </group>
  );
};

// ---------------------------------------------------------------
// Constellation field — a shell of fine particles (vertex-coloured,
// a few gold sparkles) that rotates slowly. Reads as a living
// network of students and institutions — abstract, futuristic.
// ---------------------------------------------------------------
const ConstellationField = ({ count = 500 }) => {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const indigo = new THREE.Color('#9db4ff');
    const cyan = new THREE.Color('#7dd3fc');
    const gold = new THREE.Color('#fbbf24');
    const tint = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 2.3 * (0.82 + Math.random() * 0.36);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const sparkle = Math.random();
      if (sparkle > 0.92) {
        tint.copy(gold);
      } else {
        tint.copy(indigo).lerp(cyan, Math.random());
      }
      const glow = 0.55 + Math.random() * 0.45;
      colors[i * 3] = tint.r * glow;
      colors[i * 3 + 1] = tint.g * glow;
      colors[i * 3 + 2] = tint.b * glow;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ---------------------------------------------------------------
// Dust ring — a fine annulus of particles (data-rings). Two tilted
// rings give the composition a calm orbital motion.
// ---------------------------------------------------------------
const DustRing = ({ innerR = 1.75, outerR = 2.1, count = 300, color, opacity = 0.5, tilt, speed = 0.3 }) => {
  const group = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = innerR + Math.random() * (outerR - innerR);
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.045;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, [count, innerR, outerR]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * speed;
  });

  return (
    <group ref={group} rotation={tilt}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.022}
          sizeAttenuation
          transparent
          opacity={opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// ---------------------------------------------------------------
// Connection threads — faint arcs of light linking the shell to the
// core. Subtle enough to read as network texture, not a diagram.
// ---------------------------------------------------------------
const ConnectionThreads = () => {
  const threads = useMemo(() => {
    const list = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
      const rOut = 2.5 + Math.random() * 0.3;
      const yOut = (Math.random() - 0.5) * 1.6;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * rOut, yOut, Math.sin(angle) * rOut),
        new THREE.Vector3(Math.cos(angle + 0.25) * 1.2, yOut * 0.35, Math.sin(angle + 0.25) * 1.2),
        new THREE.Vector3(Math.cos(angle + 0.5) * 0.45, yOut * 0.1, Math.sin(angle + 0.5) * 0.45),
      ]);
      list.push({
        geometry: new THREE.TubeGeometry(curve, 32, 0.008, 6, false),
        color: i % 3 === 0 ? '#fbbf24' : '#7dd3fc',
      });
    }
    return list;
  }, []);

  return (
    <group>
      {threads.map((t, i) => (
        <mesh key={i} geometry={t.geometry}>
          <meshBasicMaterial
            color={t.color}
            transparent
            opacity={0.11}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

// ---------------------------------------------------------------
// Glass shards — a few small faceted dark-glass pieces tumbling in
// the field. Adds depth and a faint "hologram" texture without any
// mascot objects.
// ---------------------------------------------------------------
const shardData = [
  { pos: [-2.4, 1.5, -0.6], scale: 0.2, color: '#7dd3fc' },
  { pos: [2.5, 0.6, -1.1], scale: 0.15, color: '#a78bfa' },
  { pos: [0.8, -2.2, 0.4], scale: 0.12, color: '#fbbf24' },
  { pos: [-1.4, -1.6, 1.2], scale: 0.18, color: '#38bdf8' },
  { pos: [2.2, 2.1, 0.3], scale: 0.13, color: '#6366f1' },
  { pos: [-0.6, 2.4, -1.4], scale: 0.16, color: '#34d399' },
];

const GlassShards = () => {
  const refs = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.x = t * (0.12 + i * 0.02) + i * 1.7;
      m.rotation.y = t * (0.18 + i * 0.015) + i * 2.4;
      m.position.y = shardData[i].pos[1] + Math.sin(t * 0.6 + i * 1.3) * 0.1;
    });
  });

  return (
    <group>
      {shardData.map((s, i) => (
        <mesh
          key={i}
          position={s.pos}
          scale={s.scale}
          ref={(el) => { refs.current[i] = el; }}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#0b1220"
            emissive={s.color}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.15}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
};

// ---------------------------------------------------------------
// Full scene — abstract network of light, matter and particles.
// ---------------------------------------------------------------
const ConstellationScene = () => {
  const group = useRef();
  const { viewport } = useThree();

  const fit = useMemo(() => {
    const HALF = 3.6;
    const MARGIN = 0.9;
    const s = Math.min(viewport.width / (HALF * 2), viewport.height / (HALF * 2)) * MARGIN;
    return { scale: s, y: -0.15 * s };
  }, [viewport.width, viewport.height]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.12, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.08, 0.05);
    }
  });

  return (
    <group ref={group} scale={fit.scale} position={[0, fit.y, 0]}>
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 3.5, 6]} intensity={2.4} color="#38bdf8" />
      <pointLight position={[-5, 4, 3]} intensity={1.6} color="#fbbf24" />
      <pointLight position={[0, -5, 2]} intensity={1.2} color="#6366f1" />

      <Stars radius={28} depth={22} count={900} factor={2.2} saturation={0} fade speed={0.4} />

      {/* Atmosphere */}
      <Aurora position={[-4.5, 1.8, -5]} color="#4338ca" scale={11} opacity={0.16} drift={1} />
      <Aurora position={[4.2, 0.2, -6]} color="#0ea5e9" scale={9} opacity={0.13} drift={1.3} />
      <Aurora position={[0, 3.4, -5]} color="#7c3aed" scale={8} opacity={0.1} drift={0.8} />

      <ConnectionThreads />
      <ConstellationField count={500} />

      <DustRing innerR={1.72} outerR={2.05} count={320} color="#7dd3fc" opacity={0.5} tilt={[Math.PI / 2.55, 0.25, 0]} speed={0.32} />
      <DustRing innerR={1.3} outerR={1.55} count={220} color="#fbbf24" opacity={0.35} tilt={[Math.PI / 2.1, -0.35, 0.4]} speed={-0.22} />

      <RefractiveCore />
      <GlassShards />
    </group>
  );
};

// ---------------------------------------------------------------
// Public wrapper — pauses the render loop whenever it is off-screen.
// ---------------------------------------------------------------
const DreamFusionEngine = () => {
  const [containerRef, isInView] = useInViewport();

  return (
    <div ref={containerRef} className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] select-none">
      <Canvas dpr={[1, 1.6]} frameloop={isInView ? "always" : "never"} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 0.2, 8]} fov={50} />
        <Suspense fallback={null}>
          <ConstellationScene />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-premium-navy via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-l from-premium-navy/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default DreamFusionEngine;
