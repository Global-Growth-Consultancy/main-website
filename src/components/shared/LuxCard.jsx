import React, { forwardRef, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * LuxCard — premium, futuristic card.
 * Adds a mouse-following spotlight (via --mx/--my CSS vars), gradient
 * border, layered depth and hover lift. Renders a motion.div so entrance
 * animation props (initial / whileInView / viewport / transition) can be
 * passed straight through. Avoid `whileHover` transform props: the CSS
 * handles the hover lift. Accepts a forwarded ref (same element).
 */
const LuxCard = forwardRef(function LuxCard({ className = "", children, ...props }, ref) {
  const rect = useRef(null);

  const handleMouseEnter = useCallback((e) => {
    rect.current = e.currentTarget.getBoundingClientRect();
  }, []);

  const handleMouseMove = useCallback((e) => {
    const el = ref && ref.current;
    if (!el || !rect.current) return;
    el.style.setProperty("--mx", `${e.clientX - rect.current.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.current.top}px`);
  }, [ref]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      className={`card-lux ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export default LuxCard;
