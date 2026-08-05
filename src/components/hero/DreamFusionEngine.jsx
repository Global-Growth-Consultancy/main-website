import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, PerspectiveCamera, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

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
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.55)');
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
const ParticleStream = ({ curve, count = 600, color, size = 0.1, speed = 0.14, opacity = 0.9 }) => {
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
const GlowTube = ({ curve, color, opacity = 0.32 }) => {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 90, 0.04, 8, false), [curve]);
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
// Central fusion core where aspiration meets BSCC loan
// ---------------------------------------------------------------
const FusionCore = () => {
  const core = useRef();
  const shell = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (core.current) {
      core.current.rotation.y = t * 0.5;
      core.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      core.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (shell.current) {
      shell.current.rotation.y = t * 0.18;
      shell.current.rotation.z = t * 0.12;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      <mesh ref={core}>
        <sphereGeometry args={[0.62, 48, 48]} />
        <MeshDistortMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={1.3}
          distort={0.38}
          speed={2.2}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <GlowSprite scale={5} color="#a855f7" opacity={0.45} />
      <GlowSprite scale={2.1} color="#ffffff" opacity={0.75} />
    </group>
  );
};

// ---------------------------------------------------------------
// Orbiting rings (opportunity field around the core)
// ---------------------------------------------------------------
const OrbitRing = ({ radius, color, tilt, speed, opacity = 0.5 }) => {
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
// Stage node (origin / destination of each stream)
// ---------------------------------------------------------------
const EnergyNode = ({ position, color, label, size = 0.4 }) => {
  return (
    <group position={position}>
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.1}
            distort={0.35}
            speed={1.8}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>
      </Float>
      <GlowSprite scale={size * 6.5} color={color} opacity={0.5} />
      <Text position={[0, -size - 0.55, 0]} fontSize={0.26} color="#cbd5e1" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        {label}
      </Text>
    </group>
  );
};

// ---------------------------------------------------------------
// Graduation cap — the final outcome, made of primitive shapes
// ---------------------------------------------------------------
const GraduationCap = ({ position }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 1.5) * 0.15;
      ref.current.rotation.y = t * 0.6;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[1.5, 0.14, 1.5]} />
        <meshStandardMaterial color="#0b1220" emissive="#10b981" emissiveIntensity={0.7} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.05, 0.4, 4]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.9} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.75, -0.28, 0.75]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.75, -0.56, 0.75]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.1} />
      </mesh>
      <GlowSprite scale={4.2} color="#34d399" opacity={0.35} />
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

  // Content bounds (world units, generous half-extents that cover nodes,
  // labels, cap and glow sprites) and the vertical center of the art.
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
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.08, 0.04);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.05, 0.04);
    }
  });

  return (
    <group ref={group} scale={fit.scale} position={[0, fit.y, 0]}>
      <ambientLight intensity={0.55} />
      <pointLight position={[6, 6, 8]} intensity={1.6} color="#38bdf8" />
      <pointLight position={[-6, 6, 4]} intensity={1.2} color="#fbbf24" />
      <pointLight position={[0, -4, 2]} intensity={0.6} color="#a855f7" />

      <Stars radius={30} depth={25} count={1500} factor={2.4} saturation={0} fade speed={1} />

      <GlowTube curve={pathA} color="#38bdf8" />
      <GlowTube curve={pathB} color="#fbbf24" />
      <GlowTube curve={pathC} color="#34d399" />

      <ParticleStream curve={pathA} count={600} color="#38bdf8" size={0.1} speed={0.14} />
      <ParticleStream curve={pathB} count={600} color="#fbbf24" size={0.1} speed={0.14} />
      <ParticleStream curve={pathC} count={450} color="#34d399" size={0.09} speed={0.12} />

      <EnergyNode position={[-4.4, 1.7, 0]} color="#38bdf8" label="ASPIRATION" />
      <EnergyNode position={[0.5, 4.0, -1.2]} color="#fbbf24" label="BSCC LOAN" size={0.42} />
      <EnergyNode position={[4.4, 1.9, 0]} color="#34d399" label="SUCCESS" />

      <FusionCore />
      <GraduationCap position={[4.4, 3.05, 0]} />

      <OrbitRing radius={1.5} color="#8b5cf6" tilt={[Math.PI / 2.6, 0.2, 0]} speed={0.6} />
      <OrbitRing radius={1.95} color="#38bdf8" tilt={[Math.PI / 2.2, -0.4, 0.3]} speed={-0.4} />
    </group>
  );
};

// ---------------------------------------------------------------
// Public wrapper
// ---------------------------------------------------------------
const DreamFusionEngine = () => {
  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] select-none">
      <Canvas dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
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
