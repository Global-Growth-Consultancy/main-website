import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaGraduationCap, FaPhone, FaEnvelope } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";

const PremiumNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { name: "Home", path: "#" },
    { name: "About", path: "#about" },
    { name: "Services", path: "#services" },
    { name: "BSCC Loans", path: "#bscc" },
    { name: "Colleges", path: "#colleges" },
    { name: "Success Stories", path: "#success" },
    { name: "Contact", path: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass-dark py-3 shadow-2xl shadow-primary-500/10"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30"
              >
                <GiBrain className="text-2xl text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">GGC</h1>
                <p className="text-xs text-gray-400 tracking-wider">GLOBAL GROWTH CONSULTANCY</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  className={`relative text-sm font-medium transition-colors duration-300 hover:text-primary-400 ${
                    activeSection === item.name.toLowerCase() ? "text-primary-400" : "text-gray-300"
                  }`}
                  onClick={() => setActiveSection(item.name.toLowerCase())}
                >
                  {item.name}
                  <motion.span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 ${
                      activeSection === item.name.toLowerCase() ? "w-full" : "w-0"
                    }`}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-full border border-primary-500/50 text-primary-400 text-sm font-medium hover:bg-primary-500/10 transition-all duration-300"
              >
                <FaPhone className="inline mr-2" />
                Call Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-premium text-sm"
              >
                Free Consultation
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass hover:bg-white/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl text-white" />
              ) : (
                <FaBars className="text-xl text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-premium-navy/95 backdrop-blur-xl" />
            <div className="relative h-full flex flex-col p-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <GiBrain className="text-xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gradient">GGC</h1>
                    <p className="text-xs text-gray-400">GLOBAL GROWTH CONSULTANCY</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg glass hover:bg-white/20 transition-all"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Mobile Nav Items */}
              <div className="flex-1 flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-all">
                        <FaGraduationCap className="text-primary-400" />
                      </div>
                      <span className="text-lg font-medium">{item.name}</span>
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-8 space-y-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full btn-premium"
                >
                  Free Consultation
                </motion.button>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                  <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                    <FaPhone />
                    <span>Call Now</span>
                  </a>
                  <a href="mailto:info@ggc.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
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
