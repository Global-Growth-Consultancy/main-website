import React from "react";
import { FaFacebookF, FaInstagram, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-8 md:py-16 px-4 md:px-10">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold animate-pulse">Global Growth Consultancy</h1>
        <p className="mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300">
          Your trusted admission consultancy, guiding students to top universities across India & internationally for all courses.
        </p>
      </div>

      {/* Three Key Features */}
      <div className="max-w-5xl mx-auto mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4">
        {[
          { title: "Expert Guidance", desc: "Our experienced counselors help you choose the best path for your academic and career success." },
          { title: "End-to-End Support", desc: "From application to visa assistance, we ensure a seamless process for students." },
          { title: "Global Reach", desc: "We specialize in admissions for medical courses in top international universities." },
        ].map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 transform hover:scale-105 transition">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-6xl mx-auto mt-8 md:mt-16 text-center px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Why Choose Us?</h2>
        <p className="mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300">
          We are India’s leading consultancy offering admissions for all types of courses across top universities in India & internationally.
        </p>
        <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4">
          {[
            { title: "Personalized Counseling", icon: "🎓" },
            { title: "100% Admission Support", icon: "✅" },
            { title: "Scholarship Assistance", icon: "💰" },
          ].map((item, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 md:p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-indigo-500 dark:hover:bg-indigo-600 transition">
              <span className="text-2xl md:text-3xl">{item.icon}</span>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mt-2 md:mt-4">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto mt-8 md:mt-16 text-center px-4">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Get Started with Your Admission Journey</h3>
        <p className="mt-2 text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300">
          Contact us today and let’s make your dream university a reality!
        </p>

        {/* Call Button */}
        <a href="tel:+917739973470" className="mt-4 md:mt-6 inline-block bg-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-medium hover:bg-indigo-700 transition">
          📞 Call Now: +91 7739973470
        </a>

        {/* Social Media */}
        <div className="flex justify-center mt-4 md:mt-6 gap-4 md:gap-6">
          <a href="https://wa.me/917739973470" target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl md:text-2xl text-green-500 hover:text-green-600 transition">
            <FaWhatsapp />
          </a>
          <a href="mailto:globalgrowthconsultancy9@gmail.com" className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition">
            <FaEnvelope />
          </a>
          <a href="https://www.instagram.com/global_growth_consultancy?utm_source=qr&igsh=d3RuZnlkcXdvd2g5" target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl md:text-2xl text-pink-500 hover:text-pink-600 transition">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Courses Image (Fixed for Mobile & Tablet) */}
      <div className="relative w-full max-w-2xl mx-auto h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[70vh] flex items-center justify-center mt-8 md:mt-12 px-4">
        <img src="/main.png" alt="Courses Banner" className="w-full h-full object-cover rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default About;