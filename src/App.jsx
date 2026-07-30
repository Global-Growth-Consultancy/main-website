import React from "react";
import PremiumNavbar from "./components/navbar/PremiumNavbar";
import PremiumHero from "./components/hero/PremiumHero";
import TrustStatistics from "./components/stats/TrustStatistics";
import Services from "./components/services/Services";
import BSCCLoans from "./components/bscc/BSCCLoans";
import UniversityPartners from "./components/partners/UniversityPartners";
import SuccessStories from "./components/testimonials/SuccessStories";
import ProcessTimeline from "./components/process/ProcessTimeline";
import AboutSection from "./components/about/AboutSection";
import FAQSection from "./components/faq/FAQSection";
import ContactSection from "./components/contact/ContactSection";
import PremiumFooter from "./components/footer/PremiumFooter";

const App = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <PremiumNavbar />
      
      <main>
        <PremiumHero />
        <TrustStatistics />
        <Services />
        <BSCCLoans />
        <UniversityPartners />
        <SuccessStories />
        <ProcessTimeline />
        <AboutSection />
        <FAQSection />
        <ContactSection />
      </main>
      
      <PremiumFooter />
    </div>
  );
};

export default App;
