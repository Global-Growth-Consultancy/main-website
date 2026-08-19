import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  FaCreditCard,
  FaShieldAlt,
  FaWifi,
  FaFileAlt,
  FaPen,
  FaSearch,
  FaCoins,
  FaCheckCircle,
  FaLandmark,
} from 'react-icons/fa';

// ------------------------------------------------------------------
// Animated counter (₹0 -> ₹4,00,000)
// ------------------------------------------------------------------
const Counter = ({ to = 400000, duration = 2.6, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(to * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      ₹{val.toLocaleString('en-IN')}
    </span>
  );
};

// ------------------------------------------------------------------
// Radial success ring (75% BSCC approval rate)
// ------------------------------------------------------------------
const SuccessRing = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const r = 56;
  const c = 2 * Math.PI * r;
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 2200;
    const tick = (now) => {
      const k = Math.min((now - start) / dur, 1);
      setP(0.75 * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="bsccRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE55C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="70"
          cy="70"
          r={r}
          stroke="url(#bsccRing)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - c * p }}
          transition={{ duration: 0.1 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-gradient-gold">75%</span>
        <span className="text-[10px] sm:text-xs text-neutral-400 mt-1 text-center leading-tight px-4">
          BSCC Loan<br />Approval Rate
        </span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// 3D tilt wrapper for the premium card
// ------------------------------------------------------------------
const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-full max-w-[340px] aspect-[1.586] rounded-2xl [perspective:1000px]"
    >
      {children}
    </motion.div>
  );
};

// ------------------------------------------------------------------
// The BSCC credit card visual
// ------------------------------------------------------------------
const LoanCard = () => (
  <div className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-500/10 bg-gradient-to-br from-[#0b1220] via-[#111c33] to-[#05080f]">
    {/* Ambient glows */}
    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-premium-gold/20 blur-3xl" />
    <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />
    {/* Grid */}
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    />
    {/* Shine sweep */}
    <motion.div
      initial={{ x: '-120%' }}
      animate={{ x: '320%' }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.4 }}
      className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-18deg]"
    />
    {/* Gold top edge */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-premium-gold/80 to-transparent" />

    {/* Content */}
    <div className="relative h-full p-4 sm:p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-premium-gold to-accent-500 flex items-center justify-center">
            <FaCreditCard className="text-white text-sm sm:text-base" />
          </div>
          <div>
            <p className="text-white font-bold text-sm sm:text-base leading-none tracking-wide">BSCC</p>
            <p className="text-[8px] sm:text-[10px] text-neutral-400 mt-0.5 tracking-widest">STUDENT CREDIT CARD</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <FaLandmark className="text-neutral-400 text-[10px] sm:text-xs" />
          <span className="text-[8px] sm:text-[10px] text-neutral-400 tracking-wider">GOVT. OF BIHAR</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-7 sm:w-11 sm:h-8 rounded-md bg-gradient-to-br from-premium-gold via-accent-300 to-accent-500 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-1 left-1 right-1 h-1/2 bg-black/30 rounded-sm" />
        </div>
        <FaWifi className="text-neutral-400 text-lg sm:text-xl -rotate-90" />
        <FaShieldAlt className="text-success-400/80 text-sm sm:text-base ml-auto" />
      </div>

      <div>
        <p className="text-[8px] sm:text-[10px] text-neutral-500 tracking-[0.25em] mb-1">SANCTIONED LOAN LIMIT</p>
        <p className="text-gradient-gold text-2xl sm:text-4xl font-bold tracking-tight">₹4,00,000</p>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[8px] sm:text-[10px] text-neutral-500 tracking-widest mb-0.5">STUDENT HOLDER</p>
          <p className="text-white font-semibold text-xs sm:text-sm tracking-wider">BACHAT KHATA</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] sm:text-[10px] text-neutral-500 tracking-widest mb-0.5">VALID TILL</p>
          <p className="text-white font-semibold text-xs sm:text-sm tracking-wider">2027</p>
        </div>
      </div>
    </div>

    {/* APPROVED badge */}
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 1, 0.85], scale: [0.6, 1, 1, 1, 1] }}
      transition={{ duration: 4, times: [0, 0.2, 0.7, 0.85, 1], repeat: Infinity, repeatDelay: 1.6 }}
      className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/20 border border-success-400/40 backdrop-blur-sm"
    >
      <FaCheckCircle className="text-success-400 text-[10px]" />
      <span className="text-[9px] font-semibold text-success-300 tracking-wider">APPROVED</span>
    </motion.div>
  </div>
);

