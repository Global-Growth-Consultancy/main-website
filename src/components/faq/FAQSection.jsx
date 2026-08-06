import React from "react";
import FAQCardSlider from "./FAQCardSlider";

const faqs = [
  {
    category: "BSCC",
    question: "What is the Bihar Student Credit Card (BSCC) scheme?",
    answer:
      "A flagship government scheme launched on 2 October 2016 under Bihar's 'Saat Nischay' initiative. It gives 12th-pass students of Bihar a collateral-free education loan of up to ₹4 lakh for higher education — and since September 2025 the interest is 0% for every student.",
  },
  {
    category: "Loans",
    question: "What does the loan actually cover?",
    answer:
      "Tuition fees, hostel and accommodation, books (up to ₹10,000), laptop for technical courses (up to ₹35,000), exam fees, and living expenses (up to ₹5,000/month for non-hostel students). The total can't exceed ₹4 lakh.",
  },
  {
    category: "Eligibility",
    question: "Who is eligible for a BSCC loan?",
    answer:
      "Permanent residents of Bihar, 12th pass from a recognized board (10th is enough for polytechnic/diploma), with admission in a BSCC-approved institution. Age up to 25 (UG) / 30 (PG & professional). No minimum marks and no income ceiling.",
  },
  {
    category: "Loans",
    question: "Is there any interest or collateral?",
    answer:
      "No collateral, no security and no third-party guarantee — the Government of Bihar is the guarantor. Interest is 0% for all students since September 2025. A parent/guardian joins as co-applicant for documentation.",
  },
  {
    category: "Admissions",
    question: "How long does the admission + loan process take?",
    answer:
      "Admission confirmation generally takes 2–4 weeks. The full BSCC process — portal application, DRCC verification, bank sanction and disbursal — typically takes 30–90 days. GGC tracks your application at every stage so nothing gets stuck.",
  },
  {
    category: "Repayment",
    question: "When do I start repaying, and in how many installments?",
    answer:
      "Repayment starts one year after your course ends, or six months after you get a job — whichever comes first. Loans up to ₹2 lakh are repaid in 84 EMIs (7 years); loans above ₹2 lakh in 120 EMIs (10 years). No prepayment penalty.",
  },
  {
    category: "Support",
    question: "What if my BSCC application gets rejected?",
    answer:
      "We first find out the exact reason — most rejections are document-related and fixable — then help you reapply correctly. If BSCC truly isn't possible, we move you to private bank loans, NBFC financing or scholarships so your education never stalls.",
  },
  {
    category: "Process",
    question: "Can you help with colleges outside Bihar?",
    answer:
      "Absolutely. If your institution is on the BSCC-approved list, the loan works anywhere in India. We also have partnerships with 200+ institutions including IITs, NITs, central universities and top private colleges.",
  },
];

const FAQSection = () => {
  return (
    <FAQCardSlider
      faqs={faqs}
      eyebrow="FAQ"
      title="Common Questions"
      subtitle="Find answers to frequently asked questions about our services, admissions and BSCC loans."
    />
  );
};

export default FAQSection;
