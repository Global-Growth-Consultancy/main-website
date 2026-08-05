import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 28);

    return () => clearInterval(interval);
  }, []);

  const messages = [
    "Preparing your education journey...",
    "Connecting to 200+ institutions...",
    "Unlocking BSCC loan pathways...",
  ];
  const messageIndex = Math.min(Math.floor(progress / 34), messages.length - 1);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[10000] bg-premium-navy flex items-center justify-center overflow-hidden"
        >
          {/* Ambient glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

          <div className="relative text-center px-6">
            {/* Logo Mark */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              {/* Rotating rings */}
              <motion.div
                className="absolute inset-0 rounded-full border border-brand-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-3 rounded-full border border-dashed border-premium-gold/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />
              {/* Core */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", stiffness: 120, damping: 12 }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-brand-500/50"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                <img
                  src="/GGCWHITE.png"
                  alt="Global Growth Consultancy Logo"
                  className="w-16 h-16 object-contain relative z-10"
                />
              </motion.div>
            </div>

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Global <span className="text-gradient">Growth</span>{" "}
                <span className="text-gradient-gold">Consultancy</span>
              </h1>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 sm:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 via-brand-400 to-premium-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-neutral-400 text-xs sm:text-sm"
              >
                {messages[messageIndex]}
              </motion.p>
              <span className="font-mono text-brand-300 text-xs sm:text-sm tabular-nums">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
