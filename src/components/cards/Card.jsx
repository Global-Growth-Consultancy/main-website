import React from "react";
import { FaPhone, FaWhatsapp, FaEnvelope, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Cards = () => {
    return (
        <div className="w-full px-4">
            <div className="max-w-screen-xl mx-auto py-10 flex flex-col md:flex-row gap-5">

                {/* Left Side - Location Details */}
                <motion.div
                    className="w-full md:w-1/2 bg-gray-900 text-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-red-500 text-3xl" />
                        Our Location
                    </h2>
                    <p className="text-lg">📍 Sharma Market, Haziyapur Mode, Gopalganj, Bihar (841428), India</p>
                </motion.div>

                {/* Right Side - Contact Details */}
                <motion.div
                    className="w-full md:w-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold mb-4">📞 Contact Us</h2>
                    <div className="flex gap-6 text-4xl">
                        <motion.a
                            href="tel:+917739973470"
                            className="text-blue-400 hover:text-blue-600 transition transform hover:scale-125"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                            <FaPhone />
                        </motion.a>
                        <motion.a
                            href="https://wa.me/917739973470"
                            className="text-green-400 hover:text-green-600 transition transform hover:scale-125"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                            <FaWhatsapp />
                        </motion.a>
                        <motion.a
                            href="mailto:globalgrowthconsultancy9@gmail.com"
                            className="text-yellow-400 hover:text-yellow-600 transition transform hover:scale-125"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                            <FaEnvelope />
                        </motion.a>
                        <motion.a
                            href="https://www.instagram.com/global_growth_consultancy?utm_source=qr&igsh=d3RuZnlkcXdvd2g5"
                            className="text-pink-500 hover:text-pink-700 transition transform hover:scale-125"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                            <FaInstagram />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Cards;
