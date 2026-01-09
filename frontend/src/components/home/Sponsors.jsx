import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHandHoldingHeart, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// Placeholder sponsors - replace with actual sponsor data
const sponsors = {
  platinum: [
    { name: "Your Company Here", logo: null },
  ],
  gold: [
    { name: "Gold Sponsor 1", logo: null },
    { name: "Gold Sponsor 2", logo: null },
  ],
  silver: [
    { name: "Silver Sponsor 1", logo: null },
    { name: "Silver Sponsor 2", logo: null },
    { name: "Silver Sponsor 3", logo: null },
  ],
};

const SponsorCard = ({ name, logo, tier, index }) => {
  const sizes = {
    platinum: "w-full max-w-xs h-32",
    gold: "w-40 h-24",
    silver: "w-32 h-20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${sizes[tier]} bg-[#FDF5E6] rounded-lg border-2 ${
        tier === "platinum"
          ? "border-[#B8860B]"
          : tier === "gold"
          ? "border-[#DAA520]/60"
          : "border-[#8B4513]/30"
      } flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer group`}
    >
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="max-w-[80%] max-h-[80%] object-contain opacity-70 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <span className="font-body text-[#8B4513]/50 text-sm text-center px-4 group-hover:text-[#5D3A1A] transition-colors">
          {name}
        </span>
      )}
    </motion.div>
  );
};

const Sponsors = () => {
  return (
    <section
      id="sponsors"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #3D2512 0%, #5D3A1A 50%, #3D2512 100%)",
      }}
    >
      {/* Decorative stars */}
      <div className="absolute top-10 left-10 text-[#DAA520]/20">
        <FaStar className="text-4xl" />
      </div>
      <div className="absolute top-20 right-20 text-[#DAA520]/15">
        <HiSparkles className="text-5xl" />
      </div>
      <div className="absolute bottom-20 left-1/4 text-[#DAA520]/10">
        <FaStar className="text-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <FaHandHoldingHeart className="text-2xl text-[#DAA520]" />
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#FDF5E6]">
              Our Sponsors
            </h2>
            <FaHandHoldingHeart className="text-2xl text-[#DAA520]" />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-4" />
          <p className="font-body text-[#F4E8D1]/80 text-lg max-w-2xl mx-auto">
            Special thanks to our generous sponsors who make this reunion possible
          </p>
        </motion.div>

        {/* Platinum Sponsors */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#B8860B]/20 via-[#DAA520]/30 to-[#B8860B]/20 rounded-full border border-[#B8860B]">
              <FaStar className="text-[#DAA520]" />
              <span className="font-heading text-[#DAA520] font-semibold">Platinum Sponsors</span>
              <FaStar className="text-[#DAA520]" />
            </span>
          </div>
          <div className="flex justify-center flex-wrap gap-6">
            {sponsors.platinum.map((sponsor, index) => (
              <SponsorCard key={index} {...sponsor} tier="platinum" index={index} />
            ))}
          </div>
        </motion.div>

        {/* Gold Sponsors */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#DAA520]/10 rounded-full border border-[#DAA520]/50">
              <span className="font-heading text-[#DAA520]/80 font-medium">Gold Sponsors</span>
            </span>
          </div>
          <div className="flex justify-center flex-wrap gap-4">
            {sponsors.gold.map((sponsor, index) => (
              <SponsorCard key={index} {...sponsor} tier="gold" index={index} />
            ))}
          </div>
        </motion.div>

        {/* Silver Sponsors */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B4513]/10 rounded-full border border-[#8B4513]/30">
              <span className="font-heading text-[#F4E8D1]/70 font-medium">Silver Sponsors</span>
            </span>
          </div>
          <div className="flex justify-center flex-wrap gap-4">
            {sponsors.silver.map((sponsor, index) => (
              <SponsorCard key={index} {...sponsor} tier="silver" index={index} />
            ))}
          </div>
        </motion.div>

        {/* Become a Sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="vintage-card max-w-2xl mx-auto p-8 sm:p-10 rounded-xl">
            <FaHandHoldingHeart className="text-4xl text-[#B8860B] mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-[#5D3A1A] mb-3">
              Become a Sponsor
            </h3>
            <p className="font-body text-[#8B4513] mb-6">
              Support our Silver Jubilee celebration and be part of this memorable event. 
              Your contribution helps create an unforgettable reunion experience.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-vintage"
              >
                Register as Sponsor
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors;
