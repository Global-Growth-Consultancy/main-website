import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight, FaGraduationCap, FaUniversity, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

const TestimonialCard = ({ testimonial, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className={`${isActive ? 'block' : 'hidden'}`}
    >
      <LuxCard className="p-8 md:p-12 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          {/* Student Image/Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl p-[1px] bg-gradient-to-br from-brand-400 via-accent-400 to-brand-600 shadow-[0_16px_40px_-16px_rgba(56,189,248,0.5)]">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-brand-700 to-premium-navy flex items-center justify-center text-4xl md:text-5xl font-display font-bold text-white">
                {testimonial.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-accent-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
              ))}
            </div>

            <div className="flex items-start gap-3 mb-4">
              <FaQuoteLeft className="text-3xl text-brand-400 flex-shrink-0 mt-1 opacity-70" />
              <p className="text-lg md:text-xl text-neutral-200 leading-relaxed italic">
                "{testimonial.story}"
              </p>
            </div>

            <div className="lux-divider mb-6" />
            <div>
              <h4 className="text-xl font-bold text-white mb-2">{testimonial.name}</h4>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                <span className="flex items-center gap-2">
                  <FaGraduationCap className="text-brand-400" />
                  {testimonial.course}
                </span>
                <span className="flex items-center gap-2">
                  <FaUniversity className="text-brand-400" />
                  {testimonial.college}
                </span>
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-brand-400" />
                  {testimonial.location}
                </span>
              </div>
              {testimonial.loan && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-success-500/30 bg-success-500/10 text-success-400 text-sm">
                  <FaCheckCircle />
                  BSCC Loan Approved
                </div>
              )}
            </div>
          </div>
        </div>
      </LuxCard>
    </motion.div>
  );
};

const SuccessStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Rahul Kumar",
      course: "B.Tech Computer Science",
      college: "IIT Patna",
      location: "Patna, Bihar",
      loan: true,
      story: "GGC made my dream of studying at IIT Patna a reality. Their guidance on the BSCC loan process was exceptional. From document preparation to final approval, they handled everything professionally. Today I'm pursuing my engineering degree without any financial burden."
    },
    {
      name: "Priya Singh",
      course: "MBBS",
      college: "Patna Medical College",
      location: "Gaya, Bihar",
      loan: true,
      story: "Getting into medical college was challenging, but GGC made the admission process seamless. Their expertise in BSCC loans helped me secure funding for my MBBS degree. The counselors were always available to answer my questions and guide me through each step."
    },
    {
      name: "Amit Sharma",
      course: "BBA",
      college: "Delhi University",
      location: "Muzaffarpur, Bihar",
      loan: false,
      story: "GGC's career counseling helped me choose the right path. They guided me through the Delhi University admission process and helped me secure admission in one of the best colleges. Their support didn't end with admission - they continue to mentor me."
    },
    {
      name: "Sneha Kumari",
      course: "B.Tech Electrical",
      college: "NIT Patna",
      location: "Bhagalpur, Bihar",
      loan: true,
      story: "The team at GGC is incredibly knowledgeable about the education loan process. They helped me understand the BSCC scheme benefits and assisted with every document. Thanks to them, I'm now studying at NIT Patna with full financial support."
    },
    {
      name: "Vikram Yadav",
      course: "MBA",
      college: "IIM Indore",
      location: "Arrah, Bihar",
      loan: true,
      story: "GGC's guidance was crucial for my IIM journey. They not only helped with the admission process but also secured education loan through BSCC. Their personalized approach and attention to detail made all the difference."
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="success" className="py-24 bg-premium-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Students Who Made It
          </h2>
          <p className="text-neutral-300 leading-relaxed italic max-w-2xl mx-auto">
            Real stories from students who transformed their futures with our guidance
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative mb-12">
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentIndex}
              testimonial={testimonials[currentIndex]}
              isActive={true}
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-surface-100 border border-white/10 shadow-soft flex items-center justify-center hover:bg-surface-200 transition-all"
            >
              <FaArrowLeft className="text-white" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-brand-600 w-8' : 'bg-neutral-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-surface-100 border border-white/10 shadow-soft flex items-center justify-center hover:bg-surface-200 transition-all"
            >
              <FaArrowRight className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "5000+", label: "Success Stories" },
            { value: "95%", label: "Satisfaction Rate" },
            { value: "200+", label: "Colleges" },
            { value: "50Cr+", label: "Loans Approved" }
          ].map((stat, index) => (
            <LuxCard
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="card-lux--tight text-center group"
            >
              <h3 className="text-3xl font-display font-bold bg-gradient-to-r from-brand-300 to-accent-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-400">{stat.label}</p>
            </LuxCard>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-neutral-400 mb-6">Want to be our next success story?</p>
          <Link
            to="/contact"
            className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base"
          >
            Start Your Journey Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;
