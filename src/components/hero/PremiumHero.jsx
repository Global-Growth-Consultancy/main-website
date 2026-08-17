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
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * ease));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{prefix}{display.toLocaleString("en-IN")}{suffix}</span>;
};

const lineReveal = {
  hidden: { y: "115%", rotateX: 15, rotateZ: 2, opacity: 0, filter: "blur(6px)" },
  show: (i) => ({
    y: "0%", rotateX: 0, rotateZ: 0, opacity: 1, filter: "blur(0px)",
    transition: { type: "spring", damping: 20, stiffness: 80, delay: 0.3 + i * 0.12 },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 35, filter: "blur(4px)" },
  show: (i) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.7 + i * 0.14 },
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
  "College Admissions", "BSCC Loans", "Career Counseling",
  "Document Processing", "IIT · NIT · Medical", "0% Interest Funding",
  "200+ Partner Colleges", "95% Success Rate",
];

const auroraBlobs = [
  { className: "absolute -top-32 -right-24 w-[600px] h-[600px] rounded-full", bg: "radial-gradient(circle at center, rgba(56,189,248,0.22), rgba(167,139,250,0.08) 45%, transparent 65%)", animate: { x: [0, 50, -30, 0], y: [0, -40, 25, 0], scale: [1, 1.12, 0.92, 1] }, dur: 10 },
  { className: "absolute top-1/4 -left-32 w-[520px] h-[520px] rounded-full", bg: "radial-gradient(circle at center, rgba(167,139,250,0.18), rgba(56,189,248,0.06) 45%, transparent 65%)", animate: { x: [0, -45, 35, 0], y: [0, 30, -20, 0], scale: [1, 0.90, 1.08, 1] }, dur: 12 },
  { className: "absolute -bottom-40 left-1/3 w-[580px] h-[580px] rounded-full", bg: "radial-gradient(circle at center, rgba(251,191,36,0.14), rgba(236,72,153,0.06) 45%, transparent 65%)", animate: { x: [0, 40, -50, 0], y: [0, -25, 35, 0], scale: [1, 1.08, 0.88, 1] }, dur: 14 },
  { className: "absolute -bottom-20 -right-16 w-[480px] h-[480px] rounded-full", bg: "radial-gradient(circle at center, rgba(236,72,153,0.12), rgba(167,139,250,0.06) 45%, transparent 65%)", animate: { x: [0, -30, 45, 0], y: [0, 35, -30, 0], scale: [1, 1.14, 0.90, 1] }, dur: 9 },
  { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full", bg: "radial-gradient(circle at center, rgba(56,189,248,0.10), rgba(125,211,252,0.04) 45%, transparent 65%)", animate: { x: [0, 20, -15, 0], y: [0, -18, 22, 0], scale: [1, 1.05, 0.95, 1] }, dur: 16 },
];

const PremiumHero = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // ── Parallax depth: each layer drifts at a different rate (no opacity fade, no blur) ──
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const robotY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const subtleScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  // Robot 3D tilt based on scroll
  const robotRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 3]);
  const robotRotateY = useTransform(scrollYProgress, [0, 0.5], [0, -2]);

  // Stat cards parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const cardX = useSpring(px, { stiffness: 60, damping: 16 });
  const cardY = useSpring(py, { stiffness: 60, damping: 16 });
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
      style={{ perspective: "1200px" }}
    >
      {/* Flash on mount */}
      <motion.div
        initial={{ opacity: 0.06 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0 bg-white pointer-events-none z-50"
      />

      {/* ── Aurora background (slowest parallax layer) ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none will-change-transform">
        {auroraBlobs.map((blob, i) => (
          <motion.div
            key={i}
            className={blob.className}
            style={{ background: blob.bg }}
            animate={blob.animate}
            transition={{ duration: blob.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(148,163,184,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.6) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent)",
        }}
      />

      {/* Gradient mesh depth layer */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(56,189,248,0.06), transparent),
            radial-gradient(ellipse 50% 40% at 80% 60%, rgba(167,139,250,0.05), transparent),
            radial-gradient(ellipse 40% 35% at 50% 80%, rgba(251,191,36,0.03), transparent)
          `,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ── Left: Copy (medium parallax) ── */}
          <motion.div style={{ y: textY, scale: subtleScale }} className="lg:col-span-6 will-change-transform">
            {/* Badge */}
            <motion.div
              variants={fadeUp} custom={0} initial="hidden" animate="show"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-500/30"
              style={{
                background: "linear-gradient(135deg, rgba(56,189,248,0.10), rgba(167,139,250,0.05))",
                boxShadow: "0 0 20px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
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

            {/* Headline */}
            <h1 className="mt-4 text-[1.85rem] leading-[1.08] sm:text-6xl md:text-7xl font-display font-bold tracking-tight" style={{ perspective: "800px" }}>
              {headlineLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1.5">
                  <motion.span
                    custom={i}
                    variants={lineReveal}
                    initial="hidden"
                    animate="show"
                    className={`block ${line.className}`}
                    style={{ transformOrigin: "left bottom" }}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp} custom={1} initial="hidden" animate="show"
              className="mt-4 sm:mt-6 text-sm sm:text-lg text-neutral-400 leading-relaxed max-w-xl"
            >
              From college admissions to{" "}
              <span className="text-neutral-200 font-semibold relative">
                Bihar Student Credit Card
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-brand-400/50 via-brand-300/30 to-transparent" />
              </span>{" "}
              education loans — GGC turns your academic aspirations into an approved, fully-funded reality.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-4"
            >
              <Link
                to="/contact"
                className="btn-premium glow-effect inline-flex items-center justify-center gap-2 text-sm sm:text-base px-7 py-3.5 group relative overflow-hidden"
              >
                <span className="relative z-10">Get Free Consultation</span>
                <FaArrowRight className="relative z-10 text-xs group-hover:translate-x-1.5 transition-transform duration-300" />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                />
              </Link>
              <a
                href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20want%20a%20free%20consultation%20for%20my%20admission%20and%20BSCC%20loan."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium-outline inline-flex items-center justify-center gap-2 text-sm sm:text-base px-7 py-3.5 group relative overflow-hidden"
              >
                <FaWhatsapp className="relative z-10 text-base group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">WhatsApp Us</span>
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: Robot (slowest content parallax + 3D tilt) ── */}
          <motion.div
            style={{ y: robotY, rotateX: robotRotateX, rotateY: robotRotateY, transformStyle: "preserve-3d" }}
            className="lg:col-span-6 will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40, rotateY: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="relative"
              style={{ perspective: 900 }}
            >
              {/* Glow behind frame */}
              <div className="absolute -inset-12 rounded-[2.5rem] pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.18), rgba(167,139,250,0.10) 35%, rgba(251,191,36,0.04) 55%, transparent 75%)" }}
              />
              <div className="absolute -inset-6 rounded-[2rem] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 60% 35%, rgba(56,189,248,0.12), transparent 60%)" }}
              />

              <StudentPerformer />

              {/* Floating stat card 1 */}
              <motion.div
                style={{ x: cardX, y: cardY, rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="absolute left-2 sm:left-6 bottom-4 sm:bottom-8 z-40"
              >
                <div
                  className="rounded-2xl px-4 py-3 border border-white/15 shadow-2xl transform-gpu"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                    boxShadow: "0 20px 50px -20px rgba(56,189,248,0.25), 0 8px 24px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10)",
                  }}
                >
                  <div className="flex items-center gap-3" style={{ transform: "translateZ(20px)" }}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-success-500/25 flex items-center justify-center shrink-0"
                      style={{ boxShadow: "0 0 16px rgba(52,211,153,0.3)" }}
                    >
                      <FaShieldAlt className="text-success-400 text-sm sm:text-base block" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white leading-tight">BSCC · 0% Interest</p>
                      <p className="text-[10px] sm:text-xs text-neutral-400">Up to ₹4 Lakh, No Collateral</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating stat card 2 */}
              <motion.div
                style={{ x: cardX, y: cardY, rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="absolute right-2 sm:right-6 top-3 sm:top-5 z-40"
              >
                <div
                  className="rounded-2xl px-4 py-3 border border-white/15 shadow-2xl transform-gpu"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                    boxShadow: "0 20px 50px -20px rgba(167,139,250,0.25), 0 8px 24px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10)",
                  }}
                >
                  <div className="flex items-center gap-3" style={{ transform: "translateZ(20px)" }}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500/25 flex items-center justify-center shrink-0"
                      style={{ boxShadow: "0 0 16px rgba(56,189,248,0.3)" }}
                    >
                      <FaCheckCircle className="text-brand-400 text-sm sm:text-base block" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white leading-tight">70–80% Approval</p>
                      <p className="text-[10px] sm:text-xs text-neutral-400">BSCC Applications</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stat strip ── */}
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
        >
          {statChips.map((chip, i) => (
            <motion.div
              key={i}
              className="relative flex items-center gap-3 rounded-2xl border border-white/[0.08] px-3 py-2.5 sm:px-4 sm:py-3.5 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                backdropFilter: "blur(8px)",
              }}
              whileHover={{
                scale: 1.04,
                borderColor: "rgba(56,189,248,0.35)",
                boxShadow: "0 20px 40px -20px rgba(56,189,248,0.2), 0 0 30px -10px rgba(56,189,248,0.15)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={`relative w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                chip.tint === "brand" ? "bg-brand-500/18 text-brand-400"
                : chip.tint === "violet" ? "bg-violet-500/18 text-violet-300"
                : chip.tint === "success" ? "bg-success-500/18 text-success-400"
                : "bg-accent-500/18 text-accent-300"
              }`}
                style={{
                  boxShadow: chip.tint === "brand" ? "0 0 14px rgba(56,189,248,0.2)"
                    : chip.tint === "violet" ? "0 0 14px rgba(167,139,250,0.2)"
                    : chip.tint === "success" ? "0 0 14px rgba(52,211,153,0.2)"
                    : "0 0 14px rgba(251,191,36,0.2)"
                }}
              >
                <chip.icon className="text-sm sm:text-base" />
              </div>
              <div className="relative">
                <div className="text-base sm:text-lg font-bold text-white leading-none">
                  <CountUp value={chip.value} prefix={chip.prefix || ""} suffix={chip.suffix || ""} />
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-400 mt-1">{chip.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Marquee strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="hidden sm:block relative z-10 border-t border-white/[0.06] py-4 bg-gradient-to-r from-premium-dark/60 via-premium-navy/80 to-premium-dark/60 backdrop-blur-md overflow-hidden group"
      >
        <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(10,15,28,1), transparent)" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(10,15,28,1), transparent)" }}
        />
        <div className="flex w-max whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1, 2].map((dup) => (
            <div key={dup} className="flex flex-shrink-0 items-center">
              {marqueeWords.map((word, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6 text-sm font-medium text-neutral-400/80 tracking-wide">{word}</span>
                  <span className="text-brand-400/40 text-[6px]">&#9670;</span>
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
