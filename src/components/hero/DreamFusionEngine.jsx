import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------------
// Visibility hook — pauses the render loop while off-screen so the
// canvas costs nothing once you scroll past the hero.
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
// Glow texture (radial gradient) used for soft halo sprites
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

const GlowSprite = ({ position = [0, 0, 0], color = '#ffffff', scale = 3, opacity = 0.7 }) => {
  const texture = useMemo(makeGlowTexture, []);
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
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
// Particle stream — LUT-sampled for maximum performance.
// The curve is pre-sampled into a lookup table once; per frame we
// only index/lerp the table instead of running arc-length math.
// ---------------------------------------------------------------
const ParticleStream = ({ curve, count = 400, color, size = 0.1, speed = 0.14, opacity = 0.9 }) => {
  const ref = useRef();

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
      const p = curve.getPointAt(seeds[i]);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }
    return { positions, seeds };
  }, [curve, count]);

  const lut = useMemo(() => {
    const n = 300;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const p = curve.getPointAt(i / (n - 1));
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    }
    return arr;
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    const arr = ref.current.geometry.attributes.position.array;
    const n = lut.length / 3;
    for (let i = 0; i < count; i++) {
      const f = (seeds[i] + t) % 1;
      const idx = f * (n - 1);
      const i0 = Math.floor(idx);
      const i1 = i0 + 1 > n - 1 ? n - 1 : i0 + 1;
      const a = idx - i0;
      arr[i * 3] = lut[i0 * 3] + (lut[i1 * 3] - lut[i0 * 3]) * a;
      arr[i * 3 + 1] = lut[i0 * 3 + 1] + (lut[i1 * 3 + 1] - lut[i0 * 3 + 1]) * a;
      arr[i * 3 + 2] = lut[i0 * 3 + 2] + (lut[i1 * 3 + 2] - lut[i0 * 3 + 2]) * a;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ---------------------------------------------------------------
// Glowing energy conduit (the visible path tube)
// ---------------------------------------------------------------
const GlowTube = ({ curve, color, opacity = 0.28 }) => {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 90, 0.035, 8, false), [curve]);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color, opacity]
  );
  return <mesh geometry={geometry} material={material} />;
};

// ---------------------------------------------------------------
// Central fusion core — a polished, softly lit sphere. No wobble,
// no distortion: calm, confident, cinematic.
// ---------------------------------------------------------------
const FusionCore = () => {
  const core = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (core.current) {
      core.current.rotation.y = t * 0.25;
      core.current.rotation.x = Math.sin(t * 0.2) * 0.06;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      <mesh ref={core}>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshPhysicalMaterial
          color="#2a2a5a"
          emissive="#4338ca"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.25}
        />
      </mesh>
      <GlowSprite scale={4.5} color="#6366f1" opacity={0.35} />
      <GlowSprite scale={1.8} color="#ffffff" opacity={0.6} />
    </group>
  );
};

// ---------------------------------------------------------------
// Orbiting rings (opportunity field around the core)
// ---------------------------------------------------------------
const OrbitRing = ({ radius, color, tilt, speed, opacity = 0.4 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.getElapsedTime() * speed;
  });
  return (
    <group rotation={tilt} position={[0, -0.2, 0]}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.02, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------
// Stage node (origin / destination of each stream) — gently floating
// ---------------------------------------------------------------
const EnergyNode = ({ position, color, label, size = 0.34 }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) ref.current.position.y = position[1] + Math.sin(t * 0.9 + position[0]) * 0.06;
  });

  return (
    <group position={position}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshPhysicalMaterial
            color="#15153a"
            emissive={color}
            emissiveIntensity={0.55}
            metalness={0.85}
            roughness={0.3}
            clearcoat={0.8}
            clearcoatRoughness={0.3}
          />
        </mesh>
        <GlowSprite scale={size * 5.5} color={color} opacity={0.38} />
      </group>
      <Text position={[0, -size - 0.55, 0]} fontSize={0.26} color="#94a3b8" anchorX="center" anchorY="middle" letterSpacing={0.14}>
        {label}
      </Text>
    </group>
  );
};

