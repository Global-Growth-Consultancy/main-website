import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PremiumNavbar from "../navbar/PremiumNavbar";
import PremiumFooter from "../footer/PremiumFooter";
import LoadingScreen from "../shared/LoadingScreen";
import SmoothScrollWrapper from "../shared/SmoothScrollWrapper";
import ScrollProgress from "../shared/ScrollProgress";
import CustomCursor from "../shared/CustomCursor";
import WhatsAppFloat from "../shared/WhatsAppFloat";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        const lenis = window.__lenis;
        if (lenis) {
          lenis.scrollTo(target, { offset: -72, duration: 1.1 });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
    }
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const PageLayout = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SmoothScrollWrapper>
      <ScrollToTop />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="w-full min-h-screen bg-premium-navy relative overflow-x-hidden">
        <ScrollProgress />
        <CustomCursor />
        <PremiumNavbar />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <PremiumFooter />
        <WhatsAppFloat />
      </div>
    </SmoothScrollWrapper>
  );
};

export default PageLayout;
