import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaBuilding, FaUserFriends, FaHistory } from "react-icons/fa";

const milestones = [
  {
    year: "2001",
    title: "The Inception",
    description: "JNV Trivandrum was founded, planting the seeds of excellence. The first batch of students walked in, marking the beginning of a legacy.",
    icon: FaBuilding,
    image: "/images/journey/2001.jpg", // Placeholder
  },
  {
    year: "2008",
    title: "First Batch Graduates",
    description: "The pioneers stepped out into the world, carrying the values and dreams nurtured within these campus walls.",
    icon: FaGraduationCap,
    image: "/images/journey/2008.jpg", // Placeholder
  },
  {
    year: "2015",
    title: "Alumni Association Formed",
    description: "To keep the bond alive, the alumni network was officially established, bridging the gap between past and present.",
    icon: FaUserFriends,
    image: "/images/journey/2016.jpg", // Placeholder
  },
  {
    year: "2026",
    title: "Silver Jubilee",
    description: "Celebrating 25 glorious years of JNV Trivandrum. A historic milestone honoring our school, teachers, and the vibrant alumni community.",
    icon: FaHistory,
    image: "/images/journey/2026.jpg", // Placeholder
  },
];

const TheJourney = () => {
  return (
    <section id="journey" className="relative py-28 sm:py-36 overflow-hidden bg-gradient-to-b from-[#FDF4E6] via-[#FFF8E7] to-[#FDF4E6]">
       {/* Enhanced Background Elements */}
       <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1A237E]/30 to-transparent transform -translate-y-1/2 hidden md:block" />
       <motion.div 
         className="absolute top-20 right-10 w-80 h-80 bg-[#D4AF37]/8 rounded-full blur-[100px]"
         animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
       />
       <motion.div 
         className="absolute bottom-20 left-10 w-96 h-96 bg-[#1A237E]/8 rounded-full blur-[100px]"
         animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
       />
       
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
            <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 rounded-full bg-white/50 border border-[#1A237E]/15 backdrop-blur-md shadow-md">
                <motion.span 
                  className="w-2.5 h-2.5 rounded-full bg-[#1A237E]"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-[#1A237E] text-sm font-semibold uppercase tracking-widest">Our Story</span>
            </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A237E] mb-8">
            The Journey So Far
          </h2>
          <div className="section-divider-modern" />
          <p className="font-body text-[#4B5563] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            From the first day at school to this grand Silver Jubilee, let's trace the path of our shared history.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
            {/* Vertical Line for Mobile */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1A237E]/30 via-[#D4AF37]/30 to-[#1A237E]/30 md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pl-20 md:pl-0 md:text-center group cursor-pointer"
              >
                {/* Timeline Dot (Mobile: Left, Desktop: Center) */}
                 {/* <div className="absolute left-6 md:left-1/2 top-0 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-[#FDF4E6] border-4 border-[#1A237E] z-20 group-hover:scale-125 transition-transform duration-300 shadow-md" /> */}

                {/* Content Card */}
                <motion.div 
                  className={`bg-white/70 backdrop-blur-md p-8 rounded-2xl border-2 border-[#1A237E]/15 shadow-xl group-hover:shadow-2xl group-hover:border-[#D4AF37]/50 transition-all duration-500 group-hover:-translate-y-3 relative overflow-hidden ${
                    index % 2 === 0 ? "md:mb-16" : "md:mt-16"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                    {/* Animated gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#1A237E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="text-5xl font-heading font-bold text-[#F3F4F6] absolute top-4 right-4 group-hover:text-[#FDF4E6] transition-colors">
                        {milestone.year}
                    </div>
                  
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A237E] to-[#3949AB] flex items-center justify-center mb-5 shadow-xl mx-auto md:mx-0 md:inline-flex text-white relative z-10"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <milestone.icon className="text-2xl" />
                  </motion.div>
                  
                  <h3 className="font-heading text-2xl font-bold text-[#1A237E] mb-3 group-hover:text-[#3949AB] transition-colors relative z-10">
                    {milestone.title}
                  </h3>
                  <p className="font-body text-base text-[#4B5563] leading-relaxed mb-5 relative z-10">
                    {milestone.description}
                  </p>
                  
                  {/* Decorative Year Tag */}
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#1A237E]/10 to-[#3949AB]/10 rounded-full text-sm text-[#1A237E] font-semibold relative z-10 group-hover:from-[#D4AF37]/20 group-hover:to-[#F4C430]/20 transition-all">
                    {milestone.year}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheJourney;
