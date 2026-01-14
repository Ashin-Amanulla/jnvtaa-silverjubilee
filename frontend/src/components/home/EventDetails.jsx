import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaClock, FaMusic, FaUtensils, FaCamera } from "react-icons/fa";

const schedule = [
  { time: "09:00 AM", event: "Alumni Arrival & Registration" },
  { time: "09:30 AM", event: "Prayer" },
  { time: "09:45 AM", event: "Welcome Address" },
  { time: "10:00 AM", event: "Inauguration of Silver Jubilee Celebrations & Address by Chief Guest" },
  { time: "10:30 AM", event: "Cultural Program (Students/Alumni)" },
  { time: "11:00 AM", event: "Career Guidance Interaction" },
  { time: "12:00 PM", event: "Selection of new Members" },
  { time: "12:30 PM", event: "Announcement of programs for the year 2026" },
  { time: "01:00 PM", event: "Lunch" },
  { time: "02:00 PM", event: "Games-Alumni vs. School Team (Cricket/Football Match)" },
  { time: "03:30 PM", event: "Closing Remarks & Memento Distribution" },
  { time: "04:00 PM", event: "National Anthem & Dispersal" },
];

const EventDetails = () => {
  return (
    <section
      id="event-details"
      className="relative py-28 sm:py-36 overflow-hidden bg-gradient-to-b from-[#FDF4E6] via-[#FFF8E7] to-[#FDF4E6]"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1A237E]/30 to-transparent" />
        <motion.div 
          className="absolute top-20 left-10 w-80 h-80 bg-[#1A237E]/8 rounded-full blur-[100px]"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[100px]"
          animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
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
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A237E] mb-6">
                Event Details
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full mb-8" />
              <p className="font-body text-lg sm:text-xl text-[#1F2937] leading-relaxed">
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-panel-enhanced p-8 rounded-3xl flex items-start gap-6 hover:border-[#1A237E]/30 transition-all duration-300 cursor-pointer group"
                >
                  <motion.div 
                    className={`p-5 rounded-2xl ${item.bg} ${item.color} shadow-md`}
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="text-3xl" />
                  </motion.div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#1A237E] mb-3 group-hover:text-[#3949AB] transition-colors">{item.title}</h3>
                    <p className="font-body text-[#4B5563] leading-relaxed">{item.desc}</p>
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
              className="relative p-10 rounded-3xl bg-white/50 border-2 border-[#1A237E]/15 shadow-2xl backdrop-blur-md hover:shadow-[0_20px_60px_rgba(26,35,126,0.15)] transition-all duration-500"
            >
              <h3 className="font-heading text-2xl font-bold text-[#1A237E] mb-8 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#1A237E] text-white"><FaClock /></span>
                Event Schedule
              </h3>
              
              <div className="relative border-l-2 border-[#1A237E]/25 ml-3 space-y-10">
                {schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-10 group"
                  >
                    {/* Enhanced Timeline Dot */}
                    <motion.div 
                      className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#FDF4E6] border-4 border-[#1A237E]/40 group-hover:border-[#D4AF37] transition-all shadow-md"
                      whileHover={{ scale: 1.3 }}
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5">
                      <span className="font-heading font-bold text-[#1A237E] text-lg sm:text-xl min-w-[110px] group-hover:text-[#3949AB] transition-colors">
                        {item.time}
                      </span>
                      <span className="font-body text-[#1F2937] font-medium text-base group-hover:text-[#1A237E] transition-colors">
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
