import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaArrowRight, FaGraduationCap } from "react-icons/fa";

const PremiumNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "#" },
    { name: "About", path: "#about" },
    { name: "Services", path: "#services" },
    { name: "BSCC Loans", path: "#bscc" },
    { name: "Colleges", path: "#colleges" },
    { name: "Contact", path: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-neutral-200 shadow-subtle"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
                <FaGraduationCap className="text-xl text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-neutral-900">GGC</h1>
                <p className="text-xs text-neutral-600">Global Growth Consultancy</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+917739973470"
                className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors"
              >
                <FaPhone className="text-sm" />
                <span>+91 7739973470</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200"
              >
                Free Consultation
                <FaArrowRight className="text-xs" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl text-neutral-900" />
              ) : (
                <FaBars className="text-xl text-neutral-900" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-white" />
            <div className="relative h-full flex flex-col p-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
                    <FaGraduationCap className="text-xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-neutral-900">GGC</h1>
                    <p className="text-xs text-neutral-600">Global Growth Consultancy</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <FaTimes className="text-xl text-neutral-900" />
                </button>
              </div>

              {/* Mobile Nav Items */}
              <div className="flex-1 flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-3 rounded-lg text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-8 space-y-4">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-5 py-3 bg-brand-600 text-white text-center font-medium rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Free Consultation
                </a>
                <div className="flex items-center justify-center gap-6 text-sm text-neutral-600">
                  <a href="tel:+917739973470" className="flex items-center gap-2 hover:text-brand-600 transition-colors">
                    <FaPhone />
                    <span>Call</span>
                  </a>
                  <a href="mailto:globalgrowthconsultancy9@gmail.com" className="flex items-center gap-2 hover:text-brand-600 transition-colors">
                    <FaEnvelope />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumNavbar;
