import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlay, FaVolumeUp, FaClosedCaptioning, FaExpand, FaMicrophone,
} from "react-icons/fa";
import NexusField from "./NexusField";

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------
// StudentPerformer — a fully code-built "video".
//
// An SVG student mascot performs a scrubbed, video-like story: scroll
// anywhere through the hero and the character acts (waves, talks with
// lipsync, gestures) while a fake player UI (timer, progress, LIVE)
// updates live — so visitors believe it is a real video.
// ------------------------------------------------------------------

const SCENES = [
  { start: 0.0, end: 0.14, text: "Namaste! I'm Aarav — your GGC student guide." },
  { start: 0.14, end: 0.36, text: "Admission? I walk you through every college and every step." },
  { start: 0.36, end: 0.58, text: "BSCC loan — 0% interest, up to ₹4 Lakh, zero collateral." },
  { start: 0.58, end: 0.78, text: "Documents, counseling, approvals — we handle it all." },
  { start: 0.78, end: 1.0, text: "Ready? Let's build your future together." },
];

const TOTAL_SECONDS = 45;
const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
};

const StudentPerformer = () => {
  const wrapRef = useRef(null);
  const headRef = useRef(null);
  const bodyRef = useRef(null);
  const capRef = useRef(null);
  const tasselRef = useRef(null);
  const armLRef = useRef(null);
  const armRRef = useRef(null);
  const mouthRef = useRef(null);
  const fillRef = useRef(null);
  const playheadRef = useRef(null);
  const timerRef = useRef(null);

  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState("");
  const [showHint, setShowHint] = useState(true);

  // ---- typewriter captions per scene ----
  useEffect(() => {
    const full = SCENES[scene].text;
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [scene]);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const triggerEl = root.closest("section") || root;
    const lenis = window.__lenis;
    if (lenis) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    const setOrigin = (el, x, y) => {
      if (el) gsap.set(el, { transformOrigin: `${x}px ${y}px` });
    };

    const ctx = gsap.context(() => {
      setOrigin(headRef.current, 100, 148);
      setOrigin(bodyRef.current, 100, 210);
      setOrigin(tasselRef.current, 120, 74);
      setOrigin(armLRef.current, 74, 152);
      setOrigin(armRRef.current, 126, 152);
      setOrigin(mouthRef.current, 100, 126);

      if (reduced) {
        setScene(0);
        if (fillRef.current) fillRef.current.style.transform = "scaleX(0)";
        if (timerRef.current) timerRef.current.textContent = formatTime(0);
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "none" }, paused: true });

      // --- head ---
      tl.to(headRef.current, { rotation: -6, duration: 0.05 }, 0)
        .to(headRef.current, { rotation: 4, duration: 0.05 }, 0.05)
        .to(headRef.current, { rotation: 0, duration: 0.04 }, 0.1)
        .to(headRef.current, { rotation: 3, duration: 0.11 }, 0.14)
        .to(headRef.current, { rotation: -3, duration: 0.11 }, 0.25)
        .to(headRef.current, { rotation: 0, duration: 0.04 }, 0.36)
        .to(headRef.current, { rotation: 4, duration: 0.12 }, 0.4)
        .to(headRef.current, { rotation: -4, duration: 0.12 }, 0.52)
        .to(headRef.current, { rotation: 0, duration: 0.06 }, 0.58)
        .to(headRef.current, { rotation: -3, duration: 0.08 }, 0.64)
        .to(headRef.current, { rotation: 2, duration: 0.08 }, 0.72)
        .to(headRef.current, { rotation: 0, duration: 0.06 }, 0.78)
        .to(headRef.current, { rotation: 3, duration: 0.1 }, 0.84)
        .to(headRef.current, { rotation: -2, duration: 0.1 }, 0.94);

      // --- right arm (wave → gesture → point) ---
      tl.to(armRRef.current, { rotation: 28, duration: 0.01 }, 0.01)
        .to(armRRef.current, { rotation: -14, duration: 0.02 }, 0.02)
        .to(armRRef.current, { rotation: 34, duration: 0.02 }, 0.04)
        .to(armRRef.current, { rotation: -12, duration: 0.02 }, 0.06)
        .to(armRRef.current, { rotation: 26, duration: 0.02 }, 0.08)
        .to(armRRef.current, { rotation: -10, duration: 0.02 }, 0.1)
        .to(armRRef.current, { rotation: -8, duration: 0.04 }, 0.12)
        .to(armRRef.current, { rotation: 8, duration: 0.06 }, 0.18)
        .to(armRRef.current, { rotation: -6, duration: 0.06 }, 0.24)
        .to(armRRef.current, { rotation: 10, duration: 0.06 }, 0.3)
        .to(armRRef.current, { rotation: -8, duration: 0.06 }, 0.36)
        .to(armRRef.current, { rotation: 42, duration: 0.04 }, 0.4)
        .to(armRRef.current, { rotation: 18, duration: 0.06 }, 0.46)
        .to(armRRef.current, { rotation: 34, duration: 0.06 }, 0.52)
        .to(armRRef.current, { rotation: -8, duration: 0.06 }, 0.58)
        .to(armRRef.current, { rotation: -20, duration: 0.04 }, 0.62)
        .to(armRRef.current, { rotation: 12, duration: 0.06 }, 0.68)
        .to(armRRef.current, { rotation: -18, duration: 0.06 }, 0.74)
        .to(armRRef.current, { rotation: -8, duration: 0.04 }, 0.78)
        .to(armRRef.current, { rotation: 46, duration: 0.04 }, 0.82)
        .to(armRRef.current, { rotation: 22, duration: 0.08 }, 0.9)
        .to(armRRef.current, { rotation: -8, duration: 0.06 }, 0.96);

      // --- left arm (soft mirror) ---
      tl.to(armLRef.current, { rotation: -8, duration: 0.06 }, 0.2)
        .to(armLRef.current, { rotation: 4, duration: 0.06 }, 0.26)
        .to(armLRef.current, { rotation: 6, duration: 0.04 }, 0.36)
        .to(armLRef.current, { rotation: -10, duration: 0.06 }, 0.42)
        .to(armLRef.current, { rotation: 6, duration: 0.06 }, 0.52)
        .to(armLRef.current, { rotation: 6, duration: 0.06 }, 0.58)
        .to(armLRef.current, { rotation: 22, duration: 0.04 }, 0.62)
        .to(armLRef.current, { rotation: -12, duration: 0.06 }, 0.68)
        .to(armLRef.current, { rotation: 18, duration: 0.06 }, 0.74)
        .to(armLRef.current, { rotation: 6, duration: 0.04 }, 0.78)
        .to(armLRef.current, { rotation: -12, duration: 0.06 }, 0.84)
        .to(armLRef.current, { rotation: 6, duration: 0.1 }, 0.94);

      // --- body bob ---
      tl.to(bodyRef.current, { y: 2.5, duration: 0.03 }, 0.03)
        .to(bodyRef.current, { y: 0, duration: 0.02 }, 0.05)
        .to(bodyRef.current, { y: 2, duration: 0.04 }, 0.09)
        .to(bodyRef.current, { y: 0, duration: 0.05 }, 0.14)
        .to(bodyRef.current, { y: 2, duration: 0.14 }, 0.3)
        .to(bodyRef.current, { y: 0, duration: 0.06 }, 0.36)
        .to(bodyRef.current, { y: 2, duration: 0.12 }, 0.5)
        .to(bodyRef.current, { y: 0, duration: 0.08 }, 0.58)
        .to(bodyRef.current, { y: 2, duration: 0.1 }, 0.7)
        .to(bodyRef.current, { y: 0, duration: 0.08 }, 0.78)
        .to(bodyRef.current, { y: 2, duration: 0.1 }, 0.9)
        .to(bodyRef.current, { y: 0, duration: 0.1 }, 1);

      // --- cap tassel sway ---
      tl.to(tasselRef.current, { rotation: 12, duration: 0.12 }, 0)
        .to(tasselRef.current, { rotation: -10, duration: 0.16 }, 0.14)
        .to(tasselRef.current, { rotation: 14, duration: 0.12 }, 0.4)
        .to(tasselRef.current, { rotation: -10, duration: 0.18 }, 0.58)
        .to(tasselRef.current, { rotation: 12, duration: 0.2 }, 0.78);

      // --- lipsync: fast open/close keyframes across talking windows ---
      gsap.set(mouthRef.current, { scaleY: 0.2 });
      for (let t = 0.02; t < 0.96; t += 0.024 + Math.random() * 0.014) {
        const amp = t < 0.12 ? 0.5 : t < 0.58 ? 1 : 0.8;
        tl.to(mouthRef.current, { scaleY: amp, duration: 0.012 }, t)
          .to(mouthRef.current, { scaleY: 0.25, duration: 0.012 }, t + 0.012);
      }

      // --- scrubbed fake player ---
      tl.scrollTrigger = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          tl.progress(p);
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
          if (playheadRef.current) playheadRef.current.style.left = `${p * 100}%`;
          if (timerRef.current) timerRef.current.textContent = formatTime(p * TOTAL_SECONDS);
          const idx = SCENES.findIndex((s) => p >= s.start && p < s.end);
          if (idx >= 0 && idx !== scene) setScene(idx);
          setShowHint(p < 0.03);
        },
      });
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.lagSmoothing(0);
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative rounded-3xl border border-white/10 bg-premium-charcoal/60 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent z-20 pointer-events-none" />

      {/* ---- Player top bar ---- */}
      <div className="relative z-20 px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-success-400/80" />
          <span className="w-2 h-2 rounded-full bg-accent-400/80" />
          <span className="w-2 h-2 rounded-full bg-brand-400/80" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          GGC · Student Story
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[3px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="voice-bar block w-[3px] h-3 rounded-full bg-brand-400"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[0.25em] text-rose-400">
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500" />
            </span>
            LIVE
          </span>
        </div>
      </div>

      {/* ---- Stage: canvas + character ---- */}
      <div className="relative h-[340px] sm:h-[400px] md:h-[430px]">
        <div className="absolute inset-0 opacity-50">
          <NexusField />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal via-transparent to-transparent pointer-events-none" />

        {/* Caption bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-3 left-1/2 -translate-x-1/2 w-[88%] z-20"
          >
            <div className="relative rounded-2xl border border-white/10 bg-premium-dark/85 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/40">
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-200 font-medium min-h-[3.2rem] flex items-center">
                <FaMicrophone className="text-brand-400 text-[10px] mr-2 shrink-0" />
                {typed}
                <span className="caret ml-0.5 inline-block w-[2px] h-4 bg-brand-400" />
              </p>
              <div className="absolute -bottom-[7px] left-[18%] w-3 h-3 rotate-45 border-b border-r border-white/10 bg-premium-dark/85" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Character */}
        <div className="absolute inset-0 flex items-end justify-center pb-2 z-10">
          <svg
            viewBox="0 0 200 240"
            className="h-[92%] w-auto drop-shadow-[0_0_22px_rgba(56,189,248,0.35)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ggcGown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#243149" />
                <stop offset="1" stopColor="#0E1526" />
              </linearGradient>
            </defs>

            {/* Ground shadow */}
            <ellipse cx="100" cy="236" rx="44" ry="6" fill="rgba(0,0,0,0.45)" />

            {/* Shoes */}
            <ellipse cx="86" cy="232" rx="10" ry="5" fill="#0B1120" />
            <ellipse cx="114" cy="232" rx="10" ry="5" fill="#0B1120" />

            {/* Body / gown */}
            <g ref={bodyRef}>
              <path
                d="M64 150 Q100 140 136 150 L148 212 Q100 224 52 212 Z"
                fill="url(#ggcGown)"
                stroke="rgba(56,189,248,0.35)"
                strokeWidth="1.5"
              />
              <path d="M88 150 L100 168 L112 150" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M62 178 Q100 188 138 178" fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="1.5" />
            </g>

            {/* Left arm */}
            <g ref={armLRef}>
              <path
                d="M66 152 Q60 176 64 196 Q66 204 74 202 L80 200 Q78 190 80 178 Q82 160 78 154 Z"
                fill="url(#ggcGown)"
                stroke="rgba(56,189,248,0.3)"
                strokeWidth="1.5"
              />
              <circle cx="72" cy="201" r="8" fill="#EAB892" />
            </g>

            {/* Right arm */}
            <g ref={armRRef}>
              <path
                d="M134 152 Q140 176 136 196 Q134 204 126 202 L120 200 Q122 190 120 178 Q118 160 122 154 Z"
                fill="url(#ggcGown)"
                stroke="rgba(56,189,248,0.3)"
                strokeWidth="1.5"
              />
              <circle cx="128" cy="201" r="8" fill="#EAB892" />
            </g>

            {/* Head */}
            <g ref={headRef}>
              <ellipse cx="100" cy="112" rx="26" ry="28" fill="#EAB892" />
              <circle cx="74" cy="112" r="4.5" fill="#EAB892" />
              <circle cx="126" cy="112" r="4.5" fill="#EAB892" />
              <circle cx="84" cy="126" r="4.5" fill="rgba(251,191,36,0.28)" />
              <circle cx="116" cy="126" r="4.5" fill="rgba(251,191,36,0.28)" />
              <path d="M81 100 Q88 95 95 99" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <path d="M105 99 Q112 95 119 100" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="88" cy="109" r="2.4" fill="#0F172A" />
              <circle cx="112" cy="109" r="2.4" fill="#0F172A" />
              <circle cx="88" cy="109" r="7.5" fill="none" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="112" cy="109" r="7.5" fill="none" stroke="#38BDF8" strokeWidth="2" />
              <path d="M95.5 109 L104.5 109" stroke="#38BDF8" strokeWidth="2" />
              <path d="M80.5 107 L73 102" stroke="#38BDF8" strokeWidth="2" />
              <path d="M119.5 107 L127 102" stroke="#38BDF8" strokeWidth="2" />
              <path d="M98 117 Q100 120 102 117" fill="none" stroke="#D29B6C" strokeWidth="2" strokeLinecap="round" />
              <g ref={mouthRef}>
                <ellipse cx="100" cy="126" rx="5" ry="6" fill="#7C2D3E" />
                <path d="M94 125 Q100 121 106 125" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>

            {/* Hair fringe */}
            <path
              d="M75 90 Q78 74 100 71 Q122 74 125 90 Q118 94 112 91 Q106 97 100 94 Q94 97 88 91 Q82 94 75 90 Z"
              fill="#0F172A"
            />

            {/* Cap */}
            <g ref={capRef}>
              <rect x="68" y="72" width="64" height="8" rx="3" fill="#0F172A" />
              <path d="M70 72 Q100 86 130 72 L130 76 Q100 90 70 76 Z" fill="#1B2740" />
              <g ref={tasselRef}>
                <path d="M120 72 Q128 64 134 66" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="136" cy="67" r="3.5" fill="#FBBF24" />
              </g>
            </g>
          </svg>
        </div>

        {/* Scroll hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-premium-dark/80 backdrop-blur px-3 py-1.5"
            >
              <svg className="animate-bounce w-3 h-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7 7 7-7" />
              </svg>
              <span className="text-[10px] font-medium text-neutral-300 tracking-wide">Scroll to play</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- Fake player controls ---- */}
      <div className="relative z-20 px-4 sm:px-5 py-3 border-t border-white/5 bg-premium-dark/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-neutral-400">
            <FaPlay className="text-[10px]" />
            <FaVolumeUp className="text-[11px]" />
          </div>
          <span ref={timerRef} className="font-mono text-[10px] text-neutral-400 tabular-nums">
            0:00
          </span>
          <div className="relative flex-1 h-[3px] rounded-full bg-white/10 overflow-visible">
            <div
              ref={fillRef}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300 origin-left"
              style={{ transform: "scaleX(0)" }}
            />
            <div
              ref={playheadRef}
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-300 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
              style={{ left: "0%" }}
            />
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <FaClosedCaptioning className="text-[11px] text-brand-300/80" />
            <FaExpand className="text-[10px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformer;
