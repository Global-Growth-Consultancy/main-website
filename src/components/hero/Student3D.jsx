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
// Student3D — "Aarav", a premium Pixar/Spline style international student.
// Highly stylized, friendly, and ultra-premium to avoid the "uncanny valley".
// Features: Clean topology, soft matte materials, symmetrical anatomy,
// and a dynamic superhero-style hover animation.
// ------------------------------------------------------------------

const glowTex = (() => {
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
})();

// ---- Premium Materials (Soft, Matte, Pixar-style) ----
const skinMat = new THREE.MeshPhysicalMaterial({
  color: "#E5A982",
  roughness: 0.4,
  clearcoat: 0.2,
  clearcoatRoughness: 0.6,
  sheen: 0.5,
  sheenRoughness: 0.8,
});
const hairMat = new THREE.MeshStandardMaterial({
  color: "#2B1D15",
  roughness: 0.6,
  metalness: 0.1,
});
const blazerMat = new THREE.MeshStandardMaterial({
  color: "#161E35",
  roughness: 0.8,
});
const shirtMat = new THREE.MeshStandardMaterial({
  color: "#FFFFFF",
  roughness: 0.6,
});
const pantsMat = new THREE.MeshStandardMaterial({
  color: "#1F2533",
  roughness: 0.8,
});
const sneakerMat = new THREE.MeshStandardMaterial({
  color: "#FAFAFA",
  roughness: 0.4,
});
const soleMat = new THREE.MeshStandardMaterial({
  color: "#D1D5DB",
  roughness: 0.5,
});
const eyeMat = new THREE.MeshPhysicalMaterial({
  color: "#0A0A0A",
  roughness: 0.1,
  clearcoat: 1.0,
});
const goldMat = new THREE.MeshStandardMaterial({
  color: "#FBBF24",
  roughness: 0.3,
  metalness: 0.8,
});
const paperMat = new THREE.MeshStandardMaterial({
  color: "#F3F4F6",
  roughness: 0.9,
});
const leatherMat = new THREE.MeshStandardMaterial({
  color: "#4A2F1D",
  roughness: 0.7,
});
const laptopMat = new THREE.MeshStandardMaterial({
  color: "#E5E7EB",
  roughness: 0.3,
  metalness: 0.6,
});
const screenMat = new THREE.MeshStandardMaterial({
  color: "#0F172A",
  emissive: "#38BDF8",
  emissiveIntensity: 1.5,
});
const passportMat = new THREE.MeshStandardMaterial({
  color: "#991B1B",
  roughness: 0.6,
});
const globeOceanMat = new THREE.MeshStandardMaterial({
  color: "#2563EB",
  roughness: 0.3,
});
const globeRingMat = new THREE.MeshStandardMaterial({
  color: "#93C5FD",
  roughness: 0.2,
  metalness: 0.5,
});

// ---- Chapter Pose Targets (rest, wave, talk, etc) ----
const POSE = {
  rest: {
    rs: [-0.1, 0, 0.15],
    re: [-0.1, 0, 0],
    ls: [-0.1, 0, -0.15],
    le: [-0.1, 0, 0],
  },
  wave: {
    rs: [-0.3, 0, 1.2],
    re: [-0.5, 0, 0],
    ls: [-0.1, 0, -0.15],
    le: [-0.1, 0, 0],
  },
  talk: {
    rs: [-0.4, 0, 0.4],
    re: [-0.6, 0, 0],
    ls: [-0.5, 0, -0.3],
    le: [-0.7, 0, 0],
  },
  point: {
    rs: [-1.2, 0, 0.2],
    re: [-0.1, 0, 0],
    ls: [-0.1, 0, -0.15],
    le: [-0.1, 0, 0],
  },
  open: {
    rs: [-0.3, 0, 0.8],
    re: [-0.2, 0, 0],
    ls: [-0.3, 0, -0.8],
    le: [-0.2, 0, 0],
  },
  present: {
    rs: [-1.0, 0.2, 0.2],
    re: [-0.2, 0, 0],
    ls: [-0.1, 0, -0.15],
    le: [-0.1, 0, 0],
  },
  celebrate: {
    rs: [-0.2, 0, 1.2],
    re: [-0.3, 0, 0],
    ls: [-0.2, 0, -1.2],
    le: [-0.3, 0, 0],
  },
};
const GESTURE_POSE = {
  0: "wave",
  1: "talk",
  2: "point",
  3: "open",
  4: "present",
};

