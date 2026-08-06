import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import NexusField from "./NexusField";

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------
// StudentPerformer — a fully code-built living character.
//
// • SVG student mascot ("Aarav") performs a scroll-scrubbed story:
//   waves, talks with lipsync, gestures, points — as the user scrolls
//   through the hero.
// • Always-on idle life: blinking, breathing, and a gentle head sway,
//   plus eye movement while talking — so he feels real, not stiff.
// • A timed quote bar on top cycles 5 captions with a countdown timer
//   and an advancing progress bar; each quote auto-rotates.
// ------------------------------------------------------------------

const QUOTES = [
  "Your dream degree starts with one scroll.",
  "BSCC loan — 0% interest, no collateral, up to ₹4 Lakh.",
  "We fill forms. You get in. It's that simple.",
  "200+ partner colleges. One guided path.",
  "From admission to approval — GGC has your back.",
];

const QUOTE_SECONDS = 4.8;

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
};

const StudentPerformer = () => {
  const wrapRef = useRef(null);
  const figureRef = useRef(null);
  const breatheRef = useRef(null);
  const headRef = useRef(null);
  const headIdleRef = useRef(null);
  const bodyRef = useRef(null);
  const capRef = useRef(null);
  const tasselRef = useRef(null);
  const armLRef = useRef(null);
  const armRRef = useRef(null);
  const mouthRef = useRef(null);
  const eyesRef = useRef(null);
  const hoverRef = useRef(false);

  const [qIndex, setQIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [countdown, setCountdown] = useState(QUOTE_SECONDS);
  const [showHint, setShowHint] = useState(true);

  // ---- timed quote rotation + countdown ----
  useEffect(() => {
    const id = setInterval(() => {
      if (hoverRef.current) return;
      setCountdown((c) => {
        const next = +(c - 0.1).toFixed(1);
        if (next <= 0) {
          setQIndex((i) => (i + 1) % QUOTES.length);
          return QUOTE_SECONDS;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  // ---- typewriter text per quote + small character "pop" ----
  useEffect(() => {
    const full = QUOTES[qIndex];
    setTyped("");
    setCountdown(QUOTE_SECONDS);
    if (qIndex > 0 && figureRef.current) {
      gsap.fromTo(
        figureRef.current,
        { scale: 1 },
        { scale: 1.025, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [qIndex]);

  // ---- main choreography (scroll scrub + idle loops) ----
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
      setOrigin(headIdleRef.current, 100, 146);
      setOrigin(bodyRef.current, 100, 190);
      setOrigin(tasselRef.current, 120, 74);
      setOrigin(armLRef.current, 74, 152);
      setOrigin(armRRef.current, 126, 152);
      setOrigin(mouthRef.current, 100, 126);
      setOrigin(eyesRef.current, 100, 109);
      setOrigin(breatheRef.current, 100, 200);

      if (reduced) return;

      // ---- idle life: blinking + breathing + head sway ----
      const blink = gsap.timeline({ repeat: -1, repeatDelay: 2.4 });
      blink
        .to(eyesRef.current, { scaleY: 0.08, duration: 0.07, ease: "power2.in" })
        .to(eyesRef.current, { scaleY: 1, duration: 0.1, ease: "power2.out" });

      const breathe = gsap.timeline({ repeat: -1, yoyo: true });
      breathe
        .to(breatheRef.current, { scaleY: 1.014, scaleX: 1.004, duration: 2.1, ease: "sine.inOut" })
        .to(breatheRef.current, { scaleY: 1, scaleX: 1, duration: 2.3, ease: "sine.inOut" });

      const sway = gsap.timeline({ repeat: -1, yoyo: true });
      sway
        .to(headIdleRef.current, { rotation: 2, duration: 2.2, ease: "sine.inOut" })
        .to(headIdleRef.current, { rotation: -2, duration: 2.4, ease: "sine.inOut" });

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

      // --- eyes look around while talking ---
      tl.to(eyesRef.current, { x: 1.5, duration: 0.12 }, 0.16)
        .to(eyesRef.current, { x: -1, duration: 0.12 }, 0.3)
        .to(eyesRef.current, { x: 2, duration: 0.12 }, 0.42)
        .to(eyesRef.current, { x: 0, duration: 0.12 }, 0.56)
        .to(eyesRef.current, { x: -1.5, duration: 0.12 }, 0.7)
        .to(eyesRef.current, { x: 2.5, duration: 0.12 }, 0.86)
        .to(eyesRef.current, { x: 0, duration: 0.1 }, 0.98);

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

      // --- scroll scrub drives the whole performance ---
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          tl.progress(self.progress);
          setShowHint(self.progress < 0.03);
        },
      });
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.lagSmoothing(0);
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
      className="group relative rounded-3xl border border-white/10 bg-premium-charcoal/60 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent z-30 pointer-events-none" />

      {/* ---- Quote bar: 5 auto-rotating captions + countdown timer ---- */}
      <div className="relative z-20 px-4 sm:px-5 py-3 border-b border-white/5 bg-premium-dark/60">
        <div className="flex items-center gap-3 min-h-[40px]">
          <div className="flex flex-col items-center shrink-0 rounded-xl border border-brand-500/30 bg-brand-500/10 px-2 py-1.5 min-w-[54px]">
            <span className="font-mono text-[12px] font-bold text-brand-300 tabular-nums leading-none">
              {formatTime(countdown)}
            </span>
            <span className="text-[9px] text-neutral-500 mt-1 leading-none">
              {qIndex + 1} / {QUOTES.length}
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={qIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="text-[11px] sm:text-sm leading-snug text-neutral-200 font-medium min-h-[40px] flex items-center"
              >
                <FaQuoteLeft className="text-brand-400 text-[9px] sm:text-[11px] mr-2 shrink-0" />
                <span>{typed}</span>
                <span className="caret ml-0.5 inline-block w-[2px] h-3.5 bg-brand-400" />
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        {/* per-quote progress */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            key={qIndex}
            className="quote-progress h-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300 group-hover:[animation-play-state:paused]"
            style={{ "--quote-duration": `${QUOTE_SECONDS}s` }}
          />
        </div>
      </div>

      {/* ---- Stage: canvas + character ---- */}
      <div className="relative h-[300px] sm:h-[390px] md:h-[450px]">
        <div className="absolute inset-0 opacity-30">
          <NexusField />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal via-transparent to-transparent pointer-events-none" />

        {/* Character aura */}
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[70%] h-[55%] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(56,189,248,0.16), transparent 68%)" }}
        />

        {/* Character */}
        <div className="absolute inset-0 flex items-end justify-center pb-1 z-10">
          <svg
            viewBox="0 0 200 240"
            className="h-[94%] w-auto max-w-[92%] drop-shadow-[0_0_24px_rgba(56,189,248,0.3)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ggcBlazer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2C3A58" />
                <stop offset="1" stopColor="#101726" />
              </linearGradient>
              <radialGradient id="ggcSkin" cx="0.4" cy="0.3" r="1">
                <stop offset="0" stopColor="#F2CBA8" />
                <stop offset="1" stopColor="#D9A173" />
              </radialGradient>
              <linearGradient id="ggcHair" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#26324A" />
                <stop offset="1" stopColor="#0B1120" />
              </linearGradient>
            </defs>

            {/* Ground shadow */}
            <ellipse cx="100" cy="236" rx="46" ry="6" fill="rgba(0,0,0,0.5)" />

            <g ref={figureRef}>
              <g ref={breatheRef}>
                {/* Trousers */}
                <path d="M84 184 L97 184 L98 222 L88 222 Q82 212 82 198 Z" fill="#0E1729" />
                <path d="M103 184 L116 184 L118 222 L112 222 Q118 212 118 198 Z" fill="#0E1729" />

                {/* Shoes */}
                <ellipse cx="88" cy="228" rx="11" ry="5" fill="#0A0F1C" />
                <ellipse cx="112" cy="228" rx="11" ry="5" fill="#0A0F1C" />
                <path d="M80 227 Q88 223 96 227" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />

                {/* Blazer torso */}
                <g ref={bodyRef}>
                  <path
                    d="M64 150 Q100 141 136 150 L140 176 Q140 186 130 186 L70 186 Q60 186 60 176 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.35)"
                    strokeWidth="1.5"
                  />
                  {/* shirt + tie */}
                  <path d="M90 148 Q100 160 110 148 L110 156 Q100 170 90 156 Z" fill="#E9EFF7" />
                  <rect x="97" y="147" width="6" height="6" rx="1.5" fill="#FBBF24" />
                  <path d="M98 153 L102 153 L104 172 L100 177 L96 172 Z" fill="#FBBF24" />
                  {/* lapel notch */}
                  <path d="M92 150 L100 162 L108 150" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="2.5" strokeLinecap="round" />
                  {/* buttons + pocket */}
                  <circle cx="100" cy="174" r="2" fill="#FBBF24" />
                  <path d="M118 170 L130 170" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Left arm */}
                <g ref={armLRef}>
                  <path
                    d="M66 152 Q60 178 64 198 Q66 206 74 204 L80 202 Q78 192 80 180 Q82 160 78 154 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="1.5"
                  />
                  <rect x="70" y="196" width="12" height="6" rx="2" fill="#E9EFF7" transform="rotate(-6 76 199)" />
                  <circle cx="76" cy="206" r="7.5" fill="url(#ggcSkin)" />
                </g>

                {/* Right arm */}
                <g ref={armRRef}>
                  <path
                    d="M134 152 Q140 178 136 198 Q134 206 126 204 L120 202 Q122 192 120 180 Q118 160 122 154 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="1.5"
                  />
                  <rect x="118" y="196" width="12" height="6" rx="2" fill="#E9EFF7" transform="rotate(6 124 199)" />
                  <circle cx="124" cy="206" r="7.5" fill="url(#ggcSkin)" />
                </g>

                {/* Neck */}
                <path d="M93 134 Q100 144 107 134 L107 142 Q100 152 93 142 Z" fill="#C98F63" />

                {/* Head */}
                <g ref={headRef}>
                  <g ref={headIdleRef}>
                    <ellipse cx="100" cy="112" rx="26" ry="28" fill="url(#ggcSkin)" />
                    <circle cx="74" cy="112" r="4.5" fill="url(#ggcSkin)" />
                    <circle cx="126" cy="112" r="4.5" fill="url(#ggcSkin)" />
                    <circle cx="84" cy="127" r="4.5" fill="rgba(251,191,36,0.28)" />
                    <circle cx="116" cy="127" r="4.5" fill="rgba(251,191,36,0.28)" />
                    <path d="M81 99 Q88 94 95 98" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M105 98 Q112 94 119 99" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                    <g ref={eyesRef}>
                      <circle cx="88" cy="109" r="2.6" fill="#0F172A" />
                      <circle cx="112" cy="109" r="2.6" fill="#0F172A" />
                      <circle cx="89" cy="108" r="0.8" fill="#fff" opacity="0.85" />
                      <circle cx="113" cy="108" r="0.8" fill="#fff" opacity="0.85" />
                    </g>
                    <circle cx="88" cy="109" r="7.5" fill="none" stroke="#38BDF8" strokeWidth="2" />
                    <circle cx="112" cy="109" r="7.5" fill="none" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M95.5 109 L104.5 109" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M80.5 107 L73 102" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M119.5 107 L127 102" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M92 106 Q88 104 85 106" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M116 106 Q120 104 123 106" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M98 117 Q100 120 102 117" fill="none" stroke="#C98F63" strokeWidth="2" strokeLinecap="round" />
                    <g ref={mouthRef}>
                      <ellipse cx="100" cy="126" rx="5" ry="6" fill="#7C2D3E" />
                      <path d="M94 125 Q100 121 106 125" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </g>
                </g>

                {/* Hair fringe */}
                <path
                  d="M75 90 Q78 74 100 71 Q122 74 125 90 Q118 94 112 91 Q106 97 100 94 Q94 97 88 91 Q82 94 75 90 Z"
                  fill="url(#ggcHair)"
                />
                <path d="M86 88 Q92 82 100 81 Q108 82 114 88" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />

                {/* Cap */}
                <g ref={capRef}>
                  <rect x="68" y="72" width="64" height="8" rx="3" fill="#0F172A" />
                  <path d="M70 72 Q100 86 130 72 L130 76 Q100 90 70 76 Z" fill="#1B2740" />
                  <g ref={tasselRef}>
                    <path d="M120 72 Q128 64 134 66" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="136" cy="67" r="3.5" fill="#FBBF24" />
                  </g>
                </g>
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
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-premium-dark/80 backdrop-blur px-3 py-1.5"
            >
              <svg className="animate-bounce w-3 h-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7 7 7-7" />
              </svg>
              <span className="text-[10px] font-medium text-neutral-300 tracking-wide">Scroll to explore</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentPerformer;
