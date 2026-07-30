import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight, FaGraduationCap, FaUniversity, FaMapMarkerAlt } from "react-icons/fa";

const TestimonialCard = ({ testimonial, isActive, index, total }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className={`glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto ${isActive ? 'block' : 'hidden'}`}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Student Image/Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-4xl md:text-5xl shadow-xl shadow-primary-500/30">
            {testimonial.name.charAt(0)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-premium-gold" />
            ))}
          </div>

          <FaQuoteLeft className="text-3xl text-primary-500/30 mb-4" />
          
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6 italic">
            "{testimonial.story}"
          </p>

          <div className="border-t border-white/10 pt-6">
            <h4 className="text-xl font-bold text-white mb-2">{testimonial.name}</h4>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaGraduationCap className="text-primary-400" />
                {testimonial.course}
              </span>
              <span className="flex items-center gap-2">
                <FaUniversity className="text-primary-400" />
                {testimonial.college}
              </span>
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-400" />
                {testimonial.location}
              </span>
            </div>
            {testimonial.loan && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                BSCC Loan Approved
              </div>
            )}
          </div>
        </div>
      </div>
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
    <section id="success" className="py-24 relative overflow-hidden bg-gradient-to-b from-premium-charcoal to-premium-navy">
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
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">Students Who Made It</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
              index={currentIndex}
              total={testimonials.length}
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <FaArrowLeft className="text-white" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary-500 w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
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
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <h3 className="text-3xl font-bold text-gradient-gold mb-2">{stat.value}</h3>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
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
          <p className="text-gray-400 mb-6">Want to be our next success story?</p>
          <button className="btn-premium">
            Start Your Journey Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;