// ---- Additive Glow Sprite ----
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

// ---- Floating Environment Props ----
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
    if (!ref.current) return;
    const t = clock.elapsedTime;
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

const Props = () => (
  <group>
    <FloatProp position={[1.1, 1.3, 0.1]} scale={0.25} speed={0.8} phase={0}>
      <mesh>
        <sphereGeometry args={[1, 24, 24]} />
        <primitive object={globeOceanMat} />
      </mesh>
      <mesh rotation={[0.4, 0.2, 0]} scale={1.05}>
        <torusGeometry args={[1, 0.02, 8, 32]} />
        <primitive object={globeRingMat} />
      </mesh>
      <mesh rotation={[-0.5, 0.4, 0.2]} scale={1.05}>
        <torusGeometry args={[1, 0.02, 8, 32]} />
        <primitive object={globeRingMat} />
      </mesh>
      <Glow scale={4} color="#38BDF8" opacity={0.3} />
    </FloatProp>

    <FloatProp
      position={[-1.1, 1.4, 0.2]}
      scale={0.35}
      speed={0.7}
      phase={1.5}
      rotSpeed={0.5}
    >
      <mesh>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <primitive object={paperMat} />
      </mesh>
      <mesh position={[0, 0.3, 0.03]}>
        <boxGeometry args={[0.8, 0.1, 0.02]} />
        <primitive object={blazerMat} />
      </mesh>
      <mesh position={[0, -0.1, 0.03]}>
        <boxGeometry args={[0.6, 0.1, 0.02]} />
        <primitive object={blazerMat} />
      </mesh>
    </FloatProp>

    <FloatProp position={[0.8, 0.7, 0.4]} scale={0.4} speed={1.1} phase={2.2}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 24]} />
        <primitive object={goldMat} />
      </mesh>
      <Glow scale={3.5} color="#FBBF24" opacity={0.4} />
    </FloatProp>

    <FloatProp position={[-0.9, 0.8, -0.2]} scale={0.4} speed={0.9} phase={0.8}>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <primitive object={passportMat} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <coneGeometry args={[0.3, 0.8, 16]} />
        <primitive object={passportMat} />
      </mesh>
    </FloatProp>
  </group>
);

