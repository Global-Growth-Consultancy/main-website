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
//   syllable-synced lipsync (the mouth pulses on every vowel of the
//   actual caption), then settles back to a calm idle loop.
// • The ENTIRE head unit (face + hair + cap + tassel) is one rigid
//   group so nothing slides relative to the face when the head turns.
// • Micro-expressions per quote: eyebrows, eyelids (squint) and smile
//   shape driven by an emotion profile.
// • Always-on secondary life: blinking, breathing, head sway, tassel
//   sway, tie sway, blush pulse, breathing shadow.
// • Entrance rise + chapter pulse ring on every new quote.
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

// speech envelope: 1 = vowel (mouth open), 0 = consonant (mouth closed)
const SPEECH = QUOTES.map((q) =>
  q.split("").map((c) => (/[aeiouAEIOU]/i.test(c) ? 1 : 0))
);

// emotion profile per quote: brow rotation (pos = furrow), squint px,
// smile scaleX
const EMOTIONS = [
  { brow: -4, squint: 1.6, smile: 1.16 }, // intro wave — excited
  { brow: -1, squint: 1.0, smile: 1.06 }, // admission — confident
  { brow: 2.2, squint: 1.5, smile: 1.0 }, // loan point — focused
  { brow: -3, squint: 1.6, smile: 1.12 }, // support — warm
  { brow: -2.5, squint: 1.2, smile: 1.12 }, // CTA — strong
];

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
  const tieRef = useRef(null);
  const blushRef = useRef(null);
  const shadowRef = useRef(null);
  const ringRef = useRef(null);
  const armLRef = useRef(null);
  const armLElbowRef = useRef(null);
  const armRRef = useRef(null);
  const armRElbowRef = useRef(null);
  const mouthRef = useRef(null);
  const eyesRef = useRef(null);
  const browLRef = useRef(null);
  const browRRef = useRef(null);
  const lidLRef = useRef(null);
  const lidRRef = useRef(null);
  const hoverRef = useRef(false);
  const reducedRef = useRef(false);
  const enteredRef = useRef(false);

  const [qIndex, setQIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
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

  // ---- idle life: blink + breathe + head sway + secondary motion ----
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
      setOrigin(bodyRef.current, 100, 175);
      setOrigin(tasselRef.current, 126, 66);
      setOrigin(tieRef.current, 100, 148);
      setOrigin(browLRef.current, 95, 101);
      setOrigin(browRRef.current, 105, 101);
      setOrigin(shadowRef.current, 100, 236);
      setOrigin(armLRef.current, 62, 157);
      setOrigin(armLElbowRef.current, 62, 185);
      setOrigin(armRRef.current, 138, 157);
      setOrigin(armRElbowRef.current, 138, 185);
      setOrigin(mouthRef.current, 100, 126);
      setOrigin(eyesRef.current, 100, 109);
      setOrigin(breatheRef.current, 100, 205);

      // neutral resting pose
      if (mouthRef.current) gsap.set(mouthRef.current, { scaleY: 0.22, scaleX: 1 });
      if (lidLRef.current) gsap.set(lidLRef.current, { y: 0 });
      if (lidRRef.current) gsap.set(lidRRef.current, { y: 0 });

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

      // shadow breathes opposite to the body
      const shadowBreath = gsap.timeline({ repeat: -1, yoyo: true });
      shadowBreath
        .to(shadowRef.current, { scaleX: 1.04, scaleY: 0.94, duration: 2.1, ease: "sine.inOut" })
        .to(shadowRef.current, { scaleX: 1, scaleY: 1, duration: 2.3, ease: "sine.inOut" });

      // head sway (whole head unit — face, hair, cap — moves together)
      const sway = gsap.timeline({ repeat: -1, yoyo: true });
      sway
        .to(headIdleRef.current, { rotation: 1.2, duration: 2.2, ease: "sine.inOut" })
        .to(headIdleRef.current, { rotation: -1.2, duration: 2.4, ease: "sine.inOut" });

      // tassel sways lazily
      const tassel = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.4 });
      tassel.to(tasselRef.current, { rotation: 8, duration: 1.4, ease: "sine.inOut" })
        .to(tasselRef.current, { rotation: -8, duration: 1.6, ease: "sine.inOut" });

      // tie sways with the breath
      const tie = gsap.timeline({ repeat: -1, yoyo: true });
      tie.to(tieRef.current, { rotation: 1.4, duration: 2.1, ease: "sine.inOut" })
        .to(tieRef.current, { rotation: -1.2, duration: 2.3, ease: "sine.inOut" });

      // blush pulses faintly
      const blush = gsap.timeline({ repeat: -1, yoyo: true });
      blush.to(blushRef.current, { opacity: 0.65, duration: 2.6, ease: "sine.inOut" })
        .to(blushRef.current, { opacity: 0.4, duration: 2.8, ease: "sine.inOut" });

      // gentle scroll parallax lean (subtle — the character performs on its own)
      const tilt = gsap.quickTo(svgRef.current, "rotation", { duration: 0.5, ease: "power1.out" });
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

  // ---- chapter performance + typewriter + emotion + lipsync ----
  useEffect(() => {
    const full = QUOTES[qIndex];
    setTyped("");
    setDone(false);
    setCountdown(QUOTE_SECONDS);

    const emo = EMOTIONS[qIndex];

    let i = 0;
    const typeId = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(typeId);
        setDone(true);
      }
    }, 26);

    if (reducedRef.current || !svgRef.current || !figureRef.current) {
      return () => clearInterval(typeId);
    }

    const ctx = gsap.context(() => {
      // ---- entrance (first time only) ----
      if (!enteredRef.current) {
        enteredRef.current = true;
        gsap.fromTo(
          figureRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
        );
        gsap.fromTo(
          shadowRef.current,
          { opacity: 0, scaleX: 0.6, scaleY: 1.4 },
          { opacity: 1, scaleX: 1, scaleY: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
        );
      }

      // ---- chapter pulse ring ----
      gsap.fromTo(
        ringRef.current,
        { width: 0, height: 0, opacity: 0.5 },
        { width: 380, height: 380, opacity: 0, duration: 1.1, ease: "power2.out" }
      );

      // ---- life pop + shadow response ----
      gsap.fromTo(
        figureRef.current,
        { scale: 1 },
        { scale: 1.012, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" }
      );
      gsap.fromTo(
        shadowRef.current,
        { scaleX: 1, scaleY: 1 },
        { scaleX: 1.06, scaleY: 0.92, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out", delay: 0.02 }
      );

      // ---- micro-expression: brows + eyelids + smile ----
      const exp = gsap.timeline();
      exp.to(browLRef.current, { rotation: emo.brow, duration: 0.5, ease: "power3.out" }, 0.06)
        .to(browRRef.current, { rotation: emo.brow, duration: 0.5, ease: "power3.out" }, 0.06)
        .to(lidLRef.current, { y: emo.squint, duration: 0.5, ease: "power3.out" }, 0.06)
        .to(lidRRef.current, { y: emo.squint, duration: 0.5, ease: "power3.out" }, 0.06);

      // ---- chapter gesture ----
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

      // ---- syllable-synced lipsync over the actual caption ----
      const mouth = mouthRef.current;
      const envelope = SPEECH[qIndex];
      const step = TALK_MS / (envelope.length || 1);
      const talk = gsap.timeline({ delay: 0.1 });

      envelope.forEach((v, i) => {
        if (!v) return;
        const at = i * step;
        talk
          .to(mouth, { scaleY: 0.9, duration: 0.05, ease: "power2.out" }, at)
          .to(mouth, { scaleY: 0.28, duration: 0.07, ease: "power2.in" }, at + 0.055);
      });

      // gentle head bob while talking (separate so the talk timeline stays finite)
      const headBob = gsap.to(headRef.current, {
        y: -0.7,
        duration: 0.26,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.12,
      });

      // settle into the resting smile once the line is delivered
      talk.eventCallback("onComplete", () => {
        headBob.kill();
        gsap.to(headRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(mouth, { scaleY: 0.22, scaleX: emo.smile, duration: 0.45, ease: "power2.out" });
      });
    }, svgRef.current);

    return () => {
      clearInterval(typeId);
      ctx.revert();
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
                {!done && <span className="caret ml-0.5 inline-block w-[2px] h-3.5 bg-brand-400" />}
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

        {/* Chapter pulse ring */}
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full border-2 border-brand-400/40 opacity-0 pointer-events-none"
        />

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

            {/* Ground pedestal (responds to movement) */}
            <g ref={shadowRef}>
              <ellipse cx="100" cy="236" rx="56" ry="8" fill="rgba(56,189,248,0.08)" />
              <ellipse cx="100" cy="236" rx="44" ry="6" fill="rgba(0,0,0,0.5)" />
            </g>

            <g ref={figureRef}>
              <g ref={breatheRef}>
                {/* Trousers */}
                <path d="M87 192 L99 192 L100 226 L90 226 Q84 216 84 204 Z" fill="#0E1729" />
                <path d="M101 192 L113 192 L114 226 L110 226 Q116 216 116 204 Z" fill="#0E1729" />

                {/* Shoes */}
                <ellipse cx="90" cy="230" rx="11" ry="5" fill="#0A0F1C" />
                <ellipse cx="110" cy="230" rx="11" ry="5" fill="#0A0F1C" />
                <path d="M82 229 Q90 225 98 229" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />

                {/* Blazer torso — broad shoulders, tapered waist */}
                <g ref={bodyRef}>
                  <path
                    d="M57 157 Q63 150 88 149 Q93 148 100 148 Q107 148 112 149 Q137 150 143 157 Q145 163 143 169 Q142 177 137 181 L136 187 Q136 193 130 193 L70 193 Q64 193 64 187 L63 181 Q58 177 57 169 Q55 163 57 157 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.35)"
                    strokeWidth="1.5"
                  />
                  {/* shirt */}
                  <path d="M90 148 Q100 158 110 148 L110 155 Q100 170 90 155 Z" fill="#E9EFF7" />
                  {/* tie (sways with the breath) */}
                  <g ref={tieRef}>
                    <rect x="97" y="146" width="6" height="6" rx="1.5" fill="#FBBF24" />
                    <path d="M98 152 L102 152 L104 172 L100 178 L96 172 Z" fill="#FBBF24" />
                  </g>
                  {/* lapel notch */}
                  <path d="M88 149 L100 163 L112 149" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="2.6" strokeLinecap="round" />
                  {/* buttons + pocket */}
                  <circle cx="100" cy="173" r="2" fill="#FBBF24" />
                  <circle cx="100" cy="180" r="2" fill="#FBBF24" />
                  <path d="M116 172 L128 172" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Left arm — two joints, hangs with a natural elbow bend */}
                <g ref={armLRef}>
                  <path
                    d="M60 157 Q54 168 56 180 Q57 188 64 187 Q71 186 70 176 Q69 167 65 158 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="1.5"
                  />
                  <g ref={armLElbowRef}>
                    <path
                      d="M63 185 Q55 193 57 203 Q59 211 67 209 Q74 207 72 197 Q72 190 69 184 Z"
                      fill="url(#ggcBlazer)"
                      stroke="rgba(56,189,248,0.3)"
                      strokeWidth="1.5"
                    />
                    <rect x="59" y="201" width="13" height="5" rx="2" fill="#E9EFF7" transform="rotate(-6 66 204)" />
                    <circle cx="70" cy="211" r="6" fill="url(#ggcSkin)" />
                  </g>
                </g>

                {/* Right arm — two joints, hangs with a natural elbow bend */}
                <g ref={armRRef}>
                  <path
                    d="M140 157 Q146 168 144 180 Q143 188 136 187 Q129 186 130 176 Q131 167 135 158 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="1.5"
                  />
                  <g ref={armRElbowRef}>
                    <path
                      d="M137 185 Q145 193 143 203 Q141 211 133 209 Q126 207 128 197 Q128 190 131 184 Z"
                      fill="url(#ggcBlazer)"
                      stroke="rgba(56,189,248,0.3)"
                      strokeWidth="1.5"
                    />
                    <rect x="128" y="201" width="13" height="5" rx="2" fill="#E9EFF7" transform="rotate(6 134 204)" />
                    <circle cx="130" cy="211" r="6" fill="url(#ggcSkin)" />
                  </g>
                </g>

                {/* Neck + chin shadow (neck rides with the head, hidden under collar) */}
                <path d="M94 134 Q100 145 106 134 L106 144 Q100 154 94 144 Z" fill="#C98F63" />
                <path d="M93 134 Q100 143 107 134" stroke="rgba(0,0,0,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* Head unit — face + hair + cap + tassel as ONE rigid group */}
                <g ref={headRef}>
                  <g ref={headIdleRef}>
                    {/* face */}
                    <path
                      d="M76 88 Q74 104 81 121 Q88 137 100 139 Q112 137 119 121 Q126 104 124 88 Q121 76 100 74 Q79 76 76 88 Z"
                      fill="url(#ggcSkin)"
                    />
                    <circle cx="76" cy="110" r="4.5" fill="url(#ggcSkin)" />
                    <circle cx="124" cy="110" r="4.5" fill="url(#ggcSkin)" />

                    {/* blush (pulses faintly) */}
                    <g ref={blushRef}>
                      <circle cx="84" cy="127" r="4.5" fill="rgba(251,191,36,0.3)" />
                      <circle cx="116" cy="127" r="4.5" fill="rgba(251,191,36,0.3)" />
                    </g>

                    {/* brows (micro-expression) */}
                    <g ref={browLRef}>
                      <path d="M80 100 Q88 94 96 99" fill="none" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round" />
                    </g>
                    <g ref={browRRef}>
                      <path d="M104 99 Q112 94 120 100" fill="none" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round" />
                    </g>

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
                    <path d="M83 105.5 Q88 102.5 93 105.5" stroke="#C98F63" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    <path d="M107 105.5 Q112 102.5 117 105.5" stroke="#C98F63" strokeWidth="1.4" fill="none" strokeLinecap="round" />

                    {/* eyelids (squint on emotion) */}
                    <rect ref={lidLRef} x="82.5" y="101.5" width="11" height="4.5" rx="2.2" fill="#E3AC7E" />
                    <rect ref={lidRRef} x="106.5" y="101.5" width="11" height="4.5" rx="2.2" fill="#E3AC7E" />

                    {/* glasses */}
                    <circle cx="88" cy="109" r="8" fill="none" stroke="#38BDF8" strokeWidth="2" />
                    <circle cx="112" cy="109" r="8" fill="none" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M96 109 L104 109" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M80 106.5 L72 101.5" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M120 106.5 L128 101.5" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M93 105 Q89.5 103 86.5 104.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M117 105 Q120.5 103 123.5 104.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" />

                    {/* nose */}
                    <path d="M99 114 Q101 118 100 120" fill="none" stroke="#C98F63" strokeWidth="2" strokeLinecap="round" />
                    <path d="M95.5 118.5 Q97.5 121 100.5 120" fill="none" stroke="#C98F63" strokeWidth="1.4" strokeLinecap="round" />

                    {/* mouth (lipsync + smile) */}
                    <g ref={mouthRef}>
                      <ellipse cx="100" cy="127" rx="5.5" ry="6.5" fill="#4A1523" />
                      <path d="M96.5 129 Q100 133.5 103.5 129 Q100 136 96.5 129 Z" fill="#D96C7C" />
                      <rect x="96" y="121.5" width="8" height="2.2" rx="0.9" fill="#F7FAFC" />
                      <path d="M93 125 Q96 120 100 122.5 Q104 120 107 125" fill="none" stroke="#B4556B" strokeWidth="2.2" strokeLinecap="round" />
                    </g>
                  </g>

                  {/* hair — short, tucked under the cap band */}
                  <path
                    d="M76 92 Q73 73 100 71 Q127 73 124 92 Q118 95 100 94 Q82 95 76 92 Z"
                    fill="url(#ggcHair)"
                  />
                  <path d="M92 87 Q97 84 103 85" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" />

                  {/* cap — mortarboard, glued to the head unit */}
                  <g>
                    <ellipse cx="100" cy="68" rx="34" ry="6.5" fill="#0F172A" />
                    <ellipse cx="100" cy="66.5" rx="34" ry="6" fill="#1B2740" />
                    <path d="M74 84 Q100 77 126 84 L126 80 Q100 73 74 80 Z" fill="#0F172A" />
                    <path d="M74 82 Q100 75.5 126 82" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
                    <g ref={tasselRef}>
                      <path d="M124 66 Q132 57 137 59" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="139" cy="60" r="3.5" fill="#FBBF24" />
                    </g>
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
