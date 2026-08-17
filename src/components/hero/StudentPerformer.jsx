import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaUniversity, FaHandHoldingUsd, FaGlobeAsia, FaPassport,
  FaStar, FaStamp, FaAward, FaPlaneDeparture, FaTrophy,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const Student3D = lazy(() => import("./SplineStudent"));

const STORY = [
  { label: "Dream", status: "Ignited", icon: FaStar, accent: "#38BDF8", gesture: 0, speech: "Hi, I'm Aarav. My dream was simple — study abroad at a top global university." },
  { label: "Admission", status: "Approved", icon: FaStamp, accent: "#A78BFA", gesture: 1, speech: "GGC locked my admission at a top-ranked university — completely stress-free." },
  { label: "Scholarship", status: "Awarded", icon: FaAward, accent: "#FBBF24", gesture: 2, speech: "They secured my scholarship too — tuition covered, no financial burden." },
  { label: "Visa", status: "Stamped", icon: FaPassport, accent: "#34D399", gesture: 3, speech: "Visa approved! Passport stamped, and ready to fly to my dream campus." },
  { label: "Study Abroad", status: "Enrolled", icon: FaPlaneDeparture, accent: "#F472B6", gesture: 4, speech: "From GGC's office to a world-class campus — my dream came to life." },
  { label: "Career", status: "Achieved", icon: FaTrophy, accent: "#FBBF24", gesture: 4, speech: "Graduated with honors. Building a global career — and so can you." },
];

const SCENE_SECONDS = 5.6;
const TALK_MS = 3400;

const CONFETTI_COLORS = ["#38BDF8", "#A78BFA", "#FBBF24", "#F472B6", "#34D399"];

const ORBITS = [
  { icon: FaUniversity, label: "200+ Colleges", pos: "right-2 sm:right-3 top-3 sm:top-5", accent: "#A78BFA" },
  { icon: FaPassport, label: "98% Visa", pos: "left-2 sm:left-3 top-6 sm:top-10", accent: "#34D399" },
  { icon: FaHandHoldingUsd, label: "BSCC Loan", pos: "right-2 sm:right-3 bottom-[32%]", accent: "#FBBF24" },
  { icon: FaGlobeAsia, label: "Study Abroad", pos: "left-2 sm:left-3 bottom-[30%]", accent: "#38BDF8" },
];

const DOC_POS = ["left-6 top-[30%]", "left-12 top-[22%]", "left-4 top-[40%]"];

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
};