// ---- Main Character Rig ----
const StudentRig = ({ isHovered, scene, gesture, speech, reducedMotion }) => {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const eyeL = useRef(null);
  const eyeR = useRef(null);
  const armL = useRef(null);
  const armR = useRef(null);
  const legL = useRef(null);
  const legR = useRef(null);

  const hoverAnim = useRef(0);
  const talkT = useRef(0);
  const isTalking = useRef(false);
  const lightRef = useRef(null);

  useEffect(() => {
    talkT.current = 0;
    isTalking.current = true;
    const to = setTimeout(() => {
      isTalking.current = false;
    }, 3000);
    return () => clearTimeout(to);
  }, [speech]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Smooth hover transition
    hoverAnim.current = THREE.MathUtils.damp(
      hoverAnim.current,
      isHovered ? 1 : 0,
      4,
      dt,
    );

    if (lightRef.current) {
      lightRef.current.intensity = hoverAnim.current * 1.5;
    }

    // Core levitation & breathing
    const idleY = Math.sin(t * 1.5) * 0.02;
    const hoverY = hoverAnim.current * 0.35; // Floats up on hover
    rootRef.current.position.y = idleY + hoverY;

    // Hover superhero tilt
    rootRef.current.rotation.x = THREE.MathUtils.damp(
      rootRef.current.rotation.x,
      hoverAnim.current * -0.15,
      3,
      dt,
    );

    if (reducedMotion) return;

    // Head tracking cursor
    headRef.current.rotation.y = THREE.MathUtils.damp(
      headRef.current.rotation.y,
      state.pointer.x * 0.3,
      5,
      dt,
    );
    headRef.current.rotation.x = THREE.MathUtils.damp(
      headRef.current.rotation.x,
      -state.pointer.y * 0.2 + hoverAnim.current * 0.2,
      5,
      dt,
    );

    // Blinking logic (scale Y of eyes)
    const blinkCycle = t % 4;
    const isBlinking = blinkCycle > 3.8 && blinkCycle < 3.9;
    const eyeScaleY = isBlinking ? 0.1 : 1;
    eyeL.current.scale.y = THREE.MathUtils.damp(
      eyeL.current.scale.y,
      eyeScaleY,
      30,
      dt,
    );
    eyeR.current.scale.y = THREE.MathUtils.damp(
      eyeR.current.scale.y,
      eyeScaleY,
      30,
      dt,
    );

    // Talking logic (head bobbing)
    if (isTalking.current) {
      headRef.current.position.y = 1.05 + Math.sin(t * 12) * 0.01;
    } else {
      headRef.current.position.y = THREE.MathUtils.damp(
        headRef.current.position.y,
        1.05,
        5,
        dt,
      );
    }

    // Arm animations (blend between gesture and hover)
    const targetPose = isHovered
      ? {
          ls: [-0.4, 0, -0.6],
          rs: [-0.4, 0, 0.6], // Arms spread gracefully
        }
      : POSE[GESTURE_POSE[gesture] || "rest"];

    armL.current.rotation.z = THREE.MathUtils.damp(
      armL.current.rotation.z,
      targetPose.ls[2],
      4,
      dt,
    );
    armL.current.rotation.x = THREE.MathUtils.damp(
      armL.current.rotation.x,
      targetPose.ls[0],
      4,
      dt,
    );
    armR.current.rotation.z = THREE.MathUtils.damp(
      armR.current.rotation.z,
      targetPose.rs[2],
      4,
      dt,
    );
    armR.current.rotation.x = THREE.MathUtils.damp(
      armR.current.rotation.x,
      targetPose.rs[0],
      4,
      dt,
    );

    // Leg swinging (dangling when hovered)
    legL.current.rotation.x = THREE.MathUtils.damp(
      legL.current.rotation.x,
      hoverAnim.current * 0.2 + Math.sin(t * 2) * 0.02,
      3,
      dt,
    );
    legR.current.rotation.x = THREE.MathUtils.damp(
      legR.current.rotation.x,
      hoverAnim.current * 0.1 - Math.sin(t * 2) * 0.02,
      3,
      dt,
    );
  });

  return (
    <group ref={rootRef}>
      {/* Dynamic Hover Aura */}
      <pointLight
        position={[0, 0.5, 0.5]}
        intensity={0}
        ref={lightRef}
        color="#38BDF8"
        distance={4}
      />

      {/* ---- Head & Face ---- */}
      <group ref={headRef} position={[0, 1.05, 0]}>
        {/* Cute chunky head */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.38, 0.35, 0.38]} />
          <primitive object={skinMat} />
        </mesh>

        {/* Simple stylized hair */}
        <mesh position={[0, 0.4, -0.02]}>
          <boxGeometry args={[0.42, 0.12, 0.42]} />
          <primitive object={hairMat} />
        </mesh>
        <mesh position={[0.2, 0.25, -0.05]}>
          <boxGeometry args={[0.06, 0.2, 0.35]} />
          <primitive object={hairMat} />
        </mesh>
        <mesh position={[-0.2, 0.25, -0.05]}>
          <boxGeometry args={[0.06, 0.2, 0.35]} />
          <primitive object={hairMat} />
        </mesh>
        <mesh position={[0, 0.35, 0.2]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
          <primitive object={hairMat} />
        </mesh>

        {/* Minimalist Pill Eyes (No scary pupils) */}
        <group position={[0, 0.18, 0.2]}>
          <mesh ref={eyeL} position={[-0.08, 0, 0]}>
            <capsuleGeometry args={[0.015, 0.03, 4, 8]} />
            <primitive object={eyeMat} />
          </mesh>
          <mesh ref={eyeR} position={[0.08, 0, 0]}>
            <capsuleGeometry args={[0.015, 0.03, 4, 8]} />
            <primitive object={eyeMat} />
          </mesh>
        </group>

        {/* Subtle cute blush */}
        <mesh position={[-0.12, 0.1, 0.19]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color="#FF9A9A" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.12, 0.1, 0.19]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color="#FF9A9A" transparent opacity={0.5} />
        </mesh>

        {/* Minimalist smile */}
        <mesh position={[0, 0.08, 0.195]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.03, 0.005, 8, 16, Math.PI * 0.6]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      </group>

      {/* ---- Body (Suit & Shirt) ---- */}
      <group position={[0, 0.75, 0]}>
        {/* Torso core */}
        <mesh>
          <boxGeometry args={[0.32, 0.45, 0.2]} />
          <primitive object={shirtMat} />
        </mesh>
        {/* Blazer sides */}
        <mesh position={[-0.1, 0, 0.02]}>
          <boxGeometry args={[0.15, 0.46, 0.22]} />
          <primitive object={blazerMat} />
        </mesh>
        <mesh position={[0.1, 0, 0.02]}>
          <boxGeometry args={[0.15, 0.46, 0.22]} />
          <primitive object={blazerMat} />
        </mesh>
        {/* Tie */}
        <mesh position={[0, 0.1, 0.11]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.04, 0.25, 0.01]} />
          <primitive object={goldMat} />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 0.05, -0.13]}>
          <boxGeometry args={[0.28, 0.35, 0.12]} />
          <primitive object={leatherMat} />
        </mesh>
      </group>

      {/* ---- Arms ---- */}
      <group position={[-0.2, 0.9, 0]} ref={armL}>
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.045, 0.25, 8, 8]} />
          <primitive object={blazerMat} />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <primitive object={skinMat} />
        </mesh>
      </group>
      <group position={[0.2, 0.9, 0]} ref={armR}>
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.045, 0.25, 8, 8]} />
          <primitive object={blazerMat} />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <primitive object={skinMat} />
        </mesh>
        {/* Holding Passport */}
        <mesh position={[0, -0.42, 0.08]} rotation={[0.2, -0.2, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.01]} />
          <primitive object={passportMat} />
        </mesh>
      </group>

      {/* ---- Legs (Perfectly symmetrical & chunky) ---- */}
      <group position={[-0.09, 0.5, 0]} ref={legL}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.05, 0.25, 8, 8]} />
          <primitive object={pantsMat} />
        </mesh>
        {/* Sneaker */}
        <mesh position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.09, 0.08, 0.16]} />
          <primitive object={sneakerMat} />
        </mesh>
        <mesh position={[0, -0.47, 0.03]}>
          <boxGeometry args={[0.1, 0.02, 0.17]} />
          <primitive object={soleMat} />
        </mesh>
      </group>
      <group position={[0.09, 0.5, 0]} ref={legR}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.05, 0.25, 8, 8]} />
          <primitive object={pantsMat} />
        </mesh>
        {/* Sneaker */}
        <mesh position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.09, 0.08, 0.16]} />
          <primitive object={sneakerMat} />
        </mesh>
        <mesh position={[0, -0.47, 0.03]}>
          <boxGeometry args={[0.1, 0.02, 0.17]} />
          <primitive object={soleMat} />
        </mesh>
      </group>

      {/* Ground Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const CameraRig = () => {
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const cam = state.camera;
    // Dynamic cinematic panning
    const tx = Math.sin(t * 0.2) * 0.1 + state.pointer.x * 0.3;
    const ty = 1.3 - state.pointer.y * 0.15;
    const tz = 5.2 + Math.sin(t * 0.15) * 0.1;
    cam.position.set(
      THREE.MathUtils.damp(cam.position.x, tx, 3, dt),
      THREE.MathUtils.damp(cam.position.y, ty, 3, dt),
      THREE.MathUtils.damp(cam.position.z, tz, 3, dt),
    );
    cam.lookAt(0, 0.9, 0);
  });
  return null;
};

const SceneContainer = (props) => {
  const { visible = true, isMobile, accent = "#38BDF8" } = props;
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 1.3, 5.2], fov: 32 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
    >
      <CameraRig />

      {/* Cinematic Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
        color="#FFF5E6"
        castShadow
        shadow-bias={-0.001}
      />
      <directionalLight
        position={[-4, 3, -4]}
        intensity={1.2}
        color="#7DD3FC"
      />
      <pointLight position={[0, 1, 2.5]} intensity={0.5} color="#FFE1B8" />
      <pointLight position={[-2, 1, 2]} intensity={0.4} color={accent} />

      <Environment preset="city" />

      {/* Additive Core Glow */}
      <Glow position={[0, 0.8, -0.5]} scale={6} color={accent} opacity={0.6} />

      <Props />
      <StudentRig {...props} />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={10}
        blur={2.5}
        far={4}
        frames={1}
      />
      <Sparkles
        count={50}
        scale={6}
        size={1.5}
        speed={0.4}
        opacity={0.4}
        color={accent}
      />
    </Canvas>
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
