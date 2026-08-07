import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// ------------------------------------------------------------------
// Student3D — "Aarav" Ultra-Premium International Student 3D Scene
// Clean geometry, zero clipping, cinematic PBR lighting & dynamic animation.
// ------------------------------------------------------------------

const shadowTex = (() => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0, 0, 0, 0.7)");
  g.addColorStop(0.4, "rgba(0, 0, 0, 0.3)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();

const glowTex = (() => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  g.addColorStop(0.35, "rgba(255, 255, 255, 0.35)");
  g.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();

// ---- PBR Materials ----
const skinMat = new THREE.MeshStandardMaterial({
  color: "#F3C5A5",
  roughness: 0.45,
  metalness: 0.05,
});

const hairMat = new THREE.MeshStandardMaterial({
  color: "#1E1715",
  roughness: 0.6,
});

const blazerMat = new THREE.MeshStandardMaterial({
  color: "#1B2A4A",
  roughness: 0.5,
  metalness: 0.1,
});

const blazerTrimMat = new THREE.MeshStandardMaterial({
  color: "#0F192E",
  roughness: 0.4,
});

const shirtMat = new THREE.MeshStandardMaterial({
  color: "#FFFFFF",
  roughness: 0.3,
});

const tieMat = new THREE.MeshStandardMaterial({
  color: "#E11D48",
  roughness: 0.4,
});

const pantsMat = new THREE.MeshStandardMaterial({
  color: "#111827",
  roughness: 0.7,
});

const sneakerMat = new THREE.MeshStandardMaterial({
  color: "#F9FAFB",
  roughness: 0.3,
});

const sneakerSoleMat = new THREE.MeshStandardMaterial({
  color: "#38BDF8",
  roughness: 0.2,
});

const goldMat = new THREE.MeshStandardMaterial({
  color: "#FBBF24",
  roughness: 0.25,
  metalness: 0.85,
});

const backpackMat = new THREE.MeshStandardMaterial({
  color: "#374151",
  roughness: 0.6,
});

const passportMat = new THREE.MeshStandardMaterial({
  color: "#991B1B",
  roughness: 0.4,
});

const globeOceanMat = new THREE.MeshStandardMaterial({
  color: "#0284C7",
  roughness: 0.2,
  metalness: 0.1,
});

const globeRingMat = new THREE.MeshStandardMaterial({
  color: "#38BDF8",
  roughness: 0.3,
  metalness: 0.6,
});

const paperMat = new THREE.MeshStandardMaterial({
  color: "#F3F4F6",
  roughness: 0.8,
});

const laptopSilverMat = new THREE.MeshStandardMaterial({
  color: "#9CA3AF",
  roughness: 0.25,
  metalness: 0.8,
});

const laptopScreenMat = new THREE.MeshStandardMaterial({
  color: "#0F172A",
  emissive: "#0284C7",
  emissiveIntensity: 1.2,
  roughness: 0.2,
});

// Poses for story chapters
const POSE = {
  rest: {
    rs: [-0.08, 0, 0.12],
    re: [-0.15, 0, 0],
    ls: [-0.08, 0, -0.12],
    le: [-0.15, 0, 0],
  },
  wave: {
    rs: [-0.35, 0, 1.15],
    re: [-0.55, 0, 0],
    ls: [-0.08, 0, -0.12],
    le: [-0.15, 0, 0],
  },
  talk: {
    rs: [-0.3, 0.2, 0.4],
    re: [-0.4, 0, 0],
    ls: [-0.4, -0.2, -0.3],
    le: [-0.5, 0, 0],
  },
  point: {
    rs: [-1.1, 0.15, 0.25],
    re: [-0.1, 0, 0],
    ls: [-0.08, 0, -0.12],
    le: [-0.15, 0, 0],
  },
  open: {
    rs: [-0.3, 0, 0.7],
    re: [-0.2, 0, 0],
    ls: [-0.3, 0, -0.7],
    le: [-0.2, 0, 0],
  },
  present: {
    rs: [-0.95, 0.3, 0.35],
    re: [-0.2, 0, 0],
    ls: [-0.08, 0, -0.12],
    le: [-0.15, 0, 0],
  },
  celebrate: {
    rs: [-0.25, 0, 1.25],
    re: [-0.3, 0, 0],
    ls: [-0.25, 0, -1.25],
    le: [-0.3, 0, 0],
  },
  hover: {
    rs: [-0.35, 0, 0.65],
    re: [-0.25, 0, 0],
    ls: [-0.35, 0, -0.65],
    le: [-0.25, 0, 0],
  },
};

const GESTURE_POSE = {
  0: "wave",
  1: "talk",
  2: "point",
  3: "open",
  4: "present",
  5: "celebrate",
};

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

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

const FloatProp = ({
  position,
  amplitude = 0.06,
  speed = 1,
  phase = 0,
  rotSpeed = 0.4,
  scale = 1,
  children,
}) => {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(t * speed + phase) * amplitude;
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
  <FloatProp position={[1.05, 1.45, 0.15]} scale={0.22} speed={0.7} phase={0}>
    <mesh>
      <sphereGeometry args={[1, 24, 18]} />
      <primitive object={globeOceanMat} />
    </mesh>
    <mesh rotation={[0.4, 0.2, 0]} scale={[1.02, 1.02, 1.02]}>
      <torusGeometry args={[1, 0.015, 8, 40]} />
      <primitive object={globeRingMat} />
    </mesh>
    <Glow position={[0, 0, 0]} scale={3.4} color="#38BDF8" opacity={0.35} />
  </FloatProp>
);

const MiniCap = () => (
  <FloatProp position={[1.2, 0.9, -0.25]} scale={0.28} speed={0.9} phase={1.2}>
    <mesh position={[0, 0.1, 0]}>
      <sphereGeometry
        args={[1, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2 + 0.35]}
      />
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
    ref.current.position.set(
      Math.sin(t * 0.28) * 1.25,
      1.62 + Math.sin(t * 0.45) * 0.22,
      0.05 + Math.sin(t * 0.3) * 0.3,
    );
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
  <FloatProp position={[-1.15, 1.15, 0.4]} scale={0.3} speed={0.8} phase={0.6}>
    <mesh>
      <boxGeometry args={[1.6, 1.2, 0.2]} />
      <primitive object={blazerTrimMat} />
    </mesh>
    <mesh position={[0, 0, 0.11]}>
      <boxGeometry args={[1.1, 0.45, 0.02]} />
      <meshStandardMaterial
        color="#34D399"
        emissive="#34D399"
        emissiveIntensity={1.4}
        roughness={0.3}
      />
    </mesh>
  </FloatProp>
);

const GoldCoin = () => (
  <FloatProp position={[0.75, 0.7, 0.55]} scale={0.45} speed={1.1} phase={1.8}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.7, 0.7, 0.14, 28]} />
      <primitive object={goldMat} />
    </mesh>
    <Glow position={[0, 0, 0]} scale={3} color="#FBBF24" opacity={0.35} />
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
    <group
      ref={ref}
      position={[0.55, 0.55, 0.42]}
      rotation={[0.08, -0.35, 0.04]}
    >
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
      <Glow position={[0, 0.1, 0]} scale={2.4} color="#38BDF8" opacity={0.4} />
    </group>
  );
};

