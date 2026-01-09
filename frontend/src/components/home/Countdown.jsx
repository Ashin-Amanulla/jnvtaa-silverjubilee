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
      className="relative py-20 bg-[#F5E6D3] overflow-hidden"
    >
      {/* Background Pattern - Vintage Geometric */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1A237E_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

       {/* Floating Elements */}
       <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl animate-float" />
       <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#1A237E]/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
            <h2 className="font-heading text-3xl sm:text-4xl text-[#1A237E] mb-2">
            Countdown to Celebration
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-12" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: index * 0.1,
              }}
              className="relative group"
            >
              <div className="w-24 h-28 sm:w-32 sm:h-36 glass-panel rounded-2xl flex flex-col items-center justify-center border border-white/40 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="font-heading text-4xl sm:text-5xl font-bold text-[#1A237E] leading-none mb-1 z-10">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#4B5563] uppercase tracking-widest z-10">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-[#1F2937]/80 font-body text-lg"
        >
            25 Years. Infinite Memories. One Grand Reunion.
        </motion.div>
      </div>
    </section>
  );
};

export default Countdown;
