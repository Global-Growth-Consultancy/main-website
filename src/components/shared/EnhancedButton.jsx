import React from 'react';
import { motion } from 'framer-motion';

const EnhancedButton = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-brand-600 to-brand-500 text-white",
    secondary: "bg-surface-100 text-white border border-white/10",
    outline: "bg-transparent border-2 border-brand-500 text-brand-400",
    glow: "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Ripple effect on hover */}
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Glow effect */}
      {variant === "glow" && (
        <motion.div
          className="absolute inset-0 bg-brand-500/30 blur-xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default EnhancedButton;