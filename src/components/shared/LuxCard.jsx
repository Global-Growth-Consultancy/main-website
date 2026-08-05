import React, { forwardRef } from "react";
import { motion } from "framer-motion";

/**
 * LuxCard — quiet-luxury card. Hairline border, soft gradient fill,
 * gentle hover lift + cool glow (all handled by `.card-lux` CSS, no
 * transform props here so framer-motion and CSS never fight). Renders
 * a motion.div so entrance props (initial / whileInView / viewport /
 * transition) pass straight through. Accepts a forwarded ref.
 */
const LuxCard = forwardRef(function LuxCard({ className = "", children, ...props }, ref) {
  return (
    <motion.div ref={ref} className={`card-lux ${className}`} {...props}>
      {children}
    </motion.div>
  );
});

export default LuxCard;
