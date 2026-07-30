import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const TiltCard = ({ children, className = "", intensity = 15 }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = card.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const rotateX = (y - 0.5) * intensity;
      const rotateY = (x - 0.5) * -intensity;
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    const handleMouseLeave = () => {
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transform }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
