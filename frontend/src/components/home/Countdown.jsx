import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date: January 25, 2026 09:00:00
    const targetDate = new Date("2026-01-25T09:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Stop timer if date passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="countdown"
      className="relative py-24 sm:py-32 bg-gradient-to-br from-[#F5E6D3] via-[#FDF4E6] to-[#F5E6D3] overflow-hidden"
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1A237E_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      </div>

       {/* Enhanced Floating Elements */}
       <motion.div 
         className="absolute top-10 left-10 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-3xl"
         animate={{
           y: [0, -20, 0],
           scale: [1, 1.1, 1],
         }}
         transition={{
           duration: 6,
           repeat: Infinity,
           ease: "easeInOut"
         }}
       />
       <motion.div 
         className="absolute bottom-10 right-10 w-48 h-48 bg-[#1A237E]/15 rounded-full blur-3xl"
         animate={{
           y: [0, 20, 0],
           scale: [1, 1.15, 1],
         }}
         transition={{
           duration: 8,
           repeat: Infinity,
           ease: "easeInOut",
           delay: 1
         }}
       />

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
            <h2 className="font-heading text-4xl sm:text-5xl text-[#1A237E] mb-3 font-bold">
            Countdown to Celebration
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] mx-auto rounded-full mb-16" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: index * 0.1,
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
              }}
              className="relative group"
            >
              <div className="w-28 h-32 sm:w-36 sm:h-40 glass-panel-enhanced rounded-3xl flex flex-col items-center justify-center border-2 border-white/60 shadow-2xl overflow-hidden transition-all duration-300 group-hover:border-[#D4AF37]/50 group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)]">
                {/* Animated gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/0 via-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.span 
                  className="font-heading text-5xl sm:text-6xl font-bold text-[#1A237E] leading-none mb-2 z-10 relative"
                  key={item.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(item.value).padStart(2, "0")}
                </motion.span>
                <span className="text-xs sm:text-sm font-semibold text-[#4B5563] uppercase tracking-[0.2em] z-10 relative">
                  {item.label}
                </span>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-[#1F2937] font-body text-lg sm:text-xl font-medium"
        >
            <motion.p
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              25 Years. Infinite Memories. One Grand Reunion.
            </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Countdown;
