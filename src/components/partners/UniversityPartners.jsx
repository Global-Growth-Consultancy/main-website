import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

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
                <LuxCard className="card-lux--tight h-24 flex items-center justify-center group">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    className="max-h-12 max-w-full object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  />
                </LuxCard>
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
              gradient: "from-brand-300 via-brand-400 to-accent-400"
            },
            {
              title: "Government Colleges",
              count: "100+",
              description: "State universities and government colleges",
              gradient: "from-white via-brand-300 to-brand-500"
            },
            {
              title: "Private Universities",
              count: "50+",
              description: "Top private universities and deemed universities",
              gradient: "from-neutral-200 via-white to-brand-400"
            }
          ].map((category, index) => (
            <LuxCard
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="text-center group"
            >
              <h3 className={`text-4xl font-display font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent mb-2`}>
                {category.count}
              </h3>
              <h4 className="text-xl font-semibold text-white mb-3">{category.title}</h4>
              <p className="text-neutral-400 text-sm">{category.description}</p>
              <div className="lux-divider mt-6 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500" />
            </LuxCard>
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
          <Link
            to="/colleges"
            className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base"
          >
            View All Partner Colleges
            <FaArrowRight className="text-xs" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityPartners;
