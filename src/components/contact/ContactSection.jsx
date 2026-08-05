import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ContactInfoCard = ({ icon: Icon, title, content, subContent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="glass rounded-2xl p-6 shadow-soft border border-white/10 card-hover"
  >
    <div className="w-14 h-14 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4">
      <Icon className="text-2xl text-brand-400" />
    </div>
    <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
    <p className="text-neutral-300 mb-1">{content}</p>
    {subContent && <p className="text-neutral-400 text-sm">{subContent}</p>}
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { db, collection, addDoc } = await import("../shared/firebase");
      await addDoc(collection(db, "enquiries"), {
        ...formData,
        timestamp: new Date().toISOString(),
      });
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", course: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError("Kuch galat ho gaya — thoda ruk kar dubara try karein, ya seedha call karein.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      content: "Patna, Bihar",
      subContent: "Serving students across all 38 districts"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      content: "+91 77399 73470",
      subContent: "Mon-Sat, 9AM-7PM"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      content: "globalgrowthconsultancy9@gmail.com",
      subContent: "Replies within 24 hours"
    },
    {
      icon: FaClock,
      title: "Working Hours",
      content: "Monday - Saturday",
      subContent: "9:00 AM - 7:00 PM"
    }
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-premium-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="eyebrow mb-4 block">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-display font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Start Your Journey
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Have questions? Ready to begin? Reach out to us and let's discuss how we can help you achieve your educational goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {contactInfo.map((info, index) => (
                <ContactInfoCard key={index} {...info} delay={index * 0.1} />
              ))}
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass rounded-2xl p-2 h-48 sm:h-64 overflow-hidden border border-white/10 relative"
            >
              <iframe
                title="GGC Location - Patna, Bihar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902305702659!2d85.13756431543247!3d25.594094983690987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58f3b6a0b7df%3A0xdff1b9c876e04271!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1627547740767!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-xl border-0 grayscale-[35%] contrast-[1.05] opacity-90"
              />
              <div className="absolute top-3 left-3 glass rounded-lg px-3 py-1.5 border border-white/10 flex items-center gap-2 pointer-events-none">
                <FaMapMarkerAlt className="text-brand-400 text-xs" />
                <span className="text-[11px] font-medium text-white">Patna, Bihar</span>
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
            <div className="glass rounded-2xl p-6 sm:p-8 shadow-soft border border-white/10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Send us a Message</h3>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-4xl text-success-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-neutral-400">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm sm:text-base"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm sm:text-base"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                      Course Interested In
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-surface-100 border border-white/10 text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all [&>option]:bg-premium-charcoal [&>option]:text-white text-sm sm:text-base"
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
                    <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-surface-100 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none text-sm sm:text-base"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-red-400"
                    >
                      <FaExclamationTriangle className="flex-shrink-0" />
                      {submitError}
                    </motion.p>
                  )}

                  <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-brand-500 hover:to-brand-400 transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[11px] sm:text-xs text-neutral-500">
                    Your details are safe with us — we only use them to contact you about your enquiry.
                  </p>
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
          <p className="text-neutral-400 mb-6">Prefer to talk directly?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+917739973470" className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base gap-3">
              <FaPhone />
              <span>Call Now</span>
            </a>
            <a
              href="https://wa.me/917739973470"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-outline inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base gap-3"
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
