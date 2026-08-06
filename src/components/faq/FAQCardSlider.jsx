import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaPlus, FaHeadset, FaArrowRight, FaCheck } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

// ------------------------------------------------------------------
// FAQCardSlider — a premium, horizontal, snap-scrolling card slider.
// Each FAQ is a card: category chip + question; tapping expands the
// answer inline. Auto-advances every 7s, pauses on hover, works with
// touch drag + arrows + keyboard. Ends with a "Still have questions?"
// CTA card.
// ------------------------------------------------------------------

const CARD_W = 340;
const CARD_GAP = 20;

const categoryTints = {
  "BSCC": "text-brand-300 bg-brand-500/15 border-brand-500/30",
  "Admissions": "text-sky-300 bg-sky-500/15 border-sky-500/30",
  "Loans": "text-success-300 bg-success-500/15 border-success-500/30",
  "Eligibility": "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  "Repayment": "text-accent-300 bg-accent-500/15 border-accent-500/30",
  "Fees": "text-accent-300 bg-accent-500/15 border-accent-500/30",
  "Support": "text-violet-300 bg-violet-500/15 border-violet-500/30",
  "Process": "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
};

const CategoryChip = ({ category }) => {
  const tint = categoryTints[category] || "text-brand-300 bg-brand-500/15 border-brand-500/30";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-[0.18em] ${tint}`}>
      {category}
    </span>
  );
};

const FAQCard = ({ faq, index, isOpen, onToggle }) => {
  return (
    <LuxCard
      className={`shrink-0 cursor-pointer transition-all duration-500 ${
        isOpen ? "!border-brand-500/50" : ""
      }`}
      style={{ width: `calc(min(${CARD_W}px, 82vw))` }}
      onClick={onToggle}
      initial={false}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <CategoryChip category={faq.category} />
        <span className="font-mono text-xs text-neutral-600">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="text-lg font-display font-bold text-white leading-snug mb-3">
        {faq.question}
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-neutral-400 leading-relaxed pb-4">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
        <span className="text-xs text-neutral-500">{isOpen ? "Answer shown" : "Tap to reveal"}</span>
        <motion.span
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.35 }}
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ${
            isOpen
              ? "bg-gradient-to-br from-brand-600 to-brand-400 text-white border-transparent"
              : "border-white/15 text-neutral-400"
          }`}
        >
          <FaPlus className="text-xs" />
        </motion.span>
      </div>
    </LuxCard>
  );
};

const FAQCardSlider = ({ faqs, eyebrow = "FAQ", title = "Common Questions", subtitle = "" }) => {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const total = faqs.length;

  const stepSize = useCallback(() => {
    const track = trackRef.current;
    const first = track && track.children[0];
    return first ? first.getBoundingClientRect().width + CARD_GAP : CARD_W + CARD_GAP;
  }, []);

  const scrollToIndex = useCallback(
    (index, behavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      const maxIndex = total - 1;
      const safe = Math.max(0, Math.min(index, maxIndex));
      track.scrollTo({ left: safe * stepSize(), behavior });
    },
    [total, stepSize]
  );

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepSize();
    const idx = Math.round(track.scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(idx, total - 1)));
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 8);
  }, [total, stepSize]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      if (activeIndex >= total - 1) {
        scrollToIndex(0);
      } else {
        scrollToIndex(activeIndex + 1);
      }
    }, 7000);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused, total, scrollToIndex]);

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

  const goPrev = () => scrollToIndex(activeIndex - 1);
  const goNext = () => scrollToIndex(activeIndex + 1);

  return (
    <section id="faq" className="py-20 sm:py-24 bg-premium-navy overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-14"
        >
          <span className="eyebrow mb-4 block">{eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 z-10 bg-gradient-to-r from-premium-navy to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 z-10 bg-gradient-to-l from-premium-navy to-transparent" />

          {/* Track */}
          <div
            ref={trackRef}
            onScroll={updateState}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth px-2 sm:px-6"
            style={{ scrollPaddingInline: "1.5rem", gap: `${CARD_GAP}px` }}
          >
            {faqs.map((faq, index) => (
              <div key={index} className="snap-start shrink-0" style={{ width: `calc(min(${CARD_W}px, 82vw))` }}>
                <FAQCard
                  faq={faq}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              </div>
            ))}

            {/* CTA card */}
            <div className="snap-start shrink-0" style={{ width: `calc(min(${CARD_W}px, 82vw))` }}>
              <div className="card-lux--accent card-lux h-full flex flex-col justify-center items-center text-center gap-4 cursor-pointer">
                <div className="lux-icon !w-14 !h-14">
                  <FaHeadset className="text-2xl" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">Still Have Questions?</h3>
                <p className="text-sm text-neutral-400 max-w-[240px]">
                  Talk to a real counselor — free, no obligation.
                </p>
                <Link
                  to="/contact"
                  className="btn-premium inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm group"
                >
                  <span>Schedule a Call</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-5 sm:gap-6">
          {/* Prev */}
          <button
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous questions"
            className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 transition-all duration-300 hover:border-brand-500/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          {/* Progress pills */}
          <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to question ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? "w-8 bg-gradient-to-r from-brand-600 to-brand-400"
                    : "w-2 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next questions"
            className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 transition-all duration-300 hover:border-brand-500/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        {/* All answered strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="inline-flex items-center gap-2 text-sm text-neutral-500">
            <FaCheck className="text-brand-400 text-xs" />
            {faqs.length} questions answered — tap any card to expand it
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQCardSlider;
