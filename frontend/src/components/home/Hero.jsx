import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { fetchAllImages, fetchRandomImage } from "../../api/galleryApi";

const Hero = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch and shuffle images on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetchRandomImage();
        if (response.success && response.data) {
          setHeroImages([response.data]);
        } else {
             // Fallback to fetching all if random endpoint fails for some reason
             const allResponse = await fetchAllImages();
             const allImages = allResponse.data.allImages || [];
             if (allImages.length > 0) {
                const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
                setHeroImages([randomImage]);
             }
        }
      } catch (error) {
        console.error("Failed to load hero images:", error);
      }
    };
    loadImages();
  }, []);



  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {heroImages.length > 0 ? (
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
             <img 
               src={heroImages[currentImageIndex]?.url} 
               alt="Hero Background"
               className="w-full h-full object-cover object-center"
               decoding="async"
               priority="true" // Hint for React (if using Next.js) or just semantic
             />
            </motion.div>
          ) : (
            // Fallback gradient if no images loaded yet
            <div className="absolute inset-0 bg-gradient-to-br from-[#FDF4E6] via-[#FFF8E7] to-[#F5E6D3]" />
          )}
        </AnimatePresence>
        
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90" />
        
        {/* Decorative Animated Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-[#1A237E]/5"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Enhanced Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-[#1A237E]/8 rounded-full blur-[120px]"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-72 h-72 bg-amber-100/50 rounded-full blur-[100px]"
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Enhanced Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 border border-[#1A237E]/15 backdrop-blur-md mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <motion.span 
            className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-[#1A237E] text-sm font-semibold tracking-wide uppercase">
            JNV Trivandrum • Silver Jubilee
          </span>
        </motion.div>

        {/* Enhanced Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-[#1A237E] drop-shadow-sm leading-tight"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block"
          >
            25 Years of
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gradient-gold relative inline-block mt-2"
          >
            Excellence
            {/* Enhanced Underline decoration */}
            <motion.svg 
              className="absolute w-full h-4 -bottom-2 left-0 text-[#D4AF37] opacity-70" 
              viewBox="0 0 100 10" 
              preserveAspectRatio="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </motion.svg>
          </motion.span>
        </motion.h1>

        {/* Enhanced Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-lg sm:text-xl md:text-2xl text-[#1F2937] max-w-3xl mb-12 leading-relaxed px-4"
        >
          Join us as we celebrate the bonds that time cannot break. A reunion of hearts, memories, and shared history.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto mb-4"
        >
          <Link to="/register" className="group">
            <motion.button
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Register Now</span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
          <a href="#journey">
            <motion.button
              className="btn-outline w-full sm:w-auto min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View The Journey
            </motion.button>
          </a>
        </motion.div>

        {/* Enhanced Info Grid with 3D Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl"
        >
          {[
            { icon: FaCalendarAlt, label: "Date", value: "January 25, 2026", delay: 0 },
            { icon: FaMapMarkerAlt, label: "Venue", value: "JNV Campus, Trivandrum", delay: 0.1 },
            { icon: FaUsers, label: "Batches", value: "All Alumni Welcome", delay: 0.2 },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + item.delay }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-panel-enhanced p-8 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:border-[#1A237E]/30 transition-all duration-300 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className="text-4xl text-[#1A237E] transition-transform duration-300" />
              </motion.div>
              <div className="text-center">
                <span className="block text-sm text-[#4B5563] uppercase tracking-widest mb-2 font-medium">{item.label}</span>
                <span className="block text-lg font-semibold text-[#1A237E]">{item.value}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4B5563]"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-6 h-10 border-2 border-[#9CA3AF] rounded-full p-1.5 hover:border-[#1A237E] transition-colors duration-300">
          <motion.div 
            className="w-1.5 h-1.5 bg-[#4B5563] rounded-full mx-auto"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
