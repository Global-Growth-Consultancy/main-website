import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaSearch, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaCheckCircle, FaGraduationCap } from 'react-icons/fa';
import LuxCard from '../shared/LuxCard';

const AnimatedProcessStep = ({ step, icon: Icon, title, description, index, isActive, onMouseEnter }) => {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
      onMouseEnter={() => onMouseEnter(index)}
    >
      <div className={`flex items-start gap-4 sm:gap-6 transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
        {/* Animated Icon */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border border-transparent transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-br from-brand-500 to-brand-600 shadow-[0_0_36px_-8px_rgba(56,189,248,0.7)]'
                : 'bg-gradient-to-br from-brand-500/15 to-accent-500/10 border-brand-500/20 shadow-lg shadow-black/20'
            }`}
          >
            <Icon className={`text-2xl transition-colors duration-300 ${isActive ? 'text-white' : 'text-brand-400'}`} />
          </motion.div>
          
          {/* Pulsing Effect */}
          {isActive && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-brand-500/30 -z-10"
            />
          )}
          
          {/* Connection Line */}
          {index < 5 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 sm:h-24 origin-top bg-gradient-to-b from-brand-500/70 via-brand-500/30 to-transparent"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pt-2 pb-8 sm:pb-12">
          <div className="flex items-center gap-3 mb-3">
            <motion.span
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`lux-step text-sm ${isActive ? '!bg-brand-600 !text-white !border-brand-400/50' : ''}`}
            >
              {step}
            </motion.span>
            <h4 className={`text-xl font-display font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-300'}`}>
              {title}
            </h4>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0.7 }}
            transition={{ duration: 0.3 }}
            className="text-neutral-400 leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedProcessTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 3500);
    return () => clearInterval(interval);
  }, [inView]);

  const steps = [
    {
      step: 1,
      icon: FaSearch,
      title: "Free Consultation",
      description: "Schedule a free consultation with our expert counselors to discuss your academic goals, career aspirations, and financial situation. We'll help you understand all available options."
    },
    {
      step: 2,
      icon: FaFileAlt,
      title: "Document Preparation",
      description: "Our team assists you in gathering and preparing all necessary documents including academic records, identity proofs, income certificates, and other required paperwork for smooth processing."
    },
    {
      step: 3,
      icon: FaUniversity,
      title: "College Selection & Application",
      description: "Based on your profile and preferences, we help you select the best-fit colleges and universities. We handle the entire application process ensuring accuracy and timely submission."
    },
    {
      step: 4,
      icon: FaHandHoldingUsd,
      title: "Education Loan Processing",
      description: "Specialized assistance for Bihar Student Credit Card (BSCC) and private bank education loans. We guide you through eligibility checks, application filling, and approval tracking."
    },
    {
      step: 5,
      icon: FaCheckCircle,
      title: "Admission Confirmation",
      description: "Once you receive admission offers, we help you compare options, make informed decisions, and complete the admission formalities including fee payment and document verification."
    },
    {
      step: 6,
      icon: FaGraduationCap,
      title: "Ongoing Support",
      description: "Our relationship doesn't end with admission. We provide continuous support throughout your academic journey, including scholarship opportunities, career guidance, and mentorship programs."
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-premium-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="eyebrow mb-4 block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Your Journey to Success
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            A simple, transparent process designed to make your education journey smooth and stress-free
          </p>
        </motion.div>

        {/* Animated Timeline */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <AnimatedProcessStep
              key={index}
              {...step}
              index={index}
              isActive={activeStep === index}
              onMouseEnter={setActiveStep}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="flex items-center justify-between gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className="flex-1 h-1 rounded-full bg-brand-500/20 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: index <= activeStep ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600"
                />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: activeStep === index ? 1.2 : 1,
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index ? 'bg-brand-500' : 'bg-brand-500/30'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <LuxCard className="p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-neutral-400 mb-8">
              Book your free consultation today and take the first step towards your dream education
            </p>
            <Link
              to="/contact"
              className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
            >
              Schedule Free Consultation
            </Link>
          </LuxCard>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedProcessTimeline;