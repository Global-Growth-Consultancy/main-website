import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion, useScroll, useTransform, useMotionValue, useSpring,
  useInView,
} from "framer-motion";
import {
  FaArrowRight, FaGraduationCap, FaUniversity, FaHandHoldingUsd,
  FaCheckCircle, FaShieldAlt, FaWhatsapp,
} from "react-icons/fa";
import StudentPerformer from "./StudentPerformer";

// ------------------------------------------------------------------
// CountUp — animates a number from 0 → target over 2s on scroll.
// ------------------------------------------------------------------
const CountUp = ({ value, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 2000;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(value * ease));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{prefix}{display.toLocaleString("en-IN")}{suffix}</span>;
};

// ------------------------------------------------------------------
// Animation variants
// ------------------------------------------------------------------
const lineReveal = {
  hidden: { y: "110%", rotate: 2, opacity: 0 },
  show: (i) => ({
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 22,
      stiffness: 90,
      delay: 0.2 + i * 0.1,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 + i * 0.12 },
  }),
};

const headlineLines = [
  { text: "Your Dream.", className: "text-white" },
  { text: "Our Mission.", className: "text-gradient" },
  { text: "Funded. Guided. Achieved.", className: "shimmer-gold" },
];

const statChips = [
  { icon: FaGraduationCap, value: 5000, label: "Students Guided", suffix: "+", tint: "brand" },
  { icon: FaUniversity, value: 200, label: "Partner Colleges", suffix: "+", tint: "violet" },
  { icon: FaCheckCircle, value: 95, label: "Success Rate", suffix: "%", tint: "success" },
  { icon: FaHandHoldingUsd, value: 50, label: "Loans Approved", prefix: "₹", suffix: " Cr+", tint: "gold" },
];

const marqueeWords = [
  "College Admissions",
  "BSCC Loans",
  "Career Counseling",
  "Document Processing",
  "IIT · NIT · Medical",
  "0% Interest Funding",
  "200+ Partner Colleges",
  "95% Success Rate",
];

// Aurora blob configs — each drifts independently
const auroraBlobs = [
  {
    className: "absolute -top-48 -right-40 w-[720px] h-[720px] rounded-full",
    bg: "radial-gradient(circle at center, rgba(56,189,248,0.16), transparent 62%)",
    animate: { x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.94, 1] },
    dur: 10,
  },
  {
    className: "absolute top-1/3 -left-48 w-[640px] h-[640px] rounded-full",
    bg: "radial-gradient(circle at center, rgba(167,139,250,0.12), transparent 62%)",
    animate: { x: [0, -35, 25, 0], y: [0, 25, -15, 0], scale: [1, 0.92, 1.06, 1] },
    dur: 12,
  },
  {
    className: "absolute -bottom-52 left-1/4 w-[680px] h-[680px] rounded-full",
    bg: "radial-gradient(circle at center, rgba(251,191,36,0.09), transparent 62%)",
    animate: { x: [0, 30, -40, 0], y: [0, -20, 30, 0], scale: [1, 1.06, 0.9, 1] },
    dur: 14,
  },
  {
    className: "absolute -bottom-32 -right-32 w-[560px] h-[560px] rounded-full",
    bg: "radial-gradient(circle at center, rgba(236,72,153,0.08), transparent 62%)",
    animate: { x: [0, -25, 35, 0], y: [0, 30, -25, 0], scale: [1, 1.1, 0.92, 1] },
    dur: 9,
  },
];

