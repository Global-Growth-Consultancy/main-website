import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaPassport, FaChalkboardTeacher, FaPhoneAlt, FaClipboardCheck } from "react-icons/fa";

const ServiceCard = ({ icon: Icon, title, description, features, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 card-hover"
  >
    <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-6">
      <Icon className="text-2xl text-brand-600" />
    </div>
    
    <h3 className="text-xl font-bold text-neutral-900 mb-3">
      {title}
    </h3>
    
    <p className="text-neutral-600 mb-6 leading-relaxed text-sm">{description}</p>
    
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3 text-sm text-neutral-700">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          {feature}
        </li>
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
    <section id="services" className="py-24 bg-white">
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
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Comprehensive Services
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            From admission to loan processing, we provide end-to-end support for your educational journey
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          className="text-center mt-16"
        >
          <p className="text-neutral-600 mb-6">Need personalized guidance for your specific situation?</p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200"
          >
            Schedule Free Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
