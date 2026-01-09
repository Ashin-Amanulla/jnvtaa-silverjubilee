import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaClock, FaMusic, FaUtensils, FaCamera } from "react-icons/fa";

const schedule = [
  { time: "09:00 AM", event: "Registration & Welcome Drink" },
  { time: "10:00 AM", event: "Inaugural Ceremony & Lamp Lighting" },
  { time: "11:30 AM", event: "Batch Introductions & Nostalgia Sharing" },
  { time: "01:00 PM", event: "Grand Silver Jubilee Lunch" },
  { time: "02:30 PM", event: "Cultural Programs & Games" },
  { time: "04:30 PM", event: "Tea & Snacks" },
  { time: "05:00 PM", event: "Photo Session" },
  { time: "06:00 PM", event: "DJ / Campfire" },
];

const EventDetails = () => {
  return (
    <section
      id="event-details"
      className="relative py-24 sm:py-32 overflow-hidden bg-[#FDF4E6]"
    >
      {/* Background Elements - Cream Theme */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1A237E]/20 to-transparent" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#1A237E]/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Event Info Cards */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#1A237E] mb-6">
                Event Details
              </h2>
              <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-6" />
              <p className="font-body text-lg text-[#1F2937] leading-relaxed">
                A day filled with laughter, memories, and celebration awaits you.
                Join us at the campus where it all began.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: FaMapMarkedAlt,
                  title: "The Venue",
                  desc: "Jawahar Navodaya Vidyalaya, Trivandrum Campus. The place we called home.",
                  color: "text-[#1A237E]",
                  bg: "bg-[#1A237E]/5",
                },
                {
                  icon: FaUtensils,
                  title: "Grand Feast",
                  desc: "A sumptuous lunch featuring nostalgic JNV biriyani with icecreeeeam!",
                  color: "text-[#F4C430]", // Muted Gold
                  bg: "bg-[#D4AF37]/10",
                },
                {
                  icon: FaMusic,
                  title: "Entertainment",
                  desc: "Live music, cultural performances by alumni, and a football match to cheer you up!",
                  color: "text-[#3949AB]",
                  bg: "bg-[#3949AB]/5",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-panel p-6 rounded-2xl flex items-start gap-5 hover:border-[#1A237E]/30 transition-all duration-300"
                >
                  <div className={`p-4 rounded-xl ${item.bg} ${item.color} shadow-sm`}>
                    <item.icon className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#1A237E] mb-2">{item.title}</h3>
                    <p className="font-body text-[#4B5563] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Schedule Timeline */}
          <div>
             <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 rounded-3xl bg-white/40 border border-[#1A237E]/10 shadow-xl backdrop-blur-sm"
            >
              <h3 className="font-heading text-2xl font-bold text-[#1A237E] mb-8 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#1A237E] text-white"><FaClock /></span>
                Event Schedule
              </h3>
              
              <div className="relative border-l-2 border-[#1A237E]/20 ml-3 space-y-8">
                {schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#FDF4E6] border-4 border-[#1A237E]/40 group-hover:border-[#D4AF37] transition-colors shadow-sm" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="font-heading font-semibold text-[#1A237E] text-lg min-w-[100px]">
                        {item.time}
                      </span>
                      <span className="font-body text-[#1F2937] font-medium group-hover:text-[#1A237E] transition-colors">
                        {item.event}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-10 pt-6 border-t border-[#1A237E]/10 text-center">
                 <p className="text-sm text-[#4B5563] italic">
                   * Schedule subject to minor changes. Final agenda will be emailed to registered attendees.
                 </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
