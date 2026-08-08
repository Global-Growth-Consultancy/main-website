import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

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
const BackdropLayers = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {/* cinematic aurora core */}
    <div
      className="absolute left-1/2 bottom-[-10%] -translate-x-1/2 w-[130%] h-[70%] opacity-60"
      style={{
        background:
          "radial-gradient(ellipse at 50% 75%, rgba(56,189,248,0.28), rgba(167,139,250,0.10) 45%, transparent 70%)",
        filter: "blur(18px)",
      }}
    />
    {/* gold ember under-foot glow */}
    <div
      className="absolute left-1/2 bottom-[-4%] -translate-x-1/2 w-[70%] h-[40%] opacity-50"
      style={{
        background:
          "radial-gradient(ellipse at 50% 90%, rgba(251,191,36,0.20), transparent 65%)",
        filter: "blur(14px)",
      }}
    />
    {/* fine tech grid floor */}
    <div
      className="absolute inset-x-[-20%] bottom-[-6%] h-[42%] opacity-[0.14]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(125,211,252,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.4) 1px, transparent 1px)",
        backgroundSize: "34px 34px",
        maskImage: "linear-gradient(to top, black, transparent 85%)",
        WebkitMaskImage: "linear-gradient(to top, black, transparent 85%)",
        transform: "perspective(420px) rotateX(58deg)",
      }}
    />
    {/* vignette for depth */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 120% 100% at 50% 40%, transparent 55%, rgba(2,6,23,0.55) 100%)",
      }}
    />
  </div>
);

// Floating brand lockup — "Global & Growth Consultancy".
const BrandLockup = () => (
  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[20] pointer-events-none select-none">
    <div className="glass rounded-2xl border border-white/10 px-5 py-2 backdrop-blur-md shadow-soft text-center">
      <p className="font-display font-bold text-sm sm:text-base leading-none tracking-wide bg-gradient-to-r from-brand-300 via-white to-brand-300 bg-clip-text text-transparent">
        Global &amp; Growth
      </p>
      <p className="mt-1 text-[9px] sm:text-[10px] font-mono tracking-[0.45em] text-neutral-400 uppercase">
        Consultancy
      </p>
    </div>
  </div>
);

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
    const handler = (e) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      // round to whole pixels — fractional translate3d causes subpixel
      // blur on the 3D canvas
      const dx = Math.round(x * PARALLAX);
      const dy = Math.round(y * PARALLAX * 0.7);
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };
    const reset = () => {
      el.style.transform = "translate3d(0px, 0px, 0px)";
    };
    window.addEventListener("mousemove", handler);
    window.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseleave", reset);
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
      // sharper render — supersample at 2x (renderer is built with
      // antialias:false, so raising the pixel ratio gives crisp edges)
      const dpr = Math.min(2, Math.max(2, window.devicePixelRatio || 1));
      splineApp._renderer?.setPixelRatio?.(dpr);
    } catch (err) {
      /* noop */
    }
    try {
      // "transparent" → runtime's color parser sets RGBA(0,0,0,0) directly,
      // no THREE alpha warning, and the premium DOM backdrop shows through
      splineApp.setBackgroundColor("transparent");
      splineApp.setZoom(1.02);
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
    <div className="absolute inset-0 flex items-end justify-center">
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
              className="w-full h-full"
              style={{
                opacity: status === "ready" ? 1 : 0,
                transition: "opacity 900ms ease",
              }}
            />
          </SplineErrorBoundary>
        </div>
      </Suspense>
    </div>
  );
};

export default SplineStudent;
