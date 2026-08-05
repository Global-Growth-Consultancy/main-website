import React from "react";
import { motion } from "framer-motion";
import { FaCreditCard, FaCheckCircle, FaRupeeSign, FaShieldAlt, FaClock, FaHeadset, FaWhatsapp } from "react-icons/fa";
import BSCCVisualizer from "./BSCCVisualizer";
import LuxCard from "../shared/LuxCard";

const FeatureItem = ({ icon: Icon, title, description }) => (
  <LuxCard
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="card-lux--tight flex items-start gap-4 group"
  >
    <div className="lux-icon !w-12 !h-12 flex-shrink-0">
      <Icon className="text-xl" />
    </div>
    <div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  </LuxCard>
);

const ProcessStep = ({ step, title, description, delay }) => (
  <LuxCard
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    className="h-full group"
  >
    <div className="flex items-start gap-6">
      <div className="lux-step flex-shrink-0">{step}</div>
      <div className="flex-1 pt-1">
        <h4 className="text-xl font-display font-bold text-white mb-2">{title}</h4>
        <p className="text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </div>
  </LuxCard>
);

const BSCCLoans = () => {
  const features = [
    {
      icon: FaRupeeSign,
      title: "Up to ₹4 Lakh Loan",
      description: "Get education loans up to ₹4 lakh for undergraduate and postgraduate courses"
    },
    {
      icon: FaShieldAlt,
      title: "Government Backed",
      description: "100% government-backed scheme with no collateral requirement"
    },
    {
      icon: FaClock,
      title: "Quick Processing",
      description: "Fast approval process with dedicated support from our team"
    },
    {
      icon: FaHeadset,
      title: "Dedicated Support",
      description: "Personal assistance throughout the application and approval process"
    }
  ];

  const eligibility = [
    "Bihar domicile with valid residential proof",
    "Age between 17-35 years",
    "Admission in recognized institution",
    "Family income below ₹8 lakh per annum",
    "No default on any previous loan"
  ];

  const process = [
    {
      step: 1,
      title: "Document Collection",
      description: "We help you gather all required documents including Aadhaar, PAN, income certificate, and admission proof"
    },
    {
      step: 2,
      title: "Application Filling",
      description: "Expert guidance in filling the BSCC application form accurately and completely"
    },
    {
      step: 3,
      title: "Submission & Tracking",
      description: "We submit your application and track its progress through the approval stages"
    },
    {
      step: 4,
      title: "Loan Disbursement",
      description: "Once approved, we ensure smooth disbursement directly to your institution"
    }
  ];

  return (
    <section id="bscc" className="py-24 bg-premium-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-500/20 border border-brand-500/30 mb-6"
          >
            <FaCreditCard className="text-2xl text-brand-400" />
            <span className="font-semibold text-white">Bihar Student Credit Card</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Education Made Accessible
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Bihar Student Credit Card (BSCC) Scheme enables students to pursue higher education without financial constraints. 
            We specialize in BSCC applications with 70-80% of our students benefiting from this government scheme.
          </p>
        </motion.div>

        {/* Live Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <BSCCVisualizer />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Key Benefits</h3>
           <div className="space-y-4">
              {features.map((feature, index) => (
                <FeatureItem key={index} {...feature} />
              ))}
            </div>

            <div className="mt-8">
              <LuxCard className="group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="lux-icon !w-12 !h-12">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">70-80% Success Rate</h4>
                    <p className="text-sm text-neutral-400">Through BSCC Scheme</p>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm">
                  Our expertise in BSCC applications ensures maximum approval rate for eligible students
                </p>
              </LuxCard>
            </div>
          </motion.div>

          {/* Right Column - Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <LuxCard className="h-full">
              <h3 className="text-2xl font-display font-bold text-white mb-6">Eligibility Criteria</h3>
              <ul className="space-y-4">
                {eligibility.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-neutral-300 group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-sm text-success-400" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20want%20to%20check%20my%20eligibility%20for%20the%20BSCC%20education%20loan."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-8 px-6 py-3.5 bg-gradient-to-r from-success-500 to-success-400 text-white font-semibold rounded-xl hover:from-success-400 hover:to-success-500 transition-all duration-300 shadow-lg shadow-success-500/25 hover:shadow-success-500/40 flex items-center justify-center gap-3"
              >
                <FaWhatsapp className="text-lg" />
                Check Your Eligibility on WhatsApp
              </motion.a>
            </LuxCard>
          </motion.div>
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="eyebrow mb-4 block">
            Our BSCC Application Process
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <ProcessStep key={index} {...step} delay={index * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <LuxCard className="p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to Apply for <span className="text-gradient-gold">BSCC Loan?</span>
              </h3>
              <p className="text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Let our experts guide you through the Bihar Student Credit Card application process.
                We ensure your application has the highest chance of approval.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
                >
                  Start BSCC Application
                </a>
                <a
                  href="#faq"
                  className="btn-premium-outline inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
                >
                  Learn More About BSCC
                </a>
              </div>
            </div>
          </LuxCard>
        </motion.div>
      </div>
    </section>
  );
};

export default BSCCLoans;
