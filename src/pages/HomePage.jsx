import React from "react";
import PremiumHero from "../components/hero/PremiumHero";
import TrustStatistics from "../components/stats/TrustStatistics";
import Services from "../components/services/Services";
import BSCCLoans from "../components/bscc/BSCCLoans";
import UniversityPartners from "../components/partners/UniversityPartners";
import SuccessStories from "../components/testimonials/SuccessStories";
import AnimatedProcessTimeline from "../components/process/AnimatedProcessTimeline";
import AboutSection from "../components/about/AboutSection";
import FAQSection from "../components/faq/FAQSection";
import ContactSection from "../components/contact/ContactSection";

const HomePage = () => {
  return (
    <>
      <PremiumHero />
      <TrustStatistics />
      <Services />
      <BSCCLoans />
      <UniversityPartners />
      <SuccessStories />
      <AnimatedProcessTimeline />
      <AboutSection />
      <FAQSection />
      <ContactSection />
    </>
  );
};

export default HomePage;
