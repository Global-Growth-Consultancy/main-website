import React from "react";
import { motion } from "framer-motion";
import { FaCreditCard, FaCheckCircle, FaFileAlt, FaUniversity, FaRupeeSign, FaShieldAlt, FaClock, FaHeadset } from "react-icons/fa";

const FeatureItem = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
      <Icon className="text-xl text-primary-400" />
    </div>
    <div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const ProcessStep = ({ step, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative"
  >
    <div className="flex items-start gap-6">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
        <span className="text-xl font-bold text-white">{step}</span>
      </div>
      <div className="flex-1 pt-2">
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  </motion.div>
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
    <section id="bscc" className="py-24 relative overflow-hidden bg-gradient-to-b from-premium-navy to-premium-charcoal">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
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
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass mb-6"
          >
            <FaCreditCard className="text-2xl text-primary-400" />
            <span className="font-semibold text-white">Bihar Student Credit Card</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">Education Made Accessible</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Bihar Student Credit Card (BSCC) Scheme enables students to pursue higher education without financial constraints. 
            We specialize in BSCC applications with 70-80% of our students benefiting from this government scheme.
          </p>
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

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 border border-primary-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <FaCheckCircle className="text-2xl text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">70-80% Success Rate</h4>
                  <p className="text-sm text-gray-400">Through BSCC Scheme</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Our expertise in BSCC applications ensures maximum approval rate for eligible students
              </p>
            </div>
          </motion.div>

          {/* Right Column - Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Eligibility Criteria</h3>
            <ul className="space-y-4">
              {eligibility.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-sm text-green-400" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-8 btn-premium"
            >
              Check Your Eligibility
            </motion.button>
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
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            <span className="text-gradient">Our BSCC Application Process</span>
          </h3>
          
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
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/30 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Apply for BSCC Loan?
              </h3>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Let our experts guide you through the Bihar Student Credit Card application process. 
                We ensure your application has the highest chance of approval.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-premium"
                >
                  Start BSCC Application
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-premium-outline"
                >
                  Learn More About BSCC
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BSCCLoans;
