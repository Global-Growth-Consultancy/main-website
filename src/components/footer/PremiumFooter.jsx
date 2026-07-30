import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";

const FooterLink = ({ href, children }) => (
  <a href={href} className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
    {children}
  </a>
);

const PremiumFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-premium-navy border-t border-white/10">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <GiBrain className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient">GGC</h3>
                <p className="text-xs text-gray-400 tracking-wider">GLOBAL GROWTH CONSULTANCY</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Bihar's premier education consultancy, dedicated to helping students achieve their academic dreams through expert guidance and seamless admission support.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><FooterLink href="#about">About Us</FooterLink></li>
              <li><FooterLink href="#services">Our Services</FooterLink></li>
              <li><FooterLink href="#bscc">BSCC Loans</FooterLink></li>
              <li><FooterLink href="#colleges">Partner Colleges</FooterLink></li>
              <li><FooterLink href="#success">Success Stories</FooterLink></li>
              <li><FooterLink href="#contact">Contact Us</FooterLink></li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li><FooterLink href="#">Admission Guidance</FooterLink></li>
              <li><FooterLink href="#">Education Loans</FooterLink></li>
              <li><FooterLink href="#">Career Counseling</FooterLink></li>
              <li><FooterLink href="#">Document Processing</FooterLink></li>
              <li><FooterLink href="#">Entrance Exam Support</FooterLink></li>
              <li><FooterLink href="#">Scholarship Assistance</FooterLink></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold text-white mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123, Education Hub, Fraser Road<br />
                  Patna, Bihar - 800001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <FooterLink href="tel:+919876543210">+91 98765 43210</FooterLink>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <FooterLink href="mailto:info@ggc-consultancy.com">info@ggc-consultancy.com</FooterLink>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Global Growth Consultancy. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Refund Policy</FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all z-50"
      >
        <FaArrowUp className="text-white" />
      </motion.button>
    </footer>
  );
};

export default PremiumFooter;
