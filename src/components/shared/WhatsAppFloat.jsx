import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloat = () => {
  return (
    <motion.a
      href="https://wa.me/917739973470?text=Hi%20GGC!%20I%20want%20a%20free%20consultation%20for%20college%20admission%20or%20a%20BSCC%20education%20loan."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GGC on WhatsApp"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-8 left-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-success-400 to-success-500 text-white flex items-center justify-center shadow-2xl shadow-success-500/40 border border-white/20"
    >
      <span className="absolute inset-0 rounded-full bg-success-500/50 animate-ping" />
      <FaWhatsapp className="text-2xl relative" />
    </motion.a>
  );
};

export default WhatsAppFloat;
