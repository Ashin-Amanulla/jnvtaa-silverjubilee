import React from "react";
import { motion } from "framer-motion";

/**
 * MarqueeText — Infinite horizontal scrolling text
 * 
 * Creates a continuous ticker-style text animation
 */

const MarqueeText = ({
  children,
  className = "",
  speed = 30, // seconds for one complete cycle
  direction = "left", // "left" | "right"
  separator = " • ", // Separator between repeated text
  repeat = 4, // How many times to repeat the text
  ...props
}) => {
  const text = typeof children === "string" ? children : "";
  const repeatedText = Array(repeat).fill(text).join(separator) + separator;

  return (
    <div 
      className={`overflow-hidden whitespace-nowrap ${className}`}
      {...props}
    >
      <motion.div
        className="inline-flex"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        <span className="inline-block pr-4">{repeatedText}</span>
        <span className="inline-block pr-4">{repeatedText}</span>
      </motion.div>
    </div>
  );
};

export default MarqueeText;
