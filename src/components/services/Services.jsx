import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaPassport, FaChalkboardTeacher, FaPhoneAlt, FaClipboardCheck } from "react-icons/fa";

const ServiceCard = ({ icon: Icon, title, description, features, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="glass rounded-3xl p-8 card-hover group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/30">
        <Icon className="text-3xl text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>
      
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
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
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-premium-navy via-premium-charcoal to-premium-navy" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

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
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">Comprehensive Services</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
          <p className="text-gray-400 mb-6">Need personalized guidance for your specific situation?</p>
          <button className="btn-premium">
            Schedule Free Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
