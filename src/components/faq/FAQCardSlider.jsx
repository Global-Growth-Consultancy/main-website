import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  FaCreditCard, FaHandHoldingUsd, FaUserCheck, FaUniversity,
  FaCoins, FaRupeeSign, FaHeadset, FaClipboardList, FaQuestionCircle,
  FaWhatsapp, FaPhone,
} from "react-icons/fa";

// ------------------------------------------------------------------
// FAQCardSlider — a premium, fully-responsive FAQ grid.
//
// Every card has the SAME width and height (grid stretches each row,
// answers fill the card). Questions AND answers are always visible —
// no clicks needed. Each card: gradient hairline border, pointer-tracked
// spotlight, ghost index watermark, category icon tile + chip, and a
// pinned footer. A gold accent CTA card rounds out the grid so no row
// is ever left half-empty.
// ------------------------------------------------------------------

const categoryMeta = {
  BSCC: { icon: FaCreditCard, tint: "text-brand-300 bg-brand-500/15 border-brand-500/30" },
  Loans: { icon: FaHandHoldingUsd, tint: "text-success-300 bg-success-500/15 border-success-500/30" },
  Eligibility: { icon: FaUserCheck, tint: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30" },
  Admissions: { icon: FaUniversity, tint: "text-sky-300 bg-sky-500/15 border-sky-500/30" },
  Repayment: { icon: FaCoins, tint: "text-accent-300 bg-accent-500/15 border-accent-500/30" },
  Fees: { icon: FaRupeeSign, tint: "text-accent-300 bg-accent-500/15 border-accent-500/30" },
  Support: { icon: FaHeadset, tint: "text-violet-300 bg-violet-500/15 border-violet-500/30" },
  Process: { icon: FaClipboardList, tint: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30" },
};

const metaFor = (category) =>
  categoryMeta[category] || { icon: FaQuestionCircle, tint: "text-brand-300 bg-brand-500/15 border-brand-500/30" };

const FAQCard = ({ faq, index }) => {
  const ref = useRef(null);
  const { icon: Icon, tint } = metaFor(faq.category);
  const num = String(index + 1).padStart(2, "0");

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className="faq-card group h-full flex flex-col">
      <span className="faq-card__num">{num}</span>

      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="faq-card__icon">
            <Icon className="text-lg" />
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-[0.18em] ${tint}`}>
            {faq.category}
          </span>
        </div>
        <span className="font-mono text-xs text-neutral-600">{num}</span>
      </div>

      <h3 className="relative z-10 text-lg font-display font-bold text-white leading-snug min-h-[3.3rem] mb-4">
        {faq.question}
      </h3>

      <div className="relative z-10 h-px w-full bg-gradient-to-r from-brand-500/30 via-white/5 to-transparent mb-4" />

      <p className="relative z-10 flex-1 text-sm text-neutral-400 leading-relaxed">
        {faq.answer}
      </p>

      <div className="relative z-10 mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-600">{faq.category}</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-brand-400/70">GGC · Answered</span>
      </div>
    </div>
  );
};

const CTACard = () => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="faq-card faq-card--accent group h-full flex flex-col justify-center items-center text-center gap-4 md:col-span-2 lg:col-span-2"
    >
      <span className="faq-card__num">00</span>
      <div className="relative z-10 flex items-center justify-center">
        <span className="faq-card__icon !w-16 !h-16">
          <FaHeadset className="text-2xl" />
        </span>
      </div>
      <h3 className="relative z-10 text-xl sm:text-2xl font-display font-bold text-white">
        Still Have Questions?
      </h3>
      <p className="relative z-10 text-sm text-neutral-400 max-w-[280px] leading-relaxed">
        Talk to a real counselor — free, no obligation, and in your language.
      </p>
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
        <a
          href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20have%20a%20question%20about%20admissions%20or%20BSCC%20loans."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm"
        >
          <FaWhatsapp />
          WhatsApp Us
        </a>
        <a
          href="tel:+917739973470"
          className="btn-premium-outline inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm"
        >
          <FaPhone />
          Call Now
        </a>
      </div>
    </div>
  );
};

const FAQCardSlider = ({ faqs, eyebrow = "FAQ", title = "Common Questions", subtitle = "" }) => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
              className="h-full"
            >
              <FAQCard faq={faq} index={index} />
            </motion.div>
          ))}

          {/* CTA card — spans 2 columns so the grid never ends on a lonely card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
            className="h-full"
          >
            <CTACard />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 text-center text-sm text-neutral-500"
        >
          {faqs.length} questions answered — everything you need, right here. No clicks required.
        </motion.p>
      </div>
    </section>
  );
};

export default FAQCardSlider;
