import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaGraduationCap, FaUniversity, FaHandHoldingUsd, FaCheckCircle } from "react-icons/fa";

const PremiumHero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neutral-100 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200"
            >
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span className="text-sm font-medium text-brand-700">Bihar's #1 Education Consultancy</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight"
            >
              Your Gateway to
              <span className="text-brand-600 block">Premium Education</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-neutral-600 leading-relaxed"
            >
              Expert guidance for BSCC loans, college admissions, and career counseling. 
              Join thousands of students who achieved their academic dreams with GGC.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {[
                "Expert career counseling & guidance",
                "BSCC loan assistance (Bihar Student Credit Card)",
                "Direct partnerships with 200+ institutions",
                "95% success rate in admissions"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FaCheckCircle className="text-brand-600 flex-shrink-0" />
                  <span className="text-neutral-700">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200"
              >
                Free Consultation
                <FaArrowRight className="text-sm" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors duration-200"
              >
                Explore Services
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-8 pt-4 border-t border-neutral-200"
            >
              {[
                { icon: FaGraduationCap, label: "5000+ Students", value: "5000+" },
                { icon: FaUniversity, label: "200+ Colleges", value: "200+" },
                { icon: FaHandHoldingUsd, label: "95% Success", value: "95%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <item.icon className="text-brand-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-900">{item.value}</div>
                    <div className="text-xs text-neutral-600">{item.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-white rounded-2xl shadow-large p-8 border border-neutral-200">
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center">
                  <FaGraduationCap className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Success Story</h3>
                  <p className="text-sm text-neutral-600">Rahul Kumar, IIT Delhi</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                <p className="text-neutral-700 leading-relaxed">
                  "GGC helped me secure admission at IIT Delhi with full BSCC loan support. 
                  Their guidance was invaluable throughout the entire process."
                </p>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-5 h-5 rounded-full bg-accent-400 flex items-center justify-center">
                      <span className="text-white text-xs">★</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-100 rounded-full opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent-100 rounded-full opacity-50" />
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-8 -right-8 bg-white rounded-xl shadow-soft p-4 border border-neutral-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                  <FaCheckCircle className="text-success-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">Loan Approved</div>
                  <div className="text-xs text-neutral-600">₹10 Lakhs</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-soft p-4 border border-neutral-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                  <FaUniversity className="text-brand-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">Admission Secured</div>
                  <div className="text-xs text-neutral-600">Top Tier College</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
