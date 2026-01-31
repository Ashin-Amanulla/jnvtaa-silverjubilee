import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

/**
 * KineticText — Animated text reveal component
 * 
 * Supports multiple animation styles:
 * - "letters" — Letter-by-letter reveal
 * - "words" — Word-by-word reveal
 * - "lines" — Line-by-line reveal
 * - "slide" — Slide up reveal
 */

const KineticText = ({
  children,
  as: Component = "h1",
  variant = "letters", // "letters" | "words" | "lines" | "slide"
  className = "",
  delay = 0,
  duration = 0.05, // Per-character/word delay
  staggerChildren = 0.03,
  once = true,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const text = typeof children === "string" ? children : "";

  // Container variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  // Letter/Word variants
  const itemVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
      rotateX: -90,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Slide variant
  const slideVariants = {
    hidden: {
      y: 60,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay,
      },
    },
  };

  // Render based on variant
  if (variant === "slide") {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={slideVariants}
        className={className}
        {...props}
      >
        <Component>{children}</Component>
      </motion.div>
    );
  }

  if (variant === "words") {
    const words = text.split(" ");
    return (
      <Component className={className} {...props}>
        <motion.span
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="inline-flex flex-wrap"
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
              <motion.span
                variants={itemVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </Component>
    );
  }

  if (variant === "lines") {
    const lines = text.split("\n");
    return (
      <Component className={className} {...props}>
        <motion.span
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="block"
        >
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                variants={itemVariants}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </Component>
    );
  }

  // Default: letters
  const letters = text.split("");
  return (
    <Component className={className} {...props}>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="inline-block"
        style={{ perspective: "1000px" }}
      >
        {letters.map((char, i) => (
          <span 
            key={i} 
            className="inline-block overflow-hidden"
            style={{ 
              display: char === " " ? "inline" : "inline-block",
              width: char === " " ? "0.3em" : "auto" 
            }}
          >
            <motion.span
              variants={itemVariants}
              className="inline-block"
              style={{ transformOrigin: "bottom" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
};

export default KineticText;
