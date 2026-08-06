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
  // New refs for enhanced body parts
  const legLRef = useRef(null);
  const legLKneeRef = useRef(null);
  const legRRef = useRef(null);
  const legRKneeRef = useRef(null);
  const handLRef = useRef(null);
  const handRRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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

  // ---- cursor following + hover reactions ----
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return undefined;

    const handleMouseMove = (e) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      // Eyes follow cursor
      if (eyesRef.current) {
        gsap.to(eyesRef.current, {
          x: deltaX * 4,
          y: deltaY * 2,
          duration: 0.3,
          ease: "power2.out"
        });
      }
      
      // Subtle head turn
      if (headRef.current) {
        gsap.to(headRef.current, {
          rotation: deltaX * 8,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    };

    root.addEventListener('mousemove', handleMouseMove);
    return () => root.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ---- hover-specific animations ----
  useEffect(() => {
    if (!svgRef.current) return;
    
    if (isHovered) {
      // Hover reaction: excited wave with both arms
      const hoverAnim = gsap.timeline();
      hoverAnim
        .to(armRRef.current, { rotation: -45, duration: 0.4, ease: "back.out(1.7)" }, 0)
        .to(armRElbowRef.current, { rotation: 35, duration: 0.4, ease: "back.out(1.7)" }, 0)
        .to(armLRef.current, { rotation: 35, duration: 0.4, ease: "back.out(1.7)" }, 0)
        .to(armLElbowRef.current, { rotation: -25, duration: 0.4, ease: "back.out(1.7)" }, 0)
        .to(mouthRef.current, { scaleY: 0.35, scaleX: 1.3, duration: 0.3, ease: "power2.out" }, 0)
        .to(browLRef.current, { rotation: -6, duration: 0.3, ease: "power2.out" }, 0)
        .to(browRRef.current, { rotation: -6, duration: 0.3, ease: "power2.out" }, 0)
        .to(bodyRef.current, { y: -3, duration: 0.3, ease: "power2.out" }, 0);
        
      return () => hoverAnim.kill();
    } else {
      // Return to idle
      gsap.to([armRRef.current, armLRef.current], { rotation: 0, duration: 0.5, ease: "power2.out" });
      gsap.to([armRElbowRef.current, armLElbowRef.current], { rotation: 6, duration: 0.5, ease: "power2.out" });
      gsap.to(mouthRef.current, { scaleY: 0.22, scaleX: 1, duration: 0.4, ease: "power2.out" });
      gsap.to([browLRef.current, browRRef.current], { rotation: 0, duration: 0.4, ease: "power2.out" });
      gsap.to(bodyRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
    }
  }, [isHovered]);

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
      // New leg origins
      setOrigin(legLRef.current, 88, 195);
      setOrigin(legLKneeRef.current, 88, 215);
      setOrigin(legRRef.current, 112, 195);
      setOrigin(legRKneeRef.current, 112, 215);

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

      // subtle leg movement (weight shift)
      const legShift = gsap.timeline({ repeat: -1, yoyo: true });
      legShift.to(legLRef.current, { rotation: 1.5, duration: 3.2, ease: "sine.inOut" }, 0)
        .to(legRRef.current, { rotation: -1.5, duration: 3.2, ease: "sine.inOut" }, 0);

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
      onMouseEnter={() => { hoverRef.current = true; setIsHovered(true); }}
      onMouseLeave={() => { hoverRef.current = false; setIsHovered(false); }}
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
                <stop offset="0.6" stopColor="#E3AC7E" />
                <stop offset="1" stopColor="#CF9766" />
              </radialGradient>
              <linearGradient id="ggcHair" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2E3B55" />
                <stop offset="1" stopColor="#0B1120" />
              </linearGradient>
              <radialGradient id="ggcCheek" cx="0.5" cy="0.5" r="0.8">
                <stop offset="0" stopColor="rgba(251,191,36,0.4)" />
                <stop offset="1" stopColor="rgba(251,191,36,0)" />
              </radialGradient>
              <linearGradient id="ggcLip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#D96C7C" />
                <stop offset="1" stopColor="#B4556B" />
              </linearGradient>
            </defs>

            {/* Ground pedestal (responds to movement) */}
            <g ref={shadowRef}>
              <ellipse cx="100" cy="236" rx="56" ry="8" fill="rgba(56,189,248,0.08)" />
              <ellipse cx="100" cy="236" rx="44" ry="6" fill="rgba(0,0,0,0.5)" />
            </g>

            <g ref={figureRef}>
              <g ref={breatheRef}>
                {/* Realistic Legs with knee joints */}
                {/* Left Leg */}
                <g ref={legLRef}>
                  {/* Upper leg (thigh) */}
                  <path 
                    d="M85 188 Q88 188 90 192 L88 210 Q86 210 84 206 Q82 200 83 194 Z" 
                    fill="#0E1729" 
                    stroke="rgba(56,189,248,0.2)" 
                    strokeWidth="1"
                  />
                  <g ref={legLKneeRef}>
                    {/* Lower leg (shin) */}
                    <path 
                      d="M86 212 Q88 215 87 222 Q85 228 82 230 Q80 228 81 222 Q82 215 85 212 Z" 
                      fill="#0E1729" 
                      stroke="rgba(56,189,248,0.2)" 
                      strokeWidth="1"
                    />
                    {/* Realistic shoe */}
                    <path 
                      d="M78 230 Q75 232 76 236 Q80 238 88 236 Q90 234 88 230 Q84 228 78 230 Z" 
                      fill="#0A0F1C" 
                      stroke="rgba(56,189,248,0.3)" 
                      strokeWidth="1"
                    />
                    <path d="M76 234 Q82 236 88 234" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
                    <ellipse cx="82" cy="235" rx="3" ry="1.5" fill="rgba(56,189,248,0.2)" />
                  </g>
                </g>

                {/* Right Leg */}
                <g ref={legRRef}>
                  {/* Upper leg (thigh) */}
                  <path 
                    d="M115 188 Q112 188 110 192 L112 210 Q114 210 116 206 Q118 200 117 194 Z" 
                    fill="#0E1729" 
                    stroke="rgba(56,189,248,0.2)" 
                    strokeWidth="1"
                  />
                  <g ref={legRKneeRef}>
                    {/* Lower leg (shin) */}
                    <path 
                      d="M114 212 Q112 215 113 222 Q115 228 118 230 Q120 228 119 222 Q118 215 115 212 Z" 
                      fill="#0E1729" 
                      stroke="rgba(56,189,248,0.2)" 
                      strokeWidth="1"
                    />
                    {/* Realistic shoe */}
                    <path 
                      d="M122 230 Q125 232 124 236 Q120 238 112 236 Q110 234 112 230 Q116 228 122 230 Z" 
                      fill="#0A0F1C" 
                      stroke="rgba(56,189,248,0.3)" 
                      strokeWidth="1"
                    />
                    <path d="M124 234 Q118 236 112 234" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
                    <ellipse cx="118" cy="235" rx="3" ry="1.5" fill="rgba(56,189,248,0.2)" />
                  </g>
                </g>

                {/* Blazer torso — broad shoulders, tapered waist with better proportions */}
                <g ref={bodyRef}>
                  <path
                    d="M55 155 Q62 145 88 144 Q94 143 100 143 Q106 143 112 144 Q138 145 145 155 Q148 162 145 170 Q143 180 138 185 L137 192 Q137 200 130 200 L70 200 Q63 200 63 192 L62 185 Q57 180 55 170 Q52 162 55 155 Z"
                    fill="url(#ggcBlazer)"
                    stroke="rgba(56,189,248,0.35)"
                    strokeWidth="1.5"
                  />
                  {/* Enhanced blazer with cloth folds */}
                  <path d="M60 160 Q65 165 70 160" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" opacity="0.5" />
                  <path d="M130 160 Q135 165 140 160" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" opacity="0.5" />
                  <path d="M62 175 Q65 185 68 175" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" opacity="0.4" />
                  <path d="M132 175 Q135 185 138 175" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" opacity="0.4" />
                  
                  {/* shirt with better shape */}
                  <path d="M88 144 Q100 158 112 144 L112 152 Q100 172 88 152 Z" fill="#E9EFF7" />
                  <path d="M92 150 Q100 165 108 150" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                  
                  {/* tie (sways with the breath) */}
                  <g ref={tieRef}>
                    <rect x="96" y="142" width="8" height="7" rx="2" fill="#FBBF24" />
                    <path d="M97 149 L103 149 L105 175 L100 182 L95 175 Z" fill="#FBBF24" />
                    <path d="M97 149 L103 149" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                  </g>
                  
                  {/* Enhanced lapel notch */}
                  <path d="M86 145 L100 162 L114 145" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="2.6" strokeLinecap="round" />
                  <path d="M88 148 L100 160 L112 148" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* buttons + pocket with better details */}
                  <circle cx="100" cy="175" r="2.5" fill="#FBBF24" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                  <circle cx="100" cy="183" r="2.5" fill="#FBBF24" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                  <path d="M115 174 L130 174" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M115 177 L128 177" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />
                  
                  {/* Shoulder pads for structure */}
                  <ellipse cx="62" cy="155" rx="8" ry="4" fill="rgba(0,0,0,0.1)" />
                  <ellipse cx="138" cy="155" rx="8" ry="4" fill="rgba(0,0,0,0.1)" />
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
                    {/* Realistic hand with fingers */}
                    <g ref={handLRef}>
                      <path 
                        d="M68 208 Q75 210 78 216 Q80 222 76 228 Q72 232 66 230 Q62 226 64 220 Q65 214 68 208 Z" 
                        fill="url(#ggcSkin)" 
                        stroke="rgba(0,0,0,0.1)" 
                        strokeWidth="1"
                      />
                      {/* Fingers */}
                      <path d="M66 210 Q67 205 68 201" stroke="url(#ggcSkin)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M70 211 Q72 206 73 202" stroke="url(#ggcSkin)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M74 212 Q76 207 77 203" stroke="url(#ggcSkin)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M78 214 Q80 210 81 207" stroke="url(#ggcSkin)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                      {/* Thumb */}
                      <path d="M64 215 Q60 213 58 216" stroke="url(#ggcSkin)" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </g>
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
                    {/* Realistic hand with fingers */}
                    <g ref={handRRef}>
                      <path 
                        d="M132 208 Q125 210 122 216 Q120 222 124 228 Q128 232 134 230 Q138 226 136 220 Q135 214 132 208 Z" 
                        fill="url(#ggcSkin)" 
                        stroke="rgba(0,0,0,0.1)" 
                        strokeWidth="1"
                      />
                      {/* Fingers */}
                      <path d="M134 210 Q133 205 132 201" stroke="url(#ggcSkin)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M130 211 Q128 206 127 202" stroke="url(#ggcSkin)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M126 212 Q124 207 123 203" stroke="url(#ggcSkin)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M122 214 Q120 210 119 207" stroke="url(#ggcSkin)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                      {/* Thumb */}
                      <path d="M136 215 Q140 213 142 216" stroke="url(#ggcSkin)" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </g>
                  </g>
                </g>

                {/* Neck + chin shadow (neck rides with the head, hidden under collar) */}
                <path d="M94 134 Q100 145 106 134 L106 144 Q100 154 94 144 Z" fill="#C98F63" />
                <path d="M93 134 Q100 143 107 134" stroke="rgba(0,0,0,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* Head unit — face + hair + cap + tassel as ONE rigid group */}
                <g ref={headRef}>
                  <g ref={headIdleRef}>
                    {/* Enhanced face with better proportions */}
                    <path
                      d="M74 86 Q72 102 79 119 Q86 135 100 137 Q114 135 121 119 Q128 102 126 86 Q123 72 100 70 Q77 72 74 86 Z"
                      fill="url(#ggcSkin)"
                    />
                    {/* Ear contours */}
                    <ellipse cx="73" cy="108" rx="3" ry="5" fill="url(#ggcSkin)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                    <ellipse cx="127" cy="108" rx="3" ry="5" fill="url(#ggcSkin)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

                    {/* Enhanced blush with gradient */}
                    <g ref={blushRef}>
                      <ellipse cx="82" cy="125" rx="6" ry="4" fill="url(#ggcCheek)" />
                      <ellipse cx="118" cy="125" rx="6" ry="4" fill="url(#ggcCheek)" />
                    </g>

                    {/* Enhanced brows (micro-expression) */}
                    <g ref={browLRef}>
                      <path d="M78 98 Q86 92 94 97" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
                    </g>
                    <g ref={browRRef}>
                      <path d="M106 97 Q114 92 122 98" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
                    </g>

                    {/* Enhanced eyes (blink + look) with better details */}
                    <g ref={eyesRef}>
                      <ellipse cx="88" cy="108" rx="5" ry="4.5" fill="#FFF8F0" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                      <ellipse cx="112" cy="108" rx="5" ry="4.5" fill="#FFF8F0" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                      <circle cx="88" cy="108" r="3.2" fill="#4A2A18" />
                      <circle cx="112" cy="108" r="3.2" fill="#4A2A18" />
                      <circle cx="88" cy="108" r="1.5" fill="#140C08" />
                      <circle cx="112" cy="108" r="1.5" fill="#140C08" />
                      <circle cx="89.5" cy="107" r="1.2" fill="#fff" opacity="0.9" />
                      <circle cx="113.5" cy="107" r="1.2" fill="#fff" opacity="0.9" />
                      {/* Eyelid crease */}
                      <path d="M83 104 Q88 102 93 104" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
                      <path d="M107 104 Q112 102 117 104" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
                    </g>
                    <path d="M83 104.5 Q88 101.5 93 104.5" stroke="#C98F63" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    <path d="M107 104.5 Q112 101.5 117 104.5" stroke="#C98F63" strokeWidth="1.4" fill="none" strokeLinecap="round" />

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

                    {/* Enhanced mouth (lipsync + smile) with better shape */}
                    <g ref={mouthRef}>
                      <ellipse cx="100" cy="126" rx="6" ry="7" fill="#4A1523" />
                      <path d="M95 128 Q100 133 105 128 Q100 137 95 128 Z" fill="url(#ggcLip)" />
                      <rect x="95" y="120" width="10" height="2.5" rx="1" fill="#F7FAFC" />
                      <path d="M92 124 Q96 119 100 121.5 Q104 119 108 124" fill="none" stroke="#B4556B" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Lip highlight */}
                      <path d="M96 125 Q100 123 104 125" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    </g>
                  </g>

                  {/* Enhanced hair — short, tucked under the cap band with texture */}
                  <path
                    d="M74 90 Q71 71 100 69 Q129 71 126 90 Q120 93 100 92 Q80 93 74 90 Z"
                    fill="url(#ggcHair)"
                  />
                  {/* Hair texture strands */}
                  <path d="M78 82 Q85 78 92 82" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M92 78 Q97 75 103 78" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M108 82 Q115 78 122 82" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M95 85 Q100 82 105 85" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round" />

                  {/* Enhanced cap — mortarboard, glued to the head unit */}
                  <g>
                    <ellipse cx="100" cy="66" rx="36" ry="7" fill="#0F172A" />
                    <ellipse cx="100" cy="64.5" rx="36" ry="6.5" fill="#1B2740" />
                    <path d="M72 82 Q100 75 128 82 L128 78 Q100 71 72 78 Z" fill="#0F172A" />
                    <path d="M72 80 Q100 73.5 128 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    {/* Cap texture */}
                    <path d="M75 79 Q100 73 125 79" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                    <g ref={tasselRef}>
                      <path d="M126 64 Q134 55 139 57" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="141" cy="58" r="4" fill="#FBBF24" />
                      <circle cx="141" cy="58" r="2" fill="rgba(0,0,0,0.2)" />
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
