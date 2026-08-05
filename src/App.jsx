import React, { useState, useEffect, lazy, Suspense } from "react";
import PremiumNavbar from "./components/navbar/PremiumNavbar";
import PremiumHero from "./components/hero/PremiumHero";
import TrustStatistics from "./components/stats/TrustStatistics";
import Services from "./components/services/Services";
import BSCCLoans from "./components/bscc/BSCCLoans";
import UniversityPartners from "./components/partners/UniversityPartners";
import SuccessStories from "./components/testimonials/SuccessStories";
import AnimatedProcessTimeline from "./components/process/AnimatedProcessTimeline";
import AboutSection from "./components/about/AboutSection";
import FAQSection from "./components/faq/FAQSection";
import ContactSection from "./components/contact/ContactSection";
import PremiumFooter from "./components/footer/PremiumFooter";
import LoadingScreen from "./components/shared/LoadingScreen";
import SmoothScrollWrapper from "./components/shared/SmoothScrollWrapper";
import ScrollProgress from "./components/shared/ScrollProgress";
import CustomCursor from "./components/shared/CustomCursor";
import WhatsAppFloat from "./components/shared/WhatsAppFloat";

const ParticleBackground = lazy(() => import("./components/shared/ParticleBackground"));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SmoothScrollWrapper>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="w-full min-h-screen bg-premium-navy bg-noise relative">
        <Suspense fallback={null}>
          <ParticleBackground />
        </Suspense>
        <ScrollProgress />
        <CustomCursor />
        <PremiumNavbar />

        <main id="main" className="relative z-10">
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
        </main>

        <PremiumFooter />
        <WhatsAppFloat />
      </div>
    </SmoothScrollWrapper>
  );
};

export default App;
