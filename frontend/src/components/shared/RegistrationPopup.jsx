import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiX, HiCalendar, HiLocationMarker } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";

const RegistrationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup was dismissed recently
    const lastDismissed = localStorage.getItem("jnvtaa_popup_dismissed");
    const now = Date.now();
    
    // Show popup if never dismissed or dismissed more than 24 hours ago
    if (!lastDismissed || now - parseInt(lastDismissed) > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000); // Show after 4 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("jnvtaa_popup_dismissed", Date.now().toString());
  };

  // Calculate countdown
  const eventDate = new Date("2026-01-25T09:00:00");
  const now = new Date();
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full z-[101]"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/20">
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB] p-6 pb-16">
                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <HiX size={24} />
                </button>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                  <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">
                    Featured Event
                  </span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                  Silver Jubilee 2026
                </h2>
                <p className="text-white/80 text-sm">
                  25 Years of Excellence • JNV Trivandrum Alumni Reunion
                </p>
              </div>

              {/* Content */}
              <div className="p-6 -mt-10">
                {/* Countdown card */}
                <div className="bg-[#FDF4E6] rounded-xl p-4 mb-6 border border-[#D4AF37]/20 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#4B5563] uppercase tracking-wider">Countdown</span>
                      <p className="text-2xl font-bold text-[#1A237E]">
                        {diffDays > 0 ? `${diffDays} Days` : "Event Started!"}
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-[#1A237E] flex items-center justify-center text-white">
                      <span className="text-xl font-bold">25</span>
                    </div>
                  </div>
                </div>

                {/* Event details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-[#4B5563]">
                    <HiCalendar className="text-[#1A237E] text-lg" />
                    <span className="text-sm">January 25, 2026</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4B5563]">
                    <HiLocationMarker className="text-[#1A237E] text-lg" />
                    <span className="text-sm">JNV Campus, Trivandrum</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4B5563]">
                    <FaUsers className="text-[#1A237E] text-lg" />
                    <span className="text-sm">All Alumni Welcome</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/register" onClick={handleDismiss} className="flex-1">
                    <button className="w-full btn-primary flex items-center justify-center gap-2">
                      Register Now
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                  <Link to="/events/silver-jubilee" onClick={handleDismiss} className="flex-1">
                    <button className="w-full btn-outline">
                      Learn More
                    </button>
                  </Link>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-[#9CA3AF] mt-4">
                  Limited seats available. Register early!
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegistrationPopup;