const PremiumHero = () => {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const yMove = useTransform(scrollY, [0, 400], [0, 60]);
  const scale = useTransform(scrollY, [0, 420], [1, 0.96]);
  const blur = useTransform(scrollY, [0, 420], ["blur(0px)", "blur(2px)"]);

  // Parallax pointer for the floating stat cards
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const cardX = useSpring(px, { stiffness: 60, damping: 16 });
  const cardY = useSpring(py, { stiffness: 60, damping: 16 });

  // 3D tilt derived from pointer
  const rotateY = useTransform(cardX, [-11, 11], [-6, 6]);
  const rotateX = useTransform(cardY, [-9, 9], [5, -5]);

  const onMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(((e.clientX - rect.left) / rect.width - 0.5) * 22);
    py.set(((e.clientY - rect.top) / rect.height - 0.5) * 18);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={() => { px.set(0); py.set(0); }}
      className="relative min-h-screen flex flex-col bg-premium-navy overflow-hidden"
    >
      {/* Flash on mount */}
      <motion.div
        initial={{ opacity: 0.06 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0 bg-white pointer-events-none z-50"
      />

      {/* ---------------- Ambient background ---------------- */}
      {/* Animated aurora blobs */}
      <motion.div style={{ opacity, y: yMove }} className="absolute inset-0 pointer-events-none">
        {auroraBlobs.map((blob, i) => (
          <motion.div
            key={i}
            className={blob.className}
            style={{ background: blob.bg }}
            animate={blob.animate}
            transition={{
              duration: blob.dur,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.6) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent)",
        }}
      />

      {/* ---------------- Content ---------------- */}
      <motion.div style={{ opacity, scale, filter: blur }} className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ---------- Left: Copy ---------- */}
          <div className="lg:col-span-7">
            {/* Badge — with scale bounce */}
            <motion.div
              variants={fadeUp} custom={0} initial="hidden" animate="show"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30"
              whileInView={{ scale: [0.92, 1.04, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-brand-400" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-300 tracking-wide">
                Bihar&apos;s #1 Education Consultancy
              </span>
            </motion.div>

            {/* Headline with masked word reveal — spring physics */}
            <h1 className="mt-6 text-[2.6rem] leading-[1.04] sm:text-6xl md:text-7xl font-display font-bold tracking-tight">
              {headlineLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1">
                  <motion.span
                    custom={i}
                    variants={lineReveal}
                    initial="hidden"
                    animate="show"
                    className={`block ${line.className}`}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp} custom={1} initial="hidden" animate="show"
              className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl"
            >
              From college admissions to <span className="text-neutral-200 font-medium">Bihar Student Credit Card</span>{" "}
              education loans — GGC turns your academic aspirations into an approved, fully-funded reality.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                to="/contact"
                className="btn-premium glow-effect inline-flex items-center justify-center gap-2 text-sm sm:text-base px-7 py-3.5 group"
              >
                <span>Get Free Consultation</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20want%20a%20free%20consultation%20for%20my%20admission%20and%20BSCC%20loan."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium-outline inline-flex items-center justify-center gap-2 text-sm sm:text-base px-7 py-3.5"
              >
                <FaWhatsapp className="text-base" />
                <span>WhatsApp Us</span>
              </a>
            </motion.div>
          </div>

          {/* ---------- Right: Network visual + floating cards ---------- */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="relative"
              style={{ perspective: 800 }}
            >
              {/* Glow behind the frame */}
              <div className="absolute -inset-8 rounded-[2rem] pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.14), rgba(167,139,250,0.06) 45%, transparent 70%)" }}
              />

              {/* Code-built "video" player: student mascot acts out a story */}
              <StudentPerformer />

              {/* Floating stat cards — 3D tilt + parallax */}
              <motion.div
                style={{
                  x: cardX,
                  y: cardY,
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="absolute -left-2 sm:-left-6 -bottom-4 sm:bottom-8 glass rounded-2xl px-4 py-3 border border-white/10 shadow-soft"
              >
                {/* Animated border glow */}
                <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "conic-gradient(from 0deg, rgba(56,189,248,0.3), rgba(167,139,250,0.2), rgba(251,191,36,0.3), rgba(56,189,248,0.3))",
                    animation: "spin 4s linear infinite",
                    filter: "blur(2px)",
                  }}
                />
                <div className="flex items-center gap-3" style={{ transform: "translateZ(18px)" }}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-success-500/20 flex items-center justify-center">
                    <FaShieldAlt className="text-success-400 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white leading-tight">BSCC · 0% Interest</p>
                    <p className="text-[10px] sm:text-xs text-neutral-400">Up to ₹4 Lakh, No Collateral</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                style={{
                  x: cardX,
                  y: cardY,
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="absolute -right-2 sm:-right-4 -top-4 glass rounded-2xl px-4 py-3 border border-white/10 shadow-soft"
              >
                <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "conic-gradient(from 180deg, rgba(56,189,248,0.3), rgba(251,191,36,0.2), rgba(167,139,250,0.3), rgba(56,189,248,0.3))",
                    animation: "spin 4s linear infinite",
                    filter: "blur(2px)",
                  }}
                />
                <div className="flex items-center gap-3" style={{ transform: "translateZ(18px)" }}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <FaCheckCircle className="text-brand-400 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white leading-tight">70–80% Approval</p>
                    <p className="text-[10px] sm:text-xs text-neutral-400">BSCC Applications</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ---------- Stat strip with CountUp ---------- */}
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statChips.map((chip, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5"
              whileHover={{ scale: 1.04, borderColor: "rgba(56,189,248,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                chip.tint === "brand" ? "bg-brand-500/15 text-brand-400"
                : chip.tint === "violet" ? "bg-violet-500/15 text-violet-300"
                : chip.tint === "success" ? "bg-success-500/15 text-success-400"
                : "bg-accent-500/15 text-accent-300"
              }`}>
                <chip.icon className="text-sm sm:text-base" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-white leading-none">
                  <CountUp
                    value={chip.value}
                    prefix={chip.prefix || ""}
                    suffix={chip.suffix || ""}
                  />
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-400 mt-1">{chip.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ---------------- Marquee strip with edge fade ---------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 border-t border-white/5 py-4 bg-premium-dark/40 backdrop-blur-sm overflow-hidden group"
      >
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(10,15,28,1), transparent)" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(10,15,28,1), transparent)" }}
        />

        <div className="flex w-max whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1, 2].map((dup) => (
            <div key={dup} className="flex flex-shrink-0 items-center">
              {marqueeWords.map((word, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6 text-sm font-medium text-neutral-500">{word}</span>
                  <motion.span
                    className="text-brand-400/70 text-[8px]"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.25,
                    }}
                  >
                    ●
                  </motion.span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PremiumHero;
