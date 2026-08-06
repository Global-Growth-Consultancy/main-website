import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// ------------------------------------------------------------------
// Student3D — premium abstract "education" scene (Stripe/Linear style).
//
// No human character (brief Phase A fallback §10): the focal element is
// a floating graduation cap, orbited by a diploma scroll, study-abroad
// globe, BSCC coin and admission document, threaded on a thin orbit ring
// with a soft accent glow + sparkle field.
//
//   • Chapter-reactive accent lighting + glow (scene color)
//   • Cinematic camera drift + pointer parallax + hover push-in
//   • Bloom / Vignette / subtle DepthOfField (desktop only)
//   • prefers-reduced-motion: static, no post-processing
//   • frameloop "never" when off-screen (performance hardening)
// ------------------------------------------------------------------

const SCENE_ACCENTS = ["#38BDF8", "#A78BFA", "#34D399", "#FBBF24", "#F472B6", "#FBBF24"];

const DPR = typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1.5] : [1, 1.75];

const makeGlowTexture = () => {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const makeBgTexture = () => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(256, 256, 60, 256, 256, 300);
  g.addColorStop(0, "rgba(8,12,24,0)");
  g.addColorStop(0.55, "rgba(8,12,24,0.32)");
  g.addColorStop(1, "rgba(6,9,18,0.9)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const glowTex = makeGlowTexture();
const bgTex = makeBgTexture();

const createMaterials = () => ({
  capBase: new THREE.MeshPhysicalMaterial({
    color: "#161F36", roughness: 0.38, metalness: 0.22, clearcoat: 0.55, clearcoatRoughness: 0.25,
  }),
  capBoard: new THREE.MeshPhysicalMaterial({
    color: "#0C1424", roughness: 0.42, metalness: 0.12, clearcoat: 0.4,
  }),
  gold: new THREE.MeshPhysicalMaterial({
    color: "#E9A83A", roughness: 0.22, metalness: 1, clearcoat: 0.4,
    emissive: "#FFC964", emissiveIntensity: 1.35,
  }),
  goldDim: new THREE.MeshStandardMaterial({ color: "#C99A2B", roughness: 0.3, metalness: 0.9 }),
  parchment: new THREE.MeshPhysicalMaterial({
    color: "#F3EBD8", roughness: 0.55, metalness: 0, clearcoat: 0.25,
  }),
  paper: new THREE.MeshStandardMaterial({ color: "#FAFAFA", roughness: 0.5, metalness: 0.02 }),
  lineAccent: new THREE.MeshStandardMaterial({ color: "#38BDF8", roughness: 0.4, emissive: "#38BDF8", emissiveIntensity: 0.35 }),
  lineFaint: new THREE.MeshStandardMaterial({ color: "#B9C2D4", roughness: 0.55 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: "#6FB1FF", roughness: 0.12, metalness: 0.05, transparent: true, opacity: 0.24,
    clearcoat: 1, clearcoatRoughness: 0.1,
  }),
  ringGold: new THREE.MeshStandardMaterial({ color: "#FFD27A", roughness: 0.3, metalness: 0.8, emissive: "#FFC964", emissiveIntensity: 0.9 }),
  ringGoldDim: new THREE.MeshStandardMaterial({ color: "#C9A24B", roughness: 0.35, metalness: 0.6, emissive: "#B98A2E", emissiveIntensity: 0.35 }),
  coin: new THREE.MeshStandardMaterial({ color: "#D8A82E", roughness: 0.26, metalness: 0.95 }),
  coinRim: new THREE.MeshStandardMaterial({ color: "#FFD27A", roughness: 0.24, metalness: 0.9, emissive: "#FFC964", emissiveIntensity: 0.7 }),
  coinEmblem: new THREE.MeshStandardMaterial({ color: "#E9A83A", roughness: 0.3, metalness: 1, emissive: "#FFC964", emissiveIntensity: 0.5 }),
});

const MAT = createMaterials();

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// ------------------------------------------------------------------
// Camera — slow drift + pointer parallax + hover push-in
// ------------------------------------------------------------------
const CameraRig = ({ reducedMotion, hover }) => {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.95, 0));
  const basePos = useRef(new THREE.Vector3(0, 0.95, 4.3));

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    if (reducedMotion) {
      camera.position.lerp(basePos.current, 0.08);
      camera.lookAt(target.current);
      return;
    }
    const t = state.clock.elapsedTime;
    const push = hover ? 3.95 : 4.3;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, basePos.current.x + state.pointer.x * 0.09, 4, dt);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      basePos.current.y + Math.sin(t * 0.5) * 0.02 - state.pointer.y * 0.05,
      4,
      dt
    );
    camera.position.z = THREE.MathUtils.damp(camera.position.z, push + Math.sin(t * 0.34) * 0.025, 3, dt);
    camera.lookAt(
      target.current.x + state.pointer.x * 0.04,
      target.current.y + state.pointer.y * 0.03,
      target.current.z
    );
  });

  return null;
};

