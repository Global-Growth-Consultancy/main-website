import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// ------------------------------------------------------------------
// Student3D ΓÇö "Aarav", a premium stylised 3D graduate.
//
// Built from zero as real 3D (react-three-fiber), NOT a flat cartoon:
//   ΓÇó proper human proportions (no oversized head, no bug eyes)
//   ΓÇó natural skin tone, modern haircut, clean face
//   ΓÇó premium graduation gown + cap, white shirt, gold tie, formal shoes
//   ΓÇó fully rigged: blink, breathe, head + iris track the user's cursor,
//     syllable-synced jaw lipsync, brow emotions, natural smile,
//     confident chapter gestures, wave, and a success-celebration hop
//   ΓÇó stylised-Pixar look (not photorealism) ΓåÆ zero uncanny valley
//   ΓÇó soft warm key light + cyan/violet rim light = premium studio grade
//
// Every motion is damped (THREE.MathUtils.damp) ΓåÆ smooth, 60 FPS.
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

const irisTex = makeIrisTexture();
const shadowTex = makeShadowTexture();

// ---- materials (MeshPhysical = soft subsurface skin, premium cloth) ----
const skinMat = new THREE.MeshPhysicalMaterial({
  color: "#B37A4F", roughness: 0.5, clearcoat: 0.28, clearcoatRoughness: 0.7,
  sheen: 0.7, sheenRoughness: 0.8,
});
const hairMat = new THREE.MeshPhysicalMaterial({ color: "#221511", roughness: 0.58, clearcoat: 0.12 });
const gownMat = new THREE.MeshPhysicalMaterial({ color: "#1D2A47", roughness: 0.55, clearcoat: 0.28, clearcoatRoughness: 0.6 });
const gownTrimMat = new THREE.MeshStandardMaterial({ color: "#141D33", roughness: 0.6 });
const pantsMat = new THREE.MeshStandardMaterial({ color: "#151E33", roughness: 0.6 });
const shirtMat = new THREE.MeshPhysicalMaterial({ color: "#F6F8FC", roughness: 0.35, clearcoat: 0.15 });
const tieMat = new THREE.MeshStandardMaterial({ color: "#FBBF24", roughness: 0.35, metalness: 0.12 });
const shoeMat = new THREE.MeshStandardMaterial({ color: "#0B0F1A", roughness: 0.32, metalness: 0.08 });
const capMat = new THREE.MeshStandardMaterial({ color: "#0F172A", roughness: 0.5 });
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

// ---- gown skirt profile (radius, y) bottom ΓåÆ top ----
const SKIRT_POINTS = [
  new THREE.Vector2(0.44, -0.62),
  new THREE.Vector2(0.4, -0.5),
  new THREE.Vector2(0.35, -0.34),
  new THREE.Vector2(0.31, -0.18),
  new THREE.Vector2(0.29, -0.02),
];

// ---- chapter pose targets ----
// right shoulder rs / right elbow re / left shoulder ls / left elbow le
const POSE = {
  rest: { rs: [-0.04, 0.05, 0.05], re: [-0.06, 0, 0], ls: [-0.04, 0.05, -0.05], le: [-0.06, 0, 0] },
  wave: { rs: [-0.3, 0.08, 1.05], re: [-0.35, 0, 0], ls: [-0.02, 0.05, -0.04], le: [-0.05, 0, 0] },
  talk: { rs: [-0.5, 0.08, 0.12], re: [1.15, 0, 0], ls: [-0.45, 0.08, -0.12], le: [1.1, 0, 0] },
  point: { rs: [-1.15, 0.3, 0.1], re: [-0.5, 0, 0], ls: [-0.03, 0.05, -0.05], le: [-0.05, 0, 0] },
  open: { rs: [-0.45, 0.05, 0.9], re: [-0.25, 0, 0], ls: [-0.45, 0.05, -0.9], le: [-0.25, 0, 0] },
  present: { rs: [-0.95, 0.35, 0.1], re: [-0.4, 0, 0], ls: [-0.5, 0.1, -0.05], le: [-0.5, 0, 0] },
  celebrate: { rs: [-0.5, 0.05, 0.95], re: [-0.3, 0, 0], ls: [-0.5, 0.05, -0.95], le: [-0.3, 0, 0] },
  hover: { rs: [-0.5, 0.05, 0.8], re: [-0.3, 0, 0], ls: [-0.5, 0.05, -0.8], le: [-0.3, 0, 0] },
};

