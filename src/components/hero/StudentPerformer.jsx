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

const Student3D = lazy(() => import("./Student3D"));

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
  { icon: FaUniversity, label: "200+ Partner Colleges", pos: "right-2 top-6", accent: "#A78BFA" },
  { icon: FaPassport, label: "98% Visa Success", pos: "left-2 top-10", accent: "#34D399" },
  { icon: FaHandHoldingUsd, label: "0% BSCC Loan", pos: "right-2 top-[42%]", accent: "#FBBF24" },
  { icon: FaGlobeAsia, label: "Study Abroad", pos: "left-2 bottom-14", accent: "#38BDF8" },
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
      const size = 3 + Math.random() * 4;
      const round = Math.random() < 0.5;
      el.style.cssText = `position:absolute;left:50%;top:56%;width:${size}px;height:${size * (round ? 1 : 1.7)}px;background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};border-radius:${round ? "50%" : "2px"};pointer-events:none;opacity:0;will-change:transform;`;
      holder.appendChild(el);
      gsap.to(el, {
        x: (Math.random() - 0.5) * 260,
        y: -(30 + Math.random() * 130),
        rotation: (Math.random() - 0.5) * 560,
        opacity: 1,
        duration: 0.35 + Math.random() * 0.3,
        ease: "power2.out",
        onComplete: () => gsap.to(el, {
          y: 50 + Math.random() * 90,
          rotation: (Math.random() - 0.5) * 220,
          opacity: 0,
          duration: 0.6,
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
      className="group relative rounded-3xl border border-white/[0.12] bg-gradient-to-b from-premium-charcoal/70 to-premium-dark/80 backdrop-blur-md shadow-2xl shadow-black/60 overflow-hidden cursor-pointer"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent z-30 pointer-events-none" />

      {/* ---- Mission-control HUD: story speech + scene dots ---- */}
      <div className="relative z-30 px-4 sm:px-5 py-3 border-b border-white/5 bg-premium-dark/60">
        <div className="flex items-center gap-3 min-h-[40px]">
          <div className="flex flex-col items-center shrink-0 rounded-xl border border-brand-500/30 bg-brand-500/10 px-2 py-1.5 min-w-[54px]">
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
                className="text-[11px] sm:text-sm leading-snug text-neutral-200 font-medium min-h-[40px] flex items-center"
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
        <div className="flex items-center gap-1.5 mt-2" role="tablist" aria-label="Story chapters">
          {STORY.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === scene}
              aria-label={`${s.label}: ${s.status}`}
              tabIndex={i === scene ? 0 : -1}
              onClick={() => jumpToScene(i)}
              className="h-1 rounded-full transition-all duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70"
              style={{
                background: i === scene ? s.accent : "rgba(255,255,255,0.08)",
                width: i === scene ? undefined : "0.5rem",
                flex: i === scene ? 1 : undefined,
                boxShadow: i === scene ? `0 0 8px ${s.accent}66` : undefined,
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
        className="relative h-[300px] sm:h-[390px] md:h-[450px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 rounded-2xl"
      >
        {/* particle field — subdued so the abstract 3D reads as hero focal point */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <NexusField />
        </div>

        {/* education ecosystem network */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="0.5">
            {NET_LINES.map(([a, b], i) => (
              <path
                key={i}
                className="net-line"
                d={`M${NET_NODES[a][0]} ${NET_NODES[a][1]} L${NET_NODES[b][0]} ${NET_NODES[b][1]}`}
              />
            ))}
          </g>
          <g fill="rgba(56,189,248,0.5)">
            {NET_NODES.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.1} />
            ))}
          </g>
        </svg>

        {/* success rays (graduation + success chapters) */}
        <div
          ref={rayBurstRef}
          className="absolute inset-x-0 mx-auto top-1/2 w-[135%] aspect-square opacity-0 pointer-events-none z-0"
          style={{
            background: "repeating-conic-gradient(rgba(251,191,36,0.10) 0deg 7deg, transparent 7deg 23deg)",
            WebkitMaskImage: "radial-gradient(circle, black 8%, transparent 66%)",
            maskImage: "radial-gradient(circle, black 8%, transparent 66%)",
          }}
        />

        {/* chapter-reactive back glow */}
        <div
          ref={backGlowRef}
          className="absolute inset-x-0 mx-auto bottom-0 w-[85%] h-[68%] pointer-events-none z-0 transition-[background] duration-700"
          style={{
            background: `radial-gradient(ellipse at center bottom, ${accent}33, rgba(167,139,250,0.06) 42%, transparent 70%)`,
            filter: "blur(10px)",
          }}
        />

        {/* cinematic vignette — draws eye to portrait character */}
        <div
          className="absolute inset-0 pointer-events-none z-[6]"
          style={{
            background: "radial-gradient(ellipse 72% 68% at 50% 58%, transparent 35%, rgba(6,10,20,0.55) 100%)",
          }}
        />

        {/* light sweep (hover) */}
        <div
          ref={sweepRef}
          className="absolute -left-[70%] inset-y-0 w-[60%] z-[5] pointer-events-none opacity-70"
          style={{
            background: "linear-gradient(105deg, transparent 0%, rgba(56,189,248,0.05) 45%, rgba(167,139,250,0.09) 55%, transparent 100%)",
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
                  background: `linear-gradient(135deg, ${o.accent}59, rgba(255,255,255,0.10) 42%, rgba(255,255,255,0.03))`,
                  boxShadow: `0 18px 44px -18px ${o.accent}55, 0 8px 22px -12px rgba(0,0,0,0.7)`,
                }}
              >
                <div
                  className="rounded-[11px] px-2.5 py-1.5 flex items-center gap-1.5"
                  style={{
                    background: "linear-gradient(180deg, rgba(14,20,38,0.78), rgba(8,12,22,0.86))",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <o.icon className="text-[13px]" style={{ color: o.accent, filter: `drop-shadow(0 0 6px ${o.accent}88)` }} />
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
            <div className="w-11 h-14 rounded-md bg-gradient-to-br from-white to-slate-200 border border-white/50 shadow-lg shadow-black/40 rotate-6">
              <div className="mt-2 px-2 space-y-1">
                <div className="h-1 rounded bg-brand-400/70 w-6" />
                <div className="h-1 rounded bg-slate-300 w-7" />
                <div className="h-1 rounded bg-slate-300 w-5" />
                <div className="h-1 rounded bg-emerald-400/60 w-6 mt-2" />
              </div>
            </div>
          </div>
        ))}

        {/* admission approval stamp — step 2 */}
        <div ref={stampRef} className="absolute z-20 pointer-events-none opacity-0 right-4 top-[36%]">
          <div
            className="px-3.5 py-2 rounded-xl border-[3px] font-display font-black tracking-[0.18em] text-sm rotate-[-12deg]"
            style={{
              borderColor: "rgba(52,211,153,0.85)",
              color: "#34D399",
              background: "linear-gradient(180deg, rgba(6,20,26,0.7), rgba(4,14,20,0.85))",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 40px rgba(52,211,153,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            APPROVED
          </div>
        </div>

        {/* scholarship gold coin — step 3 */}
        <div ref={coinRef} className="absolute z-20 pointer-events-none opacity-0 right-6 top-[24%]">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-emerald-950 border border-yellow-200/70"
            style={{
              background: "radial-gradient(circle at 35% 30%, #FDE68A, #D97706 58%, #92400E)",
              boxShadow: "0 0 34px rgba(251,191,36,0.6), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.35)",
            }}
          >
            ₹
          </div>
        </div>

        {/* story badge — live chapter widget */}
        <div ref={storyBadgeRef} className="absolute left-3 top-4 z-20 pointer-events-none">
          <div
            className="relative rounded-2xl p-px"
            style={{
              background: `linear-gradient(135deg, ${accent}77, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.03))`,
              boxShadow: `0 18px 44px -16px ${accent}66`,
            }}
          >
            <div
              className="rounded-[15px] px-2.5 py-2 flex items-center gap-2"
              style={{
                background: "linear-gradient(180deg, rgba(14,20,38,0.74), rgba(8,12,22,0.88))",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <span
                key={scene}
                className="story-pop relative w-7 h-7 shrink-0 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(160deg, ${accent}2e, ${accent}14)`,
                  color: accent,
                  boxShadow: `inset 0 0 0 1px ${accent}33, 0 0 14px ${accent}44`,
                }}
              >
                <SceneIcon className="text-[13px]" />
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
          style={{ background: "radial-gradient(circle at 50% 55%, rgba(255,255,255,0.14), transparent 55%)" }}
        />

        {/* character aura — synced to chapter accent */}
        <div
          ref={auraRef}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[75%] h-[58%] pointer-events-none z-[4] transition-[background] duration-700"
          style={{ background: `radial-gradient(ellipse at center bottom, ${accent}28, transparent 68%)` }}
        />

        {/* character — premium 3D portrait graduate */}
        <div
          ref={svgWrapRef}
          className="absolute inset-0 flex items-end justify-center pb-0 z-10"
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
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
          <div
            key={scene}
            className="quote-progress h-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300"
            style={{ "--quote-duration": `${SCENE_SECONDS}s` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPerformer;