// ------------------------------------------------------------------
// Accent light — chapter color tint
// ------------------------------------------------------------------
const AccentLight = ({ scene, reducedMotion }) => {
  const lightRef = useRef(null);
  const color = useMemo(() => new THREE.Color(SCENE_ACCENTS[scene] || SCENE_ACCENTS[0]), [scene]);

  useFrame((_, dt) => {
    if (!lightRef.current) return;
    lightRef.current.color.lerp(color, reducedMotion ? 1 : dt * 2.4);
    const target = reducedMotion ? 0.25 : 0.55;
    lightRef.current.intensity = THREE.MathUtils.damp(lightRef.current.intensity, target, 4, dt);
  });

  return <pointLight ref={lightRef} position={[-1.7, 2.3, 2.3]} intensity={0.55} distance={9} decay={2} />;
};

// ------------------------------------------------------------------
// Objects
// ------------------------------------------------------------------
const GradCap = () => (
  <group rotation={[-0.28, 0.15, -0.12]}>
    <mesh position={[0, -0.14, 0]}>
      <sphereGeometry args={[0.34, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <primitive object={MAT.capBase} attach="material" />
    </mesh>
    <mesh position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.47, 0.47, 0.035, 48]} />
      <primitive object={MAT.capBoard} attach="material" />
    </mesh>
    <mesh position={[0, 0.075, 0]}>
      <sphereGeometry args={[0.032, 16, 12]} />
      <primitive object={MAT.gold} attach="material" />
    </mesh>
    <group position={[0.33, 0.035, 0]} rotation={[0, 0, 0.2]}>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.24, 8]} />
        <primitive object={MAT.gold} attach="material" />
      </mesh>
      <mesh position={[0, -0.245, 0]}>
        <sphereGeometry args={[0.024, 12, 10]} />
        <primitive object={MAT.gold} attach="material" />
      </mesh>
    </group>
  </group>
);

const Diploma = () => (
  <group rotation={[0.25, -0.5, 0.1]}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.13, 0.13, 0.8, 24]} />
      <primitive object={MAT.parchment} attach="material" />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[0.43, 0, 0]}>
      <cylinderGeometry args={[0.135, 0.135, 0.06, 24]} />
      <primitive object={MAT.goldDim} attach="material" />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.43, 0, 0]}>
      <cylinderGeometry args={[0.135, 0.135, 0.06, 24]} />
      <primitive object={MAT.goldDim} attach="material" />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.135, 0.018, 10, 24]} />
      <primitive object={MAT.gold} attach="material" />
    </mesh>
  </group>
);

