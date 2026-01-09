import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaBuilding, FaUserFriends, FaHistory } from "react-icons/fa";

const milestones = [
  {
    year: "2001",
    title: "The Inception",
    description: "JNV Thrissur was founded, planting the seeds of excellence. The first batch of students walked in, marking the beginning of a legacy.",
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
    description: "Celebrating 25 glorious years of JNV Thrissur. A historic milestone honoring our school, teachers, and the vibrant alumni community.",
    icon: FaHistory,
    image: "/images/journey/2026.jpg", // Placeholder
  },
];

const TheJourney = () => {
  return (
    <section id="journey" className="relative py-24 sm:py-32 overflow-hidden bg-[#FDF4E6]">
       {/* Background Elements */}
       <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1A237E]/20 to-transparent transform -translate-y-1/2 hidden md:block" />
       
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white border border-[#1A237E]/10">
                <span className="w-2 h-2 rounded-full bg-[#1A237E] animate-pulse" />
                <span className="text-[#1A237E] text-xs font-medium uppercase tracking-widest">Our Story</span>
            </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A237E] mb-6">
            The Journey So Far
          </h2>
          <div className="section-divider-modern" />
          <p className="font-body text-[#4B5563] text-lg max-w-2xl mx-auto">
            From the first day at school to this grand Silver Jubilee, let's trace the path of our shared history.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
            {/* Vertical Line for Mobile */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#1A237E]/20 md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pl-20 md:pl-0 md:text-center group"
              >
                {/* Timeline Dot (Mobile: Left, Desktop: Center) */}
                 {/* <div className="absolute left-6 md:left-1/2 top-0 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-[#FDF4E6] border-4 border-[#1A237E] z-20 group-hover:scale-125 transition-transform duration-300 shadow-md" /> */}

                {/* Content Card */}
                <div className={`bg-white p-6 rounded-xl border border-[#1A237E]/10 shadow-lg group-hover:shadow-xl group-hover:border-[#D4AF37]/50 transition-all duration-500 group-hover:-translate-y-2 ${
                    index % 2 === 0 ? "md:mb-16" : "md:mt-16"
                }`}>
                    <div className="text-4xl font-heading font-bold text-[#F3F4F6] absolute top-4 right-4 group-hover:text-[#FDF4E6] transition-colors">
                        {milestone.year}
                    </div>
                  
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A237E] to-[#3949AB] flex items-center justify-center mb-4 shadow-lg mx-auto md:mx-0 md:inline-flex text-white">
                    <milestone.icon className="text-xl" />
                  </div>
                  
                  <h3 className="font-heading text-xl font-bold text-[#1A237E] mb-2 group-hover:text-[#3949AB] transition-colors">
                    {milestone.title}
                  </h3>
                  <p className="font-body text-sm text-[#4B5563] leading-relaxed mb-4">
                    {milestone.description}
                  </p>
                  
                  {/* Decorative Year Tag */}
                  <span className="inline-block px-3 py-1 bg-[#1A237E]/5 rounded-full text-xs text-[#1A237E] font-medium">
                    {milestone.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheJourney;
