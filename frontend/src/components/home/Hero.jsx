import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { FaGraduationCap, FaHeart, FaUsers } from "react-icons/fa";

const floatingIcons = [
  { Icon: FaGraduationCap, delay: 0, position: "top-1/4 left-[10%]" },
  { Icon: FaHeart, delay: 0.5, position: "top-1/3 right-[15%]" },
  { Icon: FaUsers, delay: 1, position: "bottom-1/3 left-[8%]" },
  { Icon: FaGraduationCap, delay: 1.5, position: "bottom-1/4 right-[10%]" },
];

const Hero = () => {
  const scrollToCountdown = () => {
    const element = document.querySelector("#countdown");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/poster.jpeg"
          alt="Reunion Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2512]/80 via-[#5D3A1A]/70 to-[#3D2512]/90" />
        {/* Vintage paper texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1, y: [0, -15, 0] }}
          transition={{
            opacity: { delay: delay + 1, duration: 1 },
            scale: { delay: delay + 1, duration: 0.5 },
            y: { delay: delay + 1.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`absolute ${position} hidden lg:block`}
        >
          <Icon className="text-[#DAA520] text-4xl" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2 bg-[#B8860B]/20 border border-[#B8860B] rounded-full text-[#DAA520] font-body text-sm tracking-wider">
            25 Years of Excellence
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FDF5E6] mb-6 leading-tight"
        >
          JNVTA
          <span className="block text-[#DAA520] mt-2">Silver Jubilee</span>
          <span className="block text-3xl sm:text-4xl md:text-5xl mt-4 font-normal text-[#F4E8D1]">
            Reunion 2026
          </span>
        </motion.h1>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-32 h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-6"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-body text-lg sm:text-xl md:text-2xl text-[#F4E8D1]/90 mb-10 max-w-2xl mx-auto italic"
        >
          "25 Years of Memories, One Grand Reunion"
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="btn-vintage text-lg px-10 py-4"
            >
              Register Now
            </motion.button>
          </Link>
          <motion.button
            onClick={scrollToCountdown}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-[#DAA520] text-[#DAA520] rounded font-heading hover:bg-[#DAA520]/10 transition-all"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Event Date Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex items-center justify-center gap-6 text-[#F4E8D1]/70"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#B8860B]" />
            <span className="font-body text-sm">January 25, 2026</span>
          </div>
          <div className="w-px h-4 bg-[#B8860B]/50" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#B8860B]" />
            <span className="font-body text-sm">Silver Jubilee Special</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 1 },
          y: { delay: 2, duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
        onClick={scrollToCountdown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2 text-[#DAA520]">
          <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
          <HiChevronDown className="text-2xl" />
        </div>
      </motion.div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[#B8860B]/30 m-4" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[#B8860B]/30 m-4" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-[#B8860B]/30 m-4" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#B8860B]/30 m-4" />
    </section>
  );
};

export default Hero;
