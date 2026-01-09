import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EVENT_DATE = new Date("2026-01-25T09:00:00").getTime();

const TimeUnit = ({ value, label, index }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="relative perspective-1000">
        {/* Card Container */}
        <div
          className={`relative w-20 h-24 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-lg overflow-hidden ${
            isFlipping ? "animate-flip" : ""
          }`}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#5D3A1A] to-[#3D2512] border-2 border-[#B8860B]/40 rounded-lg shadow-lg">
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 shadow-inner rounded-lg" />
            
            {/* Top half */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#704214]/30 to-transparent" />
            
            {/* Center line */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#3D2512] shadow-sm" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#B8860B]/20 translate-y-px" />
          </div>

          {/* Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#FDF5E6] drop-shadow-lg">
              {String(value).padStart(2, "0")}
            </span>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-lg" />
        </div>

        {/* Decorative screws */}
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#B8860B]/60 shadow-inner" />
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B8860B]/60 shadow-inner" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#B8860B]/60 shadow-inner" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#B8860B]/60 shadow-inner" />
      </div>

      {/* Label */}
      <span className="mt-4 font-body text-sm sm:text-base text-[#8B4513] uppercase tracking-widest">
        {label}
      </span>
    </motion.div>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = EVENT_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="countdown"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #3D2512 0%, #F4E8D1 15%, #FDF5E6 50%, #F4E8D1 85%, #3D2512 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#3D2512] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#3D2512] to-transparent" />

      {/* Vintage frame corners */}
      <div className="absolute top-8 left-4 sm:left-8 w-16 sm:w-24 h-16 sm:h-24 border-l-2 border-t-2 border-[#B8860B]/40" />
      <div className="absolute top-8 right-4 sm:right-8 w-16 sm:w-24 h-16 sm:h-24 border-r-2 border-t-2 border-[#B8860B]/40" />
      <div className="absolute bottom-8 left-4 sm:left-8 w-16 sm:w-24 h-16 sm:h-24 border-l-2 border-b-2 border-[#B8860B]/40" />
      <div className="absolute bottom-8 right-4 sm:right-8 w-16 sm:w-24 h-16 sm:h-24 border-r-2 border-b-2 border-[#B8860B]/40" />

      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#5D3A1A] mb-4">
            The Countdown Begins
          </h2>
          <div className="section-divider" />
          <p className="font-body text-[#8B4513] text-lg mt-4 mb-12">
            Mark your calendars for this momentous occasion
          </p>
        </motion.div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8">
          <TimeUnit value={timeLeft.days} label="Days" index={0} />
          
          <div className="flex flex-col gap-3 text-[#B8860B] text-2xl sm:text-3xl font-bold mb-8">
            <span>:</span>
          </div>
          
          <TimeUnit value={timeLeft.hours} label="Hours" index={1} />
          
          <div className="flex flex-col gap-3 text-[#B8860B] text-2xl sm:text-3xl font-bold mb-8">
            <span>:</span>
          </div>
          
          <TimeUnit value={timeLeft.minutes} label="Minutes" index={2} />
          
          <div className="flex flex-col gap-3 text-[#B8860B] text-2xl sm:text-3xl font-bold mb-8">
            <span>:</span>
          </div>
          
          <TimeUnit value={timeLeft.seconds} label="Seconds" index={3} />
        </div>

        {/* Event Date */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-[#5D3A1A]/10 rounded-full border border-[#B8860B]/30">
            <div className="w-3 h-3 rounded-full bg-[#B8860B] animate-pulse" />
            <span className="font-heading text-lg sm:text-xl text-[#5D3A1A]">
              January 25, 2026
            </span>
            <div className="w-3 h-3 rounded-full bg-[#B8860B] animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Countdown;
