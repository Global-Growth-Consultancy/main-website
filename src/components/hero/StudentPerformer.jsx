import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaUniversity, FaHandHoldingUsd, FaGlobeAsia, FaPassport,
  FaStar, FaStamp, FaAward, FaPlaneDeparture, FaTrophy,
} from "react-icons/fa";
import NexusField from "./NexusField";

gsap.registerPlugin(ScrollTrigger);

const Student3D = lazy(() => import("./SplineStudent"));

// ------------------------------------------------------------------
// StudentPerformer — a living marketing engine (stage + HUD).
//
// The stage runs a continuous 6-chapter cinematic loop that sells the
// company's business end-to-end:
//   Dream → Admission → Scholarship → Visa → Study Abroad → Career
//
// Each chapter drives:
//  • a live hologram speech line (typewriter)
//  • a signature stage effect (flying docs / APPROVED stamp / gold coin / rays)
//  • a chapter-reactive 3D scene (rendered by Student3D)
//  • a scene accent colour (HUD dots, badge, glow)
//
// The hero visual is a premium stylised 3D international student "Aarav"
// (Student3D, react-three-fiber): navy blazer, white shirt, backpack,
// passport in hand, floating laptop — blinking, breathing, cursor-tracked
// head/eyes, syllable-synced lipsync, chapter gestures and a success hop.
// Cinematic lighting, soft contact shadows and an additive halo glow keep
// the frame premium. DOM tweens are transform/opacity-only → 60 FPS; the
// WebGL canvas idles (frameloop "never") when scrolled out of view.
// ------------------------------------------------------------------

const STORY = [
  {
    label: "Dream",
    status: "Ignited",
    icon: FaStar,
    accent: "#38BDF8",
    gesture: 0,
    speech: "Hi, I'm Aarav. My dream was simple — study abroad at a top global university.",
  },
  {
    label: "Admission",
    status: "Approved",
    icon: FaStamp,
    accent: "#A78BFA",
    gesture: 1,
    speech: "GGC locked my admission at a top-ranked university — completely stress-free.",
  },
  {
    label: "Scholarship",
    status: "Awarded",
    icon: FaAward,
    accent: "#FBBF24",
    gesture: 2,
    speech: "They secured my scholarship too — tuition covered, no financial burden.",
  },
  {
    label: "Visa",
    status: "Stamped",
    icon: FaPassport,
    accent: "#34D399",
    gesture: 3,
    speech: "Visa approved! Passport stamped, and ready to fly to my dream campus.",
  },
  {
    label: "Study Abroad",
    status: "Enrolled",
    icon: FaPlaneDeparture,
    accent: "#F472B6",
    gesture: 4,
    speech: "From GGC's office to a world-class campus — my dream came to life.",
  },
  {
    label: "Career",
    status: "Achieved",
    icon: FaTrophy,
    accent: "#FBBF24",
    gesture: 4,
    speech: "Graduated with honors. Building a global career — and so can you.",
  },
];

const SCENE_SECONDS = 5.6;
const TALK_MS = 3400;

const CONFETTI_COLORS = ["#38BDF8", "#A78BFA", "#FBBF24", "#F472B6", "#34D399"];

// floating service chips orbiting the character
const ORBITS = [
  { icon: FaUniversity, label: "200+ Partner Colleges", pos: "right-1 sm:right-2 top-4 sm:top-6", accent: "#A78BFA" },
  { icon: FaPassport, label: "98% Visa Success", pos: "left-1 sm:left-2 top-8 sm:top-12", accent: "#34D399" },
  { icon: FaHandHoldingUsd, label: "0% BSCC Loan", pos: "right-1 sm:right-2 bottom-[30%]", accent: "#FBBF24" },
  { icon: FaGlobeAsia, label: "Study Abroad", pos: "left-1 sm:left-2 bottom-[28%]", accent: "#38BDF8" },
];

// education ecosystem network (viewBox 100x100)
const NET_NODES = [
  [18, 22], [84, 18], [14, 55], [88, 52], [50, 38], [24, 78], [76, 78],
];

