import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const UniversityPartners = () => {
  const marqueeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const universities = [
    { name: "IIT Patna", logo: "🏛️", tier: "Premier" },
    { name: "NIT Patna", logo: "🎓", tier: "Premier" },
    { name: "BIT Mesra", logo: "📚", tier: "Premier" },
    { name: "Patna University", logo: "🏫", tier: "Government" },
    { name: "Magadh University", logo: "🎯", tier: "Government" },
    { name: "BHU", logo: "🏆", tier: "Premier" },
    { name: "Delhi University", logo: "⭐", tier: "Premier" },
    { name: "JNU", logo: "🌟", tier: "Premier" },
    { name: "Anna University", logo: "💎", tier: "Premier" },
    { name: "VIT", logo: "🔬", tier: "Private" },
    { name: "SRM University", logo: "🚀", tier: "Private" },
    { name: "Amity University", logo: "🎪", tier: "Private" },
  ];

  const duplicatedUniversities = [...universities, ...universities, ...universities];

  return (
    <section id="colleges" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-medium text-sm tracking-wider uppercase mb-4 block">
            Our Network
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            200+ Partner Institutions
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Direct partnerships with prestigious universities and colleges across India for priority admissions
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative overflow-hidden mb-16">
          <motion.div
            ref={marqueeRef}
            animate={{ x: isPaused ? 0 : -1000 }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            }}
            className="flex gap-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedUniversities.map((university, index) => (
              <motion.div
                key={`${university.name}-${index}`}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-64 bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 card-hover cursor-pointer"
              >
                <div className="text-4xl mb-3 text-center">{university.logo}</div>
                <h4 className="text-lg font-bold text-neutral-900 text-center mb-2">{university.name}</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  university.tier === 'Premier' 
                    ? 'bg-accent-100 text-accent-700' 
                    : university.tier === 'Government'
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {university.tier}
                </span>
              </motion.div>
            ))}
          </motion.div>
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
              bg: "bg-accent-50",
              border: "border-accent-200",
              text: "text-accent-700"
            },
            {
              title: "Government Colleges",
              count: "100+",
              description: "State universities and government colleges",
              bg: "bg-brand-50",
              border: "border-brand-200",
              text: "text-brand-700"
            },
            {
              title: "Private Universities",
              count: "50+",
              description: "Top private universities and deemed universities",
              bg: "bg-neutral-50",
              border: "border-neutral-200",
              text: "text-neutral-700"
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 card-hover`}
            >
              <h3 className={`text-3xl font-bold ${category.text} mb-2`}>{category.count}</h3>
              <h4 className="text-xl font-semibold text-neutral-900 mb-3">{category.title}</h4>
              <p className="text-neutral-600 text-sm">{category.description}</p>
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
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200"
          >
            View All Partner Colleges
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityPartners;
