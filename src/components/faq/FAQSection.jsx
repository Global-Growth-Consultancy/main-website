import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

const FAQItem = ({ question, answer, isOpen, onClick, index }) => (
  <LuxCard
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.05 }}
    className="mb-4 overflow-hidden !p-0 group"
  >
    <button
      onClick={onClick}
      className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="lux-step !min-w-10 !h-10 !text-base">
          <FaQuestionCircle className="text-lg" />
        </div>
        <span className="text-lg font-semibold text-white">{question}</span>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ${
          isOpen
            ? 'border-brand-400/40 bg-brand-500/10 text-brand-300'
            : 'border-white/10 text-neutral-400'
        }`}
      >
        <FaChevronDown className="text-sm" />
      </motion.div>
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-2">
            <p className="text-neutral-400 leading-relaxed pl-14">{answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </LuxCard>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is the Bihar Student Credit Card (BSCC) scheme?",
      answer: "The Bihar Student Credit Card scheme is a government initiative that provides education loans up to ₹4 lakh to students for higher education. It's a collateral-free loan with low interest rates, making quality education accessible to students from Bihar. Our consultancy specializes in BSCC applications with a high success rate."
    },
    {
      question: "What documents are required for BSCC loan application?",
      answer: "For BSCC loan application, you typically need: Aadhaar card, PAN card, residence proof, income certificate, academic certificates, admission letter from the institution, bank account details, and passport-size photographs. Our team helps you gather and verify all required documents."
    },
    {
      question: "How long does the admission process take?",
      answer: "The admission process timeline varies depending on the institution and course. Generally, it takes 2-4 weeks from application to admission confirmation. For BSCC loans, the approval process typically takes 3-6 weeks. We provide timeline estimates and keep you updated throughout the process."
    },
    {
      question: "Do you charge any fees for your services?",
      answer: "We offer free initial consultation. For comprehensive admission guidance and loan processing services, we charge a nominal fee that varies based on the services required. We maintain complete transparency about our fees with no hidden charges. Contact us for a detailed quote based on your needs."
    },
    {
      question: "Can you help with admissions to colleges outside Bihar?",
      answer: "Absolutely! While we specialize in Bihar institutions, we have partnerships with colleges across India including IITs, NITs, central universities, and premier private institutions. We can help you with admissions to any recognized institution in India."
    },
    {
      question: "What if my BSCC loan application gets rejected?",
      answer: "If your BSCC application gets rejected, we help you understand the reason and explore alternative options. This includes private bank education loans, NBFC financing, or scholarship opportunities. Our goal is to ensure you have access to education funding regardless of the initial outcome."
    },
    {
      question: "Do you provide support after admission?",
      answer: "Yes, our relationship continues beyond admission. We provide ongoing support including scholarship guidance, career counseling, mentorship programs, and assistance with any academic or administrative issues that may arise during your course."
    },
    {
      question: "How do I schedule a consultation?",
      answer: "You can schedule a free consultation by calling our helpline, filling out the enquiry form on our website, or visiting our office. Our team will arrange a session with one of our expert counselors who will guide you through the entire process."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-premium-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Common Questions
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Find answers to frequently asked questions about our services and the admission process
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto mb-16">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              {...faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <LuxCard className="p-8 md:p-12 max-w-3xl mx-auto group">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-neutral-400 mb-8">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
              >
                Schedule a Call
              </Link>
              <Link
                to="/bscc"
                className="btn-premium-outline inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
              >
                BSCC Loan Guide
              </Link>
            </div>
          </LuxCard>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