const Globe = () => (
  <group rotation={[0, 0.4, 0.35]}>
    <mesh>
      <sphereGeometry args={[0.4, 40, 28]} />
      <primitive object={MAT.glass} attach="material" />
    </mesh>
    <mesh>
      <torusGeometry args={[0.4, 0.012, 10, 48]} />
      <primitive object={MAT.ringGold} attach="material" />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.4, 0.01, 10, 48]} />
      <primitive object={MAT.ringGoldDim} attach="material" />
    </mesh>
    <mesh position={[0.12, 0.14, 0.36]}>
      <sphereGeometry args={[0.03, 10, 8]} />
      <primitive object={MAT.goldDim} attach="material" />
    </mesh>
    <mesh position={[-0.18, -0.05, 0.35]}>
      <sphereGeometry args={[0.022, 10, 8]} />
      <primitive object={MAT.goldDim} attach="material" />
    </mesh>
    <mesh position={[0.05, -0.22, 0.33]}>
      <sphereGeometry args={[0.026, 10, 8]} />
      <primitive object={MAT.goldDim} attach="material" />
    </mesh>
  </group>
);

const Coin = () => (
  <group rotation={[0.3, 0.2, -0.25]}>
    <mesh>
      <cylinderGeometry args={[0.16, 0.16, 0.035, 40]} />
      <primitive object={MAT.coin} attach="material" />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.16, 0.014, 10, 40]} />
      <primitive object={MAT.coinRim} attach="material" />
    </mesh>
    <mesh>
      <torusGeometry args={[0.06, 0.012, 8, 24]} />
      <primitive object={MAT.coinEmblem} attach="material" />
    </mesh>
  </group>
);

const Document = () => (
  <group rotation={[0.15, 0.35, 0.1]}>
    <mesh>
      <boxGeometry args={[0.44, 0.56, 0.015]} />
      <primitive object={MAT.paper} attach="material" />
    </mesh>
    <mesh position={[0, 0.1, 0.01]}>
      <boxGeometry args={[0.3, 0.02, 0.012]} />
      <primitive object={MAT.lineAccent} attach="material" />
    </mesh>
    <mesh position={[0, 0.04, 0.01]}>
      <boxGeometry args={[0.26, 0.02, 0.012]} />
      <primitive object={MAT.lineFaint} attach="material" />
    </mesh>
    <mesh position={[0, -0.02, 0.01]}>
      <boxGeometry args={[0.28, 0.02, 0.012]} />
      <primitive object={MAT.lineFaint} attach="material" />
    </mesh>
  </group>
);

