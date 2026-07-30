import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaArrowUp, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const PremiumFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">GGC</h3>
            <p className="text-neutral-400 mb-6 leading-relaxed text-sm">
              Global Growth Consultancy - Bihar's premier education consultancy helping students achieve their academic dreams through expert guidance and seamless admission support.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebookF, color: "hover:bg-blue-600" },
                { icon: FaTwitter, color: "hover:bg-sky-500" },
                { icon: FaInstagram, color: "hover:bg-pink-600" },
                { icon: FaLinkedinIn, color: "hover:bg-blue-700" },
                { icon: FaYoutube, color: "hover:bg-red-600" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 ${social.color}`}
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "BSCC Loans", "Colleges", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-neutral-400 hover:text-brand-400 transition-colors duration-200 text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {[
                "Career Counseling",
                "College Admission",
                "BSCC Loan Assistance",
                "Document Preparation",
                "Visa Guidance",
                "Scholarship Support"
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-neutral-400 hover:text-brand-400 transition-colors duration-200 text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaPhone className="text-brand-400 mt-1 text-sm" />
                <div>
                  <a href="tel:+917739973470" className="text-neutral-400 hover:text-brand-400 transition-colors text-sm">
                    +91 7739973470
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-brand-400 mt-1 text-sm" />
                <div>
                  <a href="mailto:globalgrowthconsultancy9@gmail.com" className="text-neutral-400 hover:text-brand-400 transition-colors text-sm">
                    globalgrowthconsultancy9@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-brand-400 mt-1 text-sm" />
                <div>
                  <span className="text-neutral-400 text-sm">Bihar, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; 2024 Global Growth Consultancy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-neutral-500 hover:text-brand-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-500 hover:text-brand-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors duration-200 shadow-lg z-50"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default PremiumFooter;
