import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCogs, FaStethoscope, FaBriefcase, FaBalanceScale, FaFlask,
  FaClipboardCheck, FaArrowRight, FaHandHoldingUsd,
} from "react-icons/fa";

const streams = [
  {
    id: "engineering",
    icon: FaCogs,
    name: "Engineering",
    tagline: "From JEE to a funded B.Tech seat",
    entrance: ["JEE Main", "State CET (BCECE)", "Institute-level entrance"],
    courses: ["B.Tech / B.E.", "Polytechnic / Diploma", "M.Tech (later)"],
    funding: "BSCC covers engineering tuition, laptop, books and hostel — up to ₹4 lakh at 0% interest.",
    careers: ["Software Developer", "Core Engineer", "Data Scientist", "Higher Study (M.Tech, MS)"],
    ggc: "We map your JEE/CET score to the best-feasible college, handle the application, and fund the entire degree with BSCC — start to finish.",
  },
  {
    id: "medical",
    icon: FaStethoscope,
    name: "Medical",
    tagline: "NEET to a confirmed MBBS seat",
    entrance: ["NEET UG", "Bihar NEET counselling"],
    courses: ["MBBS", "BDS", "B.Pharm", "B.Sc Nursing"],
    funding: "Medical courses are expensive — BSCC funds MBBS/BDS fees, hostel and living costs, and medical students use it heavily.",
    careers: ["Doctor (MBBS)", "Dentist", "Pharmacist", "Nursing Professional"],
    ggc: "From your NEET result to a confirmed seat in counselling rounds and a sanctioned BSCC loan — we manage the paperwork for you.",
  },
  {
    id: "commerce",
    icon: FaBriefcase,
    name: "Commerce",
    tagline: "B.Com / BBA to MBA and beyond",
    entrance: ["CUET UG", "Institute entrance (BBA, IPM)", "CA / CS foundation"],
    courses: ["B.Com (Hons)", "BBA", "MBA (after graduation)", "CA / CS"],
    funding: "BSCC covers commerce and management programmes too — from B.Com right up to MBA.",
    careers: ["Finance Analyst", "Chartered Accountant", "Business Manager", "Entrepreneur"],
    ggc: "We pick the right commerce college for your profile, prep your applications, and set up loan and scholarship support in parallel.",
  },
  {
    id: "law",
    icon: FaBalanceScale,
    name: "Law",
    tagline: "CLAT to an NLU seat",
    entrance: ["CLAT", "AILET", "State law entrance"],
    courses: ["BA LLB", "BBA LLB", "LLB", "LLM"],
    funding: "BSCC funds five-year integrated law programmes at BSCC-approved institutions.",
    careers: ["Lawyer / Advocate", "Corporate Counsel", "Judiciary", "Legal Research"],
    ggc: "We shortlist the NLUs and top law colleges within your reach, and keep your admission and loan on track together.",
  },
  {
    id: "science-arts",
    icon: FaFlask,
    name: "Science & Arts",
    tagline: "B.Sc / BA with a real future",
    entrance: ["CUET UG", "State university entrance", "College-level admission"],
    courses: ["B.Sc", "BA", "BFA / B.Des", "MA / M.Sc (later)"],
    funding: "BSCC covers science, arts, design and research programmes across approved colleges.",
    careers: ["Research", "Teaching", "Design", "Civil Services", "Journalism"],
    ggc: "We help you choose a stream with a real future, secure your admission, and fund it without any stress.",
  },
];

const StreamRoadmap = () => {
  const [active, setActive] = useState(0);
  const stream = streams[active];

  return (
    <section className="py-16 sm:py-20 bg-premium-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="eyebrow mb-4 block">Interactive Roadmap</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Your Roadmap, Stream by Stream
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
            Tap your stream to see the exact path — entrance, course, funding and career — mapped out for you.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {streams.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setActive(index)}
              className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border text-sm transition-all duration-300 ${
                active === index
                  ? "border-brand-400/50 bg-brand-500/15 text-white shadow-lg shadow-brand-500/20"
                   : "border-white/12 bg-white/[0.05] text-neutral-400 hover:text-white hover:border-white/25"
              }`}
            >
              <s.icon className={`text-sm ${active === index ? "text-brand-300" : "text-neutral-500 group-hover:text-brand-400"}`} />
              {s.name}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch"
            >
              {/* Left: path */}
              <div className="card-lux p-6 sm:p-8 group h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="lux-icon">
                    <stream.icon className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white">{stream.name}</h3>
                    <p className="text-sm text-brand-300/90">{stream.tagline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Entrance Exams</h4>
                    <ul className="space-y-2.5">
                      {stream.entrance.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-300">
                          <FaClipboardCheck className="text-brand-400 text-xs flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mt-6 mb-3">Courses</h4>
                    <ul className="space-y-2.5">
                      {stream.courses.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-300">
                          <FaArrowRight className="text-brand-400 text-[10px] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">Career Paths</h4>
                    <ul className="space-y-2.5">
                      {stream.careers.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 rounded-xl border border-accent-400/25 bg-accent-400/8 p-4">
                      <p className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                        <FaHandHoldingUsd className="text-accent-400 text-base flex-shrink-0 mt-0.5" />
                        <span>{stream.funding}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: GGC role */}
              <div className="card-lux--accent card-lux p-6 sm:p-8 group h-full">
                <span className="eyebrow block mb-4">How GGC Helps</span>
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  For {stream.name}, we handle the <span className="text-gradient-gold">entire journey</span>
                </h3>
                <p className="text-neutral-300 leading-relaxed mb-8">{stream.ggc}</p>
                <div className="space-y-3.5">
                  {[
                    "Free profile & eligibility check",
                    "Personalized college shortlist",
                    "Application + document management",
                    "BSCC loan approval & disbursal tracking",
                    "Mentorship through your first year",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                        <FaClipboardCheck className="text-xs text-success-400" />
                      </div>
                      <span className="text-sm text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20want%20a%20free%20roadmap%20for%20my%20stream."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
                  >
                    Get My Free Roadmap
                    <FaArrowRight className="text-xs" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default StreamRoadmap;
