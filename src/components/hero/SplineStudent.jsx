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

const LoadingShimmer = () => (
  <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-[5]">
    <div className="w-4/5 h-4/5 max-w-[340px] rounded-t-full rounded-b-2xl bg-gradient-to-b from-brand-400/15 via-brand-400/5 to-transparent animate-pulse blur-sm" />
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
      el.style.transform = `translate3d(${x * PARALLAX}px, ${
        y * PARALLAX * 0.7
      }px, 0)`;
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
