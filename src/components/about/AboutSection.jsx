import React from "react";
import { motion } from "framer-motion";
import { FaAward, FaUsers, FaHandshake, FaLightbulb, FaBullseye, FaHeart } from "react-icons/fa";

const ValueCard = ({ icon: Icon, title, description, delay }) => (
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
    <h4 className="text-xl font-bold text-neutral-900 mb-2">{title}</h4>
    <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
  </motion.div>
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

  return (
    <section id="about" className="py-24 bg-neutral-50">
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
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Who We Are
          </h2>
          <p className="text-neutral-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Global Growth Consultancy (GGC) is Bihar's premier education consultancy, dedicated to helping students 
            achieve their academic dreams. With over a decade of experience, we have guided thousands of students to 
            prestigious institutions across India.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200"
          >
            <h3 className="text-2xl font-bold text-brand-600 mb-4">Our Mission</h3>
            <p className="text-neutral-600 leading-relaxed">
              To make quality education accessible to every deserving student in Bihar by providing expert guidance, 
              seamless admission support, and hassle-free education loan processing. We believe that financial constraints 
              should never be a barrier to pursuing one's dreams.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200"
          >
            <h3 className="text-2xl font-bold text-brand-600 mb-4">Our Vision</h3>
            <p className="text-neutral-600 leading-relaxed">
              To become India's most trusted education consultancy, known for our integrity, expertise, and 
              unwavering commitment to student success. We aim to empower the youth of Bihar to compete at the 
              national level and build successful careers.
            </p>
          </motion.div>
        </div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-neutral-900 text-center mb-8">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} delay={index * 0.1} />
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
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 text-center card-hover"
            >
              <h3 className="text-4xl font-bold text-brand-600 mb-2">{stat.value}</h3>
              <p className="text-sm text-neutral-600">{stat.label}</p>
            </motion.div>
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
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-soft border border-neutral-200">
            <h3 className="text-3xl font-bold text-neutral-900 text-center mb-8">
              Why Choose GGC?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Expert counselors with 10+ years of experience",
                "Specialization in Bihar Student Credit Card (BSCC) scheme",
                "Direct partnerships with 200+ prestigious institutions",
                "95% success rate in admissions and loan approvals",
                "Personalized guidance based on student profile",
                "End-to-end support from consultation to admission",
                "Transparent process with no hidden charges",
                "24/7 support for all student queries"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-success-600" />
                  </div>
                  <span className="text-neutral-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
