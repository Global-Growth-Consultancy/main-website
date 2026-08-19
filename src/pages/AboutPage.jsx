import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  FaAward, FaUsers, FaHandshake, FaLightbulb, FaBullseye, FaHeart,
  FaCheckCircle, FaArrowRight, FaRocket, FaGlobe, FaGraduationCap,
  FaShieldAlt, FaStar, FaQuoteLeft,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero";

// ── Animated counter ──
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

// ── Spring-based stagger container ──
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -50, filter: "blur(4px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const slideRight = {
  hidden: { opacity: 0, x: 50, filter: "blur(4px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const milestones = [
  { year: "2014", title: "The Foundation", description: "GGC began as a small counseling desk in Patna with a single vision — no deserving student should be left behind.", icon: FaRocket },
  { year: "2016", title: "BSCC Specialists", description: "When Bihar launched the Student Credit Card scheme, we became one of the first consultancies to master the application process end to end.", icon: FaShieldAlt },
  { year: "2019", title: "200+ Partners", description: "Built direct partnerships with 200+ universities, colleges and institutes across India — from IITs and NITs to premier private institutions.", icon: FaHandshake },
  { year: "2022", title: "₹50 Cr+ Loans", description: "Crossed ₹50 crore in education loans facilitated for students through BSCC and private bank financing.", icon: FaAward },
  { year: "2024", title: "5,000+ Students", description: "Guided more than 5,000 students into quality higher education with a 95% admission and loan approval rate.", icon: FaGraduationCap },
  { year: "2026", title: "The Next Chapter", description: "Now serving students across all 38 districts of Bihar — and expanding our footprint pan-India.", icon: FaGlobe },
];

const values = [
  { icon: FaAward, title: "Excellence", description: "We strive for excellence in every aspect of our service, from counseling to documentation.", accent: "#38BDF8" },
  { icon: FaUsers, title: "Student First", description: "Our students' success is our priority. We put their needs and aspirations above everything else.", accent: "#A78BFA" },
  { icon: FaHandshake, title: "Integrity", description: "We maintain complete transparency and honesty in all our dealings with students and institutions.", accent: "#34D399" },
  { icon: FaLightbulb, title: "Innovation", description: "We continuously improve our processes and adopt new methods to serve students better.", accent: "#FBBF24" },
  { icon: FaBullseye, title: "Focus", description: "We stay focused on our mission of making quality education accessible to every deserving student.", accent: "#F472B6" },
  { icon: FaHeart, title: "Compassion", description: "We understand the challenges students face and approach every case with empathy and care.", accent: "#FB7185" },
];

const stats = [
  { icon: FaUsers, value: 5000, suffix: "+", label: "Students Guided", tint: "brand" },
  { icon: FaHandshake, value: 200, suffix: "+", label: "Partner Institutions", tint: "violet" },
  { icon: FaCheckCircle, value: 95, suffix: "%", label: "Success Rate", tint: "success" },
  { icon: FaLightbulb, value: 10, suffix: "+", label: "Years Experience", tint: "gold" },
];

const whyChoose = [
  { icon: FaGraduationCap, text: "Expert counselors with 10+ years of experience" },
  { icon: FaShieldAlt, text: "Specialization in Bihar Student Credit Card (BSCC) scheme" },
  { icon: FaHandshake, text: "Direct partnerships with 200+ prestigious institutions" },
  { icon: FaStar, text: "95% success rate in admissions and loan approvals" },
  { icon: FaUsers, text: "Personalized guidance based on student profile" },
  { icon: FaRocket, text: "End-to-end support from consultation to admission" },
  { icon: FaBullseye, text: "Transparent process with no hidden charges" },
  { icon: FaHeart, text: "24/7 support for all student queries" },
];

