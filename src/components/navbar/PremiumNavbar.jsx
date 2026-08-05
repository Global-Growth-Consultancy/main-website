import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaArrowRight } from "react-icons/fa";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "BSCC Loans", path: "/bscc" },
  { name: "Colleges", path: "/colleges" },
  { name: "Contact", path: "/contact" },
];

const PremiumNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 20;
        setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-premium-navy/90 backdrop-blur-xl border-b border-white/10 shadow-subtle"
            : "bg-premium-navy"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img
                src="/GGCWHITE.png"
                alt="Global Growth Consultancy Logo"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-bold text-white">GGC</h1>
                <p className="text-[10px] sm:text-xs text-neutral-400">Global Growth Consultancy</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                      isActive ? "text-brand-400" : "text-neutral-300 hover:text-brand-400"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-400"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4">
              <a
                href="tel:+917739973470"
                className="hidden xl:flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-brand-400 transition-colors"
              >
                <FaPhone className="text-sm" />
                <span>+91 7739973470</span>
              </a>
              <Link
                to="/contact"
                className="btn-premium inline-flex items-center justify-center px-4 py-2 xl:px-5 xl:py-2.5 text-xs sm:text-sm"
              >
                Free Consultation
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-lg sm:text-xl text-white" />
              ) : (
                <FaBars className="text-lg sm:text-xl text-white" />
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
            <div className="absolute inset-0 bg-premium-navy" />
            <div className="relative h-full flex flex-col p-4 sm:p-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <img
                    src="/GGCWHITE.png"
                    alt="Global Growth Consultancy Logo"
                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                  />
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-white">GGC</h1>
                    <p className="text-[10px] sm:text-xs text-neutral-400">Global Growth Consultancy</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  <FaTimes className="text-lg sm:text-xl text-white" />
                </button>
              </div>

              {/* Mobile Nav Items */}
              <div className="flex-1 flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                          isActive ? "text-brand-400 bg-surface-100" : "text-white hover:bg-surface-100"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-center font-semibold rounded-xl shadow-lg shadow-brand-500/25 text-sm sm:text-base"
                >
                  Free Consultation
                </Link>
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-400">
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
