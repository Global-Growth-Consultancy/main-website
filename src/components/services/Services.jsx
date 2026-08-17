import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGraduationCap, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaChalkboardTeacher, FaClipboardCheck, FaArrowRight, FaChevronDown } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

const ServiceCard = ({ icon: Icon, title, description, features, delay, isExpanded, onToggle }) => (
  <LuxCard
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    className="h-full group"
  >
    <div className="lux-icon mb-3 sm:mb-6">
      <Icon className="text-2xl" />
    </div>

    <div className="flex items-center cursor-pointer md:cursor-default" onClick={onToggle}>
      <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-3">
        {title}
      </h3>
      <FaChevronDown className="md:hidden ml-auto text-neutral-500 text-xs transition-transform duration-300" style={{transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)'}} />
    </div>

    <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
      <p className="text-neutral-400 mb-3 sm:mb-6 leading-relaxed text-sm">{description}</p>

      <ul className="space-y-2 sm:space-y-3">
        {features.map((feature, featureIndex) => (
          <motion.li
            key={featureIndex}
            className="flex items-center gap-3 text-sm text-neutral-300 group-hover:translate-x-1 transition-transform duration-300"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + featureIndex * 0.05 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand-400 to-accent-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] flex-shrink-0" />
            {feature}
          </motion.li>
        ))}
      </ul>
    </div>
  </LuxCard>
);

const Services = () => {
  const services = [
    {
      icon: FaGraduationCap,
      title: "Admission Guidance",
      description: "Expert counseling for choosing the right college and course based on your career goals and academic profile.",
      features: [
        "Career Assessment",
        "College Selection",
        "Course Counseling",
        "Application Support"
      ],
      delay: 0
    },
    {
      icon: FaHandHoldingUsd,
      title: "Education Loans",
      description: "Complete assistance for education loans through Bihar Student Credit Card (BSCC) and private banks.",
      features: [
        "BSCC Scheme Guidance",
        "Private Bank Loans",
        "Documentation Support",
        "Loan Approval Tracking"
      ],
      delay: 0.1
    },
    {
      icon: FaFileAlt,
      title: "Document Processing",
      description: "End-to-end document verification, preparation, and submission for seamless admission process.",
      features: [
        "Document Verification",
        "Form Filling",
        "Application Tracking",
        "Deadline Management"
      ],
      delay: 0.2
    },
    {
      icon: FaUniversity,
      title: "College Partnerships",
      description: "Direct tie-ups with 200+ prestigious colleges and universities across India for priority admissions.",
      features: [
        "200+ Partner Colleges",
        "Priority Admissions",
        "Scholarship Assistance",
        "Campus Visits"
      ],
      delay: 0.3
    },
    {
      icon: FaChalkboardTeacher,
      title: "Career Counseling",
      description: "Professional career guidance to help you make informed decisions about your future path.",
      features: [
        "Aptitude Testing",
        "Career Roadmap",
        "Industry Insights",
        "Mentorship Programs"
      ],
      delay: 0.4
    },
    {
      icon: FaClipboardCheck,
      title: "Entrance Exam Support",
      description: "Guidance and preparation support for various entrance examinations for professional courses.",
      features: [
        "Exam Registration",
        "Study Materials",
        "Mock Tests",
        "Result Analysis"
      ],
      delay: 0.5
    }
  ];

  const [showAll, setShowAll] = useState(false);
  const [expandedService, setExpandedService] = useState(-1);

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-24 bg-premium-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <span className="eyebrow mb-4 block">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-display font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Comprehensive Services
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            From admission to loan processing, we provide end-to-end support for your educational journey
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
          {services.map((service, index) => (
            <div key={index} className={index >= 3 && !showAll ? "hidden sm:block" : ""}>
              <ServiceCard {...service} index={index} isExpanded={expandedService === index} onToggle={() => setExpandedService(expandedService === index ? -1 : index)} />
            </div>
          ))}
        </div>

        {/* Mobile Show All Button */}
        <div className="text-center mt-8 sm:hidden">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            {showAll ? "Show Less" : "Show All Services"}
            <FaArrowRight className="text-xs" />
          </button>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-neutral-400 mb-4 sm:mb-6 text-sm sm:text-base">Need personalized guidance for your specific situation?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base"
            >
              Schedule Free Consultation
              <FaArrowRight className="text-xs" />
            </Link>
            <Link
              to="/services"
              className="btn-premium-outline inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
            >
              View Complete Service Details
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
