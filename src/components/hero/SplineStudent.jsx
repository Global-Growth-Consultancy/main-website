import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

const Student3D = lazy(() => import("./Student3D"));
const Spline = lazy(() => import("@splinetool/react-spline"));

// ------------------------------------------------------------------
// SplineStudent — Spline-first hero character renderer.
//
// Loads a professionally designed 3D scene (published from the Spline
// editor at spline.design) via a hosted .splinecode URL. The character
// is authored in Spline (AI / imported GLB / community assets), which
// gives a world-class human look that procedural react-three-fiber
// geometry cannot reach.
//
// • scene URL lives in SPLINE_SCENE_URL — paste your published scene
//   URL there and the hero switches automatically.
// • on load the renderer is "productized":
//     - Spline watermark overlay is removed
//     - placeholder text tags (e.g. "Front"/"End") are hidden
//     - pixel ratio is boosted for a crisper render
//     - the scene background becomes transparent so the premium
//       DOM backdrop layers show through
// • fallback: if no URL is set, the scene fails to load, the user
//   prefers reduced motion, or the stage is scrolled out of view,
//   the procedural Student3D takes over — the hero never breaks.
// • loading: shimmer placeholder → 900ms fade-in once the scene is
//   ready; the Spline runtime is stopped when off-screen.
// • premium touch: gentle cursor parallax on the loaded scene.
// ------------------------------------------------------------------

// ⚠️ PLACEHOLDER — replace this with your published student scene URL.
// spline.design → new scene → File → Publish → copy the scene URL.
const SPLINE_SCENE_URL =
  "https://prod.spline.design/q0rh-1ED2gijsg0A/scene.splinecode";

// Object names treated as stray editor text tags (hidden on load).
// Adjust for your own scene — leave empty to keep all scene text.
const HIDE_TEXT_NAMES = [/^text/i];

const PARALLAX = 14;

// Breathing room around the robot once it is framed into the stage.
const STAGE_FRAME_MARGIN = 1.12;

// Frames the character tightly and CENTERED inside the stage. The published
// scene was authored for a full-window hero, so once the stray text tags are
// hidden the only visible geometry left is the character itself.
//
// Strategy: never guess the camera orientation — the authored rotation is kept
// exactly as-is. We read the camera's image axes (right/up) from its world
// matrix, compute the character's world bounding box, then:
//   1. nudge the camera so the box center lands on the optical axis (image
//      center) — this is what vertically/horizontally centers the robot, and
//   2. resize the ortho view plane (or pull back the perspective camera) so
//      the box fills the stage with a small margin.
// Orbit controls (if any) are anchored to the same center so the first user
// interaction continues from the framed view instead of jumping away.
const frameRobotInStage = (app) => {
  const scene = app?._scene;
  if (!scene || typeof scene.traverse !== "function") return false;
  try {
    scene.updateMatrixWorld(true);

    // Build the world-space bounding box manually. `Box3.expandByObject`
    // computes each geometry's bounding box on the fly, but it THROWS on the
    // Spline scene's custom/empty geometries — a single bad mesh used to abort
    // the whole framing. So we wrap each object's expansion in its own
    // try/catch: everything that can be measured is measured, the rest is
    // skipped.
    const corners8 = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1],
    ];
    let min = null;
    let max = null;
    scene.traverse((obj) => {
      if (obj.visible === false || !obj.geometry) return;
      let bb;
      try {
        if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
        bb = obj.geometry.boundingBox;
      } catch (err) {
        return;
      }
      if (!bb) return;
      const e = obj.matrixWorld.elements;
      const a = bb.min;
      const b = bb.max;
      for (const [ci, cj, ck] of corners8) {
        const x = ci ? b.x : a.x;
        const y = cj ? b.y : a.y;
        const z = ck ? b.z : a.z;
        const X = e[0] * x + e[4] * y + e[8] * z + e[12];
        const Y = e[1] * x + e[5] * y + e[9] * z + e[13];
        const Z = e[2] * x + e[6] * y + e[10] * z + e[14];
        if (!min) {
          min = [X, Y, Z];
          max = [X, Y, Z];
        } else {
          min[0] = Math.min(min[0], X);
          min[1] = Math.min(min[1], Y);
          min[2] = Math.min(min[2], Z);
          max[0] = Math.max(max[0], X);
          max[1] = Math.max(max[1], Y);
          max[2] = Math.max(max[2], Z);
        }
      }
    });
    if (!min) return false;

    const center = {
      x: (min[0] + max[0]) / 2,
      y: (min[1] + max[1]) / 2,
      z: (min[2] + max[2]) / 2,
    };
    const camera = scene.activeCamera;
    if (!camera) return false;

    // camera image axes from its world matrix (column-major elements)
    const m = camera.matrixWorld.elements;
    const right = new Vector3(m[0], m[1], m[2]).normalize();
    const up = new Vector3(m[4], m[5], m[6]).normalize();
    const back = new Vector3(m[8], m[9], m[10]).normalize();

    // project the 8 box corners onto the camera image plane
    const halfW = Math.max(
      0.001,
      ...[0, 1, 0, 0, 1, 1, 1, 0].map((_, i) => {
        const x = corners8[i][0] ? max[0] : min[0];
        const y = corners8[i][1] ? max[1] : min[1];
        const z = corners8[i][2] ? max[2] : min[2];
        return Math.abs(right.x * (x - center.x) + right.y * (y - center.y) + right.z * (z - center.z));
      })
    );
    const halfH = Math.max(
      0.001,
      ...[0, 1, 0, 0, 1, 1, 1, 0].map((_, i) => {
        const x = corners8[i][0] ? max[0] : min[0];
        const y = corners8[i][1] ? max[1] : min[1];
        const z = corners8[i][2] ? max[2] : min[2];
        return Math.abs(up.x * (x - center.x) + up.y * (y - center.y) + up.z * (z - center.z));
      })
    );

    // camera → box-center vector decomposed in camera space
    const pos = camera.position;
    const offX = right.x * (center.x - pos.x) + right.y * (center.y - pos.y) + right.z * (center.z - pos.z);
    const offY = up.x * (center.x - pos.x) + up.y * (center.y - pos.y) + up.z * (center.z - pos.z);
    const along = back.x * (center.x - pos.x) + back.y * (center.y - pos.y) + back.z * (center.z - pos.z);
    const nudgeX = right.x * offX + up.x * offY;
    const nudgeY = right.y * offX + up.y * offY;
    const nudgeZ = right.z * offX + up.z * offY;

    if (camera.isPerspectiveCamera) {
      const fov = (camera.fov * Math.PI) / 180 || Math.PI / 4;
      const halfTan = Math.tan(fov / 2);
      const canvas = app.canvas;
      const vw = canvas?.clientWidth || app._viewportWidth || 400;
      const vh = canvas?.clientHeight || app._viewportHeight || 400;
      const aspect = vw / vh || 1;
      const distance = Math.max(halfH / halfTan, halfW / (halfTan * aspect)) * STAGE_FRAME_MARGIN;
      // robot sits in front of the camera (along is negative), pull it to `distance`
      const shift = -distance - along;
      camera.aspect = aspect;
      camera.zoom = 1;
      camera.position.set(
        pos.x + nudgeX + back.x * shift,
        pos.y + nudgeY + back.y * shift,
        pos.z + nudgeZ + back.z * shift
      );
      camera.updateProjectionMatrix();
    } else {
      camera.zoom = 1;
      // Keep the ortho view plane at the SAME aspect ratio as the canvas.
      // A view plane whose aspect differs from the canvas stretches the
      // image (squashes/stretches the robot), so we size the larger axis to
      // the box and derive the other axis from the canvas aspect.
      const canvas = app.canvas;
      const vw = canvas?.clientWidth || app._viewportWidth || 400;
      const vh = canvas?.clientHeight || app._viewportHeight || 400;
      const aspect = vw / vh || 1;
      const reqW = halfW * 2 * STAGE_FRAME_MARGIN;
      const reqH = halfH * 2 * STAGE_FRAME_MARGIN;
      const viewW = Math.max(reqW, reqH * aspect);
      const viewH = viewW / aspect;
      camera.setViewplaneSize(viewW, viewH);
      camera.position.set(pos.x + nudgeX, pos.y + nudgeY, pos.z + nudgeZ);
    }
    camera.updateMatrixWorld(true);

    const orbit = app._controls?.orbitControls;
    if (orbit && orbit.target) {
      orbit.target.set(center.x, center.y, center.z);
      orbit.scale = 1;
    }
    return true;
  } catch (err) {
    return false;
  }
};

