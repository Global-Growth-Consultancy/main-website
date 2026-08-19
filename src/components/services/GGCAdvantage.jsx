import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

const rows = [
  {
    aspect: "College Shortlisting",
    diy: "Random Google searches, outdated cutoff lists, missed options",
    ggc: "Data-backed shortlist matched to your marks, budget and goals",
  },
  {
    aspect: "BSCC Application",
    diy: "Confusing portal, small errors cause big delays",
    ggc: "Step-by-step guidance with a 70–80% approval rate",
  },
  {
    aspect: "Documents",
    diy: "Missing certificates, re-applications, extra trips to DRCC",
    ggc: "Verified once, submitted perfectly the first time",
  },
  {
    aspect: "Deadlines",
    diy: "Missed windows and lost seats",
    ggc: "Tracked calendars — zero last-minute panic",
  },
  {
    aspect: "Loan Tracking",
    diy: "No idea where your application is stuck",
    ggc: "Live status tracking until final disbursal",
  },
  {
    aspect: "Support",
    diy: "Limited or none",
    ggc: "Dedicated counselor through the entire journey",
  },
  {
    aspect: "Outcome",
    diy: "Delays, rejections and stress",
    ggc: "Confirmed seat + fully funded education",
  },
];

const GGCAdvantage = () => {
  return (
    <section className="py-16 sm:py-20 bg-premium-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="eyebrow mb-4 block">The Honest Comparison</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Doing It Yourself vs. With GGC
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
            Admission and BSCC loan processes work — but they punish small mistakes. Here is what the
            difference actually looks like.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl">
          <div className="min-w-[640px]">
            {/* Header */}
            <div className="grid grid-cols-3 gap-0 mb-4">
              <div />
              <div className="px-5 py-4 rounded-l-2xl border border-white/12 bg-white/[0.04] flex items-center gap-2.5">
                <FaTimes className="text-neutral-500 text-sm flex-shrink-0" />
                <span className="text-sm font-semibold text-neutral-300">Doing It Yourself</span>
              </div>
              <div className="px-5 py-4 rounded-r-2xl border border-brand-500/25 bg-brand-500/8 flex items-center gap-2.5">
                <FaCheck className="text-brand-400 text-sm flex-shrink-0" />
                <span className="text-sm font-semibold text-white">With GGC</span>
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {rows.map((row, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="grid grid-cols-3 gap-0"
                >
                  <div className="px-5 py-4 flex items-center">
                    <span className="text-sm font-semibold text-white">{row.aspect}</span>
                  </div>
                  <div className="px-5 py-4 bg-white/[0.04] border-t border-white/8 flex items-center text-sm text-neutral-500 leading-relaxed">
                    {row.diy}
                  </div>
                  <div className="px-5 py-4 bg-brand-500/6 border-t border-brand-500/10 flex items-center text-sm text-neutral-300 leading-relaxed">
                    {row.ggc}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Approval-rate figures reflect GGC&apos;s historical track record and are not a guarantee of a specific outcome.
        </p>
      </div>
    </section>
  );
};

export default GGCAdvantage;
