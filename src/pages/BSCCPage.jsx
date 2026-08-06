import { motion } from "framer-motion";
import {
  FaCreditCard, FaCheckCircle, FaRupeeSign, FaShieldAlt, FaClock, FaFileAlt,
  FaGraduationCap, FaLandmark, FaPhone, FaWhatsapp, FaUserCheck, FaRegClock,
} from "react-icons/fa";
import PageHero from "../components/layout/PageHero";
import LuxCard from "../components/shared/LuxCard";
import BSCCVisualizer from "../components/bscc/BSCCVisualizer";
import FAQCardSlider from "../components/faq/FAQCardSlider";

const eligibility = [
  { title: "Permanent Resident of Bihar", description: "Aadhaar with a Bihar address or a valid Bihar domicile certificate." },
  { title: "Class 12 Passed", description: "Passed intermediate (10+2) from a recognized board — BSEB, CBSE, ICSE or any state board. 10th pass is enough for Polytechnic/Diploma." },
  { title: "Age Limit", description: "Generally up to 25 years for undergraduate courses; up to 30 years for postgraduate and certain professional courses." },
  { title: "Confirmed Admission", description: "Admission in a recognized, BSCC-approved institution (UGC / AICTE / NMC / BCI approved)." },
  { title: "No Minimum Marks", description: "There is no state-level minimum percentage requirement — 12th pass is sufficient." },
  { title: "Income-Agnostic", description: "Latest guidelines set no strict family income ceiling — the scheme is designed for economically weaker families but is open to eligible students." },
];

const covered = [
  { icon: FaGraduationCap, title: "Tuition Fees", description: "Actual institution fee structure — fully covered." },
  { icon: FaLandmark, title: "Hostel & Accommodation", description: "Hostel, mess and rented accommodation costs." },
  { icon: FaFileAlt, title: "Books & Stationery", description: "Up to ₹10,000 for books and study material." },
  { icon: FaUserCheck, title: "Laptop / Computer", description: "Up to ₹35,000 for technical and professional courses." },
  { icon: FaRegClock, title: "Exam & Entrance Fees", description: "Actual examination and entrance fees." },
  { icon: FaRupeeSign, title: "Living Expenses", description: "Up to ₹5,000/month for non-hostel students, by city category." },
];

const documents = [
  "Aadhaar Card",
  "10th Marksheet",
  "12th Marksheet / Passing Certificate",
  "Admission Letter from Institution",
  "Bihar Domicile Certificate",
  "Family Income Certificate",
  "Aadhaar-linked Bank Passbook",
  "Passport-size Photographs (4–5)",
  "Co-applicant (Parent/Guardian) PAN & Documents",
  "Previous Academic Certificates (if any)",
];

const processSteps = [
  { icon: FaFileAlt, title: "Online Application", description: "Register and apply on the official 7 Nischay Yuva Upmission portal (7nishchay-yuvaupmission.bihar.gov.in). Select the BSCC scheme and fill personal, academic, course and co-applicant details." },
  { icon: FaRegClock, title: "DRCC Appointment", description: "The District Registration & Counseling Centre (DRCC) schedules a verification appointment. You receive the date by email and SMS." },
  { icon: FaUserCheck, title: "Document Verification at DRCC", description: "Visit the DRCC on the scheduled date with self-attested copies of all documents. Documents are verified by the Assistant Manager and a Third Party Verification Agency (TPA)." },
  { icon: FaLandmark, title: "Forwarded to Bank", description: "After verification, the application is forwarded to the nominated officer and then to your preferred bank for sanction." },
  { icon: FaCheckCircle, title: "Bank Sanction", description: "The bank confirms the education loan and uploads the sanction letter within about 15 days. You receive an SMS confirmation." },
  { icon: FaCreditCard, title: "Collect Card & Sanction Letter", description: "Visit the DRCC to collect your Student Credit Card and the bank's sanction letter, along with the date to visit the bank." },
  { icon: FaRupeeSign, title: "Disbursal", description: "Complete documentation at the bank. The loan amount is disbursed — directly to your institution or your account, depending on the payment schedule." },
];

const rules = [
  "Students admitted under the management quota (after 27 December 2018) are not eligible for the scheme.",
  "The loan covers recognized general, technical, professional and vocational programs. Distance / online / correspondence courses are generally not covered.",
  "The maximum loan is the lower of your actual course fee or ₹4,00,000 — the total (fees + hostel + books + laptop) cannot exceed ₹4 lakh.",
  "Next installments are released only after you submit a passing/promotion certificate from your institution for the previous semester/year.",
  "The Bihar government does not charge any application fee. Any agent asking for money to 'process' your BSCC application is a fraud.",
  "Repayment can be deferred if you are unemployed after the moratorium — you must submit an unemployment affidavit to the DRCC every June and December.",
  "You must keep studying at the same recognized institution/course to continue receiving installments.",
];

