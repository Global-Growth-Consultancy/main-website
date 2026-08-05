import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGraduationCap, FaFileAlt, FaUniversity, FaHandHoldingUsd, FaChalkboardTeacher,
  FaClipboardCheck, FaArrowRight, FaCheckCircle, FaWhatsapp,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero";
import LuxCard from "../components/shared/LuxCard";
import ScrollReveal from "../components/shared/ScrollReveal";
import AnimatedProcessTimeline from "../components/process/AnimatedProcessTimeline";
import StreamRoadmap from "../components/services/StreamRoadmap";
import GGCAdvantage from "../components/services/GGCAdvantage";

const services = [
  {
    icon: FaGraduationCap,
    title: "Admission Guidance",
    tagline: "Find the right college and course for your goals",
    description: "Expert counseling for choosing the right college and course based on your career goals, academic profile, and financial situation.",
    features: ["Career Assessment", "College Selection", "Course Counseling", "Application Support", "Seat Confirmation"],
  },
  {
    icon: FaHandHoldingUsd,
    title: "Education Loans — BSCC & Banks",
    tagline: "From application to approved, fully funded education",
    description: "Complete assistance for education loans through Bihar Student Credit Card (BSCC) and private banks — including eligibility checks, documentation and approval tracking.",
    features: ["BSCC Scheme Guidance", "Private Bank Loans", "Documentation Support", "Loan Approval Tracking", "Disbursal Follow-up"],
  },
  {
    icon: FaFileAlt,
    title: "Document Processing",
    tagline: "Every paper, perfect the first time",
    description: "End-to-end document verification, preparation, and submission for a seamless admission and loan process — with zero errors and zero last-minute panic.",
    features: ["Document Verification", "Form Filling", "Application Tracking", "Deadline Management", "Income & Domicile Support"],
  },
  {
    icon: FaUniversity,
    title: "College Partnerships",
    tagline: "Priority access to 200+ institutions",
    description: "Direct tie-ups with 200+ prestigious colleges and universities across India for priority admissions, scholarships and campus visits.",
    features: ["200+ Partner Colleges", "Priority Admissions", "Scholarship Assistance", "Campus Visits", "Direct Counselors"],
  },
  {
    icon: FaChalkboardTeacher,
    title: "Career Counseling",
    tagline: "A clear roadmap, not guesswork",
    description: "Professional career guidance to help you make informed decisions about your future path — grounded in aptitude and industry reality.",
    features: ["Aptitude Testing", "Career Roadmap", "Industry Insights", "Mentorship Programs", "Stream Selection"],
  },
  {
    icon: FaClipboardCheck,
    title: "Entrance Exam Support",
    tagline: "JEE, NEET, CLAT & more — handled with you",
    description: "Guidance and preparation support for various entrance examinations for professional courses, including registration and result analysis.",
    features: ["Exam Registration", "Study Materials", "Mock Tests", "Result Analysis", "Admission After Results"],
  },
];

const whoItIsFor = [
  { title: "12th Pass Students", description: "Just finished school and unsure of the next step — we map your options clearly." },
  { title: "BSCC Loan Applicants", description: "Need an education loan up to ₹4 lakh at 0% interest? We make the process effortless." },
  { title: "Postgraduate Aspirants", description: "MBA, M.Tech, M.Sc and more — funding and admissions handled together." },
  { title: "Professional Course Seekers", description: "MBBS, BDS, B.Tech, LLB, BBA, BCA — the high-investment paths, done right." },
  { title: "Parents & Guardians", description: "Transparent guidance and complete peace of mind through every step." },
  { title: "Outside-Bihar Students", description: "Studying at a BSCC-approved institution outside Bihar — we still manage your loan." },
];

const ServicesPage = () => {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Complete Education Support"
        highlight="From First Counseling to Final Admission."
        subtitle="We don't just fill forms — we build roadmaps. Six integrated services that cover every stage of your higher education journey, with one team watching over all of it."
      />

      {/* Services grid */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (index % 3) * 0.08 }}
                className="flex flex-col group"
              >
                <div className="lux-icon mb-5">
                  <service.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-1.5">{service.title}</h3>
                <p className="text-sm text-brand-300/80 mb-4">{service.tagline}</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-5">{service.description}</p>
                <ul className="space-y-2.5 mt-auto">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2.5 text-sm text-neutral-300">
                      <FaCheckCircle className="text-brand-400 text-xs flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block">Who Is It For</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Built Around Your Journey
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whoItIsFor.map((item, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
                className="card-lux--tight group"
              >
                <h4 className="text-lg font-display font-bold text-white mb-2 flex items-center gap-3">
                  <span className="lux-step !min-w-9 !h-9 !text-sm">{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* BSCC spotlight */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <LuxCard className="card-lux--accent p-8 sm:p-12 relative overflow-hidden group">
              <div
                className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle at center, rgba(255,215,0,0.12), transparent 62%)" }}
              />
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="eyebrow mb-4 block">Specialty Service</span>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-5 tracking-tight">
                    The <span className="text-gradient-gold">Bihar Student Credit Card</span> — Our Signature
                  </h2>
                  <p className="text-neutral-400 leading-relaxed mb-6">
                    BSCC is the single most powerful education finance scheme for Bihar students — up to ₹4
                    lakh at 0% interest with zero collateral. But the application process confuses thousands
                    of eligible students every year. That is exactly where GGC adds value: we have guided more
                    BSCC applications than almost anyone else, and our students enjoy a 70–80% approval rate.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/bscc" className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base">
                      Read the Complete BSCC Guide
                      <FaArrowRight className="text-xs" />
                    </Link>
                    <a
                      href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20want%20to%20check%20my%20eligibility%20for%20the%20BSCC%20education%20loan."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-premium-outline inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base"
                    >
                      <FaWhatsapp />
                      Check Eligibility on WhatsApp
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "₹4 Lakh", label: "Maximum Loan" },
                    { value: "0%", label: "Interest for All" },
                    { value: "No", label: "Collateral Needed" },
                    { value: "70-80%", label: "GGC Approval Rate" },
                  ].map((stat, index) => (
                    <LuxCard
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: index * 0.08 }}
                      className="card-lux--tight text-center group"
                    >
                      <h4 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold mb-1">{stat.value}</h4>
                      <p className="text-xs sm:text-sm text-neutral-400">{stat.label}</p>
                    </LuxCard>
                  ))}
                </div>
              </div>
            </LuxCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <AnimatedProcessTimeline />

      {/* Interactive stream roadmap */}
      <StreamRoadmap />

      {/* GGC vs DIY comparison */}
      <GGCAdvantage />

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <LuxCard className="p-8 sm:p-12 text-center group">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Not Sure Which Service You Need?
              </h3>
              <p className="text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Start with a free consultation. We'll assess your profile, answer every question, and recommend
                exactly what you need — with zero obligation.
              </p>
              <Link to="/contact" className="btn-premium inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base">
                Book a Free Consultation
                <FaArrowRight className="text-xs" />
              </Link>
            </LuxCard>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
