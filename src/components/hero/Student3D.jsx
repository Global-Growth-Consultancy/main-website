import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ------------------------------------------------------------------
// Student3D — "Aarav", a premium international-study student.
//
// Smart-casual hero: navy blazer over a white shirt, charcoal trousers,
// clean white sneakers, leather backpack, passport in hand, floating
// laptop companion. Fully rigged: blink, breathe, cursor-tracked head
// + eyes, syllable-synced lipsync, confident smile + brow, chapter
// gestures and a success hop. Cinematic key/rim/fill lighting, soft
// contact shadows, additive halo glow and a slow drifting camera.
// Every motion is damped → smooth 60 FPS.
// ------------------------------------------------------------------

// ---- procedural textures (browser-only, created once) ----
const makeIrisTexture = () => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
  g.addColorStop(0, "#2B1A0E");
  g.addColorStop(0.55, "#5A3A22");
  g.addColorStop(0.82, "#3A2314");
  g.addColorStop(1, "#1C0F06");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.stroke();
  return new THREE.CanvasTexture(c);
};

const makeShadowTexture = () => {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(0.6, "rgba(0,0,0,0.28)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
};

const makeGlowTexture = () => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.35, "rgba(255,255,255,0.28)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

const irisTex = makeIrisTexture();
const shadowTex = makeShadowTexture();
const glowTex = makeGlowTexture();

// ---- materials (PBR: subsurface skin, wool blazer, leather, metal) ----
const skinMat = new THREE.MeshPhysicalMaterial({
  color: "#B37A4F", roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.7,
  sheen: 0.65, sheenRoughness: 0.8,
});
const hairMat = new THREE.MeshPhysicalMaterial({ color: "#1E120E", roughness: 0.42, clearcoat: 0.25, clearcoatRoughness: 0.4 });
const blazerMat = new THREE.MeshPhysicalMaterial({
  color: "#1B2542", roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.45,
  sheen: 0.35, sheenRoughness: 0.7,
});
const blazerTrimMat = new THREE.MeshPhysicalMaterial({
  color: "#121A33", roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.4,
});
const shirtMat = new THREE.MeshPhysicalMaterial({ color: "#F6F8FC", roughness: 0.4, clearcoat: 0.1 });
const pantsMat = new THREE.MeshStandardMaterial({ color: "#242B3D", roughness: 0.72 });
const sneakerMat = new THREE.MeshPhysicalMaterial({ color: "#FAFAFA", roughness: 0.45, clearcoat: 0.22, clearcoatRoughness: 0.5 });
const sneakerSoleMat = new THREE.MeshStandardMaterial({ color: "#CFD4DC", roughness: 0.6 });
const backpackMat = new THREE.MeshPhysicalMaterial({ color: "#2A3654", roughness: 0.6, clearcoat: 0.18, clearcoatRoughness: 0.6 });
const leatherMat = new THREE.MeshStandardMaterial({ color: "#5C3A22", roughness: 0.55 });
const laptopSilverMat = new THREE.MeshPhysicalMaterial({ color: "#C9CDD6", roughness: 0.3, metalness: 0.85, clearcoat: 0.4 });
const laptopScreenMat = new THREE.MeshStandardMaterial({
  color: "#0E2233", emissive: "#67C3F5", emissiveIntensity: 2.2, roughness: 0.2,
});
const passportMat = new THREE.MeshPhysicalMaterial({ color: "#B3232E", roughness: 0.4, clearcoat: 0.3, clearcoatRoughness: 0.5 });
const paperMat = new THREE.MeshStandardMaterial({ color: "#F4F1EA", roughness: 0.7 });
const goldMat = new THREE.MeshStandardMaterial({ color: "#E6B24A", roughness: 0.3, metalness: 0.7 });
const globeOceanMat = new THREE.MeshPhysicalMaterial({ color: "#2C6FBF", roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2 });
const globeRingMat = new THREE.MeshStandardMaterial({ color: "#9CCCF8", roughness: 0.3, metalness: 0.4 });
const scleraMat = new THREE.MeshPhysicalMaterial({ color: "#FDF6EC", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 });
const pupilMat = new THREE.MeshStandardMaterial({ color: "#12090A", roughness: 0.2 });
const lipMat = new THREE.MeshPhysicalMaterial({ color: "#B0626A", roughness: 0.42, clearcoat: 0.2 });
const mouthInnerMat = new THREE.MeshStandardMaterial({ color: "#4A1523", roughness: 0.7 });
const teethMat = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.3 });
const innerEarMat = new THREE.MeshStandardMaterial({ color: "#9C6A44", roughness: 0.6 });
const nostrilMat = new THREE.MeshStandardMaterial({ color: "#3E2316", roughness: 0.8 });
const blushMat = new THREE.MeshStandardMaterial({
  color: "#D98A68",
  roughness: 0.6,
  emissive: "#C77A5E",
  emissiveIntensity: 0.05,
});
const irisMat = new THREE.MeshStandardMaterial({ map: irisTex, roughness: 0.25 });

// ---- chapter pose targets ----
// right shoulder rs / right elbow re / left shoulder ls / left elbow le
const POSE = {
  rest: { rs: [-0.1, 0.1, 0.22], re: [-0.02, 0, 0.05], ls: [-0.62, 0.12, 0.12], le: [0.62, 0, 0] },
  wave: { rs: [-0.55, 0.1, 0.95], re: [-0.6, 0, 0], ls: [-0.62, 0.12, 0.12], le: [0.62, 0, 0] },
  talk: { rs: [-0.45, 0.12, 0.3], re: [1.05, 0, 0], ls: [-0.78, 0.12, -0.22], le: [0.85, 0, 0] },
  point: { rs: [-1.15, 0.22, 0.12], re: [-0.55, 0, 0], ls: [-0.62, 0.12, 0.12], le: [0.62, 0, 0] },
  open: { rs: [-0.4, 0.1, 0.82], re: [-0.2, 0, 0], ls: [-0.78, 0.12, -0.72], le: [0.5, 0, 0] },
  present: { rs: [-0.95, 0.28, 0.12], re: [-0.4, 0, 0], ls: [-0.62, 0.12, 0.12], le: [0.62, 0, 0] },
  celebrate: { rs: [-0.5, 0.1, 0.9], re: [-0.35, 0, 0], ls: [-0.78, 0.12, -0.88], le: [0.45, 0, 0] },
  hover: { rs: [-0.42, 0.1, 0.78], re: [-0.3, 0, 0], ls: [-0.64, 0.12, 0.12], le: [0.6, 0, 0] },
};