const StudentPerformer = () => {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const svgWrapRef = useRef(null);
  const storyBadgeRef = useRef(null);
  const confettiRef = useRef(null);
  const stampRef = useRef(null);
  const coinRef = useRef(null);
  const ringRef = useRef(null);
  const docRefs = useRef([]);
  const flashRef = useRef(null);
  const hoverRef = useRef(false);
  const reducedRef = useRef(false);
  const enteredRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const orbitRefs = useRef([]);
  const orbitFloatRefs = useRef([]);

  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [countdown, setCountdown] = useState(SCENE_SECONDS);
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  const { icon: SceneIcon, accent } = STORY[scene];

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = m;
    setReduced(m);
  }, []);

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

  const spawnConfetti = (count = 18) => {
    const holder = confettiRef.current;
    if (!holder || reducedRef.current) return;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("div");
      const size = 3 + Math.random() * 5;
      const round = Math.random() < 0.4;
      const colors = [...CONFETTI_COLORS, "#ffffff"];
      el.style.cssText = `position:absolute;left:50%;top:52%;width:${size}px;height:${size * (round ? 1 : 1.8)}px;background:${colors[i % colors.length]};border-radius:${round ? "50%" : "2px"};pointer-events:none;opacity:0;will-change:transform;`;
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

  useEffect(() => {
    if (!onScreen) return;
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
  }, [onScreen]);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

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
      orbitMove.forEach((q, i) => {
        if (!q) return;
        const dir = i % 2 === 0 ? 1 : -1;
        q.x(dx * 5 * dir);
        q.y(dy * 3 * dir);
      });
    };
    const onLeave = () => {
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

  useEffect(() => {
    if (reducedRef.current) return undefined;
    if (!isHovered && storyBadgeRef.current) {
      gsap.to(storyBadgeRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    }
    return undefined;
  }, [isHovered]);

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

  const handleClick = () => {
    if (reducedRef.current) return;
    spawnConfetti(26);
    setClicks((c) => c + 1);
  };

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return undefined;

    const triggerEl = root.closest("section") || root;
    const lenis = window.__lenis;
    if (lenis) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.set(
        [orbitFloatRefs.current, storyBadgeRef.current, svgWrapRef.current]
          .flat().filter(Boolean),
        { willChange: "transform" }
      );

      if (reducedRef.current) return;

      orbitRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 18, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.5 + i * 0.12, ease: "power3.out" }
        );
      });

      orbitFloatRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -5, duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.25,
        });
      });

      const tilt = gsap.quickTo(svgWrapRef.current, "rotation", { duration: 0.5, ease: "power1.out" });
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => tilt(self.progress * 1.2 - 0.6),
      });
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.lagSmoothing(0);
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  useEffect(() => {
    const root = stageRef.current;
    if (!root) return undefined;
    const docs = docRefs.current.filter(Boolean);
    const stamp = stampRef.current;
    const coin = coinRef.current;
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

      if (reducedRef.current) return;

      if (flashRef.current) {
        gsap.fromTo(flashRef.current, { opacity: 0.6 }, { opacity: 0, duration: 0.8, ease: "power2.out" });
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
            .fromTo(stamp, { opacity: 0, scale: 2.3, rotation: -8 },
              { opacity: 1, scale: 1, rotation: -12, duration: 0.26, ease: "power3.out" })
            .to(stamp, { scale: 0.98, duration: 0.14, ease: "sine.out" })
            .to(stamp, { scale: 1, duration: 0.14, ease: "sine.inOut" })
            .to(stamp, { opacity: 0, scale: 1.08, duration: 0.45, ease: "power2.in", delay: 1.35 });
        }
      } else if (scene === 2) {
        if (coin) {
          gsap.timeline()
            .fromTo(coin, { opacity: 0, scale: 0.4, y: 16 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2)" })
            .to(coin, { scale: 1.12, duration: 0.35, ease: "sine.inOut" }, 0.6)
            .to(coin, { scale: 1, duration: 0.35, ease: "sine.inOut" }, 0.95)
            .to(coin, { opacity: 0, y: -12, duration: 0.4, ease: "power1.in", delay: 1.5 });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [scene]);

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
      if (!enteredRef.current) {
        enteredRef.current = true;
        gsap.fromTo(svgWrapRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
        spawnConfetti(14);
      }

      gsap.fromTo(ringRef.current,
        { width: 0, height: 0, opacity: 0.5 },
        { width: 380, height: 380, opacity: 0, duration: 1.1, ease: "power2.out" }
      );
      const burst = scene === 4 ? 18 : scene === 5 ? 24 : 0;
      spawnConfetti(burst);

      gsap.fromTo(svgWrapRef.current, { scale: 1 },
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
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(180deg, rgba(10,16,32,0.92), rgba(6,10,20,0.96))",
        boxShadow: "0 40px 80px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* subtle top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-30 pointer-events-none" />

      {/* ---- HUD ---- */}
      <div className="relative z-30 px-4 sm:px-5 py-3 border-b border-white/[0.04]"
        style={{
          background: "linear-gradient(180deg, rgba(10,15,28,0.6), rgba(6,10,20,0.7))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3 min-h-[42px]">
          <div className="flex flex-col items-center shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 min-w-[52px]">
            <span className="font-mono text-[12px] font-bold text-white/80 tabular-nums leading-none">
              {formatTime(countdown)}
            </span>
            <span className="text-[9px] text-white/30 mt-1 leading-none">
              {scene + 1} / {STORY.length}
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={scene}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-[11px] sm:text-sm leading-snug text-white/80 font-medium min-h-[42px] flex items-center"
              >
                <span className="relative flex h-1.5 w-1.5 mr-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: accent, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: accent }} />
                </span>
                <span>{typed}</span>
                {!done && <span className="ml-0.5 inline-block w-[2px] h-3.5 bg-white/50" />}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        {/* chapter dots */}
        <div className="flex items-center gap-1.5 mt-2.5" role="tablist" aria-label="Story chapters">
          {STORY.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === scene}
              aria-label={`${s.label}: ${s.status}`}
              tabIndex={i === scene ? 0 : -1}
              onClick={(e) => { e.stopPropagation(); jumpToScene(i); }}
              className="h-[3px] rounded-full transition-all duration-500 cursor-pointer focus-visible:outline-none"
              style={{
                background: i === scene ? s.accent : "rgba(255,255,255,0.08)",
                width: i === scene ? undefined : "0.45rem",
                flex: i === scene ? 1 : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* ---- Stage ---- */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label="Hero story stage"
        onFocus={() => { pauseUntilRef.current = Date.now() + 10000; }}
        onKeyDown={onStageKeyDown}
        className="relative h-[250px] sm:h-[400px] md:h-[480px] focus-visible:outline-none rounded-b-2xl overflow-hidden"
      >
        {/* clean dark background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,12,24,0.4) 0%, rgba(4,6,14,0.7) 100%)" }} />

        {/* vignette */}
        <div className="absolute inset-0 pointer-events-none z-[6]"
          style={{ background: "radial-gradient(ellipse 90% 85% at 50% 46%, transparent 55%, rgba(4,6,14,0.5) 100%)" }}
        />

        {/* floating chips */}
        {ORBITS.map((o, i) => (
          <div
            key={o.label}
            ref={(el) => { orbitFloatRefs.current[i] = el; }}
            className={`absolute z-10 pointer-events-none ${o.pos}`}
          >
            <div ref={(el) => { orbitRefs.current[i] = el; }}>
              <div
                className="rounded-lg px-2 py-1 flex items-center gap-1.5"
                style={{
                  background: "rgba(12,18,32,0.7)",
                  border: `1px solid ${o.accent}22`,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <o.icon className="text-[10px]" style={{ color: o.accent }} />
                <span className="text-[8px] font-semibold text-white/60 whitespace-nowrap">{o.label}</span>
              </div>
            </div>
          </div>
        ))}

        {/* flying documents */}
        {DOC_POS.map((pos, i) => (
          <div
            key={i}
            ref={(el) => { docRefs.current[i] = el; }}
            className={`absolute z-20 pointer-events-none opacity-0 ${pos}`}
          >
            <div className="w-12 h-15 rounded-lg bg-gradient-to-br from-white to-slate-100 border border-white/60 shadow-xl rotate-6">
              <div className="mt-2.5 px-2 space-y-1">
                <div className="h-1 rounded bg-brand-400/80 w-6" />
                <div className="h-1 rounded bg-slate-300 w-7" />
                <div className="h-1 rounded bg-slate-300 w-5" />
              </div>
            </div>
          </div>
        ))}

        {/* APPROVED stamp */}
        <div ref={stampRef} className="absolute z-20 pointer-events-none opacity-0 right-3 sm:right-5 top-[34%]">
          <div className="px-4 py-2.5 rounded-xl border-[3px] font-display font-black tracking-[0.18em] text-sm rotate-[-12deg]"
            style={{
              borderColor: "rgba(52,211,153,0.9)",
              color: "#34D399",
              background: "rgba(4,12,18,0.85)",
              boxShadow: "0 0 40px rgba(52,211,153,0.3)",
            }}
          >
            APPROVED
          </div>
        </div>

        {/* gold coin */}
        <div ref={coinRef} className="absolute z-20 pointer-events-none opacity-0 right-4 sm:right-7 top-[22%]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black text-emerald-950 border border-yellow-200/70"
            style={{
              background: "radial-gradient(circle at 35% 30%, #FDE68A, #D97706 55%, #92400E)",
              boxShadow: "0 0 30px rgba(251,191,36,0.5)",
            }}
          >
            ₹
          </div>
        </div>

        {/* story badge */}
        <div ref={storyBadgeRef} className="absolute left-2 sm:left-3 top-3 sm:top-4 z-20 pointer-events-none">
          <div className="rounded-xl px-2.5 py-2 flex items-center gap-2"
            style={{
              background: "rgba(8,14,28,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <span
              key={scene}
              className="story-pop relative w-7 h-7 shrink-0 rounded-lg flex items-center justify-center leading-none"
              style={{
                background: `${accent}18`,
                color: accent,
              }}
            >
              <SceneIcon className="text-[13px] block" />
            </span>
            <span className="leading-tight">
              <span className="block text-[8px] uppercase tracking-[0.18em] text-white/30">{STORY[scene].label}</span>
              <span className="block text-[11px] font-bold text-white/90">Step {scene + 1} · {STORY[scene].status}</span>
            </span>
          </div>
        </div>

        {/* confetti */}
        <div ref={confettiRef} className="absolute inset-0 z-20 overflow-hidden pointer-events-none" />

        {/* pulse ring */}
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full border-2 opacity-0 pointer-events-none"
          style={{ borderColor: `${accent}40` }}
        />

        {/* transition flash */}
        <div
          ref={flashRef}
          className="absolute inset-0 pointer-events-none z-[4] opacity-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${accent}15, transparent 50%)` }}
        />

        {/* character */}
        <div
          ref={svgWrapRef}
          className="absolute inset-0 flex items-center justify-center z-10"
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

        {/* progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04] z-30">
          <div
            key={scene}
            className="quote-progress h-full rounded-full"
            style={{
              "--quote-duration": `${SCENE_SECONDS}s`,
              background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPerformer;
