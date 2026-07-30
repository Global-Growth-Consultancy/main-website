import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle } from "react-icons/fa";

const ContactInfoCard = ({ icon: Icon, title, content, subContent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 card-hover"
  >
    <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
      <Icon className="text-2xl text-brand-600" />
    </div>
    <h4 className="text-lg font-bold text-neutral-900 mb-2">{title}</h4>
    <p className="text-neutral-700 mb-1">{content}</p>
    {subContent && <p className="text-neutral-600 text-sm">{subContent}</p>}
  </motion.div>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      content: "123, Education Hub, Fraser Road",
      subContent: "Patna, Bihar - 800001"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      content: "+91 98765 43210",
      subContent: "Mon-Sat, 9AM-7PM"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      content: "info@ggc-consultancy.com",
      subContent: "support@ggc-consultancy.com"
    },
    {
      icon: FaClock,
      title: "Working Hours",
      content: "Monday - Saturday",
      subContent: "9:00 AM - 7:00 PM"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-brand-600 font-medium text-sm tracking-wider uppercase mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Start Your Journey
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Have questions? Ready to begin? Reach out to us and let's discuss how we can help you achieve your educational goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-8">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((info, index) => (
                <ContactInfoCard key={index} {...info} delay={index * 0.1} />
              ))}
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-neutral-50 rounded-2xl p-4 h-64 flex items-center justify-center border border-neutral-200"
            >
              <div className="text-center">
                <FaMapMarkerAlt className="text-4xl text-brand-600 mb-3 mx-auto" />
                <p className="text-neutral-700">Interactive Map</p>
                <p className="text-sm text-neutral-600">Patna, Bihar</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">Send us a Message</h3>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-4xl text-success-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-neutral-900 mb-2">Message Sent!</h4>
                  <p className="text-neutral-600">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Course Interested In
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
                    >
                      <option value="">Select a course</option>
                      <option value="engineering">Engineering (B.Tech/B.E)</option>
                      <option value="medical">Medical (MBBS/BDS)</option>
                      <option value="management">Management (MBA/BBA)</option>
                      <option value="arts">Arts & Humanities</option>
                      <option value="science">Science</option>
                      <option value="commerce">Commerce</option>
                      <option value="law">Law</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200 flex items-center justify-center gap-3"
                  >
                    <span>Send Message</span>
                    <FaPaperPlane />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-neutral-600 mb-6">Prefer to talk directly?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+917739973470" className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200 gap-3">
              <FaPhone />
              <span>Call Now</span>
            </a>
            <a 
              href="https://wa.me/917739973470" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors duration-200 gap-3"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
