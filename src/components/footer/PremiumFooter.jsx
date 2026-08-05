import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaArrowUp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const PremiumFooter = () => {
  const year = new Date().getFullYear();
  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const socials = [
    { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/global_growth_consultancy" },
    { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/917739973470" },
  ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "BSCC Loans", to: "/bscc" },
    { label: "Colleges", to: "/colleges" },
    { label: "Contact", to: "/contact" },
  ];

  const services = [
    "Career Counseling",
    "College Admission",
    "BSCC Loan Assistance",
    "Document Preparation",
    "Scholarship Support",
    "Entrance Exam Support",
  ];

  return (
    <footer className="bg-premium-darker text-white relative overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(80%,720px)] h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img
                src="/GGCWHITE.png"
                alt="Global Growth Consultancy Logo"
                className="w-11 h-11 object-contain"
              />
              <div>
                <p className="text-lg font-bold text-white leading-none">GGC</p>
                <p className="text-[11px] text-neutral-400 mt-1">Global Growth Consultancy</p>
              </div>
            </Link>
            <p className="text-neutral-400 mb-6 leading-relaxed text-sm">
              Bihar&apos;s premier education consultancy — guiding students to top colleges across India with
              guaranteed BSCC loan assistance.
            </p>
            <div className="flex gap-2.5">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/15 hover:-translate-y-1 transition-all duration-300"
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs text-neutral-300 mb-5 uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-neutral-400 hover:text-brand-300 transition-colors duration-200 text-sm group inline-flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-500/50 group-hover:bg-brand-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mono text-xs text-neutral-300 mb-5 uppercase tracking-[0.2em]">Services</h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-neutral-400 hover:text-brand-300 transition-colors duration-200 text-sm group inline-flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-500/50 group-hover:bg-brand-400 transition-colors" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs text-neutral-300 mb-5 uppercase tracking-[0.2em]">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-brand-400 text-xs" />
                </div>
                <div className="pt-1">
                  <a href="tel:+917739973470" className="text-neutral-300 hover:text-brand-300 transition-colors text-sm">
                    +91 77399 73470
                  </a>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Mon–Sat, 9AM–7PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-brand-400 text-xs" />
                </div>
                <div className="pt-1">
                  <a
                    href="mailto:globalgrowthconsultancy9@gmail.com"
                    className="text-neutral-300 hover:text-brand-300 transition-colors text-sm break-all"
                  >
                    globalgrowthconsultancy9@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-brand-400 text-xs" />
                </div>
                <div className="pt-1">
                  <span className="text-neutral-300 text-sm">Patna, Bihar, India</span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Serving all 38 districts</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-sm">
            &copy; {year} Global Growth Consultancy. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <Link to="/contact" className="text-neutral-400 hover:text-brand-300 transition-colors">Free Consultation</Link>
            <span className="text-neutral-600">•</span>
            <a href="tel:+917739973470" className="text-neutral-400 hover:text-brand-300 transition-colors">+91 77399 73470</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-lg shadow-brand-500/40 border border-white/10 z-50"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </motion.button>
    </footer>
  );
};

export default PremiumFooter;
