import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const followerX = useSpring(x, { stiffness: 900, damping: 60, mass: 0.2 });
  const followerY = useSpring(y, { stiffness: 900, damping: 60, mass: 0.2 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    const moveCursor = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Event delegation: any interactive element (including dynamically
    // mounted ones) triggers the hover state.
    const handleHoverEnter = (e) => {
      if (e.target.closest("a, button, input, textarea, select, [data-cursor='hover']")) {
        setIsHovering(true);
      }
    };
    const handleHoverLeave = (e) => {
      if (e.target.closest("a, button, input, textarea, select, [data-cursor='hover']")) {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleHoverEnter);
    document.addEventListener("mouseout", handleHoverLeave);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleHoverEnter);
      document.removeEventListener("mouseout", handleHoverLeave);
    };
  }, [x, y]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed w-4 h-4 rounded-full bg-primary-500 pointer-events-none z-[9999] hidden md:block mix-blend-difference -m-2"
        animate={{ scale: isClicking ? 0.8 : isHovering ? 1.5 : 1 }}
        transition={{ type: "spring", stiffness: 800, damping: 40 }}
      />

      {/* Cursor follower — spring-driven, no timers, no re-renders */}
      <motion.div
        ref={followerRef}
        className="fixed w-8 h-8 rounded-full border-2 border-primary-500 pointer-events-none z-[9998] hidden md:block -m-4"
        animate={{ scale: isClicking ? 0.6 : isHovering ? 2 : 1, opacity: isHovering ? 0.5 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ x: followerX, y: followerY }}
      />
    </>
  );
};

export default CustomCursor;
