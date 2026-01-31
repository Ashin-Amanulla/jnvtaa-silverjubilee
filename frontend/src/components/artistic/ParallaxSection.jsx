import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ParallaxSection — Scroll-driven parallax container
 * 
 * Creates depth by moving child elements at different speeds during scroll
 */

const ParallaxSection = ({
  children,
  className = "",
  speed = 0.5, // 0 = no movement, 1 = full scroll speed
  direction = "up", // "up" | "down"
  ...props
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "down" ? 1 : -1;
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * speed * multiplier, -100 * speed * multiplier]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ParallaxImage — Image with parallax effect
 */
export const ParallaxImage = ({
  src,
  alt,
  className = "",
  speed = 0.3,
  ...props
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 30}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} {...props}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

/**
 * ParallaxText — Large text with parallax movement
 */
export const ParallaxText = ({
  children,
  className = "",
  speed = 0.2,
  ...props
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 50}%`]);

  return (
    <motion.div
      ref={ref}
      style={{ x }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
