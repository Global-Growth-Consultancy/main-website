import React from "react";
import { Link } from "react-router-dom";
import {
  FaUniversity, FaBuilding, FaLandmark, FaGraduationCap, FaArrowRight, FaCheckCircle,
  FaFileAlt, FaSearch, FaClipboardCheck, FaUserGraduate, FaWhatsapp,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero";
import LuxCard from "../components/shared/LuxCard";
import ScrollReveal from "../components/shared/ScrollReveal";
import UniversityPartners from "../components/partners/UniversityPartners";

const courseCategories = [
  { icon: FaGraduationCap, category: "Engineering & Technology", programs: "B.Tech, M.Tech, Polytechnic, Diploma" },
  { icon: FaUserGraduate, category: "Medical & Healthcare", programs: "MBBS, BDS, B.Pharm, M.Pharm, Nursing" },
  { icon: FaBuilding, category: "Management & Commerce", programs: "BBA, MBA, B.Com, M.Com, PGDM" },
  { icon: FaLandmark, category: "Computer & IT", programs: "BCA, MCA, AI, ML, Cybersecurity" },
  { icon: FaUniversity, category: "Law & Education", programs: "LLB, BA LLB, LLM, B.Ed, M.Ed" },
  { icon: FaGraduationCap, category: "Science & Arts", programs: "B.Sc, M.Sc, BA, MA, BFA, B.Des" },
];

const admissionSteps = [
  { icon: FaSearch, title: "Profile Assessment", description: "We understand your marks, stream, budget and career goals to shortlist the best-fit institutions." },
  { icon: FaClipboardCheck, title: "Shortlisting & Strategy", description: "Compare courses and colleges, check eligibility and approval status — especially for BSCC-funded seats." },
  { icon: FaFileAlt, title: "Application & Documents", description: "We prepare, verify and submit every application and document — accurately and on time." },
  { icon: FaCheckCircle, title: "Admission & Fee Support", description: "Once selected, we manage fee payment, education loan disbursal and complete admission formalities." },
  { icon: FaGraduationCap, title: "Post-Admission Support", description: "Scholarships, internships, hostel guidance and everything you need through your course." },
];

const CollegesPage = () => {
  return (
    <>
      <PageHero
        eyebrow="Our Network"
        title="200+ Partner Institutions"
        highlight="One Application, Endless Possibilities."
        subtitle="We maintain direct partnerships with engineering, medical, law, management and science institutions across India — giving our students priority access, faster decisions and better outcomes."
      />

      {/* Stats strip */}
      <section className="py-12 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "200+", label: "Partner Institutions" },
              { value: "38", label: "Bihar Districts Served" },
              { value: "25+", label: "Courses & Streams" },
              { value: "95%", label: "Admission Success Rate" },
            ].map((stat, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className="card-lux--tight text-center group"
              >
                <h4 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-xs sm:text-sm text-neutral-400">{stat.label}</p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { title: "Premier Institutes", count: "50+", description: "IITs, NITs, and top central universities", gradient: "from-brand-300 via-brand-400 to-accent-400" },
              { title: "Government Colleges", count: "100+", description: "State universities and government colleges", gradient: "from-white via-brand-300 to-brand-500" },
              { title: "Private Universities", count: "50+", description: "Top private and deemed universities", gradient: "from-neutral-200 via-white to-brand-400" },
            ].map((category, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="text-center group"
              >
                <h3 className={`text-4xl sm:text-5xl font-display font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent mb-2`}>
                  {category.count}
                </h3>
                <h4 className="text-xl font-semibold text-white mb-3">{category.title}</h4>
                <p className="text-neutral-400 text-sm">{category.description}</p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Course categories */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block">Course Categories</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Programs We Place Students Into
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCategories.map((item, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
                className="group"
              >
                <div className="lux-icon mb-4">
                  <item.icon className="text-2xl" />
                </div>
                <h4 className="text-lg font-display font-bold text-white mb-1.5">{item.category}</h4>
                <p className="text-sm text-neutral-400">{item.programs}</p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Admission process */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block">How Admission Works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              A Clear, Guided Path to Your Seat
            </h2>
          </div>

          {/* Stepper rail (desktop) */}
          <div className="hidden lg:block relative mb-12 max-w-4xl mx-auto">
            <div className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
            <div className="relative grid grid-cols-5 gap-6">
              {admissionSteps.map((step, index) => (
                <div key={index} className="flex justify-center">
                  <span className="lux-step relative z-10 shadow-[0_0_20px_-6px_rgba(56,189,248,0.5)]">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {admissionSteps.map((step, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className="card-lux--tight group"
              >
                <div className="flex items-center justify-between mb-3">
                  <step.icon className="text-2xl text-brand-400" />
                  <span className="lux-step !min-w-8 !h-8 !text-xs lg:hidden">{index + 1}</span>
                </div>
                <h4 className="text-base font-display font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{step.description}</p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <UniversityPartners />

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <LuxCard className="p-8 sm:p-12 text-center group">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Shortlist Colleges &amp; Get a Roadmap — Free
              </h3>
              <p className="text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Tell us your stream, budget and dream course. We'll return with a personalized shortlist of
                institutions, expected costs, and the exact path to your seat.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact" className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base">
                  Get My Shortlist
                  <FaArrowRight className="text-xs" />
                </Link>
                <a
                  href="https://wa.me/917739973470"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium-outline inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base"
                >
                  <FaWhatsapp />
                  Ask on WhatsApp
                </a>
              </div>
            </LuxCard>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default CollegesPage;
