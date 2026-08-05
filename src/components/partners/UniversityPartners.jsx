import React from "react";
import { motion } from "framer-motion";

const UniversityPartners = () => {
  const partnerLogos = [
    { src: "/marquee2.jpeg", alt: "Partner institution logo" },
    { src: "/marquee7.png", alt: "Partner institution logo" },
    { src: "/marquee8.png", alt: "Partner institution logo" },
    { src: "/marquee9.png", alt: "Partner institution logo" },
    { src: "/marquee10.png", alt: "Partner institution logo" },
    { src: "/marquee11.png", alt: "Partner institution logo" },
    { src: "/marquee12.png", alt: "Partner institution logo" },
    { src: "/marquee13.png", alt: "Partner institution logo" },
  ];

  const duplicatedLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section id="colleges" className="py-24 bg-premium-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">Our Network</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            200+ Partner Institutions
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Direct partnerships with prestigious universities and colleges across India for priority admissions
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative overflow-hidden mb-16 group">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {duplicatedLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-44 pr-8">
                <div className="glass rounded-2xl h-24 flex items-center justify-center px-4 card-hover border border-white/10">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    className="max-h-12 max-w-full object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Premier Institutes",
              count: "50+",
              description: "IITs, NITs, and top central universities",
              text: "text-accent-400"
            },
            {
              title: "Government Colleges",
              count: "100+",
              description: "State universities and government colleges",
              text: "text-brand-400"
            },
            {
              title: "Private Universities",
              count: "50+",
              description: "Top private universities and deemed universities",
              text: "text-neutral-300"
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`glass rounded-2xl p-8 shadow-soft border border-white/10 card-hover`}
            >
              <h3 className={`text-3xl font-bold ${category.text} mb-2`}>{category.count}</h3>
              <h4 className="text-xl font-semibold text-white mb-3">{category.title}</h4>
              <p className="text-neutral-400 text-sm">{category.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
          >
            View All Partner Colleges
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityPartners;