const faqs = [
  {
    category: "BSCC",
    question: "What is the Bihar Student Credit Card (BSCC) scheme?",
    answer: "BSCC is a flagship education loan scheme launched by the Bihar government on 2 October 2016 under the 'Saat Nischay' (Seven Resolutions) initiative. It provides interest-free education loans of up to ₹4 lakh to 12th-pass students of Bihar for higher education — without any collateral or security.",
  },
  {
    category: "Loans",
    question: "What is the interest rate on a BSCC loan?",
    answer: "Since the Bihar Cabinet decision of September 2025, BSCC loans are completely interest-free (0%) for all students — male, female, transgender and Divyang. Earlier rates (4% for general and 1% for women/disabled/transgender) have been discontinued. Students repay only the principal amount.",
  },
  {
    category: "Eligibility",
    question: "Who is eligible for BSCC?",
    answer: "You must be a permanent resident of Bihar, have passed Class 12 from a recognized board, and have secured admission in a BSCC-approved institution. Age is generally up to 25 years for graduation and up to 30 years for postgraduation/professional courses. There is no minimum percentage requirement.",
  },
  {
    category: "Eligibility",
    question: "Is there a family income limit for BSCC?",
    answer: "The latest guidelines set no strict income ceiling — the scheme is effectively income-agnostic. It is designed to support students from economically weaker families, so lower-income households naturally benefit the most.",
  },
  {
    category: "Loans",
    question: "Do I need collateral or a guarantor?",
    answer: "No. BSCC requires no collateral, no security and no third-party guarantee. The Government of Bihar itself acts as the guarantor for the loan. A parent/guardian must join as a co-applicant for documentation purposes.",
  },
  {
    category: "Fees",
    question: "How much loan can I get and what does it cover?",
    answer: "Up to ₹4,00,000 — covering tuition fees, hostel and accommodation, books and stationery (up to ₹10,000), laptop (up to ₹35,000), exam fees, and living expenses (up to ₹5,000/month for non-hostel students).",
  },
  {
    category: "Repayment",
    question: "When do I start repaying the loan?",
    answer: "Repayment begins one year after course completion, or six months after you get a job — whichever comes first. For loans up to ₹2 lakh you get 7 years (84 EMIs); for loans above ₹2 lakh you get 10 years (120 EMIs). There is no prepayment penalty.",
  },
  {
    category: "Process",
    question: "How long does approval take?",
    answer: "The complete process — online application, DRCC verification, bank sanction and disbursal — typically takes 30 to 90 days, depending on your district and bank. GGC tracks your application at every stage so nothing gets stuck.",
  },
  {
    category: "Admissions",
    question: "Can I study outside Bihar with BSCC?",
    answer: "Yes. If your institution is on the BSCC-approved list, you can study anywhere in India and still avail the loan. Many of our students use BSCC for IITs, NITs, and private universities outside Bihar.",
  },
  {
    category: "Support",
    question: "What if my BSCC application is rejected?",
    answer: "We first find out the exact reason for rejection and help you fix it — most rejections are document-related and fixable. If BSCC is truly not possible, we move you to private bank education loans, NBFC financing or scholarships, so your education never stalls.",
  },
];