const GESTURE_POSE = { 0: "wave", 1: "talk", 2: "point", 3: "open", 4: "present" };

const EMOTION = {
  0: { brow: 0.024 },
  1: { brow: 0.012 },
  2: { brow: 0.02 },
  3: { brow: 0.016 },
  4: { brow: 0.02 },
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// ---- additive halo glow (cheap "bloom" without postprocessing) ----
const Glow = ({ position, scale, color = "#38BDF8", opacity = 0.4 }) => (
  <sprite position={position} scale={[scale, scale, 1]}>
    <spriteMaterial
      map={glowTex}
      color={color}
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </sprite>
);

// ---- floating environment prop wrapper ----
const FloatProp = ({ position, amplitude = 0.06, speed = 1, phase = 0, rotSpeed = 0.4, scale = 1, children }) => {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * amplitude;
    ref.current.rotation.y = Math.sin(t * rotSpeed * 0.5 + phase) * 0.35;
    ref.current.rotation.z = Math.sin(t * rotSpeed * 0.4 + phase) * 0.08;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  );
};

const MiniGlobe = () => (
  <FloatProp position={[1.0, 1.45, 0.15]} scale={0.22} speed={0.7} phase={0}>
    <mesh>
      <sphereGeometry args={[1, 24, 18]} />
      <primitive object={globeOceanMat} />
    </mesh>
    <mesh rotation={[0.4, 0.2, 0]} scale={[1.01, 1.01, 1.01]}>
      <torusGeometry args={[1, 0.012, 8, 40]} />
      <primitive object={globeRingMat} />
    </mesh>
    <mesh rotation={[-0.5, 0.4, 0.2]} scale={[1.01, 1.01, 1.01]}>
      <torusGeometry args={[1, 0.012, 8, 40]} />
      <primitive object={globeRingMat} />
    </mesh>
    <Glow position={[0, 0, 0]} scale={3.4} color="#67C3F5" opacity={0.35} />
  </FloatProp>
);

const MiniCap = () => (
  <FloatProp position={[1.2, 0.9, -0.25]} scale={0.3} speed={0.9} phase={1.2}>
    <mesh position={[0, 0.1, 0]}>
      <sphereGeometry args={[1, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2 + 0.35]} />
      <primitive object={blazerTrimMat} />
    </mesh>
    <mesh position={[0, 0.55, 0]} rotation={[0.06, 0, 0]}>
      <cylinderGeometry args={[1.1, 1.1, 0.07, 28]} />
      <primitive object={blazerTrimMat} />
    </mesh>
    <mesh position={[0, 0.62, 0]}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <primitive object={goldMat} />
    </mesh>
  </FloatProp>
);

const PaperPlane = () => {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.set(Math.sin(t * 0.28) * 1.25, 1.62 + Math.sin(t * 0.45) * 0.22, 0.05 + Math.sin(t * 0.3) * 0.3);
    ref.current.rotation.set(0.15, Math.sin(t * 0.4) * 0.7, -0.2);
  });
  return (
    <group ref={ref} scale={0.12}>
      <mesh>
        <coneGeometry args={[1.4, 3.4, 4, 1]} />
        <primitive object={paperMat} />
      </mesh>
    </group>
  );
};

const VisaStamp = () => (
  <FloatProp position={[-1.15, 1.15, 0.4]} scale={0.32} speed={0.8} phase={0.6}>
    <mesh>
      <boxGeometry args={[1.6, 1.2, 0.3]} />
      <primitive object={blazerTrimMat} />
    </mesh>
    <mesh position={[0, 0, 0.17]}>
      <boxGeometry args={[1.1, 0.45, 0.02]} />
      <meshStandardMaterial color="#34D399" emissive="#34D399" emissiveIntensity={1.6} roughness={0.4} />
    </mesh>
  </FloatProp>
);

const GoldCoin = () => (
  <FloatProp position={[0.75, 0.7, 0.55]} scale={0.5} speed={1.1} phase={1.8}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.7, 0.7, 0.16, 28]} />
      <primitive object={goldMat} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.09, 0]}>
      <torusGeometry args={[0.55, 0.06, 8, 26]} />
      <primitive object={goldMat} />
    </mesh>
    <Glow position={[0, 0, 0]} scale={3} color="#FBBF24" opacity={0.3} />
  </FloatProp>
);

const LocationPin = () => (
  <FloatProp position={[-0.95, 0.75, -0.4]} scale={0.5} speed={1.2} phase={2.4}>
    <mesh position={[0, 0.45, 0]}>
      <sphereGeometry args={[0.5, 16, 12]} />
      <primitive object={passportMat} />
    </mesh>
    <mesh position={[0, -0.2, 0]}>
      <coneGeometry args={[0.34, 0.75, 4]} />
      <primitive object={passportMat} />
    </mesh>
  </FloatProp>
);

