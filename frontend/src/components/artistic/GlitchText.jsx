import React from "react";
import { motion } from "framer-motion";

/**
 * GlitchText — Text with glitch/distortion effect on hover
 */

const GlitchText = ({
  children,
  as: Component = "span",
  className = "",
  glitchColor1 = "#FF6B6B",
  glitchColor2 = "#00D4FF",
  ...props
}) => {
  const text = typeof children === "string" ? children : "";

  return (
    <Component
      className={`relative inline-block cursor-pointer ${className}`}
      {...props}
    >
      {/* Main text */}
      <span className="relative z-10">{text}</span>
      
      {/* Glitch layers */}
      <motion.span
        className="absolute inset-0 z-0"
        style={{ color: glitchColor1 }}
        initial={{ x: 0, opacity: 0 }}
        whileHover={{
          x: [-2, 2, -2, 0],
          opacity: [0, 0.8, 0.8, 0],
          transition: { duration: 0.3, repeat: Infinity },
        }}
        aria-hidden
      >
        {text}
      </motion.span>
      
      <motion.span
        className="absolute inset-0 z-0"
        style={{ color: glitchColor2 }}
        initial={{ x: 0, opacity: 0 }}
        whileHover={{
          x: [2, -2, 2, 0],
          opacity: [0, 0.8, 0.8, 0],
          transition: { duration: 0.3, repeat: Infinity, delay: 0.05 },
        }}
        aria-hidden
      >
        {text}
      </motion.span>
    </Component>
  );
};

/**
 * GlitchContainer — Container that applies glitch to children on hover
 */
export const GlitchContainer = ({
  children,
  className = "",
  intensity = 4,
  ...props
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        x: [0, -intensity, intensity, -intensity, 0],
        transition: { duration: 0.2, repeat: 2 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlitchText;