// ------------------------------------------------------------------
// Orbiting rupee particles around the card
// ------------------------------------------------------------------
const OrbitField = () => {
  const particles = [
    { angle: 0, delay: 0 },
    { angle: 60, delay: 0.6 },
    { angle: 120, delay: 1.2 },
    { angle: 180, delay: 1.8 },
    { angle: 240, delay: 2.4 },
    { angle: 300, delay: 3.0 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-premium-gold/30 to-accent-500/30 border border-premium-gold/40 flex items-center justify-center text-premium-gold text-[10px] font-bold"
            style={{ transform: `rotate(${p.angle}deg) translateY(-148px) rotate(-${p.angle}deg)` }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          >
            ₹
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

// ------------------------------------------------------------------
// Application lifecycle rail
// ------------------------------------------------------------------
const ProcessRail = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const steps = [
    { icon: FaFileAlt, label: 'Documents' },
    { icon: FaPen, label: 'Application' },
    { icon: FaSearch, label: 'Verification' },
    { icon: FaCoins, label: 'Disbursal' },
  ];

  return (
    <div ref={ref} className="w-full">
      <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-premium-gold to-accent-400"
          initial={{ width: '0%' }}
          animate={inView ? { width: '100%' } : {}}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-premium-gold shadow-[0_0_12px_2px_rgba(255,215,0,0.6)]"
          style={{ left: "0%" }}
          initial={{ x: "0vw" }}
          animate={{ x: ["0vw", "calc(100% - 12px)", "0vw"] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="flex justify-between mt-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-500/12 border border-brand-500/18 flex items-center justify-center">
              <s.icon className="text-brand-400 text-xs sm:text-sm" />
            </div>
            <span className="text-[10px] sm:text-xs text-neutral-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Main visualizer panel
// ------------------------------------------------------------------
const BSCCVisualizer = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-premium-charcoal/60 backdrop-blur-sm shadow-2xl shadow-black/40">
      {/* Animated gradient border glow */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-gold/70 to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[220px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 p-6 sm:p-10 lg:p-14 items-center">
        {/* Left: loan status */}
        <div className="space-y-8">
          <div>
            <span className="text-brand-400 font-medium text-xs tracking-[0.2em] uppercase">Live Loan Status</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2 leading-tight">
              Sanctioned. <span className="text-gradient-gold">₹4,00,000.</span>
            </h3>
            <p className="text-neutral-400 text-sm sm:text-base mt-2 leading-relaxed">
              Track a BSCC application through every stage — from document collection to loan disbursal.
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8">
            <SuccessRing />
            <div className="space-y-2">
              <p className="text-[11px] sm:text-xs text-neutral-400 tracking-widest uppercase">Loan amount</p>
              <Counter className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-gold tracking-tight" />
              <div className="flex items-center gap-2 pt-1">
                <FaShieldAlt className="text-success-400 text-xs" />
                <span className="text-[11px] sm:text-xs text-neutral-300">100% Government Backed · No Collateral</span>
              </div>
            </div>
          </div>

          <ProcessRail />
        </div>

        {/* Right: the card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex items-center justify-center py-6"
        >
          <OrbitField />
          <div className="relative z-10 w-full max-w-[340px]">
            <TiltCard>
              <LoanCard />
            </TiltCard>
          </div>
          <motion.span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-neutral-500 tracking-[0.3em] uppercase"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Bihar Student Credit Card Scheme
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default BSCCVisualizer;