// ------------------------------------------------------------------
// Scene — composition + animation loop
// ------------------------------------------------------------------
const AbstractScene = ({ scene, clicks, reducedMotion }) => {
  const compRef = useRef(null);
  const glowRef = useRef(null);
  const shockRef = useRef(null);
  const orbitRingRef = useRef(null);
  const capRef = useRef(null);
  const diplomaRef = useRef(null);
  const globeRef = useRef(null);
  const coinRef = useRef(null);
  const docRef = useRef(null);

  const entrance = useRef(0);
  const pulse = useRef(0);
  const prevClicks = useRef(clicks);
  const prevScene = useRef(scene);
  const accentColor = useMemo(() => new THREE.Color(SCENE_ACCENTS[scene] || SCENE_ACCENTS[0]), [scene]);
  const focus = useRef({ cap: 0, diploma: 0, globe: 0, coin: 0, doc: 0 });
  const reducedRef = useRef(reducedMotion);

  useEffect(() => { reducedRef.current = reducedMotion; }, [reducedMotion]);

  useEffect(() => {
    if (clicks !== prevClicks.current) {
      prevClicks.current = clicks;
      if (!reducedRef.current) pulse.current = 1;
    }
  }, [clicks]);

  useEffect(() => {
    if (scene !== prevScene.current) {
      prevScene.current = scene;
      if (scene >= 4 && !reducedRef.current) pulse.current = 1;
    }
  }, [scene]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const reduced = reducedRef.current;

    entrance.current = Math.min(entrance.current + dt * 1.2, 1);
    compRef.current.position.y = (1 - easeOutCubic(entrance.current)) * -0.5;

    // accent color → glow disc + orbit ring
    const targetAccent = new THREE.Color(SCENE_ACCENTS[scene] || SCENE_ACCENTS[0]);
    accentColor.lerp(targetAccent, reduced ? 1 : dt * 2.2);
    if (glowRef.current) {
      glowRef.current.material.color.copy(accentColor).multiplyScalar(reduced ? 0.85 : 1.35);
      glowRef.current.material.opacity = reduced ? 0.55 : 0.9;
    }
    if (orbitRingRef.current) {
      orbitRingRef.current.material.color.copy(accentColor).multiplyScalar(0.9);
      orbitRingRef.current.material.opacity = reduced ? 0.35 : 0.55;
    }

    if (reduced) {
      capRef.current.position.y = 0.92;
      capRef.current.rotation.y = 0.15;
      capRef.current.scale.setScalar(0.95);
      diplomaRef.current.position.set(-1.0, 0.55, -0.15);
      globeRef.current.position.set(1.0, 0.6, -0.2);
      globeRef.current.rotation.y = 0.25;
      coinRef.current.position.set(-0.68, 0.35, 0.38);
      docRef.current.position.set(0.72, 0.32, 0.34);
      shockRef.current.material.opacity = 0;
      return;
    }

    // pulse (click / graduation / success)
    pulse.current = Math.max(pulse.current - dt * 0.75, 0);
    shockRef.current.scale.setScalar(1 + (1 - pulse.current) * 3);
    shockRef.current.material.opacity = pulse.current * 0.5;

    // per-chapter focus emphasis
    const f = focus.current;
    const targets = {
      cap: scene === 4 || scene === 5,
      diploma: scene === 1 || scene === 5,
      globe: scene === 3 || scene === 5,
      coin: scene === 2 || scene === 5,
      doc: scene === 0 || scene === 5,
    };
    f.cap = THREE.MathUtils.damp(f.cap, targets.cap ? 1 : 0, 4, dt);
    f.diploma = THREE.MathUtils.damp(f.diploma, targets.diploma ? 1 : 0, 4, dt);
    f.globe = THREE.MathUtils.damp(f.globe, targets.globe ? 1 : 0, 4, dt);
    f.coin = THREE.MathUtils.damp(f.coin, targets.coin ? 1 : 0, 4, dt);
    f.doc = THREE.MathUtils.damp(f.doc, targets.doc ? 1 : 0, 4, dt);

    // float + slow rotation
    capRef.current.position.y = 0.92 + Math.sin(t * 1.1) * 0.05;
    capRef.current.rotation.y = t * 0.35;
    capRef.current.scale.setScalar(0.95 * (1 + f.cap * 0.08) * (1 + pulse.current * 0.18));

    diplomaRef.current.position.y = 0.55 + Math.sin(t * 1.0 + 1) * 0.06;
    diplomaRef.current.rotation.y = -0.15 + Math.sin(t * 0.5) * 0.18;
    diplomaRef.current.scale.setScalar(0.85 * (1 + f.diploma * 0.09));

    globeRef.current.position.y = 0.6 + Math.sin(t * 1.2 + 2) * 0.07;
    globeRef.current.rotation.y = t * 0.25;
    globeRef.current.scale.setScalar(0.8 * (1 + f.globe * 0.09));

    coinRef.current.position.y = 0.35 + Math.sin(t * 1.3 + 3) * 0.08;
    coinRef.current.rotation.y = t * 0.9;
    coinRef.current.scale.setScalar(0.95 * (1 + f.coin * 0.09));

    docRef.current.position.y = 0.32 + Math.sin(t * 1.15 + 4) * 0.07;
    docRef.current.rotation.z = Math.sin(t * 0.6) * 0.1;
    docRef.current.scale.setScalar(0.9 * (1 + f.doc * 0.09));

    orbitRingRef.current.rotation.z = t * 0.12;
  });

  return (
    <group ref={compRef}>
      {/* background void */}
      <mesh position={[0, 0.95, -2.6]} scale={[10, 7, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={bgTex} transparent depthWrite={false} toneMapped={false} />
      </mesh>

      {/* accent glow */}
      <mesh ref={glowRef} position={[0, 0.9, -1.5]} scale={[3.2, 3.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* shock ring (click / success) */}
      <mesh ref={shockRef} position={[0, 0.9, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* orbit ring */}
      <mesh ref={orbitRingRef} position={[0, 0.9, -0.3]} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.35, 0.008, 8, 90]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} />
      </mesh>

      {/* focal objects */}
      <group ref={capRef} position={[0, 0.92, 0]} scale={0.95}>
        <GradCap />
      </group>
      <group ref={diplomaRef} position={[-1.0, 0.55, -0.15]} scale={0.85}>
        <Diploma />
      </group>
      <group ref={globeRef} position={[1.0, 0.6, -0.2]} scale={0.8}>
        <Globe />
      </group>
      <group ref={coinRef} position={[-0.68, 0.35, 0.38]} scale={0.95}>
        <Coin />
      </group>
      <group ref={docRef} position={[0.72, 0.32, 0.34]} scale={0.9}>
        <Document />
      </group>

      {!reducedMotion && (
        <Sparkles count={90} scale={[4, 2.8, 2]} size={2.6} speed={0.35} opacity={0.65} color="#FFD98A" position={[0, 0.9, 0]} />
      )}

      <ContactShadows position={[0, 0.02, 0]} opacity={0.22} scale={5} blur={2.6} far={3} color="#000000" frames={1} resolution={256} />
    </group>
  );
};

const SceneContainer = ({ isHovered, scene, clicks, reducedMotion, visible, isMobile }) => (
  <div className="absolute inset-0">
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={DPR}
      camera={{ position: [0, 0.95, 4.3], fov: 30 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={({ camera }) => camera.lookAt(0, 0.95, 0)}
    >
      <fog attach="fog" args={["#0A0F1C", 4.2, 8.5]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#FFF1E0" />
      <directionalLight position={[-3.5, 3, -3.5]} intensity={0.5} color="#7DD3FC" />
      <directionalLight position={[0, 2.5, -3]} intensity={0.3} color="#A78BFA" />

      <AccentLight scene={scene} reducedMotion={reducedMotion} />
      {/* procedural studio env (no CDN fetch — self-contained reflections) */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <Lightformer form="rect" intensity={4} color="#FFF1E0" position={[0, 3, 2]} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={2} color="#7DD3FC" position={[-4, 2, 1]} rotation-y={Math.PI / 2} scale={[3, 1.5, 1]} />
          <Lightformer form="rect" intensity={1.5} color="#A78BFA" position={[4, 1, 1]} rotation-y={-Math.PI / 2} scale={[3, 1.5, 1]} />
          <Lightformer form="circle" intensity={2.5} color="#FFE9C8" position={[0, 4, -4]} scale={[2, 2, 1]} />
        </group>
      </Environment>

      <AbstractScene scene={scene} clicks={clicks} reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} hover={isHovered} />

      {/* post-FX: desktop + full-motion only (renderer keeps ACES tone mapping) */}
      {!reducedMotion && !isMobile && (
        <EffectComposer multisampling={4}>
          <DepthOfField worldFocusDistance={4.3} focalLength={0.018} bokehScale={0.6} />
          <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
          <Vignette offset={0.3} darkness={0.45} />
        </EffectComposer>
      )}
    </Canvas>
  </div>
);

const Student3D = ({ isHovered, scene, clicks, reducedMotion, visible = true }) => {
  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);
  return <SceneContainer visible={visible} isMobile={isMobile} isHovered={isHovered} scene={scene} clicks={clicks} reducedMotion={reducedMotion} />;
};

export default Student3D;
