import React from "react";
import { FaUniversity, FaBook, FaCheckCircle, FaRupeeSign, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";

const SevenNischay = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold animate-pulse">
          7 निश्चय योजना एवं बिहार स्टूडेंट क्रेडिट कार्ड योजना
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          बिहार सरकार की प्रमुख योजनाएँ जो शिक्षा और रोजगार को बढ़ावा देती हैं।
        </p>
      </div>

      {/* 7 Nischay Scheme Details */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6">✅ 7 निश्चय योजना के प्रमुख बिंदु</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[{ title: "युवाओं को आर्थिक सशक्तिकरण", icon: <FaBook /> },
            { title: "उच्च शिक्षा को बढ़ावा", icon: <FaUniversity /> },
            { title: "हर घर नल का जल", icon: <FaCheckCircle /> },
            { title: "हर घर बिजली", icon: <FaCheckCircle /> },
            { title: "स्वच्छता और शौचालय", icon: <FaCheckCircle /> },
            { title: "महिलाओं का सशक्तिकरण", icon: <FaCheckCircle /> },
          ].map((item, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300">
              <span className="text-4xl mb-2">{item.icon}</span>
              <h3 className="text-lg font-semibold text-center">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Bihar Student Credit Card Scheme */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-center">📚 बिहार स्टूडेंट क्रेडिट कार्ड योजना</h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 text-center">
          इस योजना के तहत छात्रों को उच्च शिक्षा के लिए <strong>₹4 लाख तक का ऋण</strong> 0% ब्याज दर पर दिया जाता है।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {[{ title: "योग्यता: 12वीं पास छात्र", icon: <FaCheckCircle /> },
            { title: "ऋण राशि: ₹4 लाख तक", icon: <FaRupeeSign /> },
            { title: "ब्याज दर: 0% (लड़कियों, दिव्यांगों हेतु)", icon: <FaRupeeSign /> },
            { title: "कोर्स कवर: B.Tech, MBBS, BBA, BCA, आदि", icon: <FaUniversity /> },
          ].map((item, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300">
              <span className="text-4xl mb-2">{item.icon}</span>
              <h3 className="text-lg font-semibold text-center">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="text-center mt-12">
        <a href="https://www.7nishchay-yuvaupmission.bihar.gov.in/" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all inline-block">
          🎓 अभी आवेदन करें
        </a>
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

      {/* Location Section */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold">📍 हमारा स्थान</h2>
        <div className="mt-4">
          <iframe className="w-full h-80 rounded-lg" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902305702659!2d85.13756431543247!3d25.594094983690987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58f3b6a0b7df%3A0xdff1b9c876e04271!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1627547740767!5m2!1sen!2sin" allowFullScreen="" loading="lazy"></iframe>
        </div>
      </div>
    </div>
  );
};

export default SevenNischay;
