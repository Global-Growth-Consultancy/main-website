import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaCreditCard, FaHandHoldingUsd, FaUserCheck, FaUniversity,
  FaCoins, FaRupeeSign, FaHeadset, FaClipboardList, FaQuestionCircle,
  FaWhatsapp, FaPhone, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";

// ------------------------------------------------------------------
// FAQCardSlider — an autoscrolling, super-advanced FAQ carousel.
//
// • Responsive slides-per-view: 3 on desktop, 2 on tablet, 2 on mobile.
// • Auto-scrolls every 4s (pauses on hover / drag), with a live
//   progress bar, arrows, drag-to-scroll, edge fade masks and a
//   "01 / 08" counter.
// • Every card is uniform size, question + answer always visible.
// • Each category gets its own vivid colour identity (gradient icon,
//   chip, top accent bar, corner glow, hover glow) — a completely
//   different, premium look.
// ------------------------------------------------------------------

const themes = {
  BSCC:        { from: "#0ea5e9", to: "#38bdf8", soft: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.38)" },
  Loans:       { from: "#10b981", to: "#34d399", soft: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.38)" },
  Eligibility: { from: "#d97706", to: "#fbbf24", soft: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.38)" },
  Admissions:  { from: "#7c3aed", to: "#a78bfa", soft: "rgba(167,139,250,0.17)", border: "rgba(167,139,250,0.38)" },
  Repayment:   { from: "#ea580c", to: "#fb923c", soft: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.38)" },
  Fees:        { from: "#db2777", to: "#f472b6", soft: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.38)" },
  Support:     { from: "#c026d3", to: "#e879f9", soft: "rgba(232,121,249,0.15)", border: "rgba(232,121,249,0.38)" },
  Process:     { from: "#0d9488", to: "#2dd4bf", soft: "rgba(45,212,191,0.15)", border: "rgba(45,212,191,0.38)" },
};

const icons = {
  BSCC: FaCreditCard,
  Loans: FaHandHoldingUsd,
  Eligibility: FaUserCheck,
  Admissions: FaUniversity,
  Repayment: FaCoins,
  Fees: FaRupeeSign,
  Support: FaHeadset,
  Process: FaClipboardList,
};

const themeFor = (category) => themes[category] || themes.BSCC;
const iconFor = (category) => icons[category] || FaQuestionCircle;

const AUTO_MS = 4000;

// Slides-per-view: desktop 3, tablet 2, mobile 2.
function useSlidesPerView() {
  const [spv, setSpv] = useState(3);
  useEffect(() => {
    const tablet = window.matchMedia("(max-width: 1023px)");
    const mobile = window.matchMedia("(max-width: 639px)");
    const update = () => {
      if (mobile.matches) setSpv(2);
      else if (tablet.matches) setSpv(2);
      else setSpv(3);
    };
    update();
    mobile.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);
  return spv;
}

const SlideCard = ({ faq, index }) => {
  const t = themeFor(faq.category);
  const Icon = iconFor(faq.category);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className="faq-slide-card group h-full flex flex-col"
      style={{ "--card-glow": `${t.to}66` }}
    >
      {/* top accent bar */}
      <div
        className="absolute top-0 left-5 right-5 h-[3px] rounded-b-full"
        style={{ background: `linear-gradient(90deg, transparent, ${t.to}, transparent)` }}
      />
      {/* corner glow */}
      <div
        className="absolute -top-14 -right-14 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${t.soft}, transparent 70%)` }}
      />

      <div className="relative flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
              boxShadow: `0 10px 24px -10px ${t.to}`,
            }}
          >
            <Icon className="text-sm sm:text-base" />
          </span>
          <span
            className="truncate text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded-full border"
            style={{ color: t.to, borderColor: t.border, background: t.soft }}
          >
            {faq.category}
          </span>
        </div>
        <span className="font-mono text-[10px] sm:text-xs text-white/25">{num}</span>
      </div>

      <h3 className="text-sm sm:text-base md:text-lg font-display font-bold text-white leading-snug min-h-[2.7rem] sm:min-h-[3.2rem] mb-3">
        {faq.question}
      </h3>

      <div className="h-px w-full mb-3" style={{ background: `linear-gradient(90deg, ${t.to}55, transparent)` }} />

      <p className="flex-1 text-[11px] sm:text-xs md:text-sm text-neutral-400 leading-relaxed">
        {faq.answer}
      </p>

      <div className="relative mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: t.to }}>
          GGC · Answered
        </span>
        <span className="text-[9px] font-mono text-white/25">{num}</span>
      </div>
    </div>
  );
};