const NET_LINES = [
  [0, 4], [1, 4], [2, 4], [3, 4], [5, 4], [6, 4],
  [0, 1], [0, 2], [1, 3], [2, 5], [3, 6], [5, 6],
];

// flying-document start positions (step 1 of the story)
const DOC_POS = [
  "left-6 top-[30%]", "left-12 top-[22%]", "left-4 top-[40%]",
];

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
};

const StudentPerformer = () => {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const svgWrapRef = useRef(null);
  const auraRef = useRef(null);
  const backGlowRef = useRef(null);
  const rayBurstRef = useRef(null);
  const sweepRef = useRef(null);
  const storyBadgeRef = useRef(null);
  const confettiRef = useRef(null);
  const stampRef = useRef(null);
  const coinRef = useRef(null);
  const ringRef = useRef(null);
  const orbitRefs = useRef([]);
  const orbitFloatRefs = useRef([]);
  const docRefs = useRef([]);
  const flashRef = useRef(null);
  const hoverRef = useRef(false);
  const reducedRef = useRef(false);
  const enteredRef = useRef(false);
  const pauseUntilRef = useRef(0);

  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [countdown, setCountdown] = useState(SCENE_SECONDS);
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  const { icon: SceneIcon, accent } = STORY[scene];

  // ---- reduced-motion detection (runs first) ----
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = m;
    setReduced(m);
  }, []);

  // ---- frameloop demand: idle the 3D canvas when scrolled out of view ----
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ---- confetti burst ----
  const spawnConfetti = (count = 18) => {
    const holder = confettiRef.current;
    if (!holder || reducedRef.current) return;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("div");
      const size = 3 + Math.random() * 5;
      const round = Math.random() < 0.4;
      const colors = [...CONFETTI_COLORS, "#ffffff"];
      el.style.cssText = `position:absolute;left:50%;top:52%;width:${size}px;height:${size * (round ? 1 : 1.8)}px;background:${colors[i % colors.length]};border-radius:${round ? "50%" : "2px"};pointer-events:none;opacity:0;will-change:transform;box-shadow:0 0 ${size}px ${colors[i % colors.length]}44;`;
      holder.appendChild(el);
      gsap.to(el, {
        x: (Math.random() - 0.5) * 300,
        y: -(40 + Math.random() * 150),
        rotation: (Math.random() - 0.5) * 620,
        opacity: 1,
        duration: 0.3 + Math.random() * 0.3,
        ease: "power2.out",
        onComplete: () => gsap.to(el, {
          y: 60 + Math.random() * 100,
          rotation: (Math.random() - 0.5) * 240,
          opacity: 0,
          duration: 0.7,
          ease: "power1.in",
          onComplete: () => el.remove(),
        }),
      });
    }
  };

  // ---- timed story rotation + countdown ----
  useEffect(() => {
    const id = setInterval(() => {
      if (hoverRef.current || Date.now() < pauseUntilRef.current) return;
      setCountdown((c) => {
        const next = +(c - 0.1).toFixed(1);
        if (next <= 0) {
          setScene((i) => (i + 1) % STORY.length);
          return SCENE_SECONDS;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  // ---- orbit chips + back glow cursor parallax (character parallax lives in Student3D) ----
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const glow = backGlowRef.current;
    const toGlow = glow ? gsap.quickTo(glow, "x", { duration: 0.7, ease: "power1.out" }) : null;

    const orbitMove = orbitRefs.current.map((el) =>
      el ? {
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power1.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power1.out" }),
      } : null
    );

    const onMove = (e) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      if (toGlow) toGlow(dx * -9);
      orbitMove.forEach((q, i) => {
        if (!q) return;
        const dir = i % 2 === 0 ? 1 : -1;
        q.x(dx * 6 * dir);
        q.y(dy * 4 * dir);
      });
    };
    const onLeave = () => {
      if (toGlow) toGlow(0);
      orbitMove.forEach((q) => {
        if (!q) return;
        q.x(0);
        q.y(0);
      });
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ---- hover reactions: light sweep + glow + rays (character reacts inside Student3D) ----
  useEffect(() => {
    if (reducedRef.current) return undefined;

    const rayTarget = scene >= 4 ? (scene === 5 ? 0.5 : 0.34) : 0;

    if (isHovered) {
      if (sweepRef.current) {
        gsap.fromTo(sweepRef.current, { x: 0, opacity: 0.5 }, { x: "360%", opacity: 0.9, duration: 0.95, ease: "power2.inOut" });
      }
      if (backGlowRef.current) {
        gsap.to(backGlowRef.current, { scale: 1.12, duration: 0.6, ease: "power2.out" });
      }
      if (rayBurstRef.current) {
        gsap.to(rayBurstRef.current, { opacity: Math.max(rayTarget, 0.3), duration: 0.6, ease: "power2.out" });
      }
    } else {
      if (sweepRef.current) {
        gsap.to(sweepRef.current, { x: 0, opacity: 0.5, duration: 0.5, ease: "power2.out" });
      }
      if (backGlowRef.current) {
        gsap.to(backGlowRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
      }
      if (rayBurstRef.current) {
        gsap.to(rayBurstRef.current, { opacity: rayTarget, duration: 0.5, ease: "power2.out" });
      }
    }
    return undefined;
  }, [isHovered, scene]);

  const handleClick = () => {
    if (reducedRef.current) return;
    spawnConfetti(26);
    setClicks((c) => c + 1);
  };

  // ---- chapter navigation (dots / keyboard) with a 10s rotation hold ----
  const jumpToScene = (i) => {
    pauseUntilRef.current = Date.now() + 10000;
    setScene(i);
    setCountdown(SCENE_SECONDS);
  };

  const onStageKeyDown = (e) => {
    if (e.key === "ArrowRight") jumpToScene((scene + 1) % STORY.length);
    else if (e.key === "ArrowLeft") jumpToScene((scene - 1 + STORY.length) % STORY.length);
    else return;
    e.preventDefault();
  };

  // ---- idle life: floating chrome + scroll lean (character life lives in Student3D) ----
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return undefined;

    const triggerEl = root.closest("section") || root;
    const lenis = window.__lenis;
    if (lenis) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // GPU hints for the floating chrome
      gsap.set([
        orbitFloatRefs.current, docRefs.current, stampRef.current, coinRef.current,
        sweepRef.current, rayBurstRef.current, backGlowRef.current, storyBadgeRef.current,
        svgWrapRef.current,
      ].flat().filter(Boolean), { willChange: "transform" });

      if (rayBurstRef.current) gsap.set(rayBurstRef.current, { yPercent: -50 });

      if (reducedRef.current) return;

      // staggered mount entrance for floating chips
      orbitRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 22, scale: 0.86 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, delay: 0.45 + i * 0.13, ease: "power3.out" }
        );
      });

      // aura + back glow breathe softly
      const aura = gsap.timeline({ repeat: -1, yoyo: true });
      aura.to(auraRef.current, { opacity: 0.6, duration: 2.6, ease: "sine.inOut" })
        .to(auraRef.current, { opacity: 0.3, duration: 2.8, ease: "sine.inOut" });
      const backGlow = gsap.timeline({ repeat: -1, yoyo: true });
      backGlow.to(backGlowRef.current, { opacity: 0.9, duration: 3, ease: "sine.inOut" })
        .to(backGlowRef.current, { opacity: 0.55, duration: 3.2, ease: "sine.inOut" });

      // success rays rotate slowly
      if (rayBurstRef.current) {
        gsap.to(rayBurstRef.current, { rotation: 360, duration: 55, repeat: -1, ease: "none" });
      }

      // orbit chips float lazily (outer wrapper — parallax lives on the inner layer)
      orbitFloatRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -6, duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.25,
        });
      });

      // gentle scroll parallax lean
      const tilt = gsap.quickTo(svgWrapRef.current, "rotation", { duration: 0.5, ease: "power1.out" });
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => tilt(self.progress * 1.6 - 0.8),
      });
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.lagSmoothing(0);
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  // ---- scene signature effects (docs / stamp / coin / rays / badge pop) ----
  useEffect(() => {
    const root = stageRef.current;
    if (!root) return undefined;
    const docs = docRefs.current.filter(Boolean);
    const stamp = stampRef.current;
    const coin = coinRef.current;
    const rays = rayBurstRef.current;
    const badge = storyBadgeRef.current;

    const ctx = gsap.context(() => {
      gsap.set(docs, { opacity: 0 });
      if (stamp) gsap.set(stamp, { opacity: 0, scale: 2.3 });
      if (coin) gsap.set(coin, { opacity: 0, scale: 0.4, y: 16 });
      if (badge) {
        gsap.fromTo(
          badge,
          { scale: 0.92, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }
        );
      }

      const rayTarget = scene >= 4 ? (scene === 5 ? 0.5 : 0.34) : 0;
      if (rays) gsap.to(rays, { opacity: rayTarget, duration: 0.8, ease: "power2.out" });

      if (reducedRef.current) return;

      // chapter transition glow flash
      if (flashRef.current) {
        gsap.fromTo(flashRef.current, { opacity: 0.9 }, { opacity: 0, duration: 1, ease: "power2.out" });
      }

      if (scene === 0) {
        docs.forEach((el, i) => {
          gsap.timeline({ repeat: 1, repeatDelay: 0.6, delay: i * 0.3 })
            .fromTo(
              el,
              { x: -140, y: 20 + i * 14, rotation: -16, opacity: 0 },
              { x: 120 + i * 22, y: -12 - i * 8, rotation: 8, opacity: 1, duration: 0.9, ease: "power3.out" }
            )
            .to(el, { x: 260 + i * 10, y: 6 + i * 10, rotation: 18, opacity: 0, duration: 0.8, ease: "power1.in" });
        });
      } else if (scene === 1) {
        if (stamp) {
          gsap.timeline()
            .fromTo(
              stamp,
              { opacity: 0, scale: 2.3, rotation: -8 },
              { opacity: 1, scale: 1, rotation: -12, duration: 0.26, ease: "power3.out" }
            )
            .to(stamp, { scale: 0.98, duration: 0.14, ease: "sine.out" })
            .to(stamp, { scale: 1, duration: 0.14, ease: "sine.inOut" })
            .to(stamp, { opacity: 0, scale: 1.08, duration: 0.45, ease: "power2.in", delay: 1.35 });
        }
      } else if (scene === 2) {
        if (coin) {
          gsap.timeline()
            .fromTo(
              coin,
              { opacity: 0, scale: 0.4, y: 16 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2)" }
            )
            .to(coin, { scale: 1.12, duration: 0.35, ease: "sine.inOut" }, 0.6)
            .to(coin, { scale: 1, duration: 0.35, ease: "sine.inOut" }, 0.95)
            .to(coin, { opacity: 0, y: -12, duration: 0.4, ease: "power1.in", delay: 1.5 });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [scene]);

  // ---- scene performance: typewriter + entrance + ring + confetti + life pop ----
  useEffect(() => {
    const full = STORY[scene].speech;
    setTyped("");
    setDone(false);
    setCountdown(SCENE_SECONDS);

    let i = 0;
    const typeId = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(typeId);
        setDone(true);
      }
    }, 26);

    if (reducedRef.current) {
      clearInterval(typeId);
      setTyped(full);
      setDone(true);
    }

    if (reducedRef.current || !svgWrapRef.current) {
      return () => clearInterval(typeId);
    }

    const ctx = gsap.context(() => {
      // ---- entrance (first time only) ----
      if (!enteredRef.current) {
        enteredRef.current = true;
        gsap.fromTo(
          svgWrapRef.current,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
        );
        spawnConfetti(14);
      }

      // ---- chapter pulse ring + confetti ----
      gsap.fromTo(
        ringRef.current,
        { width: 0, height: 0, opacity: 0.5 },
        { width: 380, height: 380, opacity: 0, duration: 1.1, ease: "power2.out" }
      );
      const burst = scene === 4 ? 18 : scene === 5 ? 24 : 0;
      spawnConfetti(burst);

      // ---- life pop ----
      gsap.fromTo(
        svgWrapRef.current,
        { scale: 1 },
        { scale: 1.012, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }, stageRef.current);

    return () => {
      clearInterval(typeId);
      ctx.revert();
    };
  }, [scene]);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => { hoverRef.current = true; setIsHovered(true); }}
      onMouseLeave={() => { hoverRef.current = false; setIsHovered(false); }}
      onClick={handleClick}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(180deg, rgba(14,20,38,0.85), rgba(8,12,22,0.92))",
        boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8), 0 0 60px -20px rgba(56,189,248,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Animated gradient border ring */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none z-30"
        style={{
          padding: "1px",
          background: "conic-gradient(from 0deg, rgba(56,189,248,0.4), rgba(167,139,250,0.3), rgba(251,191,36,0.3), rgba(56,189,248,0.4))",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          animation: "spin 8s linear infinite",
          filter: "blur(1px)",
        }}
      />
      {/* Inner glow overlay on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(56,189,248,0.06), transparent 60%)",
        }}
      />
      {/* Top hairline */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent z-30 pointer-events-none" />

      {/* ---- Mission-control HUD: story speech + scene dots ---- */}
      <div className="relative z-30 px-4 sm:px-5 py-3 border-b border-white/[0.04] backdrop-blur-xl"
        style={{
          background: "linear-gradient(180deg, rgba(10,15,28,0.7), rgba(8,12,22,0.85))",
        }}
      >
        <div className="flex items-center gap-3 min-h-[42px]">
          <div className="flex flex-col items-center shrink-0 rounded-xl border border-brand-500/25 bg-brand-500/8 px-2.5 py-1.5 min-w-[56px]"
            style={{ boxShadow: "0 0 16px rgba(56,189,248,0.1)" }}
          >
            <span className="font-mono text-[12px] font-bold text-brand-300 tabular-nums leading-none">
              {formatTime(countdown)}
            </span>
            <span className="text-[9px] text-neutral-500 mt-1 leading-none">
              {scene + 1} / {STORY.length}
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={scene}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="text-[11px] sm:text-sm leading-snug text-neutral-200 font-medium min-h-[42px] flex items-center"
              >
                <span className="relative flex h-2 w-2 mr-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success-400" />
                </span>
                <span>{typed}</span>
                {!done && <span className="caret ml-0.5 inline-block w-[2px] h-3.5 bg-brand-400" />}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        {/* scene dots (clickable chapter jump + 10s rotation hold) */}
        <div className="flex items-center gap-1.5 mt-2.5" role="tablist" aria-label="Story chapters">
          {STORY.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === scene}
              aria-label={`${s.label}: ${s.status}`}
              tabIndex={i === scene ? 0 : -1}
              onClick={() => jumpToScene(i)}
              className="h-1 rounded-full transition-all duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 hover:opacity-80"
              style={{
                background: i === scene ? s.accent : "rgba(255,255,255,0.06)",
                width: i === scene ? undefined : "0.5rem",
                flex: i === scene ? 1 : undefined,
                boxShadow: i === scene ? `0 0 10px ${s.accent}55` : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* ---- Stage: cinematic marketing world ---- */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label="Hero story stage — press arrow keys to switch chapters"
        onFocus={() => { pauseUntilRef.current = Date.now() + 10000; }}
        onKeyDown={onStageKeyDown}
        className="relative h-[340px] sm:h-[440px] md:h-[500px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 rounded-b-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(10,16,30,0.3) 0%, rgba(6,10,20,0.6) 100%)",
        }}
      >
        {/* particle field — enhanced visibility so the abstract 3D reads as hero focal point */}
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
          <NexusField />
        </div>

        {/* education ecosystem network — enhanced visibility */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.5)" />
              <stop offset="50%" stopColor="rgba(167,139,250,0.4)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0.3)" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#netGrad)" strokeWidth="0.6">
            {NET_LINES.map(([a, b], i) => (
              <path
                key={i}
                className="net-line"
                d={`M${NET_NODES[a][0]} ${NET_NODES[a][1]} L${NET_NODES[b][0]} ${NET_NODES[b][1]}`}
              />
            ))}
          </g>
          <g fill="rgba(56,189,248,0.65)">
            {NET_NODES.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.4} />
            ))}
          </g>
        </svg>

        {/* success rays (graduation + success chapters) */}
        <div
          ref={rayBurstRef}
          className="absolute inset-x-0 mx-auto top-[45%] w-[140%] aspect-square opacity-0 pointer-events-none z-0"
          style={{
            background: "repeating-conic-gradient(rgba(251,191,36,0.08) 0deg 6deg, transparent 6deg 22deg)",
            WebkitMaskImage: "radial-gradient(circle, black 6%, transparent 60%)",
            maskImage: "radial-gradient(circle, black 6%, transparent 60%)",
          }}
        />

        {/* chapter-reactive back glow */}
        <div
          ref={backGlowRef}
          className="absolute inset-x-0 mx-auto bottom-0 w-[90%] h-[80%] pointer-events-none z-0 transition-[background] duration-700"
          style={{
            background: `radial-gradient(ellipse at center bottom, ${accent}40, rgba(167,139,250,0.08) 45%, transparent 72%)`,
            filter: "blur(12px)",
          }}
        />

        {/* cinematic vignette — draws eye to portrait character, softer center */}
        <div
          className="absolute inset-0 pointer-events-none z-[6]"
          style={{
            background: "radial-gradient(ellipse 80% 75% at 50% 48%, transparent 40%, rgba(6,10,20,0.65) 100%)",
          }}
        />

        {/* light sweep (hover) */}
        <div
          ref={sweepRef}
          className="absolute -left-[70%] inset-y-0 w-[55%] z-[5] pointer-events-none opacity-60"
          style={{
            background: "linear-gradient(105deg, transparent 0%, rgba(56,189,248,0.04) 40%, rgba(167,139,250,0.08) 52%, rgba(251,191,36,0.04) 60%, transparent 100%)",
            transform: "skewX(-14deg)",
          }}
        />

        {/* floating service chips — premium glass */}
        {ORBITS.map((o, i) => (
          <div
            key={o.label}
            ref={(el) => { orbitFloatRefs.current[i] = el; }}
            className={`absolute z-10 pointer-events-none ${o.pos}`}
          >
            <div ref={(el) => { orbitRefs.current[i] = el; }}>
              <div
                className="relative rounded-xl p-px"
                style={{
                  background: `linear-gradient(135deg, ${o.accent}65, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.04))`,
                  boxShadow: `0 20px 50px -18px ${o.accent}50, 0 8px 24px -12px rgba(0,0,0,0.75)`,
                }}
              >
                <div
                  className="rounded-[11px] px-2.5 py-1.5 flex items-center gap-1.5"
                  style={{
                    background: "linear-gradient(180deg, rgba(12,18,32,0.82), rgba(6,10,18,0.90))",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)",
                  }}
                >
                  <o.icon className="text-[13px]" style={{ color: o.accent, filter: `drop-shadow(0 0 8px ${o.accent}90)` }} />
                  <span className="text-[9px] font-semibold text-neutral-200 whitespace-nowrap">{o.label}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* flying documents — step 1 */}
        {DOC_POS.map((pos, i) => (
          <div
            key={i}
            ref={(el) => { docRefs.current[i] = el; }}
            className={`absolute z-20 pointer-events-none opacity-0 ${pos}`}
          >
            <div className="w-12 h-15 rounded-lg bg-gradient-to-br from-white to-slate-100 border border-white/60 shadow-xl shadow-black/50 rotate-6"
              style={{ boxShadow: "0 8px 24px -6px rgba(56,189,248,0.25), 0 4px 12px -4px rgba(0,0,0,0.5)" }}
            >
              <div className="mt-2.5 px-2 space-y-1">
                <div className="h-1 rounded bg-brand-400/80 w-6" />
                <div className="h-1 rounded bg-slate-300 w-7" />
                <div className="h-1 rounded bg-slate-300 w-5" />
                <div className="h-1 rounded bg-emerald-400/70 w-6 mt-2" />
              </div>
            </div>
          </div>
        ))}

        {/* admission approval stamp — step 2 */}
        <div ref={stampRef} className="absolute z-20 pointer-events-none opacity-0 right-3 sm:right-5 top-[34%]">
          <div
            className="px-4 py-2.5 rounded-xl border-[3px] font-display font-black tracking-[0.18em] text-sm rotate-[-12deg]"
            style={{
              borderColor: "rgba(52,211,153,0.9)",
              color: "#34D399",
              background: "linear-gradient(180deg, rgba(6,18,24,0.75), rgba(4,12,18,0.88))",
              backdropFilter: "blur(14px)",
              boxShadow: "0 0 50px rgba(52,211,153,0.45), 0 0 20px rgba(52,211,153,0.25), inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            APPROVED
          </div>
        </div>

        {/* scholarship gold coin — step 3 */}
        <div ref={coinRef} className="absolute z-20 pointer-events-none opacity-0 right-4 sm:right-7 top-[22%]">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black text-emerald-950 border border-yellow-200/70"
            style={{
              background: "radial-gradient(circle at 35% 30%, #FDE68A, #D97706 55%, #92400E)",
              boxShadow: "0 0 44px rgba(251,191,36,0.65), 0 0 18px rgba(251,191,36,0.35), inset 0 2px 4px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.35)",
            }}
          >
            ₹
          </div>
        </div>

        {/* story badge — live chapter widget */}
        <div ref={storyBadgeRef} className="absolute left-2 sm:left-3 top-3 sm:top-4 z-20 pointer-events-none">
          <div
            className="relative rounded-2xl p-px"
            style={{
              background: `linear-gradient(135deg, ${accent}80, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.04))`,
              boxShadow: `0 20px 50px -16px ${accent}55, 0 0 20px -8px ${accent}33`,
            }}
          >
            <div
              className="rounded-[15px] px-2.5 py-2 flex items-center gap-2"
              style={{
                background: "linear-gradient(180deg, rgba(12,18,32,0.78), rgba(6,10,18,0.90))",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)",
              }}
            >
              <span
                key={scene}
                className="story-pop relative w-7 h-7 shrink-0 rounded-lg flex items-center justify-center leading-none"
                style={{
                  background: `linear-gradient(160deg, ${accent}2e, ${accent}14)`,
                  color: accent,
                  boxShadow: `inset 0 0 0 1px ${accent}33, 0 0 14px ${accent}44`,
                }}
              >
                <SceneIcon className="text-[13px] block" />
              </span>
              <span className="leading-tight">
                <span className="block text-[8px] uppercase tracking-[0.18em] text-neutral-500">{STORY[scene].label}</span>
                <span className="block text-[11px] font-bold text-white">Step {scene + 1} · {STORY[scene].status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* confetti layer */}
        <div ref={confettiRef} className="absolute inset-0 z-20 overflow-hidden pointer-events-none" />

        {/* chapter pulse ring */}
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full border-2 border-brand-400/40 opacity-0 pointer-events-none"
        />

        {/* chapter transition glow flash (GSAP pulse) */}
        <div
          ref={flashRef}
          className="absolute inset-0 pointer-events-none z-[4] opacity-0"
          style={{ background: "radial-gradient(circle at 50% 52%, rgba(255,255,255,0.18), transparent 50%)" }}
        />

        {/* character aura — synced to chapter accent */}
        <div
          ref={auraRef}
          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%] pointer-events-none z-[4] transition-[background] duration-700"
          style={{ background: `radial-gradient(ellipse at center, ${accent}35, transparent 70%)` }}
        />

        {/* character — premium 3D portrait graduate */}
        <div
          ref={svgWrapRef}
          className="absolute inset-0 flex items-center justify-center z-10 px-2 pt-2"
        >
          <Suspense fallback={null}>
            <Student3D
              isHovered={isHovered}
              scene={scene}
              gesture={STORY[scene].gesture}
              speech={STORY[scene].speech}
              clicks={clicks}
              talkMs={TALK_MS}
              reducedMotion={reduced}
              visible={onScreen}
              accent={accent}
            />
          </Suspense>
        </div>

        {/* scene progress */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.04] z-30">
          <div
            key={scene}
            className="quote-progress h-full rounded-full"
            style={{
              "--quote-duration": `${SCENE_SECONDS}s`,
              background: `linear-gradient(90deg, ${accent}, ${accent}cc, ${accent}66)`,
              boxShadow: `0 0 12px ${accent}66, 0 0 4px ${accent}44`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPerformer;
