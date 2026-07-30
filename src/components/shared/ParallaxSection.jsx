import React, { useRef, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";

const ParallaxSection = ({ children, speed = 0.5, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <div ref={ref} className={className}>
      <div style={{ y }}>{children}</div>
    </div>
  );
};

export default ParallaxSection;
