import React from "react";
import { motion } from "framer-motion";

const GradientMesh = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%),
            radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%),
            radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%),
            radial-gradient(at 0% 50%, hsla(225,39%,30%,1) 0, transparent 50%),
            radial-gradient(at 50% 50%, hsla(253,16%,7%,1) 0, transparent 50%),
            radial-gradient(at 100% 50%, hsla(339,49%,30%,1) 0, transparent 50%),
            radial-gradient(at 0% 100%, hsla(225,39%,30%,1) 0, transparent 50%),
            radial-gradient(at 50% 100%, hsla(339,49%,30%,1) 0, transparent 50%),
            radial-gradient(at 100% 100%, hsla(253,16%,7%,1) 0, transparent 50%)
          `,
          backgroundSize: "200% 200%",
        }}
      />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl"
      />
    </div>
  );
};

export default GradientMesh;
