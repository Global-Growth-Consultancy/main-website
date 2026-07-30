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
import SmoothScroll from "./components/shared/SmoothScroll";
import CustomCursor from "./components/shared/CustomCursor";
import LoadingScreen from "./components/shared/LoadingScreen";
import ScrollProgress from "./components/shared/ScrollProgress";
import ParticleBackground from "./components/shared/ParticleBackground";
import GradientMesh from "./components/shared/GradientMesh";

const App = () => {
  return (
    <div className="w-full min-h-screen bg-premium-navy">
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <GradientMesh />
      <ParticleBackground />
      <SmoothScroll />
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
