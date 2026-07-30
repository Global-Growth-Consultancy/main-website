import React from "react";
import { FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";

const CollegeList = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold animate-pulse">Top Colleges & Universities</h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300">
          We provide guidance for admissions into 250+ top colleges and universities across various fields.
        </p>
      </div>

      {/* Colleges Table */}
      <div className="overflow-x-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6">Explore Our Categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Programs Available</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Engineering & Technology", "B.Tech, M.Tech, Polytechnic, Diploma, Etc"],
                ["Medical & Healthcare", "MBBS, BDS, B.Pharm, M.Pharm, D.Pharm, Nursing, Etc"],
                ["Management & Commerce", "BBA, MBA, B.Com, M.Com, PGDM, Etc"],
                ["Computer & IT", "BCA, MCA, DCA, AI, ML, Cybersecurity, Etc"],
                ["Law & Education", "LLB, BA LLB, LLM, B.Ed, M.Ed, Etc"],
                ["Science & Arts", "B.Sc, M.Sc, BA, MA, MSW, BFA, B.Des, Etc"],
                ["Hotel & Hospitality", "BHM, Diploma in Hotel Management, Etc"],
              ].map(([category, programs], index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""}>
                  <td className="border px-4 py-2 font-semibold">{category}</td>
                  <td className="border px-4 py-2">{programs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold">Why Choose Us?</h2>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          Get access to top universities and personalized admission assistance for a bright future.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "250+ Colleges & Universities", icon: "🏛️" },
            { title: "Expert Admission Guidance", icon: "🎯" },
            { title: "Scholarships & Financial Aid", icon: "💰" },
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
      <div className="relative w-full h-[60vh] flex items-center justify-center mt-4 object-contain p-0 m-0">
        <img src="/main.png" alt="Courses Banner" className="w-100vw max-h-full object-contain ml-0" />
      </div>
    </div>
  );
};

export default CollegeList;
