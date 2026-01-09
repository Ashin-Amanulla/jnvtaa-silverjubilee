import React from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUtensils,
  FaMusic,
  FaUsers,
  FaMicrophone,
  FaCamera,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const eventInfo = [
  {
    icon: FaCalendarAlt,
    title: "Date",
    details: "January 25, 2026",
    subtext: "Silver Jubilee Celebration",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Venue",
    details: "JNV Campus",
    subtext: "Thrissur, Kerala",
  },
  {
    icon: FaClock,
    title: "Timing",
    details: "9:00 AM Onwards",
    subtext: "Full Day Event",
  },
];

const schedule = [
  { time: "9:00 AM", event: "Registration & Welcome", icon: FaUsers },
  { time: "10:30 AM", event: "Inauguration Ceremony", icon: HiSparkles },
  { time: "12:00 PM", event: "Cultural Performances", icon: FaMusic },
  { time: "1:30 PM", event: "Reunion Lunch", icon: FaUtensils },
  { time: "3:00 PM", event: "Batch-wise Gatherings", icon: FaCamera },
  { time: "5:00 PM", event: "Entertainment & Games", icon: FaMicrophone },
  { time: "7:00 PM", event: "Grand Dinner & Fellowship", icon: FaUtensils },
];

const EventDetails = () => {
  return (
    <section
      id="event-details"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #3D2512 0%, #5D3A1A 50%, #3D2512 100%)",
      }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B8860B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#FDF5E6] mb-4">
            Event Details
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-4" />
          <p className="font-body text-[#F4E8D1]/80 text-lg max-w-2xl mx-auto">
            Everything you need to know about our Silver Jubilee celebration
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {eventInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="vintage-card p-8 rounded-xl text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B4513] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <info.icon className="text-2xl text-[#FDF5E6]" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#5D3A1A] mb-2">
                {info.title}
              </h3>
              <p className="font-body text-lg text-[#704214] font-medium">
                {info.details}
              </p>
              <p className="font-body text-sm text-[#8B4513]/70 mt-1">
                {info.subtext}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Schedule Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="vintage-card p-8 sm:p-12 rounded-2xl"
        >
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#5D3A1A] text-center mb-10">
            Event Schedule
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#B8860B] via-[#DAA520] to-[#B8860B] transform sm:-translate-x-1/2" />

            {/* Timeline items */}
            <div className="space-y-8">
              {schedule.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`ml-16 sm:ml-0 sm:w-1/2 ${
                      index % 2 === 0
                        ? "sm:pr-12 sm:text-right"
                        : "sm:pl-12 sm:text-left"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-3 p-4 bg-[#F4E8D1] rounded-lg border border-[#B8860B]/30 hover:shadow-lg transition-shadow ${
                        index % 2 === 0 ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/20 flex items-center justify-center">
                        <item.icon className="text-[#8B4513]" />
                      </div>
                      <div className={index % 2 === 0 ? "sm:text-right" : ""}>
                        <p className="font-heading font-semibold text-[#800020]">
                          {item.time}
                        </p>
                        <p className="font-body text-[#5D3A1A]">{item.event}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-6 sm:left-1/2 w-4 h-4 rounded-full bg-[#B8860B] border-4 border-[#FDF5E6] transform -translate-x-1/2 shadow-md z-10" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-10 font-body text-sm text-[#8B4513]/70 italic"
          >
            * Schedule is tentative and subject to minor changes
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
