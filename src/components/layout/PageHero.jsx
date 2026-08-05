import React from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const PageHero = ({ eyebrow, title, highlight, subtitle, children }) => {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-24 bg-premium-navy overflow-hidden">
      {/* Ambient background — static, cheap */}
      <div
        className="absolute -top-40 right-[-10%] w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(56,189,248,0.12), transparent 62%)" }}
      />
      <div
        className="absolute bottom-[-30%] left-[-10%] w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(139,92,246,0.1), transparent 62%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.04,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, black, transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="eyebrow mb-5 block"
          >
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.06] tracking-tight"
        >
          {title}
          {highlight && (
            <>
              <br />
              <span className="text-gradient">{highlight}</span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {children}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-neutral-500">
            <span className="text-[10px] tracking-[0.3em] uppercase font-mono">Scroll</span>
            <FaChevronDown className="animate-bounce text-brand-400/70 text-sm" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