const Rocket = () => (
  <FloatProp position={[1.25, 1.85, -0.35]} scale={0.3} speed={0.6} phase={3}>
    <mesh rotation={[0, 0, 0]}>
      <capsuleGeometry args={[0.42, 1.3, 6, 16]} />
      <primitive object={sneakerMat} />
    </mesh>
    <mesh position={[0, 1.1, 0]}>
      <coneGeometry args={[0.42, 0.55, 16]} />
      <primitive object={passportMat} />
    </mesh>
    <mesh position={[0, -0.85, 0]} rotation={[0, 0, 0.5]}>
      <boxGeometry args={[0.16, 0.5, 0.04]} />
      <primitive object={passportMat} />
    </mesh>
    <mesh position={[0, -0.85, 0]} rotation={[0, 0, -0.5]}>
      <boxGeometry args={[0.16, 0.5, 0.04]} />
      <primitive object={passportMat} />
    </mesh>
    <Glow position={[0, -1.1, 0]} scale={2.2} color="#FBBF24" opacity={0.5} />
  </FloatProp>
);

const DocSheet = () => (
  <FloatProp position={[-0.65, 1.68, 0.3]} scale={0.4} speed={0.75} phase={0.9} rotSpeed={0.3}>
    <mesh>
      <boxGeometry args={[1.3, 1.7, 0.04]} />
      <primitive object={paperMat} />
    </mesh>
    <mesh position={[0, 0.28, 0.04]}>
      <boxGeometry args={[0.85, 0.12, 0.02]} />
      <primitive object={blazerMat} />
    </mesh>
    <mesh position={[0, 0.05, 0.04]}>
      <boxGeometry args={[1.0, 0.1, 0.02]} />
      <primitive object={blazerTrimMat} />
    </mesh>
    <mesh position={[0, -0.2, 0.04]}>
      <boxGeometry args={[0.9, 0.1, 0.02]} />
      <primitive object={blazerTrimMat} />
    </mesh>
  </FloatProp>
);

const FloatingLaptop = () => {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.y = 0.55 + Math.sin(t * 0.9) * 0.045;
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.05;
  });
  return (
    <group ref={ref} position={[0.52, 0.55, 0.42]} rotation={[0.08, -0.35, 0.04]}>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.28, 0.02, 0.19]} />
        <primitive object={laptopSilverMat} />
      </mesh>
      <mesh position={[0, 0.1, -0.035]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.016]} />
        <primitive object={laptopSilverMat} />
      </mesh>
      <mesh position={[0, 0.1, -0.046]} rotation={[0.55, 0, 0]}>
        <planeGeometry args={[0.24, 0.14]} />
        <primitive object={laptopScreenMat} />
      </mesh>
      <Glow position={[0, 0.1, 0]} scale={2.4} color="#67C3F5" opacity={0.45} />
    </group>
  );
};

// ---- environment props + dust ----
const EnvironmentProps = () => (
  <group>
    <MiniGlobe />
    <MiniCap />
    <PaperPlane />
    <VisaStamp />
    <GoldCoin />
    <LocationPin />
    <Rocket />
    <DocSheet />
    <FloatingLaptop />
    <Sparkles count={42} scale={[7, 4.4, 4]} size={1.6} speed={0.4} opacity={0.35} color="#7DD3FC" />
  </group>
);

const CameraRig = () => {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const cam = state.camera;
    const tx = Math.sin(t * 0.22) * 0.06 + state.pointer.x * 0.22;
    const ty = 1.42 + Math.cos(t * 0.18) * 0.05 - state.pointer.y * 0.1;
    const tz = 6.05 + Math.sin(t * 0.15) * 0.08;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 2.2, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty, 2.2, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tz, 2, dt);
    cam.lookAt(0, 1.1, 0);
  });
  return null;
};

