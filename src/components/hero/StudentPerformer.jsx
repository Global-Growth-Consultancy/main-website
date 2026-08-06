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
// • SVG student mascot ("Aarav") performs in REAL TIME, on its own —
//   no scroll required. Every quote is a "chapter": the character
//   gestures (wave, talk with hands, point, open arms) and talks with
//   real-time lipsync, then settles back to a calm idle loop.
// • Always-on idle life: blinking, breathing, gentle head sway.
// • A timed quote bar on top cycles 5 captions with a countdown timer
//   and an advancing progress bar; each quote auto-rotates and the
//   character performs its matching chapter live.
// ------------------------------------------------------------------

const QUOTES = [
  "Your dream degree starts with one scroll.",
  "BSCC loan — 0% interest, no collateral, up to ₹4 Lakh.",
  "We fill forms. You get in. It's that simple.",
  "200+ partner colleges. One guided path.",
  "From admission to approval — GGC has your back.",
];

const QUOTE_SECONDS = 4.8;
const TALK_MS = 3200;

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
};

const StudentPerformer = () => {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const figureRef = useRef(null);
  const breatheRef = useRef(null);
  const headRef = useRef(null);
  const headIdleRef = useRef(null);
  const bodyRef = useRef(null);
  const tasselRef = useRef(null);
  const armLRef = useRef(null);
  const armLElbowRef = useRef(null);
  const armRRef = useRef(null);
  const armRElbowRef = useRef(null);
  const mouthRef = useRef(null);
  const eyesRef = useRef(null);
  const hoverRef = useRef(false);
  const reducedRef = useRef(false);

  const [qIndex, setQIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [countdown, setCountdown] = useState(QUOTE_SECONDS);

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

  // ---- idle life: blinking + breathing + head sway + scroll tilt ----
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return undefined;

    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reduced = reducedRef.current;
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
      setOrigin(armLElbowRef.current, 70, 181);
      setOrigin(armRRef.current, 126, 152);
      setOrigin(armRElbowRef.current, 130, 181);
      setOrigin(mouthRef.current, 100, 126);
      setOrigin(eyesRef.current, 100, 109);
      setOrigin(breatheRef.current, 100, 200);

      if (reduced) return;

      // blinking
      const blink = gsap.timeline({ repeat: -1, repeatDelay: 2.2 });
      blink
        .to(eyesRef.current, { scaleY: 0.08, duration: 0.07, ease: "power2.in" })
        .to(eyesRef.current, { scaleY: 1, duration: 0.1, ease: "power2.out" });

      // breathing
      const breathe = gsap.timeline({ repeat: -1, yoyo: true });
      breathe
        .to(breatheRef.current, { scaleY: 1.014, scaleX: 1.004, duration: 2.1, ease: "sine.inOut" })
        .to(breatheRef.current, { scaleY: 1, scaleX: 1, duration: 2.3, ease: "sine.inOut" });

      // head sway
      const sway = gsap.timeline({ repeat: -1, yoyo: true });
      sway
        .to(headIdleRef.current, { rotation: 1.6, duration: 2.2, ease: "sine.inOut" })
        .to(headIdleRef.current, { rotation: -1.6, duration: 2.4, ease: "sine.inOut" });

      // gentle scroll parallax lean (subtle — the character performs on its own)
      const tilt = gsap.quickTo(svgRef.current, "rotation", { duration: 0.5, ease: "power1.out" });
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => tilt(self.progress * 2.4 - 1.2),
      });
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.lagSmoothing(0);
      if (lenis) lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  // ---- chapter performance + typewriter per quote ----
  useEffect(() => {
    const full = QUOTES[qIndex];
    setTyped("");
    setCountdown(QUOTE_SECONDS);

    if (qIndex > 0 && figureRef.current) {
      gsap.fromTo(
        figureRef.current,
        { scale: 1 },
        { scale: 1.02, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }

    let i = 0;
    const typeId = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(typeId);
    }, 26);

    let talkTween = null;
    let stopTalkId = null;

    if (!reducedRef.current && svgRef.current) {
      gsap.context(() => {
        const armR = armRRef.current;
        const armE = armRElbowRef.current;
        const armL = armLRef.current;
        const armLE = armLElbowRef.current;
        const head = headRef.current;
        const body = bodyRef.current;
        const eyes = eyesRef.current;

        const gesture = gsap.timeline();
        const ch = qIndex;

        if (ch === 0) {
          // intro — wave
          gesture
            .to(armR, { rotation: -30, duration: 0.55, ease: "power3.out" }, 0.1)
            .to(armR, { rotation: -20, duration: 0.4, ease: "sine.inOut" }, 0.95)
            .to(armR, { rotation: -34, duration: 0.4, ease: "sine.inOut" }, 1.55)
            .to(armR, { rotation: -20, duration: 0.4, ease: "sine.inOut" }, 2.15)
            .to(armR, { rotation: 0, duration: 0.7, ease: "power3.inOut" }, 3.4)
            .to(armE, { rotation: 24, duration: 0.4, ease: "sine.inOut" }, 0.95)
            .to(armE, { rotation: -26, duration: 0.4, ease: "sine.inOut" }, 1.55)
            .to(armE, { rotation: 20, duration: 0.4, ease: "sine.inOut" }, 2.15)
            .to(armE, { rotation: 6, duration: 0.7, ease: "power3.inOut" }, 3.4)
            .to(head, { rotation: -5, duration: 0.5, ease: "power2.out" }, 0.15)
            .to(head, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, 0.85)
            .to(body, { y: -1.5, duration: 0.5, ease: "sine.inOut" }, 0.15)
            .to(body, { y: 0, duration: 0.6, ease: "sine.inOut" }, 3.3);
        } else if (ch === 1) {
          // admission — hands-on talk
          gesture
            .to(armR, { rotation: 18, duration: 0.6, ease: "power3.out" }, 0.2)
            .to(armR, { rotation: 10, duration: 0.6, ease: "sine.inOut" }, 1.5)
            .to(armR, { rotation: 20, duration: 0.6, ease: "sine.inOut" }, 2.5)
            .to(armR, { rotation: 0, duration: 0.6, ease: "power3.inOut" }, 3.5)
            .to(armE, { rotation: -28, duration: 0.6, ease: "power3.out" }, 0.3)
            .to(armE, { rotation: -14, duration: 0.6, ease: "sine.inOut" }, 1.6)
            .to(armE, { rotation: -26, duration: 0.6, ease: "sine.inOut" }, 2.6)
            .to(armE, { rotation: 6, duration: 0.6, ease: "power3.inOut" }, 3.6)
            .to(head, { rotation: 3, duration: 0.7, ease: "sine.inOut" }, 0.3)
            .to(head, { rotation: -2, duration: 0.7, ease: "sine.inOut" }, 1.6)
            .to(head, { rotation: 0, duration: 0.6, ease: "sine.inOut" }, 3.1)
            .to(eyes, { x: 1.5, duration: 0.5, ease: "sine.inOut" }, 0.5)
            .to(eyes, { x: -1, duration: 0.5, ease: "sine.inOut" }, 1.7)
            .to(eyes, { x: 0, duration: 0.5, ease: "sine.inOut" }, 3.0);
        } else if (ch === 2) {
          // BSCC loan — point out
          gesture
            .to(armR, { rotation: -52, duration: 0.6, ease: "power3.out" }, 0.3)
            .to(armR, { rotation: -40, duration: 0.5, ease: "sine.inOut" }, 1.7)
            .to(armR, { rotation: -48, duration: 0.5, ease: "sine.inOut" }, 2.4)
            .to(armR, { rotation: 0, duration: 0.7, ease: "power3.inOut" }, 3.5)
            .to(armE, { rotation: 42, duration: 0.6, ease: "power3.out" }, 0.4)
            .to(armE, { rotation: 22, duration: 0.5, ease: "sine.inOut" }, 1.8)
            .to(armE, { rotation: 38, duration: 0.5, ease: "sine.inOut" }, 2.5)
            .to(armE, { rotation: 6, duration: 0.7, ease: "power3.inOut" }, 3.6)
            .to(body, { y: -1, duration: 0.5, ease: "sine.inOut" }, 0.4)
            .to(body, { y: 0, duration: 0.6, ease: "sine.inOut" }, 3.2)
            .to(head, { rotation: -6, duration: 0.5, ease: "sine.inOut" }, 0.5)
            .to(head, { rotation: 0, duration: 0.8, ease: "sine.inOut" }, 3.0)
            .to(eyes, { x: 2, duration: 0.5, ease: "sine.inOut" }, 0.6)
            .to(eyes, { x: 0, duration: 0.5, ease: "sine.inOut" }, 3.0);
        } else if (ch === 3) {
          // support — open arms
          gesture
            .to(armR, { rotation: -38, duration: 0.6, ease: "power3.out" }, 0.2)
            .to(armR, { rotation: -26, duration: 0.5, ease: "sine.inOut" }, 1.8)
            .to(armR, { rotation: -38, duration: 0.5, ease: "sine.inOut" }, 2.5)
            .to(armR, { rotation: 0, duration: 0.7, ease: "power3.inOut" }, 3.5)
            .to(armE, { rotation: -18, duration: 0.6, ease: "power3.out" }, 0.3)
            .to(armE, { rotation: -6, duration: 0.5, ease: "sine.inOut" }, 1.9)
            .to(armE, { rotation: -16, duration: 0.5, ease: "sine.inOut" }, 2.6)
            .to(armE, { rotation: 6, duration: 0.7, ease: "power3.inOut" }, 3.6)
            .to(armL, { rotation: 38, duration: 0.6, ease: "power3.out" }, 0.2)
            .to(armL, { rotation: 26, duration: 0.5, ease: "sine.inOut" }, 1.8)
            .to(armL, { rotation: 38, duration: 0.5, ease: "sine.inOut" }, 2.5)
            .to(armL, { rotation: 0, duration: 0.7, ease: "power3.inOut" }, 3.5)
            .to(armLE, { rotation: -16, duration: 0.6, ease: "power3.out" }, 0.3)
            .to(armLE, { rotation: -5, duration: 0.5, ease: "sine.inOut" }, 1.9)
            .to(armLE, { rotation: -14, duration: 0.5, ease: "sine.inOut" }, 2.6)
            .to(armLE, { rotation: 6, duration: 0.7, ease: "power3.inOut" }, 3.6)
            .to(head, { rotation: 2, duration: 0.8, ease: "sine.inOut" }, 0.5)
            .to(head, { rotation: 0, duration: 0.8, ease: "sine.inOut" }, 2.8);
        } else {
          // CTA — point forward
          gesture
            .to(armR, { rotation: -22, duration: 0.6, ease: "power3.out" }, 0.3)
            .to(armR, { rotation: -14, duration: 0.5, ease: "sine.inOut" }, 1.9)
            .to(armR, { rotation: -20, duration: 0.5, ease: "sine.inOut" }, 2.6)
            .to(armR, { rotation: 0, duration: 0.7, ease: "power3.inOut" }, 3.5)
            .to(armE, { rotation: 58, duration: 0.6, ease: "power3.out" }, 0.4)
            .to(armE, { rotation: 34, duration: 0.5, ease: "sine.inOut" }, 2)
            .to(armE, { rotation: 52, duration: 0.5, ease: "sine.inOut" }, 2.7)
            .to(armE, { rotation: 6, duration: 0.7, ease: "power3.inOut" }, 3.6)
            .to(head, { rotation: 3, duration: 0.5, ease: "sine.inOut" }, 0.6)
            .to(head, { rotation: 0, duration: 0.8, ease: "sine.inOut" }, 3.1)
            .to(eyes, { x: 2.5, duration: 0.5, ease: "sine.inOut" }, 0.7)
            .to(eyes, { x: 0, duration: 0.5, ease: "sine.inOut" }, 3.1);
        }

        // real-time lipsync while the text is typing
        talkTween = gsap.to(mouthRef.current, {
          scaleY: 1,
          duration: 0.075,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          repeatDelay: 0.03,
        });
      }, svgRef.current);

      stopTalkId = setTimeout(() => {
        if (talkTween) talkTween.kill();
        gsap.to(mouthRef.current, { scaleY: 0.2, duration: 0.3, ease: "power2.out" });
      }, TALK_MS);
    }

    return () => {
      clearInterval(typeId);
      if (stopTalkId) clearTimeout(stopTalkId);
      if (talkTween) talkTween.kill();
    };
  }, [qIndex]);

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
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(56,189,248,0.18), transparent 68%)" }}
        />

        {/* Character */}
        <div className="absolute inset-0 flex items-end justify-center pb-1 z-10">
          <svg
            ref={svgRef}
            viewBox="0 0 200 240"
            className="h-[94%] w-auto max-w-[92%] drop-shadow-[0_0_26px_rgba(56,189,248,0.3)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ggcBlazer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2C3A58" />
                <stop offset="1" stopColor="#101726" />
              </linearGradient>
              <radialGradient id="ggcSkin" cx="0.4" cy="0.3" r="1">
                <stop offset="0" stopColor="#F4CEAA" />
                <stop offset="0.75" stopColor="#E3AC7E" />
                <stop offset="1" stopColor="#CF9766" />
              </radialGradient>
              <linearGradient id="ggcHair" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2E3B55" />
                <stop offset="1" stopColor="#0B1120" />
              </linearGradient>
            </defs>

            {/* Ground pedestal */}
            <ellipse cx="100" cy="236" rx="56" ry="8" fill="rgba(56,189,248,0.08)" />
            <ellipse cx="100" cy="236" rx="44" ry="6" fill="rgba(0,0,0,0.5)" />

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

                {/* Left arm — two joints */}
                <g ref={armLRef}>
                  <path
                    d="M68 152 Q60 164 62 176 Q64 184 72 183 Q80 182 78 172 Q78 162 74 152 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="1.5"
                  />
                  <g ref={armLElbowRef}>
                    <path
                      d="M70 181 Q62 190 64 200 Q66 208 73 206 Q80 204 78 194 Q78 186 76 179 Z"
                      fill="url(#ggcBlazer)"
                      stroke="rgba(56,189,248,0.3)"
                      strokeWidth="1.5"
                    />
                    <rect x="68" y="197" width="12" height="6" rx="2" fill="#E9EFF7" transform="rotate(-6 74 200)" />
                    <circle cx="74" cy="206" r="7.5" fill="url(#ggcSkin)" />
                  </g>
                </g>

                {/* Right arm — two joints */}
                <g ref={armRRef}>
                  <path
                    d="M132 152 Q140 164 138 176 Q136 184 128 183 Q120 182 122 172 Q122 162 126 152 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="1.5"
                  />
                  <g ref={armRElbowRef}>
                    <path
                      d="M130 181 Q138 190 136 200 Q134 208 127 206 Q120 204 122 194 Q122 186 124 179 Z"
                      fill="url(#ggcBlazer)"
                      stroke="rgba(56,189,248,0.3)"
                      strokeWidth="1.5"
                    />
                    <rect x="120" y="197" width="12" height="6" rx="2" fill="#E9EFF7" transform="rotate(6 126 200)" />
                    <circle cx="126" cy="206" r="7.5" fill="url(#ggcSkin)" />
                  </g>
                </g>

                {/* Neck + chin shadow */}
                <path d="M94 133 Q100 143 106 133 L106 140 Q100 150 94 140 Z" fill="#C98F63" />
                <path d="M93 134 Q100 143 107 134" stroke="rgba(0,0,0,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* Head */}
                <g ref={headRef}>
                  <g ref={headIdleRef}>
                    {/* face */}
                    <path
                      d="M74 90 Q72 106 79 123 Q86 137 100 139 Q114 137 121 123 Q128 106 126 90 Q123 77 100 75 Q77 77 74 90 Z"
                      fill="url(#ggcSkin)"
                    />
                    <circle cx="74" cy="110" r="4.5" fill="url(#ggcSkin)" />
                    <circle cx="126" cy="110" r="4.5" fill="url(#ggcSkin)" />
                    <circle cx="84" cy="127" r="4.5" fill="rgba(251,191,36,0.3)" />
                    <circle cx="116" cy="127" r="4.5" fill="rgba(251,191,36,0.3)" />

                    {/* brows */}
                    <path d="M79 100 Q87 94 95 99" fill="none" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round" />
                    <path d="M105 99 Q113 94 121 100" fill="none" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round" />

                    {/* eyes (blink + look) */}
                    <g ref={eyesRef}>
                      <ellipse cx="88" cy="109" rx="4.6" ry="4.3" fill="#FFF8F0" />
                      <ellipse cx="112" cy="109" rx="4.6" ry="4.3" fill="#FFF8F0" />
                      <circle cx="88" cy="109" r="3" fill="#4A2A18" />
                      <circle cx="112" cy="109" r="3" fill="#4A2A18" />
                      <circle cx="88" cy="109" r="1.3" fill="#140C08" />
                      <circle cx="112" cy="109" r="1.3" fill="#140C08" />
                      <circle cx="89.5" cy="108" r="1" fill="#fff" opacity="0.9" />
                      <circle cx="113.5" cy="108" r="1" fill="#fff" opacity="0.9" />
                    </g>
                    <path d="M82.5 105.5 Q88 102.5 93.5 105.5" stroke="#C98F63" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    <path d="M106.5 105.5 Q112 102.5 117.5 105.5" stroke="#C98F63" strokeWidth="1.4" fill="none" strokeLinecap="round" />

                    {/* glasses */}
                    <circle cx="88" cy="109" r="8" fill="none" stroke="#38BDF8" strokeWidth="2" />
                    <circle cx="112" cy="109" r="8" fill="none" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M96 109 L104 109" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M80 106.5 L73 102" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M120 106.5 L127 102" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M93 105 Q89.5 103 86.5 104.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M117 105 Q120.5 103 123.5 104.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" />

                    {/* nose */}
                    <path d="M99 114 Q101 118 100 120" fill="none" stroke="#C98F63" strokeWidth="2" strokeLinecap="round" />
                    <path d="M95.5 118.5 Q97.5 121 100.5 120" fill="none" stroke="#C98F63" strokeWidth="1.4" strokeLinecap="round" />

                    {/* mouth (lipsync) */}
                    <g ref={mouthRef}>
                      <ellipse cx="100" cy="127" rx="5.5" ry="6.5" fill="#4A1523" />
                      <path d="M96.5 129 Q100 133.5 103.5 129 Q100 136 96.5 129 Z" fill="#D96C7C" />
                      <rect x="96" y="121.5" width="8" height="2.2" rx="0.9" fill="#F7FAFC" />
                      <path d="M93 125 Q96 120 100 122.5 Q104 120 107 125" fill="none" stroke="#B4556B" strokeWidth="2.2" strokeLinecap="round" />
                    </g>
                  </g>
                </g>

                {/* Hair */}
                <path
                  d="M74 92 Q73 76 90 71 Q100 69 110 71 Q127 76 126 92 Q127 106 117 106 L83 106 Q73 106 74 92 Z"
                  fill="url(#ggcHair)"
                />
                <path
                  d="M76 90 Q78 75 99 72 Q120 75 124 90 Q118 92 112 89 Q106 95 100 92 Q94 95 88 89 Q82 92 76 90 Z"
                  fill="url(#ggcHair)"
                />
                <path d="M90 80 Q96 76 103 77" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" />

                {/* Cap */}
                <g>
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
      </div>
    </div>
  );
};

export default StudentPerformer;