// ---------------------------------------------------------------
// Graduation cap — the final outcome. Restrained and still; a quiet
// mark of achievement rather than a bobbing mascot.
// ---------------------------------------------------------------
const GraduationCap = ({ position }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.12;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[1.4, 0.12, 1.4]} />
        <meshPhysicalMaterial color="#0b1220" emissive="#10b981" emissiveIntensity={0.35} metalness={0.9} roughness={0.25} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.98, 0.36, 4]} />
        <meshPhysicalMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.45} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.72, -0.26, 0.72]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.72, -0.54, 0.72]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <GlowSprite scale={3.4} color="#34d399" opacity={0.22} />
    </group>
  );
};

// ---------------------------------------------------------------
// Full scene: aspiration + loan converge into admission, bloom into success
//
// The scene is wrapped in a group whose scale is derived from the
// LIVE viewport. It always fits the entire composition inside the
// visible frustum for any container size / aspect ratio — no cropping.
// ---------------------------------------------------------------
const DreamScene = () => {
  const group = useRef();
  const { viewport } = useThree();

  const fit = useMemo(() => {
    const HALF_W = 5.3;
    const HALF_H = 4.5;
    const CENTER_Y = 1.1;
    const MARGIN = 0.94;
    const s = Math.min(viewport.width / (HALF_W * 2), viewport.height / (HALF_H * 2)) * MARGIN;
    return { scale: s, y: -CENTER_Y * s };
  }, [viewport.width, viewport.height]);

  const pathA = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.4, 1.7, 0),
        new THREE.Vector3(-2.5, 1.1, 0.6),
        new THREE.Vector3(-0.8, 0.3, 0.4),
        new THREE.Vector3(0, -0.2, 0),
      ]),
    []
  );
  const pathB = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, 4.0, -1.2),
        new THREE.Vector3(0.1, 2.3, 0.3),
        new THREE.Vector3(0, 0.5, 0.5),
        new THREE.Vector3(0, -0.2, 0),
      ]),
    []
  );
  const pathC = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.2, 0),
        new THREE.Vector3(1.5, 0.5, 0.5),
        new THREE.Vector3(3.0, 1.3, 0.3),
        new THREE.Vector3(4.4, 1.9, 0),
      ]),
    []
  );

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.06, 0.04);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.04, 0.04);
    }
  });

  return (
    <group ref={group} scale={fit.scale} position={[0, fit.y, 0]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 8]} intensity={1.4} color="#38bdf8" />
      <pointLight position={[-6, 6, 4]} intensity={1.0} color="#fbbf24" />
      <pointLight position={[0, -4, 2]} intensity={0.5} color="#6366f1" />

      <Stars radius={30} depth={25} count={1200} factor={2} saturation={0} fade speed={0.6} />

      <GlowTube curve={pathA} color="#38bdf8" />
      <GlowTube curve={pathB} color="#fbbf24" />
      <GlowTube curve={pathC} color="#34d399" />

      <ParticleStream curve={pathA} count={400} color="#38bdf8" size={0.1} speed={0.14} />
      <ParticleStream curve={pathB} count={400} color="#fbbf24" size={0.1} speed={0.14} />
      <ParticleStream curve={pathC} count={300} color="#34d399" size={0.09} speed={0.12} />

      <EnergyNode position={[-4.4, 1.7, 0]} color="#38bdf8" label="ASPIRATION" />
      <EnergyNode position={[0.5, 4.0, -1.2]} color="#fbbf24" label="BSCC LOAN" size={0.38} />
      <EnergyNode position={[4.4, 1.9, 0]} color="#34d399" label="SUCCESS" />

      <FusionCore />
      <GraduationCap position={[4.4, 3.05, 0]} />

      <OrbitRing radius={1.5} color="#8b5cf6" tilt={[Math.PI / 2.6, 0.2, 0]} speed={0.5} opacity={0.35} />
      <OrbitRing radius={1.95} color="#38bdf8" tilt={[Math.PI / 2.2, -0.4, 0.3]} speed={-0.35} opacity={0.3} />
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
      <Canvas dpr={[1, 1.75]} frameloop={isInView ? "always" : "never"} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={55} />
        <Suspense fallback={null}>
          <DreamScene />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-premium-navy via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-l from-premium-navy/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default DreamFusionEngine;