const EnvironmentProps = () => (
  <group>
    <MiniGlobe />
    <MiniCap />
    <PaperPlane />
    <VisaStamp />
    <GoldCoin />
    <FloatingLaptop />
    <Sparkles
      count={40}
      scale={[7, 4.4, 4]}
      size={1.6}
      speed={0.4}
      opacity={0.35}
      color="#7DD3FC"
    />
  </group>
);

const CameraRig = () => {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const cam = state.camera;
    const tx = Math.sin(t * 0.22) * 0.06 + state.pointer.x * 0.22;
    const ty = 1.35 + Math.cos(t * 0.18) * 0.05 - state.pointer.y * 0.1;
    const tz = 5.6 + Math.sin(t * 0.15) * 0.08;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 2.2, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty, 2.2, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tz, 2, dt);
    cam.lookAt(0, 1.0, 0);
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
    env.current = props.speech
      .split("")
      .map((c) => (/[aeiouAEIOU]/i.test(c) ? 1 : 0));
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
    if (!armRS.current || !armLS.current || !armRE.current || !armLE.current)
      return;
    armRS.current.rotation.x = THREE.MathUtils.damp(
      armRS.current.rotation.x,
      rs[0],
      lambda,
      dt,
    );
    armRS.current.rotation.y = THREE.MathUtils.damp(
      armRS.current.rotation.y,
      rs[1],
      lambda,
      dt,
    );
    armRS.current.rotation.z = THREE.MathUtils.damp(
      armRS.current.rotation.z,
      rs[2],
      lambda,
      dt,
    );
    armRE.current.rotation.x = THREE.MathUtils.damp(
      armRE.current.rotation.x,
      re[0],
      lambda,
      dt,
    );

    armLS.current.rotation.x = THREE.MathUtils.damp(
      armLS.current.rotation.x,
      ls[0],
      lambda,
      dt,
    );
    armLS.current.rotation.y = THREE.MathUtils.damp(
      armLS.current.rotation.y,
      ls[1],
      lambda,
      dt,
    );
    armLS.current.rotation.z = THREE.MathUtils.damp(
      armLS.current.rotation.z,
      ls[2],
      lambda,
      dt,
    );
    armLE.current.rotation.x = THREE.MathUtils.damp(
      armLE.current.rotation.x,
      le[0],
      lambda,
      dt,
    );
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const reduced = reducedRef.current;

    entrance.current = Math.min(entrance.current + dt * 1.3, 1);
    const baseY = (1 - easeOutCubic(entrance.current)) * -1.15;

    if (hop.current > 0) hop.current = Math.max(hop.current - dt * 1.7, 0);
    const hopY = Math.sin(hop.current * Math.PI) * 0.26;
    if (figureRef.current) figureRef.current.position.y = baseY + hopY;

    if (groundRef.current) {
      const s = 1 + Math.max(hopY, 0) * 0.6;
      groundRef.current.scale.set(s, s, 1);
      groundRef.current.material.opacity = 0.6 - hopY * 0.35;
    }

    if (reduced) return;

    // breathing
    if (torsoRef.current) {
      const br = 1 + Math.sin(t * 1.15) * 0.012;
      torsoRef.current.scale.set(1, br, 1);
    }

    // blinking
    if (t >= blinkNext.current) {
      blinkT.current += dt;
      if (blinkT.current >= 0.16) {
        blinkT.current = 0;
        blinkNext.current = t + 2.4 + Math.random() * 2.6;
      }
    }
    const bp = blinkT.current / 0.16;
    const lidScaleY = bp < 0.5 ? 1 - bp * 1.8 : 0.1 + (bp - 0.5) * 1.8;
    if (lidLRef.current) lidLRef.current.scale.y = lidScaleY;
    if (lidRRef.current) lidRRef.current.scale.y = lidScaleY;

    // head tracking
    if (headTrackRef.current) {
      headTrackRef.current.rotation.y = THREE.MathUtils.damp(
        headTrackRef.current.rotation.y,
        Math.sin(t * 0.5) * 0.015 + state.pointer.x * 0.18,
        6,
        dt,
      );
      headTrackRef.current.rotation.x = THREE.MathUtils.damp(
        headTrackRef.current.rotation.x,
        Math.sin(t * 0.4 + 1) * 0.018 - state.pointer.y * 0.1,
        6,
        dt,
      );
    }

    // head bob while talking
    if (talkT.current < talkMs.current) {
      talkT.current += dt;
      if (headBobRef.current)
        headBobRef.current.position.y = Math.sin(t * 8) * 0.005;
    } else if (headBobRef.current) {
      headBobRef.current.position.y = THREE.MathUtils.damp(
        headBobRef.current.position.y,
        0,
        6,
        dt,
      );
    }

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
      const w = Math.sin(t * 7);
      applyPose(
        [POSE.wave.rs[0], POSE.wave.rs[1], POSE.wave.rs[2] + w * 0.12],
        [POSE.wave.re[0] - w * 0.18, 0, 0],
        POSE.wave.ls,
        POSE.wave.le,
        5,
        dt,
      );
    } else {
      applyPose(pose.rs, pose.re, pose.ls, pose.le, 5, dt);
    }

    if (blazerRef.current)
      blazerRef.current.rotation.z = Math.sin(t * 0.9) * 0.012;
    if (backpackRef.current)
      backpackRef.current.rotation.z = Math.sin(t * 0.8) * 0.02;
    if (passportRef.current)
      passportRef.current.rotation.z = Math.sin(t * 1.1) * 0.04;

    if (legLRef.current && legRRef.current) {
      legLRef.current.rotation.z = Math.sin(t * 0.9) * 0.02;
      legRRef.current.rotation.z = -Math.sin(t * 0.9) * 0.02;
    }
  });

  return (
    <group ref={figureRef}>
      {/* Ground Shadow */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
      >
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial
          map={shadowTex}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>

      <group position={[0, 0.95, 0]}>
        {/* ---- Legs & Sneakers ---- */}
        <group ref={legLRef} position={[-0.13, 0, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.055, 0.35, 8, 16]} />
            <primitive object={pantsMat} />
          </mesh>
          <group position={[0, -0.48, 0.04]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.09, 0.07, 0.22]} />
              <primitive object={sneakerMat} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[0.095, 0.025, 0.23]} />
              <primitive object={sneakerSoleMat} />
            </mesh>
          </group>
        </group>

        <group ref={legRRef} position={[0.13, 0, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.055, 0.35, 8, 16]} />
            <primitive object={pantsMat} />
          </mesh>
          <group position={[0, -0.48, 0.04]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.09, 0.07, 0.22]} />
              <primitive object={sneakerMat} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[0.095, 0.025, 0.23]} />
              <primitive object={sneakerSoleMat} />
            </mesh>
          </group>
        </group>

        {/* ---- Tailored Torso (Zero Clipping) ---- */}
        <group ref={torsoRef} position={[0, 0.28, 0]}>
          {/* Inner Shirt Base */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.13, 0.12, 0.36, 20]} />
            <primitive object={shirtMat} />
          </mesh>
          {/* Red Tie */}
          <mesh position={[0, 0.08, 0.135]} rotation={[0.05, 0, 0]}>
            <boxGeometry args={[0.035, 0.2, 0.01]} />
            <primitive object={tieMat} />
          </mesh>

          {/* Blazer Jacket (Completely Enclosing, Sleek & Fitted) */}
          <group ref={blazerRef}>
            {/* Main Body */}
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[0.148, 0.3, 12, 20]} />
              <primitive object={blazerMat} />
            </mesh>
            {/* Collar & Lapels */}
            <mesh position={[-0.05, 0.12, 0.11]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.035, 0.16, 0.02]} />
              <primitive object={blazerTrimMat} />
            </mesh>
            <mesh position={[0.05, 0.12, 0.11]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.035, 0.16, 0.02]} />
              <primitive object={blazerTrimMat} />
            </mesh>
            {/* Gold Buttons */}
            <mesh position={[0, -0.04, 0.15]}>
              <sphereGeometry args={[0.01, 10, 8]} />
              <primitive object={goldMat} />
            </mesh>
          </group>
        </group>

        {/* Backpack */}
        <group ref={backpackRef} position={[0, 0.28, -0.14]}>
          <mesh>
            <boxGeometry args={[0.24, 0.32, 0.1]} />
            <primitive object={backpackMat} />
          </mesh>
        </group>

        {/* ---- Head & Face (Clean Pixar Style, Zero Potato Blobs) ---- */}
        <group position={[0, 0.62, 0]}>
          {/* Neck */}
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.055, 0.06, 0.1, 16]} />
            <primitive object={skinMat} />
          </mesh>

          <group ref={headTrackRef}>
            <group ref={headBobRef}>
              {/* Smooth Head Skull */}
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.165, 32, 24]} />
                <primitive object={skinMat} />
              </mesh>

              {/* Stylish Hair Cap */}
              <mesh position={[0, 0.14, -0.01]} scale={[1.02, 0.95, 1.02]}>
                <sphereGeometry
                  args={[0.17, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]}
                />
                <primitive object={hairMat} />
              </mesh>
              {/* Hair Fringe */}
              <mesh
                position={[0, 0.2, 0.08]}
                rotation={[0.2, 0, 0]}
                scale={[1.1, 0.35, 0.6]}
              >
                <sphereGeometry args={[0.08, 16, 12]} />
                <primitive object={hairMat} />
              </mesh>

              {/* Minimalist Pill Eyes */}
              <group position={[0, 0.08, 0.15]}>
                <mesh ref={lidLRef} position={[-0.06, 0, 0]}>
                  <capsuleGeometry args={[0.014, 0.03, 4, 12]} />
                  <meshPhysicalMaterial
                    color="#0A0A0A"
                    roughness={0.1}
                    clearcoat={1.0}
                  />
                </mesh>
                <mesh ref={lidRRef} position={[0.06, 0, 0]}>
                  <capsuleGeometry args={[0.014, 0.03, 4, 12]} />
                  <meshPhysicalMaterial
                    color="#0A0A0A"
                    roughness={0.1}
                    clearcoat={1.0}
                  />
                </mesh>
              </group>

              {/* Minimalist Cute Nose */}
              <mesh position={[0, 0.045, 0.165]}>
                <sphereGeometry args={[0.016, 14, 10]} />
                <primitive object={skinMat} />
              </mesh>

              {/* Friendly Smile */}
              <mesh position={[0, 0.015, 0.16]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.028, 0.005, 8, 16, Math.PI * 0.6]} />
                <meshStandardMaterial color="#4A2A22" roughness={0.8} />
              </mesh>

              {/* Subtle Blush */}
              <mesh position={[-0.085, 0.04, 0.155]}>
                <circleGeometry args={[0.022, 16]} />
                <meshBasicMaterial color="#FF9A9A" transparent opacity={0.35} />
              </mesh>
              <mesh position={[0.085, 0.04, 0.155]}>
                <circleGeometry args={[0.022, 16]} />
                <meshBasicMaterial color="#FF9A9A" transparent opacity={0.35} />
              </mesh>

              {/* Dummy refs for backward compatibility */}
              <group ref={jawRef} />
              <group ref={cornerLRef} />
              <group ref={cornerRRef} />
              <group ref={irisLRef} />
              <group ref={irisRRef} />
              <group ref={browLRef} />
              <group ref={browRRef} />
            </group>
          </group>
        </group>

        {/* ---- Left Arm (Holds Passport) ---- */}
        <group ref={armLS} position={[-0.2, 0.45, 0]}>
          <mesh position={[0, -0.14, 0]}>
            <capsuleGeometry args={[0.05, 0.22, 8, 12]} />
            <primitive object={blazerMat} />
          </mesh>
          <group ref={armLE} position={[0, -0.26, 0]}>
            <mesh position={[0, -0.12, 0]}>
              <capsuleGeometry args={[0.045, 0.2, 8, 12]} />
              <primitive object={blazerMat} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <sphereGeometry args={[0.04, 14, 10]} />
              <primitive object={skinMat} />
            </mesh>
            {/* Passport Folder */}
            <group
              ref={passportRef}
              position={[0, -0.24, 0.06]}
              rotation={[0.2, 0.2, 0]}
            >
              <mesh>
                <boxGeometry args={[0.07, 0.09, 0.012]} />
                <primitive object={passportMat} />
              </mesh>
              <mesh position={[0, 0, 0.007]}>
                <torusGeometry args={[0.015, 0.003, 8, 16]} />
                <primitive object={goldMat} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ---- Right Arm (Gestures) ---- */}
        <group ref={armRS} position={[0.2, 0.45, 0]}>
          <mesh position={[0, -0.14, 0]}>
            <capsuleGeometry args={[0.05, 0.22, 8, 12]} />
            <primitive object={blazerMat} />
          </mesh>
          <group ref={armRE} position={[0, -0.26, 0]}>
            <mesh position={[0, -0.12, 0]}>
              <capsuleGeometry args={[0.045, 0.2, 8, 12]} />
              <primitive object={blazerMat} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <sphereGeometry args={[0.04, 14, 10]} />
              <primitive object={skinMat} />
            </mesh>
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
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 1.35, 5.6], fov: 32 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows
      >
        <CameraRig />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[3.5, 5, 4]}
          intensity={1.5}
          color="#FFF5E6"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-radius={6}
          shadow-bias={-0.0005}
        />
        <directionalLight
          position={[-4, 3, -4]}
          intensity={1.1}
          color="#7DD3FC"
        />
        <pointLight position={[0, 1, 2.5]} intensity={0.5} color="#FFE1B8" />

        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, 0, 0]}>
            <Lightformer
              form="rect"
              intensity={2.5}
              color="#FFF2E0"
              position={[0, 3, 3]}
              scale={[5, 2.5, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.4}
              color="#7DD3FC"
              position={[-4, 2, 1]}
              rotation-y={Math.PI / 2}
              scale={[3, 1.5, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.2}
              color={accent}
              position={[0, 0.5, -4]}
              scale={[4, 2, 1]}
            />
          </group>
        </Environment>

        {/* Additive halo glow behind character */}
        <Glow
          position={[0, 0.85, -0.6]}
          scale={6.5}
          color={accent}
          opacity={0.45}
        />
        <Glow
          position={[0, 0.85, -0.6]}
          scale={4}
          color="#7DD3FC"
          opacity={0.45}
        />

        <EnvironmentProps />
        <StudentRig {...props} />

        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.45}
          scale={12}
          blur={2.4}
          far={3.5}
          resolution={512}
          frames={1}
        />
      </Canvas>
    </div>
  );
};

const Student3D = (props) => {
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    [],
  );
  return <SceneContainer {...props} isMobile={isMobile} />;
};

export default Student3D;
