import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import EnquiryForm from "../shared/EnquiryForm";

const Footer = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <footer className="w-full bg-gray-900 text-white py-10">
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-10 px-6">

                {/* Left Side - Company Info */}
                <motion.div
                    className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <img
                        src="/gamez.png"
                        alt="Gamez Logo"
                        className="w-auto h-24 md:h-32 lg:h-40 object-contain"
                    />
                    <p className="mt-4 text-gray-400 text-sm">
                        Your trusted admission consultancy, guiding students to top universities across India & internationally for all courses.
                    </p>
                </motion.div>

                {/* Center - Quick Links */}
                <motion.div
                    className="md:w-1/3 flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h4 className="text-lg font-semibold mb-4 text-gray-300">Quick Links</h4>
                    <ul className="space-y-2">
                        {["About Us", "Games", "Careers", "Blog"].map((item, index) => (
                            <li key={index}>
                                <a href={`#${item}`} className="text-gray-400 hover:text-blue-400 transition duration-300">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Right Side - Enquiry Form Button */}
                <motion.div
                    className="md:w-1/3 flex flex-col items-center md:items-end text-center md:text-right"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h4 className="text-lg font-semibold mb-4 text-gray-300">Need Help?</h4>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
                    >
                        Open Enquiry Form
                    </button>

                    {/* Social Media Links */}
                    <div className="flex gap-4 mt-4 text-2xl">
                        <motion.a href="#" className="text-blue-400 hover:text-blue-600" whileHover={{ scale: 1.2 }}>
                            <FaFacebook />
                        </motion.a>
                        <motion.a href="#" className="text-blue-300 hover:text-blue-500" whileHover={{ scale: 1.2 }}>
                            <FaTwitter />
                        </motion.a>
                        <motion.a href="#" className="text-pink-500 hover:text-pink-700" whileHover={{ scale: 1.2 }}>
                            <FaInstagram />
                        </motion.a>
                        <motion.a href="#" className="text-blue-500 hover:text-blue-700" whileHover={{ scale: 1.2 }}>
                            <FaLinkedin />
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Enquiry Form - Displayed as Popup */}
            <EnquiryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

            {/* Bottom Footer - Rights & Handled By */}
            <div className="text-center text-gray-500 mt-8 text-sm">
                © {new Date().getFullYear()} GGC. All Rights Reserved.  
                <br />
                Handled by{" "}
                <a
                    href="https://wa.me/917256063776"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                >
                    Balaji Software
                </a>
            </div>
        </footer>
    );
};

export default Footer;
