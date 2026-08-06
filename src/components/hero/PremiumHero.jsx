import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  FaArrowRight, FaGraduationCap, FaUniversity, FaHandHoldingUsd,
  FaCheckCircle, FaShieldAlt, FaWhatsapp,
} from "react-icons/fa";
import NexusField from "./NexusField";

// ------------------------------------------------------------------
// Word-by-word masked reveal for the headline.
// ------------------------------------------------------------------
const lineReveal = {
  hidden: { y: "110%", rotate: 2, opacity: 0 },
  show: (i) => ({
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.14 },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 + i * 0.12 },
  }),
};

const headlineLines = [
  { text: "Your Dream.", className: "text-white" },
  { text: "Our Mission.", className: "text-gradient" },
  { text: "Funded. Guided. Achieved.", className: "shimmer-gold" },
];

const statChips = [
  { icon: FaGraduationCap, value: "5000+", label: "Students Guided", tint: "brand" },
  { icon: FaUniversity, value: "200+", label: "Partner Colleges", tint: "violet" },
  { icon: FaCheckCircle, value: "95%", label: "Success Rate", tint: "success" },
  { icon: FaHandHoldingUsd, value: "₹50 Cr+", label: "Loans Approved", tint: "gold" },
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

const PremiumHero = () => {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const yMove = useTransform(scrollY, [0, 400], [0, 60]);

  // Parallax pointer for the floating stat cards
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const cardX = useSpring(px, { stiffness: 60, damping: 16 });
  const cardY = useSpring(py, { stiffness: 60, damping: 16 });

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
      {/* ---------------- Ambient background ---------------- */}
      {/* Aurora blobs — cheap radial gradients, no blur filters */}
      <motion.div style={{ opacity, y: yMove }} className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 -right-40 w-[720px] h-[720px] rounded-full"
          style={{ background: "radial-gradient(circle at center, rgba(56,189,248,0.16), transparent 62%)" }} />
        <div className="absolute top-1/3 -left-48 w-[640px] h-[640px] rounded-full"
          style={{ background: "radial-gradient(circle at center, rgba(167,139,250,0.12), transparent 62%)" }} />
        <div className="absolute -bottom-52 left-1/4 w-[680px] h-[680px] rounded-full"
          style={{ background: "radial-gradient(circle at center, rgba(251,191,36,0.09), transparent 62%)" }} />
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
      <motion.div style={{ opacity }} className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-40 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ---------- Left: Copy ---------- */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <motion.div
              variants={fadeUp} custom={0} initial="hidden" animate="show"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30"
            >
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-brand-400" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-300 tracking-wide">
                Bihar&apos;s #1 Education Consultancy
              </span>
            </motion.div>

            {/* Headline with masked word reveal */}
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
            >
              {/* Glow behind the frame */}
              <div className="absolute -inset-8 rounded-[2rem] pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.14), rgba(167,139,250,0.06) 45%, transparent 70%)" }}
              />

              {/* Frame */}
              <div className="relative rounded-3xl border border-white/10 bg-premium-charcoal/60 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
                {/* Top hairline */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

                {/* Header row of the "card" */}
                <div className="relative px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-success-400/80" />
                    <span className="w-2 h-2 rounded-full bg-accent-400/80" />
                    <span className="w-2 h-2 rounded-full bg-brand-400/80" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                    GGC Network · Live
                  </span>
                </div>

                {/* Canvas */}
                <div className="relative h-[300px] sm:h-[360px] md:h-[400px]">
                  <NexusField />
                  {/* Legibility fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating stat cards (parallax with pointer) */}
              <motion.div
                style={{ x: cardX, y: cardY }}
                className="absolute -left-2 sm:-left-6 -bottom-4 sm:bottom-8 glass rounded-2xl px-4 py-3 border border-white/10 shadow-soft"
              >
                <div className="flex items-center gap-3">
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
                style={{ x: cardX, y: cardY }}
                className="absolute -right-2 sm:-right-4 -top-4 glass rounded-2xl px-4 py-3 border border-white/10 shadow-soft"
              >
                <div className="flex items-center gap-3">
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

        {/* ---------- Stat strip ---------- */}
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statChips.map((chip, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                chip.tint === "brand" ? "bg-brand-500/15 text-brand-400"
                : chip.tint === "violet" ? "bg-violet-500/15 text-violet-300"
                : chip.tint === "success" ? "bg-success-500/15 text-success-400"
                : "bg-accent-500/15 text-accent-300"
              }`}>
                <chip.icon className="text-sm sm:text-base" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-white leading-none">{chip.value}</div>
                <div className="text-[11px] sm:text-xs text-neutral-400 mt-1">{chip.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ---------------- Marquee strip ---------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 border-t border-white/5 py-4 bg-premium-dark/40 backdrop-blur-sm overflow-hidden group"
      >
        <div className="flex w-max whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1, 2].map((dup) => (
            <div key={dup} className="flex flex-shrink-0 items-center">
              {marqueeWords.map((word, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6 text-sm font-medium text-neutral-500">{word}</span>
                  <span className="text-brand-400/70 text-[8px]">●</span>
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