const StudentRig = (props) => {
  const figureRef = useRef(null);
  const groundRef = useRef(null);
  const torsoRef = useRef(null);
  const blazerRef = useRef(null);
  const backpackRef = useRef(null);
  const passportRef = useRef(null);
  const legLRef = useRef(null);
  const legRRef = useRef(null);
  const armRS = useRef(null);
  const armRE = useRef(null);
  const armLS = useRef(null);
  const armLE = useRef(null);
  const headTrackRef = useRef(null);
  const headBobRef = useRef(null);
  const lidLRef = useRef(null);
  const lidRRef = useRef(null);
  const irisLRef = useRef(null);
  const irisRRef = useRef(null);
  const browLRef = useRef(null);
  const browRRef = useRef(null);
  const jawRef = useRef(null);
  const cornerLRef = useRef(null);
  const cornerRRef = useRef(null);

  const entrance = useRef(0);
  const blinkNext = useRef(1.6);
  const blinkT = useRef(0);
  const talkT = useRef(0);
  const talkMs = useRef(props.talkMs);
  const env = useRef([]);
  const celebrateT = useRef(0);
  const hop = useRef(0);
  const smileAmt = useRef(0.75);
  const gRef = useRef(props.gesture);
  const hoverRef = useRef(props.isHovered);
  const reducedRef = useRef(props.reducedMotion);
  const prevClicks = useRef(props.clicks);
  const prevScene = useRef(props.scene);

  useEffect(() => {
    gRef.current = props.gesture;
  }, [props.gesture]);

  useEffect(() => {
    hoverRef.current = props.isHovered;
  }, [props.isHovered]);

  useEffect(() => {
    reducedRef.current = props.reducedMotion;
  }, [props.reducedMotion]);

  useEffect(() => {
    env.current = props.speech.split("").map((c) => (/[aeiouAEIOU]/i.test(c) ? 1 : 0));
    talkMs.current = props.talkMs;
    talkT.current = 0;
  }, [props.speech, props.talkMs]);

  useEffect(() => {
    if (props.clicks !== prevClicks.current) {
      prevClicks.current = props.clicks;
      if (!reducedRef.current) {
        celebrateT.current = 1.5;
        hop.current = 1;
      }
    }
  }, [props.clicks]);

  useEffect(() => {
    if (props.scene !== prevScene.current) {
      prevScene.current = props.scene;
      talkT.current = 0;
      if (props.scene === 5 && !reducedRef.current) {
        celebrateT.current = 1.5;
        hop.current = 1;
      }
    }
  }, [props.scene]);

  const applyPose = (rs, re, ls, le, lambda, dt) => {
    armRS.current.rotation.x = THREE.MathUtils.damp(armRS.current.rotation.x, rs[0], lambda, dt);
    armRS.current.rotation.y = THREE.MathUtils.damp(armRS.current.rotation.y, rs[1], lambda, dt);
    armRS.current.rotation.z = THREE.MathUtils.damp(armRS.current.rotation.z, rs[2], lambda, dt);
    armRE.current.rotation.x = THREE.MathUtils.damp(armRE.current.rotation.x, re[0], lambda, dt);
    armLS.current.rotation.x = THREE.MathUtils.damp(armLS.current.rotation.x, ls[0], lambda, dt);
    armLS.current.rotation.y = THREE.MathUtils.damp(armLS.current.rotation.y, ls[1], lambda, dt);
    armLS.current.rotation.z = THREE.MathUtils.damp(armLS.current.rotation.z, ls[2], lambda, dt);
    armLE.current.rotation.x = THREE.MathUtils.damp(armLE.current.rotation.x, le[0], lambda, dt);
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const reduced = reducedRef.current;

    // entrance rise
    entrance.current = Math.min(entrance.current + dt * 1.3, 1);
    const baseY = (1 - easeOutCubic(entrance.current)) * -1.15;

    // success hop (click / career chapter)
    if (hop.current > 0) hop.current = Math.max(hop.current - dt * 1.7, 0);
    const hopY = Math.sin(hop.current * Math.PI) * 0.26;
    figureRef.current.position.y = baseY + hopY;

    // ground shadow responds to height
    const s = 1 + Math.max(hopY, 0) * 0.6;
    groundRef.current.scale.set(s, s, 1);
    groundRef.current.material.opacity = 0.6 - hopY * 0.35;

    if (reduced) {
      smileAmt.current = THREE.MathUtils.damp(smileAmt.current, 0.5, 4, dt);
      headTrackRef.current.rotation.y = THREE.MathUtils.damp(headTrackRef.current.rotation.y, 0.02, 3, dt);
      headTrackRef.current.rotation.x = THREE.MathUtils.damp(headTrackRef.current.rotation.x, -0.02, 3, dt);
      applyPose(POSE.rest.rs, POSE.rest.re, POSE.rest.ls, POSE.rest.le, 3, dt);
      jawRef.current.rotation.x = THREE.MathUtils.damp(jawRef.current.rotation.x, -0.02, 8, dt);
      cornerLRef.current.position.y = -0.07;
      cornerRRef.current.position.y = -0.07;
      return;
    }

    // ---- idle life ----
    // breathing (chest + jacket)
    const br = 1 + Math.sin(t * 1.15) * 0.012;
    torsoRef.current.scale.set(1, br, 1);

    // blinking
    if (t >= blinkNext.current) {
      blinkT.current += dt;
      if (blinkT.current >= 0.16) {
        blinkT.current = 0;
        blinkNext.current = t + 2.4 + Math.random() * 2.6;
      }
    }
    const bp = blinkT.current / 0.16;
    const lid = bp < 0.5 ? bp * 2 : (1 - bp) * 2;
    const lidRot = -1.35 * lid;
    lidLRef.current.rotation.x = THREE.MathUtils.damp(lidLRef.current.rotation.x, lidRot, 60, dt);
    lidRRef.current.rotation.x = THREE.MathUtils.damp(lidRRef.current.rotation.x, lidRot, 60, dt);

    // syllable-synced lipsync + head bob while talking
    let jawTarget = 0.015;
    if (talkT.current < talkMs.current) {
      const idx = Math.min(Math.floor((talkT.current / talkMs.current) * env.current.length), env.current.length - 1);
      if (env.current[idx]) jawTarget = 0.15;
      talkT.current += dt;
      headBobRef.current.position.y = Math.sin(t * 8) * 0.005;
    } else {
      headBobRef.current.position.y = THREE.MathUtils.damp(headBobRef.current.position.y, 0, 6, dt);
    }
    jawRef.current.rotation.x = THREE.MathUtils.damp(jawRef.current.rotation.x, -jawTarget, 20, dt);

    // confident smile (stronger when happy)
    const happy = hoverRef.current || gRef.current === 4;
    smileAmt.current = THREE.MathUtils.damp(smileAmt.current, happy ? 1 : 0.75, 5, dt);
    cornerLRef.current.position.y = -0.074 + smileAmt.current * 0.008;
    cornerRRef.current.position.y = -0.074 + smileAmt.current * 0.008;
    blushMat.emissiveIntensity = 0.08 + smileAmt.current * 0.45;

    // head looks toward the user's cursor + gentle idle sway
    headTrackRef.current.rotation.y = THREE.MathUtils.damp(
      headTrackRef.current.rotation.y,
      Math.sin(t * 0.5) * 0.015 + state.pointer.x * 0.13,
      6,
      dt
    );
    headTrackRef.current.rotation.x = THREE.MathUtils.damp(
      headTrackRef.current.rotation.x,
      Math.sin(t * 0.4 + 1) * 0.018 - state.pointer.y * 0.07,
      6,
      dt
    );
    headTrackRef.current.rotation.z = THREE.MathUtils.damp(headTrackRef.current.rotation.z, 0.02, 4, dt);

    // iris follows the cursor
    irisLRef.current.position.x = THREE.MathUtils.damp(irisLRef.current.position.x, state.pointer.x * 0.02, 10, dt);
    irisLRef.current.position.y = THREE.MathUtils.damp(irisLRef.current.position.y, state.pointer.y * 0.014, 10, dt);
    irisRRef.current.position.x = THREE.MathUtils.damp(irisRRef.current.position.x, state.pointer.x * 0.02, 10, dt);
    irisRRef.current.position.y = THREE.MathUtils.damp(irisRRef.current.position.y, state.pointer.y * 0.014, 10, dt);

    // brow emotion per chapter
    const emo = EMOTION[gRef.current] || EMOTION[0];
    browLRef.current.position.y = 0.13 + emo.brow;
    browRRef.current.position.y = 0.13 + emo.brow;

    // chapter gestures
    const celebrate = celebrateT.current > 0;
    if (celebrate) celebrateT.current -= dt;
    const pose =
      celebrate || hop.current > 0.02
        ? POSE.celebrate
        : hoverRef.current
          ? POSE.hover
          : GESTURE_POSE[gRef.current]
            ? POSE[GESTURE_POSE[gRef.current]]
            : POSE.rest;

    if (gRef.current === 0 && !celebrate && !hoverRef.current) {
      // intro — wave
      const w = Math.sin(t * 7);
      applyPose(
        [POSE.wave.rs[0], POSE.wave.rs[1], POSE.wave.rs[2] + w * 0.12],
        [POSE.wave.re[0] - w * 0.18, 0, 0],
        POSE.wave.ls,
        POSE.wave.le,
        5,
        dt
      );
    } else {
      applyPose(pose.rs, pose.re, pose.ls, pose.le, 5, dt);
    }

    // secondary cloth + prop motion
    blazerRef.current.rotation.z = Math.sin(t * 0.9) * 0.012;
    blazerRef.current.rotation.x = Math.sin(t * 0.7 + 0.6) * 0.008;
    backpackRef.current.rotation.z = Math.sin(t * 0.8) * 0.02;
    backpackRef.current.rotation.x = Math.sin(t * 0.6 + 0.4) * 0.015;
    passportRef.current.rotation.z = Math.sin(t * 1.1) * 0.04;

    // weight shift
    legLRef.current.rotation.z = Math.sin(t * 0.9) * 0.02;
    legRRef.current.rotation.z = -Math.sin(t * 0.9) * 0.02;
  });

  return (
    <group ref={figureRef}>
      {/* ground shadow */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.9, 48]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.6} depthWrite={false} />
      </mesh>

      <group position={[0, 1.0, 0]}>
        {/* ---- legs + clean sneakers (weight shift: left leg forward) ---- */}
        <group ref={legLRef} position={[-0.13, 0.02, 0.07]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.078, 0.36, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <capsuleGeometry args={[0.06, 0.34, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <group position={[0, -0.82, 0]}>
            <mesh position={[0, -0.02, 0.03]}>
              <boxGeometry args={[0.1, 0.07, 0.26]} />
              <primitive object={sneakerMat} />
            </mesh>
            <mesh position={[0, -0.02, 0.15]} scale={[0.75, 0.65, 0.85]}>
              <sphereGeometry args={[0.055, 16, 12]} />
              <primitive object={sneakerMat} />
            </mesh>
            <mesh position={[0, -0.06, 0.02]}>
              <boxGeometry args={[0.105, 0.035, 0.27]} />
              <primitive object={sneakerSoleMat} />
            </mesh>
            <mesh position={[0.056, -0.02, 0.04]}>
              <boxGeometry args={[0.012, 0.02, 0.17]} />
              <primitive object={goldMat} />
            </mesh>
          </group>
        </group>
        <group ref={legRRef} position={[0.13, 0.02, -0.05]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.078, 0.36, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <capsuleGeometry args={[0.06, 0.34, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <group position={[0, -0.82, 0]}>
            <mesh position={[0, -0.02, 0.03]}>
              <boxGeometry args={[0.1, 0.07, 0.26]} />
              <primitive object={sneakerMat} />
            </mesh>
            <mesh position={[0, -0.02, 0.15]} scale={[0.75, 0.65, 0.85]}>
              <sphereGeometry args={[0.055, 16, 12]} />
              <primitive object={sneakerMat} />
            </mesh>
            <mesh position={[0, -0.06, 0.02]}>
              <boxGeometry args={[0.105, 0.035, 0.27]} />
              <primitive object={sneakerSoleMat} />
            </mesh>
            <mesh position={[-0.056, -0.02, 0.04]}>
              <boxGeometry args={[0.012, 0.02, 0.17]} />
              <primitive object={goldMat} />
            </mesh>
          </group>
        </group>

        {/* ---- pelvis ---- */}
        <mesh position={[0, 0.1, 0]} scale={[0.9, 0.72, 0.66]}>
          <sphereGeometry args={[0.16, 24, 18]} />
          <primitive object={pantsMat} />
        </mesh>

        {/* ---- torso: waist + chest (white shirt) ---- */}
        <group ref={torsoRef}>
          <mesh position={[0, 0.2, 0]} scale={[1, 1, 0.72]}>
            <capsuleGeometry args={[0.13, 0.16, 4, 16]} />
            <primitive object={shirtMat} />
          </mesh>
          <mesh position={[0, 0.36, 0]} scale={[0.95, 1.08, 0.7]}>
            <sphereGeometry args={[0.19, 28, 20]} />
            <primitive object={shirtMat} />
          </mesh>
        </group>

        {/* ---- blazer (open, premium wool) ---- */}
        <group ref={blazerRef}>
          {/* back panel */}
          <mesh position={[0, 0.3, -0.05]}>
            <boxGeometry args={[0.42, 0.44, 0.08]} />
            <primitive object={blazerMat} />
          </mesh>
          {/* front panels (open, showing shirt) */}
          <mesh position={[-0.1, 0.3, 0.03]} rotation={[0, 0, 0.06]}>
            <boxGeometry args={[0.2, 0.4, 0.06]} />
            <primitive object={blazerMat} />
          </mesh>
          <mesh position={[0.1, 0.3, 0.03]} rotation={[0, 0, -0.06]}>
            <boxGeometry args={[0.2, 0.4, 0.06]} />
            <primitive object={blazerMat} />
          </mesh>
          {/* lapels */}
          <mesh position={[-0.03, 0.44, 0.05]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.035, 0.15, 0.022]} />
            <primitive object={blazerTrimMat} />
          </mesh>
          <mesh position={[0.03, 0.44, 0.05]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.035, 0.15, 0.022]} />
            <primitive object={blazerTrimMat} />
          </mesh>
          {/* collar band behind neck */}
          <mesh position={[0, 0.53, -0.01]}>
            <boxGeometry args={[0.18, 0.06, 0.06]} />
            <primitive object={blazerTrimMat} />
          </mesh>
          {/* shoulder pads / trapezius */}
          <mesh position={[0, 0.55, -0.02]} scale={[1.1, 0.34, 0.55]}>
            <sphereGeometry args={[0.13, 20, 16]} />
            <primitive object={blazerMat} />
          </mesh>
          {/* gold buttons */}
          <mesh position={[0.02, 0.24, 0.1]}>
            <sphereGeometry args={[0.012, 10, 8]} />
            <primitive object={goldMat} />
          </mesh>
          <mesh position={[0.02, 0.13, 0.1]}>
            <sphereGeometry args={[0.012, 10, 8]} />
            <primitive object={goldMat} />
          </mesh>
        </group>

        {/* ---- deltoid shoulder spheres ---- */}
        <mesh position={[-0.22, 0.53, 0]} scale={[1.1, 0.85, 1.05]}>
          <sphereGeometry args={[0.075, 18, 14]} />
          <primitive object={blazerMat} />
        </mesh>
        <mesh position={[0.22, 0.53, 0]} scale={[1.1, 0.85, 1.05]}>
          <sphereGeometry args={[0.075, 18, 14]} />
          <primitive object={blazerMat} />
        </mesh>

        {/* ---- left arm (holds passport folder) ---- */}
        <group ref={armLS} position={[-0.24, 0.55, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.065, 0.28, 4, 12]} />
            <primitive object={blazerMat} />
          </mesh>
          <group ref={armLE} position={[0, -0.34, 0]}>
            <mesh position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.055, 0.24, 4, 12]} />
              <primitive object={blazerMat} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.07, 14]} />
              <primitive object={shirtMat} />
            </mesh>
            <group position={[0, -0.26, 0]}>
              <mesh scale={[1, 1.15, 0.8]}>
                <sphereGeometry args={[0.06, 18, 14]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.02, -0.05, 0.03]} rotation={[0, 0, 0.15]}>
                <capsuleGeometry args={[0.011, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0, -0.055, 0.03]}>
                <capsuleGeometry args={[0.011, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.02, -0.05, 0.03]} rotation={[0, 0, -0.15]}>
                <capsuleGeometry args={[0.011, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              {/* passport folder in hand */}
              <group ref={passportRef} position={[0, -0.12, 0.1]} rotation={[0.12, 0.35, 0.05]}>
                <mesh>
                  <boxGeometry args={[0.075, 0.1, 0.014]} />
                  <primitive object={passportMat} />
                </mesh>
                <mesh position={[0, 0, 0.008]}>
                  <torusGeometry args={[0.018, 0.003, 8, 20]} />
                  <primitive object={goldMat} />
                </mesh>
                <mesh position={[0, -0.024, 0.008]}>
                  <planeGeometry args={[0.06, 0.018]} />
                  <meshStandardMaterial color="#F4F1EA" roughness={0.7} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* ---- right arm (free for gestures) ---- */}
        <group ref={armRS} position={[0.24, 0.55, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.065, 0.28, 4, 12]} />
            <primitive object={blazerMat} />
          </mesh>
          <group ref={armRE} position={[0, -0.34, 0]}>
            <mesh position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.055, 0.24, 4, 12]} />
              <primitive object={blazerMat} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.07, 14]} />
              <primitive object={shirtMat} />
            </mesh>
            <group position={[0, -0.26, 0]}>
              <mesh scale={[1, 1.15, 0.8]}>
                <sphereGeometry args={[0.06, 18, 14]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.02, -0.05, 0.03]} rotation={[0, 0, 0.15]}>
                <capsuleGeometry args={[0.011, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0, -0.055, 0.03]}>
                <capsuleGeometry args={[0.011, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.02, -0.05, 0.03]} rotation={[0, 0, -0.15]}>
                <capsuleGeometry args={[0.011, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ---- backpack on back ---- */}
        <group ref={backpackRef} position={[0, 0.3, -0.29]}>
          <mesh>
            <boxGeometry args={[0.3, 0.38, 0.17]} />
            <primitive object={backpackMat} />
          </mesh>
          <mesh position={[0, 0.21, 0]}>
            <boxGeometry args={[0.32, 0.1, 0.18]} />
            <primitive object={backpackMat} />
          </mesh>
          <mesh position={[0, -0.1, 0.095]}>
            <boxGeometry args={[0.24, 0.14, 0.03]} />
            <primitive object={leatherMat} />
          </mesh>
          <mesh position={[0, 0.27, 0.05]}>
            <torusGeometry args={[0.05, 0.012, 8, 18]} />
            <primitive object={leatherMat} />
          </mesh>
          {/* straps over shoulders */}
          <mesh position={[0.14, -0.08, 0.1]} rotation={[0.55, 0, 0]}>
            <boxGeometry args={[0.045, 0.4, 0.012]} />
            <primitive object={leatherMat} />
          </mesh>
          <mesh position={[-0.14, -0.08, 0.1]} rotation={[0.55, 0, 0]}>
            <boxGeometry args={[0.045, 0.4, 0.012]} />
            <primitive object={leatherMat} />
          </mesh>
        </group>

        {/* ---- neck + head ---- */}
        <mesh position={[0, 0.66, 0]}>
          <cylinderGeometry args={[0.06, 0.068, 0.22, 16]} />
          <primitive object={skinMat} />
        </mesh>

        <group position={[0, 0.78, 0]}>
          <group ref={headTrackRef}>
            <group ref={headBobRef}>
              {/* ---- skull (human egg shape) ---- */}
              <mesh position={[0, 0.1, -0.01]} scale={[0.94, 1.12, 0.97]}>
                <sphereGeometry args={[0.2, 32, 24]} />
                <primitive object={skinMat} />
              </mesh>
              {/* crown volume */}
              <mesh position={[0, 0.21, 0.01]} scale={[0.88, 0.9, 0.9]}>
                <sphereGeometry args={[0.11, 24, 18]} />
                <primitive object={skinMat} />
              </mesh>
              {/* jaw + chin definition */}
              <mesh position={[0, -0.06, 0.04]} scale={[0.95, 0.6, 0.85]}>
                <sphereGeometry args={[0.12, 24, 18]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0, -0.16, 0.05]} scale={[0.78, 0.85, 0.7]}>
                <sphereGeometry args={[0.07, 20, 16]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.14, -0.06, 0.03]} scale={[0.45, 0.5, 0.75]}>
                <sphereGeometry args={[0.07, 20, 16]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.14, -0.06, 0.03]} scale={[0.45, 0.5, 0.75]}>
                <sphereGeometry args={[0.07, 20, 16]} />
                <primitive object={skinMat} />
              </mesh>
              {/* cheeks */}
              <mesh position={[-0.13, 0.0, 0.08]} scale={[0.5, 0.75, 0.5]}>
                <sphereGeometry args={[0.06, 18, 14]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.13, 0.0, 0.08]} scale={[0.5, 0.75, 0.5]}>
                <sphereGeometry args={[0.06, 18, 14]} />
                <primitive object={skinMat} />
              </mesh>
              {/* ears (layered outer + inner) */}
              <mesh position={[-0.185, 0.03, -0.01]} scale={[0.35, 0.8, 0.4]}>
                <sphereGeometry args={[0.052, 16, 12]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.196, 0.035, 0.0]} scale={[0.32, 0.55, 0.35]}>
                <sphereGeometry args={[0.035, 14, 10]} />
                <primitive object={innerEarMat} />
              </mesh>
              <mesh position={[0.185, 0.03, -0.01]} scale={[0.35, 0.8, 0.4]}>
                <sphereGeometry args={[0.052, 16, 12]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.196, 0.035, 0.0]} scale={[0.32, 0.55, 0.35]}>
                <sphereGeometry args={[0.035, 14, 10]} />
                <primitive object={innerEarMat} />
              </mesh>
              {/* subtle blush */}
              <mesh position={[-0.115, -0.015, 0.185]} scale={[1, 0.7, 0.5]}>
                <sphereGeometry args={[0.026, 16, 12]} />
                <primitive object={blushMat} />
              </mesh>
              <mesh position={[0.115, -0.015, 0.185]} scale={[1, 0.7, 0.5]}>
                <sphereGeometry args={[0.026, 16, 12]} />
                <primitive object={blushMat} />
              </mesh>

              {/* ---- eyes (glossy eyeballs recessed in the socket) ---- */}
              <group position={[-0.105, 0.045, 0.145]}>
                <mesh scale={[1, 1.05, 0.55]}>
                  <sphereGeometry args={[0.072, 24, 18]} />
                  <primitive object={scleraMat} />
                </mesh>
                <group ref={lidLRef}>
                  <mesh position={[0, 0.055, 0.01]} scale={[1, 0.6, 0.6]}>
                    <sphereGeometry args={[0.082, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <primitive object={skinMat} />
                  </mesh>
                </group>
                <mesh position={[0, -0.055, 0.01]} scale={[1, 0.6, 0.6]}>
                  <sphereGeometry args={[0.082, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                  <primitive object={skinMat} />
                </mesh>
                <group ref={irisLRef} position={[0, 0, 0.032]}>
                  <mesh>
                    <circleGeometry args={[0.034, 24]} />
                    <primitive object={irisMat} />
                  </mesh>
                  <mesh position={[0, 0, 0.002]}>
                    <circleGeometry args={[0.018, 20]} />
                    <primitive object={pupilMat} />
                  </mesh>
                  <mesh position={[0.013, 0.013, 0.004]}>
                    <circleGeometry args={[0.009, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                  </mesh>
                </group>
              </group>
              <group position={[0.105, 0.045, 0.145]}>
                <mesh scale={[1, 1.05, 0.55]}>
                  <sphereGeometry args={[0.072, 24, 18]} />
                  <primitive object={scleraMat} />
                </mesh>
                <group ref={lidRRef}>
                  <mesh position={[0, 0.055, 0.01]} scale={[1, 0.6, 0.6]}>
                    <sphereGeometry args={[0.082, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <primitive object={skinMat} />
                  </mesh>
                </group>
                <mesh position={[0, -0.055, 0.01]} scale={[1, 0.6, 0.6]}>
                  <sphereGeometry args={[0.082, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                  <primitive object={skinMat} />
                </mesh>
                <group ref={irisRRef} position={[0, 0, 0.032]}>
                  <mesh>
                    <circleGeometry args={[0.034, 24]} />
                    <primitive object={irisMat} />
                  </mesh>
                  <mesh position={[0, 0, 0.002]}>
                    <circleGeometry args={[0.018, 20]} />
                    <primitive object={pupilMat} />
                  </mesh>
                  <mesh position={[0.013, 0.013, 0.004]}>
                    <circleGeometry args={[0.009, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                  </mesh>
                </group>
              </group>

              {/* brows */}
              <mesh ref={browLRef} position={[-0.105, 0.13, 0.172]} rotation={[0, 0, 0.08]}>
                <boxGeometry args={[0.1, 0.016, 0.02]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh ref={browRRef} position={[0.105, 0.13, 0.172]} rotation={[0, 0, -0.08]}>
                <boxGeometry args={[0.1, 0.016, 0.02]} />
                <primitive object={hairMat} />
              </mesh>

              {/* ---- nose: bridge + tip + alae + nostrils ---- */}
              <mesh position={[0, 0.05, 0.168]} rotation={[0.3, 0, 0]}>
                <boxGeometry args={[0.028, 0.09, 0.02]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0, 0.015, 0.188]} rotation={[0.14, 0, 0]}>
                <boxGeometry args={[0.024, 0.07, 0.02]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0, -0.025, 0.205]} scale={[0.9, 0.85, 0.9]}>
                <sphereGeometry args={[0.034, 18, 14]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.034, -0.048, 0.195]} scale={[0.85, 0.8, 0.9]}>
                <sphereGeometry args={[0.028, 16, 12]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.034, -0.048, 0.195]} scale={[0.85, 0.8, 0.9]}>
                <sphereGeometry args={[0.028, 16, 12]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.02, -0.058, 0.2]} scale={[1, 0.7, 0.8]}>
                <sphereGeometry args={[0.011, 12, 10]} />
                <primitive object={nostrilMat} />
              </mesh>
              <mesh position={[0.02, -0.058, 0.2]} scale={[1, 0.7, 0.8]}>
                <sphereGeometry args={[0.011, 12, 10]} />
                <primitive object={nostrilMat} />
              </mesh>

              {/* ---- mouth: fuller lips + jaw rig ---- */}
              <mesh position={[0, -0.075, 0.185]}>
                <torusGeometry args={[0.052, 0.016, 8, 20, Math.PI]} />
                <primitive object={lipMat} />
              </mesh>
              <group ref={jawRef} position={[0, -0.075, 0.15]}>
                <mesh position={[0, 0, 0.025]} scale={[1.1, 0.6, 0.5]}>
                  <sphereGeometry args={[0.048, 18, 14]} />
                  <primitive object={mouthInnerMat} />
                </mesh>
                <mesh position={[0, 0.012, 0.048]}>
                  <boxGeometry args={[0.048, 0.016, 0.01]} />
                  <primitive object={teethMat} />
                </mesh>
                <mesh position={[0, -0.022, 0.05]} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.048, 0.016, 8, 18, Math.PI]} />
                  <primitive object={lipMat} />
                </mesh>
              </group>
              <mesh ref={cornerLRef} position={[-0.052, -0.074, 0.182]}>
                <sphereGeometry args={[0.013, 12, 10]} />
                <primitive object={lipMat} />
              </mesh>
              <mesh ref={cornerRRef} position={[0.052, -0.074, 0.182]}>
                <sphereGeometry args={[0.013, 12, 10]} />
                <primitive object={lipMat} />
              </mesh>

              {/* ---- layered modern hair (side-part + textured fringe) ---- */}
              <mesh position={[0, 0.16, -0.04]} scale={[1.0, 0.98, 0.95]}>
                <sphereGeometry args={[0.205, 32, 24]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[0, 0.225, 0.0]} scale={[1.1, 0.4, 1.0]}>
                <sphereGeometry args={[0.09, 20, 16]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[-0.06, 0.23, 0.05]} scale={[1.0, 0.4, 0.9]}>
                <sphereGeometry args={[0.055, 18, 14]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[0.06, 0.23, 0.05]} scale={[1.0, 0.4, 0.9]}>
                <sphereGeometry args={[0.055, 18, 14]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[0, 0.2, 0.15]} rotation={[0.3, 0, 0]} scale={[1.25, 0.4, 0.6]}>
                <sphereGeometry args={[0.05, 18, 14]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[-0.055, 0.195, 0.165]} rotation={[0.3, 0, 0.14]} scale={[1.0, 0.4, 0.55]}>
                <sphereGeometry args={[0.04, 16, 12]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[0.055, 0.195, 0.165]} rotation={[0.3, 0, -0.14]} scale={[1.0, 0.4, 0.55]}>
                <sphereGeometry args={[0.04, 16, 12]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[-0.145, 0.1, -0.01]} scale={[0.45, 1.15, 0.8]}>
                <sphereGeometry args={[0.042, 16, 12]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[0.145, 0.1, -0.01]} scale={[0.45, 1.15, 0.8]}>
                <sphereGeometry args={[0.042, 16, 12]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[0, 0.12, -0.13]} scale={[1.1, 0.6, 0.5]}>
                <sphereGeometry args={[0.055, 18, 14]} />
                <primitive object={hairMat} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const SceneContainer = (props) => {
  const { visible = true, isMobile } = props;
  const accent = props.accent || "#38BDF8";
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={isMobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 1.42, 6.05], fov: 34 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows
      >
        <CameraRig />
        <ambientLight intensity={0.28} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.6}
          color="#FFE9CC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-radius={8}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-5, 3, -4]} intensity={1.15} color="#67E8F9" />
        <directionalLight position={[0, 3, -4]} intensity={0.4} color="#A78BFA" />
        <pointLight position={[0, 0.4, 2.6]} intensity={0.3} color="#FFE1B8" />
        <pointLight position={[-3, 1.2, 3]} intensity={0.3} color={accent} />
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, 0, 0]}>
            <Lightformer form="rect" intensity={3} color="#FFF2E0" position={[0, 3, 3]} scale={[5, 2.5, 1]} />
            <Lightformer form="rect" intensity={1.6} color="#7DD3FC" position={[-4, 2, 1]} rotation-y={Math.PI / 2} scale={[3, 1.5, 1]} />
            <Lightformer form="rect" intensity={1.1} color="#A78BFA" position={[4, 1, 1]} rotation-y={-Math.PI / 2} scale={[3, 1.5, 1]} />
            <Lightformer form="rect" intensity={1.4} color={accent} position={[0, 0.5, -4]} scale={[4, 2, 1]} />
          </group>
        </Environment>
        {/* additive halo glow behind the character */}
        <Glow position={[0, 0.85, -0.6]} scale={7} color={accent} opacity={0.5} />
        <Glow position={[0, 0.85, -0.6]} scale={4.2} color="#7DD3FC" opacity={0.5} />
        <EnvironmentProps />
        <StudentRig {...props} />
        <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={14} blur={2.6} far={3.5} resolution={512} frames={1} />
      </Canvas>
    </div>
  );
};

const Student3D = (props) => {
  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);
  return <SceneContainer {...props} isMobile={isMobile} />;
};

export default Student3D;