const BSCCPage = () => {

  return (
    <>
      <PageHero
        eyebrow="Bihar Student Credit Card"
        title="Study Now."
        highlight="Pay Nothing in Interest."
        subtitle="The Bihar Student Credit Card (BSCC) — launched under Bihar's flagship 'Saat Nischay' initiative — gives 12th-pass students of Bihar an interest-free, collateral-free education loan of up to ₹4 lakh. Here is everything you need to know, researched and explained simply."
      />

      {/* Key numbers */}
      <section className="py-12 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "₹4 Lakh", label: "Maximum Loan" },
              { value: "0%", label: "Interest for All" },
              { value: "No", label: "Collateral Required" },
              { value: "4 Lakh+", label: "Students Benefited" },
            ].map((stat, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className="card-lux--accent card-lux--tight text-center group"
              >
                <h4 className="text-2xl sm:text-4xl font-display font-bold text-gradient-gold mb-1">{stat.value}</h4>
                <p className="text-xs sm:text-sm text-neutral-400">{stat.label}</p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* What is BSCC + Saat Nischay */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="eyebrow mb-4 block">The Scheme</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                What is the Bihar Student Credit Card?
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  The <span className="text-white font-medium">Bihar Student Credit Card (BSCC)</span> is a
                  government-backed education loan scheme that provides up to <span className="text-white font-medium">₹4 lakh</span> to
                  students for higher education — covering tuition, hostel, books, laptop and living expenses.
                  Launched on <span className="text-white font-medium">2 October 2016</span>, it is implemented through the
                  Bihar State Education Finance Corporation (BSEFC) and managed on the official{" "}
                  <span className="text-white font-medium">7 Nischay Yuva Upmission</span> portal.
                </p>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white pt-2">
                  Part of the <span className="text-gradient">Saat Nischay</span> Initiative
                </h3>
                <p>
                  BSCC is one of the flagship resolutions of Bihar's <span className="text-white font-medium">Saat Nischay (Seven Resolves)</span> —
                  the vision announced by Chief Minister Nitish Kumar to build a developed Bihar. The education and
                  youth pillar of Saat Nischay focuses on making higher education affordable and employable, and it
                  includes three linked schemes:
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { icon: FaCreditCard, title: "BSCC — Student Credit Card", description: "Interest-free loan of up to ₹4 lakh for higher education." },
                  { icon: FaUserCheck, title: "Kushal Yuva Program (KYP)", description: "Free 3-month training in communication, IT and soft skills." },
                  { icon: FaShieldAlt, title: "MNSSBY — Swayam Sahayata Bhata", description: "₹1,000/month unemployment allowance for up to 2 years." },
                ].map((item, index) => (
                  <LuxCard key={index} className="card-lux--tight group" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08 }}>
                    <div className="flex items-start gap-4">
                      <div className="lux-icon !w-12 !h-12 flex-shrink-0">
                        <item.icon className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-neutral-400">{item.description}</p>
                      </div>
                    </div>
                  </LuxCard>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-5">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  <span className="text-brand-300 font-semibold">Objective:</span> ensure that no student of Bihar
                  misses higher education because of money. The scheme's impact is visible — the Bihar Education
                  Department reports <span className="text-white font-medium">₹8,149.56 crore disbursed to 4,04,167 students</span> so far.
                </p>
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <BSCCVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block">Who Can Apply</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              BSCC Eligibility Criteria
            </h2>
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
              Good news: BSCC has no minimum marks and no income ceiling — it is designed to be open.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibility.map((item, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
                className="group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="lux-step !min-w-9 !h-9 !text-sm">{String(index + 1).padStart(2, "0")}</span>
                  <h4 className="text-lg font-display font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage + Repayment */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <span className="eyebrow mb-4 block">Loan Coverage</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6 tracking-tight">
                What the Loan Covers
              </h2>
              <div className="space-y-4">
                {covered.map((item, index) => (
                  <LuxCard
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="card-lux--tight group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="lux-icon !w-12 !h-12 flex-shrink-0">
                        <item.icon className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-0.5">{item.title}</h4>
                        <p className="text-sm text-neutral-400">{item.description}</p>
                      </div>
                    </div>
                  </LuxCard>
                ))}
              </div>
            </div>

            <div>
              <span className="eyebrow mb-4 block">Interest & Repayment</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6 tracking-tight">
                0% Interest. Simple Repayment.
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Following the Bihar Cabinet decision of September 2025, the interest on BSCC loans is{" "}
                <span className="text-white font-medium">0% for every student</span> — you repay only what you borrowed.
                Repayment starts one year after your course ends, or six months after you start earning.
              </p>
              <div className="space-y-4 mb-6">
                {[
                  { title: "Moratorium", description: "Course duration + 1 year, OR 6 months after employment — whichever is earlier." },
                  { title: "Up to ₹2 lakh", description: "Repayable in 84 monthly installments (7 years)." },
                  { title: "Above ₹2 lakh", description: "Repayable in 120 monthly installments (10 years)." },
                  { title: "No penalties", description: "No prepayment penalty — pay off earlier if you wish." },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-brand-400 text-sm mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold text-sm sm:text-base">{item.title}</h4>
                      <p className="text-neutral-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Repayment example table */}
              <LuxCard className="group !p-0 overflow-hidden">
                <div className="p-6 pb-4">
                  <h4 className="text-lg font-display font-bold text-white">Repayment Examples (0% Interest)</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-b border-white/10 bg-surface-100/50">
                        <th className="px-6 py-3 text-left text-neutral-300 font-medium">Loan Amount</th>
                        <th className="px-6 py-3 text-left text-neutral-300 font-medium">Tenure</th>
                        <th className="px-6 py-3 text-right text-neutral-300 font-medium">EMI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["₹1,00,000", "7 years", "₹1,190"],
                        ["₹2,00,000", "7 years", "₹2,381"],
                        ["₹3,00,000", "10 years", "₹2,500"],
                        ["₹4,00,000", "10 years", "₹3,333"],
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="px-6 py-3 text-white">{row[0]}</td>
                          <td className="px-6 py-3 text-neutral-400">{row[1]}</td>
                          <td className="px-6 py-3 text-right text-gradient-gold font-semibold">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-surface-100/30">
                  <p className="text-xs text-neutral-500">
                    Indicative figures based on published guidelines. Final tenure is stated on your sanction letter.
                  </p>
                </div>
              </LuxCard>
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block">Paperwork, Simplified</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Required Documents
            </h2>
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
              Carry self-attested copies to your DRCC visit. GGC helps you prepare every one of these perfectly.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {documents.map((doc, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
                className="card-lux--tight group"
              >
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-brand-400 text-sm mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-300">{doc}</span>
                </div>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Application process */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 block">Step by Step</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              The Complete Application Process
            </h2>
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
              From portal to disbursal in 7 clear stages — typically 30–90 days in total.
            </p>
          </div>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <LuxCard
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
                className="group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="lux-step !min-w-11 !h-11 !text-lg">{index + 1}</span>
                    <div className="lux-icon !w-12 !h-12 sm:hidden">
                      <step.icon className="text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="lux-icon !w-12 !h-12 hidden sm:flex">
                        <step.icon className="text-xl" />
                      </div>
                      <h4 className="text-xl font-display font-bold text-white">{step.title}</h4>
                    </div>
                    <p className="text-neutral-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </LuxCard>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-16 sm:py-20 bg-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LuxCard className="p-8 sm:p-12 group">
            <span className="eyebrow mb-4 block">Know Before You Apply</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-8 tracking-tight">
              Important Rules & Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 py-1.5">
                  <FaShieldAlt className="text-brand-400 text-sm mt-1 flex-shrink-0" />
                  <span className="text-neutral-300 text-sm sm:text-base leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </LuxCard>
        </div>
      </section>

      {/* Real benefit */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="eyebrow mb-4 block">The Real Benefit</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6 tracking-tight">
                What BSCC Actually Changes for a Student
              </h2>
              <div className="space-y-5 text-neutral-400 leading-relaxed">
                <p>
                  Take the example of a student admitted to a ₹3 lakh B.Tech program. With a BSCC loan at 0%
                  interest repaid over 10 years, the total cost of borrowing is <span className="text-white font-medium">zero</span> —
                  the student pays back exactly ₹3,000/month after they start earning, beginning only after the
                  course and a one-year grace period.
                </p>
                <p>
                  The same loan from a private lender at ~11% interest would cost roughly{" "}
                  <span className="text-white font-medium">₹1.8 lakh in interest alone</span>. That is the power of
                  BSCC — and why the scheme has already changed the lives of over 4 lakh students.
                </p>
                <p>
                  Combined with GGC's guidance, BSCC covers your tuition, hostel, laptop and living costs while
                  our team ensures your application is accurate, tracked and approved — so you can focus on one
                  thing only: your studies.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FaRupeeSign, value: "₹3,000/mo", label: "From first EMI (example)" },
                { icon: FaShieldAlt, value: "0%", label: "Total interest payable" },
                { icon: FaClock, value: "30–90", label: "Days to disbursal" },
                { icon: FaUserCheck, value: "100%", label: "GGC tracking coverage" },
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
                  <h4 className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold mb-1">{stat.value}</h4>
                  <p className="text-xs sm:text-sm text-neutral-400">{stat.label}</p>
                </LuxCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQCardSlider
        faqs={faqs}
        eyebrow="BSCC FAQ"
        title="Your Questions, Answered"
        subtitle="Everything about the Bihar Student Credit Card — swipe through the cards, tap any question to expand it."
      />

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-premium-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LuxCard className="p-8 sm:p-12 text-center group">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Apply for Your <span className="text-gradient-gold">BSCC Loan?</span>
            </h3>
            <p className="text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Don't let a complicated process stand between you and a 0% interest education loan. Let GGC handle
              the paperwork, tracking and approvals — free eligibility check, no obligation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20want%20to%20check%20my%20eligibility%20for%20the%20BSCC%20education%20loan."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base"
              >
                <FaWhatsapp />
                Check Eligibility on WhatsApp
              </a>
              <a href="tel:+917739973470" className="btn-premium-outline inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base">
                <FaPhone />
                Call +91 77399 73470
              </a>
            </div>
            <p className="text-xs text-neutral-500 mt-6">
              Official portal: 7nishchay-yuvaupmission.bihar.gov.in · Toll-free helpline: 1800 3456 444
            </p>
          </LuxCard>
        </div>
      </section>

      <FAQCardSlider
        faqs={faqs}
        eyebrow="Quick Recap"
        title="Still Curious?"
        subtitle="Swipe through the BSCC FAQ cards once more — or jump straight to a free eligibility check."
      />
    </>
  );
};

export default BSCCPage;
