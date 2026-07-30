import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaCheckCircle, FaGraduationCap } from "react-icons/fa";

const ProcessStep = ({ step, icon: Icon, title, description, delay, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative"
  >
    <div className="flex items-start gap-6">
      {/* Icon */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-soft">
          <Icon className="text-2xl text-white" />
        </div>
        {!isLast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-brand-200" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-2 pb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
            {step}
          </span>
          <h4 className="text-xl font-bold text-neutral-900">{title}</h4>
        </div>
        <p className="text-neutral-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const ProcessTimeline = () => {
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
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Your Journey to Success
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            A simple, transparent process designed to make your education journey smooth and stress-free
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <ProcessStep
              key={index}
              {...step}
              delay={index * 0.1}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-soft border border-neutral-200">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-neutral-600 mb-8">
              Book your free consultation today and take the first step towards your dream education
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200"
            >
              Schedule Free Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