const GESTURE_POSE = { 0: "wave", 1: "talk", 2: "point", 3: "open", 4: "present" };

const EMOTION = {
  0: { brow: 0.02 },
  1: { brow: 0.008 },
  2: { brow: 0.016 },
  3: { brow: 0.014 },
  4: { brow: 0.012 },
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const StudentRig = (props) => {
  const figureRef = useRef(null);
  const groundRef = useRef(null);
  const torsoRef = useRef(null);
  const skirtRef = useRef(null);
  const tieRef = useRef(null);
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
  const capRef = useRef(null);
  const tasselRef = useRef(null);

  const entrance = useRef(0);
  const blinkNext = useRef(1.6);
  const blinkT = useRef(0);
  const talkT = useRef(0);
  const talkMs = useRef(props.talkMs);
  const env = useRef([]);
  const celebrateT = useRef(0);
  const hop = useRef(0);
  const smileAmt = useRef(0.6);
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

    // success hop (click / graduation chapter)
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
    // breathing
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

    // natural smile (always present, stronger when happy)
    const happy = hoverRef.current || gRef.current === 4;
    smileAmt.current = THREE.MathUtils.damp(smileAmt.current, happy ? 1 : 0.6, 5, dt);
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
    browLRef.current.position.y = 0.125 + emo.brow;
    browRRef.current.position.y = 0.125 + emo.brow;

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
      // intro ΓÇö wave
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

    // secondary cloth motion
    skirtRef.current.rotation.z = Math.sin(t * 0.9) * 0.012;
    skirtRef.current.rotation.x = Math.sin(t * 0.7 + 0.6) * 0.008;
    tieRef.current.rotation.z = Math.sin(t * 1.3) * 0.05;
    tasselRef.current.rotation.z = Math.sin(t * 1.6) * 0.12;
    capRef.current.rotation.x = 0.05 + Math.sin(t * 1.2) * 0.012;

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
        {/* ---- legs + premium shoes ---- */}
        <group ref={legLRef} position={[-0.12, 0.02, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.075, 0.32, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <capsuleGeometry args={[0.06, 0.3, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <group position={[0, -0.66, 0]}>
            <mesh position={[0, -0.02, 0.04]}>
              <boxGeometry args={[0.09, 0.06, 0.22]} />
              <primitive object={shoeMat} />
            </mesh>
            <mesh position={[0, -0.02, 0.12]} scale={[0.7, 0.6, 0.9]}>
              <sphereGeometry args={[0.05, 16, 12]} />
              <primitive object={shoeMat} />
            </mesh>
          </group>
        </group>
        <group ref={legRRef} position={[0.12, 0.02, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.075, 0.32, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <capsuleGeometry args={[0.06, 0.3, 4, 12]} />
            <primitive object={pantsMat} />
          </mesh>
          <group position={[0, -0.66, 0]}>
            <mesh position={[0, -0.02, 0.04]}>
              <boxGeometry args={[0.09, 0.06, 0.22]} />
              <primitive object={shoeMat} />
            </mesh>
            <mesh position={[0, -0.02, 0.12]} scale={[0.7, 0.6, 0.9]}>
              <sphereGeometry args={[0.05, 16, 12]} />
              <primitive object={shoeMat} />
            </mesh>
          </group>
        </group>

        {/* ---- gown skirt ---- */}
        <group ref={skirtRef}>
          <mesh>
            <latheGeometry args={[SKIRT_POINTS, 40]} />
            <primitive object={gownMat} />
          </mesh>
          <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.44, 0.014, 10, 40]} />
            <primitive object={gownTrimMat} />
          </mesh>
        </group>

        {/* ---- torso / robe + white shirt + gold tie ---- */}
        <group ref={torsoRef}>
          <mesh position={[0, 0.3, 0]} scale={[0.95, 1, 0.8]}>
            <capsuleGeometry args={[0.27, 0.42, 6, 16]} />
            <primitive object={gownMat} />
          </mesh>
          <mesh position={[-0.085, 0.4, 0.215]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.14, 0.2, 0.02]} />
            <primitive object={shirtMat} />
          </mesh>
          <mesh position={[0.085, 0.4, 0.215]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.14, 0.2, 0.02]} />
            <primitive object={shirtMat} />
          </mesh>
          <group ref={tieRef}>
            <mesh position={[0, 0.44, 0.222]}>
              <boxGeometry args={[0.05, 0.05, 0.02]} />
              <primitive object={tieMat} />
            </mesh>
            <mesh position={[0, 0.35, 0.222]}>
              <boxGeometry args={[0.028, 0.16, 0.016]} />
              <primitive object={tieMat} />
            </mesh>
          </group>
          <mesh position={[-0.05, 0.5, 0.235]} rotation={[0, 0, 0.55]}>
            <boxGeometry args={[0.02, 0.1, 0.015]} />
            <primitive object={gownTrimMat} />
          </mesh>
          <mesh position={[0.05, 0.5, 0.235]} rotation={[0, 0, -0.55]}>
            <boxGeometry args={[0.02, 0.1, 0.015]} />
            <primitive object={gownTrimMat} />
          </mesh>
          <mesh position={[-0.5, 0.52, 0]}>
            <sphereGeometry args={[0.15, 20, 16]} />
            <primitive object={gownMat} />
          </mesh>
          <mesh position={[0.5, 0.52, 0]}>
            <sphereGeometry args={[0.15, 20, 16]} />
            <primitive object={gownMat} />
          </mesh>
        </group>

        {/* ---- left arm (gown sleeve + white cuff + hand) ---- */}
        <group ref={armLS} position={[-0.5, 0.52, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.075, 0.3, 4, 12]} />
            <primitive object={gownMat} />
          </mesh>
          <group ref={armLE} position={[0, -0.36, 0]}>
            <mesh position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.068, 0.26, 4, 12]} />
              <primitive object={gownMat} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.072, 0.072, 0.07, 14]} />
              <primitive object={shirtMat} />
            </mesh>
            <group position={[0, -0.34, 0]}>
              <mesh scale={[1, 1.2, 0.85]}>
                <sphereGeometry args={[0.065, 18, 14]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.02, -0.05, 0.03]} rotation={[0, 0, 0.15]}>
                <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0, -0.055, 0.03]}>
                <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.02, -0.05, 0.03]} rotation={[0, 0, -0.15]}>
                <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ---- right arm ---- */}
        <group ref={armRS} position={[0.5, 0.52, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.075, 0.3, 4, 12]} />
            <primitive object={gownMat} />
          </mesh>
          <group ref={armRE} position={[0, -0.36, 0]}>
            <mesh position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.068, 0.26, 4, 12]} />
              <primitive object={gownMat} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.072, 0.072, 0.07, 14]} />
              <primitive object={shirtMat} />
            </mesh>
            <group position={[0, -0.34, 0]}>
              <mesh scale={[1, 1.2, 0.85]}>
                <sphereGeometry args={[0.065, 18, 14]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[-0.02, -0.05, 0.03]} rotation={[0, 0, 0.15]}>
                <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0, -0.055, 0.03]}>
                <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
              <mesh position={[0.02, -0.05, 0.03]} rotation={[0, 0, -0.15]}>
                <capsuleGeometry args={[0.012, 0.05, 4, 8]} />
                <primitive object={skinMat} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ---- neck + head ---- */}
        <mesh position={[0, 0.6, 0.02]}>
          <cylinderGeometry args={[0.065, 0.07, 0.16, 16]} />
          <primitive object={skinMat} />
        </mesh>

        <group position={[0, 0.76, 0]}>
          <group ref={headTrackRef}>
            <group ref={headBobRef}>
              {/* ---- skull (human egg shape, not a sphere) ---- */}
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
              <mesh ref={browLRef} position={[-0.105, 0.125, 0.172]} rotation={[0, 0, 0.08]}>
                <boxGeometry args={[0.1, 0.016, 0.02]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh ref={browRRef} position={[0.105, 0.125, 0.172]} rotation={[0, 0, -0.08]}>
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
              {/* crown clumps */}
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
              {/* textured fringe */}
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
              {/* temples / sideburns */}
              <mesh position={[-0.145, 0.1, -0.01]} scale={[0.45, 1.15, 0.8]}>
                <sphereGeometry args={[0.042, 16, 12]} />
                <primitive object={hairMat} />
              </mesh>
              <mesh position={[0.145, 0.1, -0.01]} scale={[0.45, 1.15, 0.8]}>
                <sphereGeometry args={[0.042, 16, 12]} />
                <primitive object={hairMat} />
              </mesh>
              {/* back nape */}
              <mesh position={[0, 0.12, -0.13]} scale={[1.1, 0.6, 0.5]}>
                <sphereGeometry args={[0.055, 18, 14]} />
                <primitive object={hairMat} />
              </mesh>

              {/* graduation cap */}
              <group ref={capRef} position={[0, 0.22, 0]} rotation={[0.05, 0, 0]}>
                <mesh position={[0, 0.03, 0]}>
                  <sphereGeometry args={[0.24, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2 + 0.35]} />
                  <primitive object={capMat} />
                </mesh>
                <mesh position={[0, 0.095, 0]} rotation={[0.06, 0, 0]}>
                  <cylinderGeometry args={[0.26, 0.26, 0.014, 40]} />
                  <primitive object={capMat} />
                </mesh>
                <mesh position={[0, 0.105, 0]}>
                  <sphereGeometry args={[0.022, 12, 10]} />
                  <primitive object={tieMat} />
                </mesh>
                <group ref={tasselRef} position={[0.22, 0.095, 0.02]}>
                  <mesh position={[0, -0.03, 0]}>
                    <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
                    <primitive object={tieMat} />
                  </mesh>
                  <mesh position={[0, -0.06, 0]}>
                    <sphereGeometry args={[0.02, 10, 8]} />
                    <primitive object={tieMat} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const SceneContainer = (props) => {
  const { visible = true, isMobile } = props;
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={isMobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 1.3, 5.8], fov: 34 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ camera }) => camera.lookAt(0, 1.12, 0)}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#fff4e6" />
        <directionalLight position={[-4, 4, -5]} intensity={0.85} color="#7dd3fc" />
        <directionalLight position={[0, 3, -4]} intensity={0.4} color="#a78bfa" />
        <pointLight position={[0, 1.2, 2.6]} intensity={0.35} color="#ffffff" />
        {/* procedural studio env (no CDN fetch — premium reflections) */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, 0, 0]}>
            <Lightformer form="rect" intensity={3} color="#FFF4E6" position={[0, 3, 3]} scale={[5, 2.5, 1]} />
            <Lightformer form="rect" intensity={1.5} color="#7DD3FC" position={[-4, 2, 1]} rotation-y={Math.PI / 2} scale={[3, 1.5, 1]} />
            <Lightformer form="rect" intensity={1} color="#A78BFA" position={[4, 1, 1]} rotation-y={-Math.PI / 2} scale={[3, 1.5, 1]} />
          </group>
        </Environment>
        <StudentRig {...props} />
      </Canvas>
    </div>
  );
};

const Student3D = (props) => {
  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);
  return <SceneContainer {...props} isMobile={isMobile} />;
};

export default Student3D;
