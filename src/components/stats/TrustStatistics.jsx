import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FaUsers, FaUniversity, FaAward, FaHandshake, FaCheckCircle, FaStar } from "react-icons/fa";

const StatCard = ({ icon: Icon, value, label, description, delay }) => {
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 card-hover"
    >
      <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-6">
        <Icon className="text-2xl text-brand-600" />
      </div>
      <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
        {typeof value === 'string' && value.includes('+') ? `${count}+` : count}
        {typeof value === 'string' && value.includes('%') ? '%' : ''}
        {typeof value === 'string' && value.includes('Cr') ? 'Cr+' : ''}
      </h3>
      <p className="text-lg font-semibold text-neutral-900 mb-2">{label}</p>
      <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

const TrustBadge = ({ icon: Icon, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 px-6 py-3 rounded-full bg-brand-50 border border-brand-200"
  >
    <Icon className="text-brand-600" />
    <span className="text-sm font-medium text-neutral-700">{text}</span>
  </motion.div>
);

const TrustStatistics = () => {
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
    { icon: FaCheckCircle, text: "BSCC Certified Partner" },
    { icon: FaStar, text: "4.9/5 Google Rating" },
    { icon: FaAward, text: "Best Education Consultancy 2024" },
    { icon: FaCheckCircle, text: "ISO Certified" },
  ];

  return (
    <section className="py-24 bg-neutral-50">
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
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Numbers That Speak
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Our track record demonstrates our commitment to student success and trust building
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {badges.map((badge, index) => (
            <TrustBadge key={index} {...badge} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStatistics;
