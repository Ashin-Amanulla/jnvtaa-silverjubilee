import React from "react";
import { motion } from "framer-motion";
import { FaHandshake } from "react-icons/fa";

const sponsors = [
  { name: "Global Tech Solutions", tier: "Platinum", logo: "/images/sponsors/tech.png" }, // Placeholders
  { name: "Elite Constructions", tier: "Gold", logo: "/images/sponsors/construction.png" },
  { name: "City Hospital", tier: "Silver", logo: "/images/sponsors/hospital.png" },
  { name: "Green Valley Resort", tier: "Silver", logo: "/images/sponsors/resort.png" },
];

const Sponsors = () => {
  return (
    <section id="sponsors" className="relative py-24 bg-[#F5E6D3]">
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100">
               <FaHandshake className="text-amber-600 text-sm" />
               <span className="text-amber-800 text-xs font-medium uppercase tracking-widest">Our Partners</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A237E] mb-12">
            Proudly Sponsored By
            </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-md border border-[#1A237E]/10 flex flex-col items-center justify-center gap-4 group hover:border-amber-200 transition-all duration-300"
            >
              <div className="w-24 h-24 bg-[#FDF4E6] rounded-full flex items-center justify-center text-[#9CA3AF] font-bold text-xs">
                  LOGO
              </div>
              <div>
                  <h3 className="font-heading font-semibold text-[#1F2937]">{sponsor.name}</h3>
                  <span className="text-xs text-amber-600 font-medium uppercase tracking-wider">{sponsor.tier} Partner</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16"
        >
            <button className="btn-outline">Become a Sponsor</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors;