// ── Premium card wrapper ──
const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      className={`relative rounded-2xl border border-[#243352] overflow-hidden ${hover ? "group" : ""} ${className}`}
      style={{
        background: "linear-gradient(180deg, #1A2640, #162035)",
      }}
      {...props}
    >
      {/* spotlight glow on hover */}
      {hover && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: "radial-gradient(400px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(56,189,248,0.06), transparent 60%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const AboutPage = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });

  return (
    <div ref={sectionRef}>
      <PageHero
        eyebrow="About GGC"
        title="Who We Are"
        highlight="Your Success is Our Mission."
        subtitle="Global Growth Consultancy (GGC) is Bihar's premier education consultancy. For over a decade we have turned academic aspirations into approved admissions and funded realities — one student at a time."
      />

      {/* ── Story ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* ambient glow */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none will-change-transform">
          <div className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.15), transparent 65%)" }} />
          <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.12), transparent 65%)" }} />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text side */}
            <motion.div variants={slideLeft} initial="hidden" animate={storyInView ? "show" : "hidden"}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/[0.06] text-brand-300 text-xs font-semibold tracking-wider uppercase mb-6">
                <FaQuoteLeft className="text-[10px] opacity-60" />
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-display font-bold text-white mb-6 leading-tight tracking-tight">
                From a Desk in Patna to a <span className="text-gradient">Pan-India Network</span>
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                <p>Every year, thousands of talented students in Bihar miss out on higher education — not because they lack ability, but because they lack the right guidance and financial support. GGC was founded to close exactly that gap.</p>
                <p>We started with a simple promise: understand the student, recommend the right path, and walk with them until their admission — and their funding — is confirmed. Today that promise has guided more than 5,000 students into prestigious institutions across India.</p>
                <p>As recognized specialists in the Bihar Student Credit Card (BSCC) scheme, we have facilitated <span className="text-white font-semibold">₹50+ crore in education loans</span> — helping students afford engineering, medicine, law, management and more without a single barrier of paperwork standing in their way.</p>
              </div>
            </motion.div>

            {/* Stats grid */}
            <motion.div variants={stagger} initial="hidden" animate={storyInView ? "show" : "hidden"} className="grid grid-cols-2 gap-4 sm:gap-5">
              {stats.map((stat, i) => (
                <motion.div key={i} variants={scaleIn}>
                  <GlassCard className="p-5 sm:p-6 text-center" whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <div className={`w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                      stat.tint === "brand" ? "bg-brand-500/15 text-brand-400"
                        : stat.tint === "violet" ? "bg-violet-500/15 text-violet-300"
                        : stat.tint === "success" ? "bg-success-500/15 text-success-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}>
                      <stat.icon className="text-lg" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-display font-bold text-white">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
            <motion.div variants={slideLeft} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
              <GlassCard className="p-8 sm:p-10 h-full">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/[0.06] text-brand-300 text-xs font-semibold tracking-wider uppercase mb-5">
                  <FaRocket className="text-[10px]" />
                  Our Mission
                </span>
                <p className="text-neutral-300 leading-relaxed text-[15px]">
                  To make quality education accessible to every deserving student in Bihar by providing expert
                  guidance, seamless admission support, and hassle-free education loan processing. We believe
                  that financial constraints should never be a barrier to pursuing one's dreams.
                </p>
                <div className="mt-6 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-gradient-to-r from-brand-400/60 via-brand-300/30 to-transparent" />
              </GlassCard>
            </motion.div>
            <motion.div variants={slideRight} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
              <GlassCard className="p-8 sm:p-10 h-full">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-violet-300 text-xs font-semibold tracking-wider uppercase mb-5">
                  <FaGlobe className="text-[10px]" />
                  Our Vision
                </span>
                <p className="text-neutral-300 leading-relaxed text-[15px]">
                  To become India's most trusted education consultancy, known for our integrity, expertise, and
                  unwavering commitment to student success. We aim to empower the youth of Bihar to compete at
                  the national level and build successful careers.
                </p>
                <div className="mt-6 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-gradient-to-r from-violet-400/60 via-violet-300/30 to-transparent" />
              </GlassCard>
            </motion.div>
          </div>

          {/* ── Values ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/[0.06] text-amber-300 text-xs font-semibold tracking-wider uppercase mb-5">
                <FaStar className="text-[10px]" />
                Our Values
              </span>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                What Drives Us Every Day
              </h3>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((v, i) => (
                <motion.div key={i} variants={scaleIn}>
                  <GlassCard
                    className="p-6 h-full"
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${v.accent}15`, color: v.accent, boxShadow: `0 0 20px ${v.accent}15` }}>
                      <v.icon className="text-lg" />
                    </div>
                    <h4 className="text-lg font-display font-bold text-white mb-2">{v.title}</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">{v.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* subtle bg glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12), transparent 60%)" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/[0.06] text-brand-300 text-xs font-semibold tracking-wider uppercase mb-5">
              <FaRocket className="text-[10px]" />
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Milestones on the Road to Trust
            </h2>
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
              From a single counseling desk to a state-wide movement — the moments that built GGC.
            </p>
          </div>

          <div className="relative">
            {/* Animated vertical line */}
            <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px">
              <div className="h-full w-full bg-gradient-to-b from-brand-500/0 via-brand-500/30 to-brand-500/0" />
              <motion.div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-brand-400/80 via-brand-400/40 to-brand-400/0"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="space-y-10 md:space-y-14">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40, filter: "blur(4px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className={`relative pl-16 md:pl-0 md:w-1/2 ${
                      isLeft ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                    }`}
                  >
                    {/* Animated node dot */}
                    <div
                      className={`absolute top-6 left-2.5 md:top-8 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 ${
                        isLeft ? "md:left-auto md:-right-[14px]" : "md:-left-[14px]"
                      }`}
                      style={{ borderColor: `${milestones[i] ? "rgba(56,189,248,0.5)" : "rgba(56,189,248,0.5)"}`, background: "rgba(6,10,20,0.9)" }}
                    >
                      <m.icon className="text-[10px] text-brand-400" />
                    </div>

                    <GlassCard className="p-6" whileHover={{ scale: 1.02, y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-300 text-xs font-bold font-mono tracking-wider mb-3">
                        {m.year}
                      </span>
                      <h4 className="text-xl font-display font-bold text-white mb-2">{m.title}</h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">{m.description}</p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose GGC ── */}
      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8 md:p-12" hover={false}>
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success-500/20 bg-success-500/[0.06] text-success-300 text-xs font-semibold tracking-wider uppercase mb-5">
                  <FaShieldAlt className="text-[10px]" />
                  Why Us
                </span>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-white">
                  Why Students Choose GGC
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
                {whyChoose.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-success-500/15 flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-sm text-success-400" />
                    </div>
                    <span className="text-neutral-300 text-sm sm:text-[15px]">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="p-8 sm:p-12 text-center" hover={false}>
              {/* glow accent */}
              <div className="absolute -inset-1 rounded-3xl opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 30%, rgba(56,189,248,0.15), rgba(167,139,250,0.08) 40%, transparent 70%)" }} />
              <div className="relative">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  Your Story Starts Here
                </h3>
                <p className="text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Book a free consultation and let our team design a roadmap that takes you from where you are
                  to where you want to be.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/contact"
                    className="btn-premium inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base group relative overflow-hidden">
                    <span className="relative z-10">Book Free Consultation</span>
                    <FaArrowRight className="relative z-10 text-xs group-hover:translate-x-1.5 transition-transform duration-300" />
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                  </Link>
                  <Link to="/services"
                    className="btn-premium-outline inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base">
                    Explore Our Services
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
