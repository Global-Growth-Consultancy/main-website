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
    <section id="colleges" className="py-24 relative overflow-hidden bg-premium-navy">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-premium-navy via-premium-charcoal to-premium-navy" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 font-medium text-sm tracking-wider uppercase mb-4 block">
            Our Network
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">200+ Partner Institutions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                className="flex-shrink-0 w-64 glass rounded-2xl p-6 card-hover cursor-pointer"
              >
                <div className="text-4xl mb-3 text-center">{university.logo}</div>
                <h4 className="text-lg font-bold text-white text-center mb-2">{university.name}</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  university.tier === 'Premier' 
                    ? 'bg-premium-gold/20 text-premium-gold' 
                    : university.tier === 'Government'
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'bg-accent-500/20 text-accent-400'
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
              color: "from-premium-gold/20 to-premium-gold/5",
              border: "border-premium-gold/30"
            },
            {
              title: "Government Colleges",
              count: "100+",
              description: "State universities and government colleges",
              color: "from-primary-500/20 to-primary-500/5",
              border: "border-primary-500/30"
            },
            {
              title: "Private Universities",
              count: "50+",
              description: "Top private universities and deemed universities",
              color: "from-accent-500/20 to-accent-500/5",
              border: "border-accent-500/30"
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`glass rounded-2xl p-8 card-hover bg-gradient-to-br ${category.color} border ${category.border}`}
            >
              <h3 className="text-3xl font-bold text-white mb-2">{category.count}</h3>
              <h4 className="text-xl font-semibold text-white mb-3">{category.title}</h4>
              <p className="text-gray-400 text-sm">{category.description}</p>
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
          <button className="btn-premium">
            View All Partner Colleges
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityPartners;
