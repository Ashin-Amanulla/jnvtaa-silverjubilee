import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background - Cream Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDF4E6] via-[#FFF8E7] to-[#FDF4E6]" />

      {/* Animated Elements (Warm Tones) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#1A237E]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-100/40 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-[#1A237E]/10 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[#1A237E] text-sm font-semibold tracking-wide uppercase">
            JNV Trivandrum • Silver Jubilee
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-[#1A237E] drop-shadow-sm leading-tight"
        >
          25 Years of <br />
          <span className="text-gradient-gold relative inline-block">
            Excellence
            {/* Underline decoration */}
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#D4AF37] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-lg sm:text-xl md:text-2xl text-[#1F2937] max-w-2xl mb-12 leading-relaxed"
        >
          Join us as we celebrate the bonds that time cannot break. A reunion of hearts, memories, and shared history.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 group">
            Register Now
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <a href="#journey" className="btn-outline">
            View The Journey
          </a>
        </motion.div>

        {/* Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: FaCalendarAlt, label: "Date", value: "January 25, 2026" },
            { icon: FaMapMarkerAlt, label: "Venue", value: "JNV Campus, Trivandrum" },
            { icon: FaUsers, label: "Batches", value: "All Alumni Welcome" },
          ].map((item, index) => (
            <div
              key={index}
              className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-[#1A237E]/30 transition-colors"
            >
              <item.icon className="text-3xl text-[#1A237E] group-hover:scale-110 transition-transform duration-300" />
              <div className="text-center">
                <span className="block text-sm text-[#4B5563] uppercase tracking-widest mb-1">{item.label}</span>
                <span className="block text-lg font-semibold text-[#1A237E]">{item.value}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4B5563]"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 border-2 border-[#9CA3AF] rounded-full p-1">
          <div className="w-1.5 h-1.5 bg-[#4B5563] rounded-full animate-bounce mx-auto" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
