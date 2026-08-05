import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaChalkboardTeacher, FaClipboardCheck } from "react-icons/fa";

const ServiceCard = ({ icon: Icon, title, description, features, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="glass rounded-2xl p-8 shadow-soft border border-white/10 card-hover group cursor-pointer"
  >
    <motion.div 
      className="w-14 h-14 rounded-xl bg-brand-500/20 flex items-center justify-center mb-6 group-hover:bg-brand-500/30 transition-colors duration-300"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="text-2xl text-brand-400 group-hover:text-brand-300 transition-colors duration-300" />
    </motion.div>
    
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors duration-300">
      {title}
    </h3>
    
    <p className="text-neutral-400 mb-6 leading-relaxed text-sm group-hover:text-neutral-300 transition-colors duration-300">{description}</p>
    
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <motion.li 
          key={index} 
          className="flex items-center gap-3 text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors duration-300"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 group-hover:bg-brand-300 transition-colors duration-300" />
          {feature}
        </motion.li>
      ))}
    </ul>
  </motion.div>
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
            <ServiceCard key={index} {...service} />
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
