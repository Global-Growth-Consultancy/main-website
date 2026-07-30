import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

const FAQItem = ({ question, answer, isOpen, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="glass rounded-2xl overflow-hidden mb-4"
  >
    <button
      onClick={onClick}
      className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <FaQuestionCircle className="text-primary-400" />
        </div>
        <span className="text-lg font-semibold text-white">{question}</span>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <FaChevronDown className="text-gray-400" />
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
            <p className="text-gray-400 leading-relaxed pl-14">{answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
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
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-premium-charcoal to-premium-navy">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl" />

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
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">Common Questions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
          <div className="glass rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-400 mb-8">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-premium">
                Schedule a Call
              </button>
              <button className="btn-premium-outline">
                Send us a Message
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
