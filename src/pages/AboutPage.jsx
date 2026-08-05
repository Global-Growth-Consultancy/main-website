import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaAward, FaUsers, FaHandshake, FaLightbulb, FaBullseye, FaHeart, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import PageHero from "../components/layout/PageHero";
import LuxCard from "../components/shared/LuxCard";
import ScrollReveal from "../components/shared/ScrollReveal";
import TrustStatistics from "../components/stats/TrustStatistics";
import SuccessStories from "../components/testimonials/SuccessStories";

const milestones = [
  { year: "2014", title: "The Foundation", description: "GGC began as a small counseling desk in Patna with a single vision — no deserving student should be left behind." },
  { year: "2016", title: "BSCC Specialists", description: "When Bihar launched the Student Credit Card scheme, we became one of the first consultancies to master the application process end to end." },
  { year: "2019", title: "200+ Partners", description: "Built direct partnerships with 200+ universities, colleges and institutes across India — from IITs and NITs to premier private institutions." },
  { year: "2022", title: "₹50 Cr+ Loans", description: "Crossed ₹50 crore in education loans facilitated for students through BSCC and private bank financing." },
  { year: "2024", title: "5,000+ Students", description: "Guided more than 5,000 students into quality higher education with a 95% admission and loan approval rate." },
  { year: "2026", title: "The Next Chapter", description: "Now serving students across all 38 districts of Bihar — and expanding our footprint pan-India." },
];

const AboutPage = () => {
  const values = [
    { icon: FaAward, title: "Excellence", description: "We strive for excellence in every aspect of our service, from counseling to documentation." },
    { icon: FaUsers, title: "Student First", description: "Our students' success is our priority. We put their needs and aspirations above everything else." },
    { icon: FaHandshake, title: "Integrity", description: "We maintain complete transparency and honesty in all our dealings with students and institutions." },
    { icon: FaLightbulb, title: "Innovation", description: "We continuously improve our processes and adopt new methods to serve students better." },
    { icon: FaBullseye, title: "Focus", description: "We stay focused on our mission of making quality education accessible to every deserving student." },
    { icon: FaHeart, title: "Compassion", description: "We understand the challenges students face and approach every case with empathy and care." },
  ];

  return (
    <>
      <PageHero
        eyebrow="About GGC"
        title="Who We Are"
        highlight="Your Success is Our Mission."
        subtitle="Global Growth Consultancy (GGC) is Bihar's premier education consultancy. For over a decade we have turned academic aspirations into approved admissions and funded realities — one student at a time."
      />

      {/* Story */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <span className="eyebrow mb-4 block">Our Story</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                From a Desk in Patna to a <span className="text-gradient">Pan-India Network</span>
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  Every year, thousands of talented students in Bihar miss out on higher education — not because
                  they lack ability, but because they lack the right guidance and financial support. GGC was
                  founded to close exactly that gap.
                </p>
                <p>
                  We started with a simple promise: understand the student, recommend the right path, and walk
                  with them until their admission — and their funding — is confirmed. Today that promise has
                  guided more than 5,000 students into prestigious institutions across India.
                </p>
                <p>
                  As recognized specialists in the Bihar Student Credit Card (BSCC) scheme, we have facilitated
                  ₹50+ crore in education loans — helping students afford engineering, medicine, law, management
                  and more without a single barrier of paperwork standing in their way.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: FaUsers, value: "5000+", label: "Students Guided" },
                { icon: FaHandshake, value: "200+", label: "Partner Institutions" },
                { icon: FaAward, value: "95%", label: "Success Rate" },
                { icon: FaLightbulb, value: "10+", label: "Years Experience" },
              ].map((stat, index) => (
                <LuxCard
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className="card-lux--tight text-center group"
                >
                  <div className="lux-icon mb-4 mx-auto">
                    <stat.icon className="text-2xl" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-sm text-neutral-400">{stat.label}</p>
                </LuxCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
            <LuxCard
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group"
            >
              <span className="eyebrow block mb-4">Our Mission</span>
              <p className="text-neutral-300 leading-relaxed">
                To make quality education accessible to every deserving student in Bihar by providing expert
                guidance, seamless admission support, and hassle-free education loan processing. We believe
                that financial constraints should never be a barrier to pursuing one's dreams.
              </p>
            </LuxCard>
            <LuxCard
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group"
            >
              <span className="eyebrow block mb-4">Our Vision</span>
              <p className="text-neutral-300 leading-relaxed">
                To become India's most trusted education consultancy, known for our integrity, expertise, and
                unwavering commitment to student success. We aim to empower the youth of Bihar to compete at
                the national level and build successful careers.
              </p>
            </LuxCard>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <span className="eyebrow mb-4 block">Our Values</span>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                What Drives Us Every Day
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <LuxCard
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className="group"
                >
                  <div className="lux-icon mb-4">
                    <value.icon className="text-2xl" />
                  </div>
                  <h4 className="text-xl font-display font-bold text-white mb-2">{value.title}</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">{value.description}</p>
                </LuxCard>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Milestones — animated vertical timeline */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="eyebrow mb-4 block">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Milestones on the Road to Trust
            </h2>
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
              From a single counseling desk to a state-wide movement — the moments that built GGC.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/0 via-brand-500/40 to-brand-500/0" />

            <div className="space-y-10 md:space-y-14">
              {milestones.map((milestone, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`relative pl-16 md:pl-0 md:w-1/2 ${
                      isLeft ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                    }`}
                  >
                    {/* Node dot */}
                    <div
                      className={`absolute top-6 left-2.5 md:top-8 w-6 h-6 rounded-full border border-brand-400/50 bg-premium-navy flex items-center justify-center ${
                        isLeft ? "md:left-auto md:-right-3" : "md:-left-3"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(56,189,248,0.6)]" />
                    </div>

                    <LuxCard className="group">
                      <span className="lux-step mb-3">{milestone.year}</span>
                      <h4 className="text-xl font-display font-bold text-white mb-2">{milestone.title}</h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">{milestone.description}</p>
                    </LuxCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GGC */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LuxCard className="p-8 md:p-12 group">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-white text-center mb-10">
              Why Students Choose GGC
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {[
                "Expert counselors with 10+ years of experience",
                "Specialization in Bihar Student Credit Card (BSCC) scheme",
                "Direct partnerships with 200+ prestigious institutions",
                "95% success rate in admissions and loan approvals",
                "Personalized guidance based on student profile",
                "End-to-end support from consultation to admission",
                "Transparent process with no hidden charges",
                "24/7 support for all student queries",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-sm text-success-400" />
                  </div>
                  <span className="text-neutral-300 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </LuxCard>
        </div>
      </section>

      <TrustStatistics />
      <SuccessStories />

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LuxCard className="p-8 sm:p-12 text-center group">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Your Story Starts Here
            </h3>
            <p className="text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book a free consultation and let our team design a roadmap that takes you from where you are
              to where you want to be.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base">
                Book Free Consultation
                <FaArrowRight className="text-xs" />
              </Link>
              <Link to="/services" className="btn-premium-outline inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base">
                Explore Our Services
              </Link>
            </div>
          </LuxCard>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
