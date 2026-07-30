import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-3xl p-8 card-hover group"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-3xl text-white" />
      </div>
      <h3 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-3">
        {typeof value === 'string' && value.includes('+') ? `${count}+` : count}
        {typeof value === 'string' && value.includes('%') ? '%' : ''}
        {typeof value === 'string' && value.includes('Cr') ? 'Cr+' : ''}
      </h3>
      <p className="text-xl font-semibold text-white mb-2">{label}</p>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

const TrustBadge = ({ icon: Icon, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 px-6 py-3 rounded-full glass"
  >
    <Icon className="text-primary-400" />
    <span className="text-sm font-medium text-gray-300">{text}</span>
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
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

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
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">Numbers That Speak</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
