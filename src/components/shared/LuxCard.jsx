import React, { forwardRef, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * LuxCard — premium card. Uses `.card-lux` CSS (gradient hairline border,
 * soft gradient fill, sheen sweep, hover lift). On top of that it tracks the
 * pointer and exposes `--spot-x` / `--spot-y` CSS custom properties so the
 * `.card-lux` spotlight glow can follow the cursor. Renders a motion.div so
 * entrance props (initial / whileInView / viewport / transition) pass through.
 */
const LuxCard = forwardRef(function LuxCard({ className = "", children, ...props }, ref) {
  const onMouseMove = useCallback((e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`card-lux ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export default LuxCard;