// The react-spline component throws during render when a scene fails to
// load (it does not support an onError prop), so a real ErrorBoundary is
// required to prevent the whole app from unmounting.
class SplineErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (this.props.onFail) this.props.onFail(error, info);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Branded preloader — fills the stage while the Spline scene streams in,
// so the hero never looks like a blank void during the 5-10s warmup.
const LoadingShimmer = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[5]">
    <div className="relative w-4/5 h-3/5 max-w-[300px] flex items-end justify-center">
      <div className="w-full h-[92%] max-w-[240px] rounded-t-full rounded-b-2xl bg-gradient-to-b from-brand-400/20 via-brand-400/5 to-transparent animate-pulse" />
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-brand-400/20 border-t-brand-400 animate-spin" />
      </div>
    </div>
    <p className="mt-3 text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-brand-300/60 uppercase animate-pulse">
      Preparing 3D experience
    </p>
  </div>
);

// Premium backdrop behind the (now transparent) Spline scene.
const BackdropLayers = () => null;

const BrandLockup = () => null;

const SplineStudent = (props) => {
  const { visible = true, reducedMotion = false } = props;
  const [status, setStatus] = useState("loading");
  const appRef = useRef(null);
  const innerRef = useRef(null);

  const useSpline = Boolean(SPLINE_SCENE_URL) && !reducedMotion;

  useEffect(() => {
    const app = appRef.current;
    if (!app || status !== "ready") return;
    try {
      if (visible) {
        app.play();
      } else {
        app.stop();
      }
    } catch (err) {
      /* noop */
    }
  }, [visible, status]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || status !== "ready") return undefined;
    const parent = el.parentElement?.parentElement;
    if (!parent) return undefined;
    const handler = (e) => {
      const r = parent.getBoundingClientRect();
      if (r.width === 0) return;
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const dx = Math.round(x * PARALLAX);
      const dy = Math.round(y * PARALLAX * 0.7);
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };
    const reset = () => {
      el.style.transform = "translate3d(0px, 0px, 0px)";
    };
    parent.addEventListener("mousemove", handler);
    parent.addEventListener("mouseleave", reset);
    return () => {
      parent.removeEventListener("mousemove", handler);
      parent.removeEventListener("mouseleave", reset);
    };
  }, [status]);

  // Re-frame the character whenever the stage resizes (the stage height steps
  // between 320/420/480px at breakpoints and the width shifts with layout).
  //
  // The Spline runtime re-applies the scene's own camera framing on load and
  // on every resize (it resets the view plane / aspect), which would undo our
  // centering. Those resizes are asynchronous and land at unpredictable times
  // (fonts, images and layout shifts each trigger one — we've observed them
  // firing as late as ~6s after mount), so a fixed-length interval isn't
  // enough. The runtime also captures its own resize handler internally, so
  // hooking `app._resize` is unreliable.
  //
  // Robust strategy: poll the camera on a short cadence and re-frame whenever
  // the runtime has moved it. We only stop once the camera has stayed at our
  // framed state for consecutive ticks AND enough wall-clock time has passed
  // to cover the runtime's late settle resizes. The runtime's canvas is also
  // observed so genuine layout changes (breakpoints, window resizes) trigger a
  // fresh re-frame for the component's whole lifetime.
  useEffect(() => {
    const el = innerRef.current;
    if (status !== "ready" || !el) return undefined;
    const startedAt = Date.now();
    let timer = 0;
    let stuck = 0;
    const MIN_STABLE_MS = 9000;
    const MAX_TOTAL_MS = 20000;

    const signature = () => {
      const cam = appRef.current?._scene?.activeCamera;
      if (!cam) return null;
      const p = cam.position;
      const q = cam.quaternion;
      const pad = (v) => v.toFixed(3);
      return [
        pad(p.x), pad(p.y), pad(p.z),
        pad(q.x), pad(q.y), pad(q.z), pad(q.w),
        cam.left !== undefined ? pad(cam.left) : "",
        cam.top !== undefined ? pad(cam.top) : "",
        cam.zoom !== undefined ? pad(cam.zoom) : "",
      ].join("|");
    };

    const tick = () => {
      const app = appRef.current;
      if (!app) return;
      const before = signature();
      let ok = false;
      try {
        ok = frameRobotInStage(app);
      } catch (err) {
        ok = false;
      }
      const after = signature();
      // before === after: camera already at our framed state (runtime quiet),
      // count a "stable" tick. before !== after: framing had to fight a
      // runtime reset — keep going.
      if (ok && before === after) {
        stuck += 1;
      } else {
        stuck = 0;
      }
      const elapsed = Date.now() - startedAt;
      if ((stuck >= 2 && elapsed >= MIN_STABLE_MS) || elapsed >= MAX_TOTAL_MS) return;
      timer = window.setTimeout(tick, 400);
    };
    timer = window.setTimeout(tick, 400);

    const schedule = () => {
      window.clearTimeout(timer);
      stuck = 0;
      timer = window.setTimeout(tick, 150);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    const canvas = appRef.current?.canvas;
    if (canvas) {
      ro.observe(canvas);
      if (canvas.parentElement) ro.observe(canvas.parentElement);
    }
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, [status]);

  const handleLoad = (splineApp) => {
    appRef.current = splineApp;
    try {
      // hide stray editor text tags (e.g. "Front"/"End")
      splineApp.getAllObjects().forEach((obj) => {
        const name = obj.name || "";
        if (HIDE_TEXT_NAMES.some((re) => re.test(name))) {
          try {
            obj.hide();
          } catch (err) {
            /* noop */
          }
        }
      });
    } catch (err) {
      /* noop */
    }
    try {
      // remove the Spline logo watermark overlay
      splineApp._renderer?.pipeline?.setWatermark?.(null);
    } catch (err) {
      /* noop */
    }
    try {
      // maximum sharpness — render at device's native pixel ratio
      const dpr = window.devicePixelRatio || 1;
      splineApp._renderer?.setPixelRatio?.(dpr);
    } catch (err) {
      /* noop */
    }
    try {
      if (splineApp._renderer) splineApp._renderer.toneMapping = 1;
    } catch (err) {
      /* noop */
    }
    try {
      // "transparent" → runtime's color parser sets RGBA(0,0,0,0) directly,
      // no THREE alpha warning, and the premium DOM backdrop shows through
      splineApp.setBackgroundColor("transparent");
    } catch (err) {
      /* noop */
    }
    try {
      // frame the robot inside the stage — pull the camera back (keeping its
      // authored angle) until the character's bounding box fills the stage
      frameRobotInStage(splineApp);
    } catch (err) {
      /* noop */
    }
    setStatus("ready");
  };

  const handleFail = () => setStatus("failed");

  if (!useSpline || status === "failed") {
    return <Student3D {...props} />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <BackdropLayers />
      <BrandLockup />
      <Suspense fallback={<LoadingShimmer />}>
        <div
          ref={innerRef}
          className="absolute inset-0 will-change-transform"
          style={{ transform: "translate3d(0px, 0px, 0px)" }}
        >
          {status === "loading" && <LoadingShimmer />}
          <SplineErrorBoundary
            fallback={<Student3D {...props} />}
            onFail={handleFail}
          >
            <Spline
              scene={SPLINE_SCENE_URL}
              onLoad={handleLoad}
              renderOnDemand={false}
              className="w-full h-full !block"
              style={{
                opacity: status === "ready" ? 1 : 0,
                transition: "opacity 600ms cubic-bezier(0.4,0,0.2,1)",
                width: "100% !important",
                height: "100% !important",
              }}
            />
          </SplineErrorBoundary>
        </div>
      </Suspense>
    </div>
  );
};

export default SplineStudent;
