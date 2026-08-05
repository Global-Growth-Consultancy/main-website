import React from "react";
import PageHero from "../components/layout/PageHero";
import ContactSection from "../components/contact/ContactSection";
import FAQSection from "../components/faq/FAQSection";

const ContactPage = () => {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's Start the Conversation"
        highlight="We're Here, Ready to Help."
        subtitle="Whether it's a quick eligibility question or a full admission + loan roadmap, our team responds within 24 hours — usually much faster."
      />
      <ContactSection />
      <FAQSection />
    </>
  );
};

export default ContactPage;
