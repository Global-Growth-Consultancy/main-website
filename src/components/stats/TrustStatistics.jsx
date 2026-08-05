import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FaUsers, FaCheckCircle, FaAward, FaHandshake, FaUniversity } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

const StatCard = ({ icon: Icon, value, label, description, delay, index }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
      const duration = 2000;
      const steps = 60;
      const increment = parseFloat(value) / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= parseFloat(value)) {
          setCount(parseFloat(value));
          clearInterval(timer);
        } else {
          setCount(Math.floor(current * 10) / 10);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, isVisible, value]);

  const suffix = typeof value === 'string' && value.includes('%') ? '%' : typeof value === 'string' && value.includes('Cr') ? 'Cr+' : '+';

  return (
    <LuxCard
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="h-full group"
    >
      <span className="lux-ghost-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="lux-icon mb-6">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-5xl font-display font-bold bg-gradient-to-r from-white via-brand-300 to-brand-500 bg-clip-text text-transparent mb-3">
        {count}
        <span className="text-brand-400">{suffix}</span>
      </h3>
      <p className="text-lg font-semibold text-white mb-2">{label}</p>
      <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
      <div className="lux-divider mt-6 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
    </LuxCard>
  );
};

const TrustBadge = ({ icon: Icon, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] shadow-lg shadow-black/20 backdrop-blur-sm"
  >
    <Icon className="text-brand-400" />
    <span className="text-sm font-medium text-neutral-300">{text}</span>
  </motion.div>
);

const TrustStatistics = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);
  
  const stats = [
    {
      icon: FaUsers,
      value: "5000+",
      label: "Students Guided",
      description: "Successfully helped thousands of students achieve their academic dreams across India",
    },
    {
      icon: FaUniversity,
      value: "200+",
      label: "Partner Colleges",
      description: "Network of prestigious universities and colleges across multiple states",
    },
    {
      icon: FaHandshake,
      value: "95%",
      label: "Success Rate",
      description: "Exceptional admission success rate through expert guidance and documentation",
    },
    {
      icon: FaAward,
      value: "50Cr+",
      label: "Loans Facilitated",
      description: "Education loans processed including BSCC and private bank financing",
    },
  ];

  const badges = [
    { icon: FaUsers, text: "5000+ Students Guided" },
    { icon: FaUniversity, text: "200+ Partner Institutions" },
    { icon: FaCheckCircle, text: "95% Admission Success Rate" },
    { icon: FaHandshake, text: "BSCC Scheme Specialists" },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-premium-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="eyebrow mb-4 block">Our Impact</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-display font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Numbers That Speak
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Our track record demonstrates our commitment to student success and trust building
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div style={{ y: y1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              index={index}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div style={{ y: y2 }} className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {badges.map((badge, index) => (
            <TrustBadge key={index} {...badge} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStatistics;
