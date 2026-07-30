import React from "react";
import { FaGraduationCap, FaGlobe, FaBookOpen, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";

const Program = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold animate-pulse">Our Courses</h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300">
          Explore our diverse range of courses, designed to help students achieve their academic goals at top universities worldwide.
        </p>
      </div>

      {/* Course Categories */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { title: "Medical Courses", desc: "Get admission into top medical universities with expert guidance.", icon: <FaGraduationCap className="text-4xl text-indigo-500" /> },
          { title: "Engineering Programs", desc: "Pursue engineering at top institutes with seamless admission support.", icon: <FaGlobe className="text-4xl text-green-500" /> },
          { title: "Management Studies", desc: "Excel in business and management with top-tier MBA programs.", icon: <FaBookOpen className="text-4xl text-yellow-500" /> },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 cursor-pointer text-center"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6">Courses We Offer</h2>
        <table className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Courses</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Engineering & Technology", "B.Tech, M.Tech, Polytechnic, Diploma, Etc"],
              ["Medical & Healthcare", "B.Pharm, M.Pharm, D.Pharm, BMLT, DMLT, ANM, GNM, BPT, Etc"],
              ["Management & Commerce", "BBA, MBA, B.Com, M.Com, PGDM, Etc"],
              ["Computer & IT", "BCA, MCA, DCA, Certificate in AI, ML, Cybersecurity, Etc"],
              ["Law & Education", "LLB, BA LLB, LLM, B.Ed, M.Ed, Etc"],
              ["Science & Arts", "B.Sc, M.Sc, BA, MA, MSW, BFA, B.Des, Etc"],
              ["Hotel & Hospitality", "BHM, Diploma in Hotel Management, Etc"],
            ].map(([category, courses], index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                <td className="border px-4 py-2 font-semibold">{category}</td>
                <td className="border px-4 py-2">{courses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Why Choose Our Courses */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold">Why Choose Our Courses?</h2>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          We provide top-notch academic guidance, ensuring the best opportunities for students across various fields.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "Globally Recognized Universities", icon: "🌍" },
            { title: "Expert Admission Assistance", icon: "🎯" },
            { title: "Scholarship & Financial Aid", icon: "💰" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300"
            >
              <span className="text-4xl">{item.icon}</span>
              <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Button */}
      <div className="text-center mt-12">
        <a href="tel:+917739973470" className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all inline-block">
          📞 Call Now: +91 7739973470
        </a>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center mt-6 gap-6 text-2xl">
        <a href="https://wa.me/917739973470" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600">
          <FaWhatsapp />
        </a>
        <a href="mailto:globalgrowthconsultancy9@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500">
          <FaEnvelope />
        </a>
        <a href="https://www.instagram.com/global_growth_consultancy?utm_source=qr&igsh=d3RuZnlkcXdvd2g5" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
          <FaInstagram />
        </a>
      </div>

      {/* Courses Image */}
      <div className="relative w-full h-[60vh] flex items-center justify-center mt-12">
        <img src="/main.png" alt="Courses Banner" className="w-100vw max-h-full object-cover" />
      </div>
    </div>
  );
};

export default Program;
