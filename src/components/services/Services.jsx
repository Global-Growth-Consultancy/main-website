import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaChalkboardTeacher, FaClipboardCheck, FaArrowRight } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

const ServiceCard = ({ icon: Icon, title, description, features, delay, index }) => (
  <LuxCard
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

    <h3 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-3">
      {title}
      <span className="lux-arrow opacity-0 group-hover:opacity-100 -ml-1">
        <FaArrowRight className="text-xs" />
      </span>
    </h3>

    <p className="text-neutral-400 mb-6 leading-relaxed text-sm">{description}</p>

    <ul className="space-y-3">
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

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-premium-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
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
          <a
            href="#contact"
            className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
          >
            Schedule Free Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
