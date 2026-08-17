import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaAward, FaUsers, FaHandshake, FaLightbulb, FaBullseye, FaHeart, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import LuxCard from "../shared/LuxCard";

const ValueCard = ({ icon: Icon, title, description, delay }) => (
  <LuxCard
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    className="group min-w-[260px] snap-center flex-shrink-0 lg:min-w-0 lg:snap-start"
  >
    <div className="lux-icon mb-4">
      <Icon className="text-2xl" />
    </div>
    <h4 className="text-xl font-display font-bold text-white mb-2">{title}</h4>
    <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
  </LuxCard>
);

const AboutSection = () => {
  const values = [
    {
      icon: FaAward,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from counseling to documentation."
    },
    {
      icon: FaUsers,
      title: "Student First",
      description: "Our students' success is our priority. We put their needs and aspirations above everything else."
    },
    {
      icon: FaHandshake,
      title: "Integrity",
      description: "We maintain complete transparency and honesty in all our dealings with students and institutions."
    },
    {
      icon: FaLightbulb,
      title: "Innovation",
      description: "We continuously improve our processes and adopt new methods to serve students better."
    },
    {
      icon: FaBullseye,
      title: "Focus",
      description: "We stay focused on our mission of making quality education accessible to every deserving student."
    },
    {
      icon: FaHeart,
      title: "Compassion",
      description: "We understand the challenges students face and approach every case with empathy and care."
    }
  ];

  const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "50+", label: "Expert Counselors" },
    { value: "5+", label: "Cities Covered" },
    { value: "24/7", label: "Support Available" }
  ];

  const [showAllWhyChoose, setShowAllWhyChoose] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const whyChooseItems = [
    "Expert counselors with 10+ years of experience",
    "Specialization in Bihar Student Credit Card (BSCC) scheme",
    "Direct partnerships with 200+ prestigious institutions",
    "95% success rate in admissions and loan approvals",
    "Personalized guidance based on student profile",
    "End-to-end support from consultation to admission",
    "Transparent process with no hidden charges",
    "24/7 support for all student queries"
  ];

  const displayedWhyChoose = showAllWhyChoose || isDesktop ? whyChooseItems : whyChooseItems.slice(0, 4);

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-premium-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="eyebrow mb-4 block">About Us</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Who We Are
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            Global Growth Consultancy (GGC) is Bihar's premier education consultancy, dedicated to helping students 
            achieve their academic dreams. With over a decade of experience, we have guided thousands of students to 
            prestigious institutions across India.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 mb-10 sm:mb-16">
          <LuxCard
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="card-lux--accent group"
          >
            <span className="eyebrow block mb-4">Our Mission</span>
            <p className="text-neutral-300 leading-relaxed">
              To make quality education accessible to every deserving student in Bihar by providing expert guidance, 
              seamless admission support, and hassle-free education loan processing. We believe that financial constraints 
              should never be a barrier to pursuing one's dreams.
            </p>
            <div className="lux-divider mt-6 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
          </LuxCard>

          <LuxCard
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="card-lux--accent group"
          >
            <span className="eyebrow block mb-4">Our Vision</span>
            <p className="text-neutral-300 leading-relaxed">
              To become India's most trusted education consultancy, known for our integrity, expertise, and 
              unwavering commitment to student success. We aim to empower the youth of Bihar to compete at the 
              national level and build successful careers.
            </p>
            <div className="lux-divider mt-6 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
          </LuxCard>
        </div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">Our Core Values</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} index={index} delay={index * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <LuxCard
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="card-lux--tight text-center group"
            >
              <h3 className="text-xl sm:text-4xl font-display font-bold bg-gradient-to-r from-brand-300 to-accent-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-400">{stat.label}</p>
            </LuxCard>
          ))}
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <LuxCard className="p-5 sm:p-8 md:p-12">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white text-center mb-8">
              Why Choose GGC?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedWhyChoose.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 group/li"
                >
                  <div className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-sm text-success-400" />
                  </div>
                  <span className="text-neutral-300">{item}</span>
                </motion.div>
              ))}
            </div>
            {!showAllWhyChoose && !isDesktop && (
              <button
                onClick={() => setShowAllWhyChoose(true)}
                className="mt-6 mx-auto flex items-center gap-2 text-brand-300 hover:text-brand-200 text-sm font-medium transition-colors"
              >
                Show all {whyChooseItems.length} reasons
                <FaArrowRight className="text-xs" />
              </button>
            )}
          </LuxCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            to="/about"
            className="btn-premium-outline inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base"
          >
            Read Our Full Story
            <FaArrowRight className="text-xs" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
