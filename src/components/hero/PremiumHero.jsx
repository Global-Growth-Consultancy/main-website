import React, { Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaArrowRight, FaGraduationCap, FaUniversity, FaHandHoldingUsd, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import ScrollReveal from "../shared/ScrollReveal";

const DreamFusionEngine = lazy(() => import("./DreamFusionEngine"));

const PremiumHero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center bg-premium-navy overflow-hidden">
      {/* Animated Background */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl opacity-50"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl"
      />

      {/* Subtle grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />

      {/* Floating Particles */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-brand-500/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * 800,
            opacity: 0,
          }}
          animate={{
            y: [null, -100 - Math.random() * 200],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <ScrollReveal direction="left" className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 backdrop-blur-sm">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-brand-400" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-300 tracking-wide">
                Bihar&apos;s #1 Education Consultancy
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
              Your Dream.
              <br />
              <span className="text-gradient">Our Mission.</span>
              <br />
              <span className="text-gradient-gold">Funded. Guided. Achieved.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl">
              From college admissions to <span className="text-neutral-200 font-medium">Bihar Student Credit Card</span>{" "}
              education loans — GGC turns your academic aspirations into an approved, fully-funded reality.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {[
                { icon: FaGraduationCap, text: "Admissions to 200+ institutions" },
                { icon: FaHandHoldingUsd, text: "BSCC loans up to ₹4 Lakh" },
                { icon: FaUniversity, text: "IIT, NIT, Medical & more" },
                { icon: FaShieldAlt, text: "95% admission success rate" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-brand-400 text-xs" />
                  </div>
                  <span className="text-sm text-neutral-300">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <a
                href="#contact"
                className="btn-premium glow-effect inline-flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-3.5 group"
              >
                <span>Get Free Consultation</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="btn-premium-outline inline-flex items-center justify-center text-sm sm:text-base px-6 py-3.5"
              >
                Explore Services
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-5 sm:gap-8 pt-6 border-t border-white/10">
              {[
                { icon: FaGraduationCap, value: "5000+", label: "Students Guided" },
                { icon: FaUniversity, value: "200+", label: "Partner Colleges" },
                { icon: FaCheckCircle, value: "95%", label: "Success Rate" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
                    <item.icon className="text-brand-400 text-sm sm:text-base" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white leading-none">{item.value}</div>
                    <div className="text-[11px] sm:text-xs text-neutral-400 mt-1">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Right Content - Dream Fusion Engine */}
          <ScrollReveal direction="right" delay={0.2} className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10 rounded-full blur-2xl pointer-events-none" />
            <Suspense
              fallback={
                <div className="relative w-full h-[400px] md:h-[540px] flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
                </div>
              }
            >
              <DreamFusionEngine />
            </Suspense>

            {/* Overlay Stats */}
            <div className="absolute bottom-2 sm:bottom-8 left-2 sm:left-8 glass rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 border border-white/10 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-success-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-success-400 text-sm sm:text-base" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">₹50 Cr+ Loans Approved</p>
                  <p className="text-[10px] sm:text-xs text-neutral-400">BSCC + Private Bank Financing</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </motion.div>
    </section>
  );
};

export default PremiumHero;