const CTACard = () => {
  return (
    <div
      className="faq-slide-card group h-full flex flex-col justify-center items-center text-center gap-3 sm:gap-4"
      style={{ "--card-glow": "rgba(251,191,36,0.6)" }}
    >
      <div
        className="absolute top-0 left-5 right-5 h-[3px] rounded-b-full"
        style={{ background: "linear-gradient(90deg, transparent, #fbbf24, transparent)" }}
      />
      <div
        className="absolute -top-14 -right-14 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.16), transparent 70%)" }}
      />

      <span
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white"
        style={{
          background: "linear-gradient(135deg, #d97706, #fbbf24)",
          boxShadow: "0 14px 34px -12px rgba(251,191,36,0.8)",
        }}
      >
        <FaHeadset className="text-2xl" />
      </span>

      <h3 className="text-lg sm:text-xl font-display font-bold text-white">
        Still Have Questions?
      </h3>
      <p className="text-xs sm:text-sm text-neutral-400 max-w-[240px] leading-relaxed">
        Talk to a real counselor — free, no obligation.
      </p>

      <div className="flex flex-col items-center justify-center gap-2.5 mt-1">
        <a
          href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20have%20a%20question%20about%20admissions%20or%20BSCC%20loans."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm"
        >
          <FaWhatsapp />
          WhatsApp Us
        </a>
        <a
          href="tel:+917739973470"
          className="btn-premium-outline inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm"
        >
          <FaPhone />
          Call Now
        </a>
      </div>
    </div>
  );
};

const FAQCardSlider = ({ faqs, eyebrow = "FAQ", title = "Common Questions", subtitle = "" }) => {
  const trackRef = useRef(null);
  const slidesPerView = useSlidesPerView();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const dragRef = useRef(null);

  const total = faqs.length + 1; // + CTA card
  const maxIndex = Math.max(0, total - slidesPerView);

  const stepSize = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 1;
    return track.children[1].offsetLeft - track.children[0].offsetLeft;
  }, []);

  const scrollToIndex = useCallback(
    (index, behavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      const safe = Math.max(0, Math.min(index, maxIndex));
      track.scrollTo({ left: safe * stepSize(), behavior });
    },
    [maxIndex, stepSize]
  );

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepSize();
    const idx = Math.round(track.scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(idx, maxIndex)));
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 8);
  }, [maxIndex, stepSize]);

  // Autoscroll
  useEffect(() => {
    if (isPaused) return undefined;
    const id = setInterval(() => {
      if (activeIndex >= maxIndex) scrollToIndex(0);
      else scrollToIndex(activeIndex + 1);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [activeIndex, isPaused, maxIndex, scrollToIndex]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToIndex(activeIndex + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollToIndex(activeIndex - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, scrollToIndex]);

  // Recompute scroll limits when breakpoint changes
  useEffect(() => {
    const id = requestAnimationFrame(updateState);
    return () => cancelAnimationFrame(id);
  }, [slidesPerView, updateState]);

  // Drag-to-scroll (mouse only; touch uses native swipe)
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    dragRef.current = {
      startX: e.clientX,
      scrollLeft: trackRef.current ? trackRef.current.scrollLeft : 0,
      dragging: false,
    };
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    const track = trackRef.current;
    if (!d || !track || e.pointerType !== "mouse") return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.dragging = true;
    if (d.dragging) {
      track.scrollLeft = d.scrollLeft - dx;
    }
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  const goPrev = () => scrollToIndex(activeIndex - 1);
  const goNext = () => scrollToIndex(activeIndex + 1);

  const arrowClass =
    "w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 transition-all duration-300 hover:border-brand-500/50 hover:text-white hover:shadow-[0_0_24px_-6px_rgba(56,189,248,0.5)] disabled:opacity-25 disabled:cursor-not-allowed";

  return (
    <section id="faq" className="py-20 sm:py-24 bg-premium-navy overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.08), transparent 65%)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="eyebrow mb-4 block">{eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Auto-play progress bar */}
          <div className="h-[3px] rounded-full bg-white/5 overflow-hidden mb-6 sm:mb-8">
            <div
              key={activeIndex}
              className="progress-fill"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            />
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 z-10 bg-gradient-to-r from-premium-navy to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 z-10 bg-gradient-to-l from-premium-navy to-transparent" />

          {/* Track */}
          <div
            ref={trackRef}
            onScroll={updateState}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="faq-track flex overflow-x-auto snap-x snap-mandatory scrollbar-none relative cursor-grab active:cursor-grabbing"
            style={{ scrollPaddingInline: "0.25rem" }}
          >
            {faqs.map((faq, index) => (
              <div key={index} className="carousel-slide snap-start h-full">
                <SlideCard faq={faq} index={index} />
              </div>
            ))}
            <div className="carousel-slide snap-start h-full">
              <CTACard />
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 sm:mt-10 flex items-center justify-center gap-4 sm:gap-6"
        >
          <button onClick={goPrev} disabled={!canPrev} aria-label="Previous questions" className={arrowClass}>
            <FaChevronLeft className="text-sm" />
          </button>

          <div className="flex items-center gap-3 font-mono">
            <span className="text-brand-400 text-sm sm:text-base font-semibold">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-500 text-sm sm:text-base">{String(total).padStart(2, "0")}</span>
          </div>

          <button onClick={goNext} disabled={!canNext} aria-label="Next questions" className={arrowClass}>
            <FaChevronRight className="text-sm" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 text-center text-xs sm:text-sm text-neutral-500"
        >
          Auto-scrolls every few seconds · drag or use the arrows · pause on hover
        </motion.p>
      </div>
    </section>
  );
};

export default FAQCardSlider;
