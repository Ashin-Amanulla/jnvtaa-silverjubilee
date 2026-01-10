import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import PageLayout from "../components/shared/PageLayout";

// Featured event
const featuredEvent = {
  id: "silver-jubilee-2026",
  title: "Silver Jubilee 2026",
  description: "25 Years of Excellence - Grand Alumni Reunion celebrating a quarter century of Navodayan spirit. Join us for a memorable day of reconnecting, reminiscing, and rejoicing.",
  date: "January 25, 2026",
  time: "9:00 AM onwards",
  venue: "JNV Campus, Trivandrum",
  image: "/images/logo.jpeg",
  featured: true,
  registrationOpen: true,
};

// Upcoming events (placeholder for future)
const upcomingEvents = [
  {
    id: "silver-jubilee-2026",
    title: "Silver Jubilee 2026",
    date: "January 25, 2026",
    venue: "JNV Campus, Trivandrum",
    type: "Reunion",
    featured: true,
  },
];

// Past events (placeholder)
const pastEvents = [
  {
    id: "alumni-meet-2024",
    title: "Annual Alumni Meet 2024",
    date: "December 2024",
    venue: "Virtual Event",
    type: "Virtual Meet",
  },
  {
    id: "founders-day-2023",
    title: "Founders Day Celebration",
    date: "November 2023",
    venue: "JNV Campus",
    type: "Celebration",
  },
  {
    id: "career-guidance-2023",
    title: "Career Guidance Workshop",
    date: "August 2023",
    venue: "Online",
    type: "Workshop",
  },
];

// Calculate days until event
const getDaysUntil = (dateStr) => {
  const eventDate = new Date(dateStr);
  const now = new Date();
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const EventsPage = () => {
  return (
    <PageLayout showPopup={false}>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB]" />
        
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 border-2 border-white rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 border-2 border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <FaCalendarAlt className="text-[#D4AF37]" />
              <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Events & Gatherings
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              JNVTAA Events
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Reunions, workshops, and celebrations that bring our community together. 
              Join us in creating lasting memories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Event - Silver Jubilee */}
      <section className="py-16 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <HiSparkles className="text-[#D4AF37] text-xl" />
              <span className="text-[#1A237E] font-semibold uppercase tracking-wider text-sm">
                Featured Event
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#D4AF37]/20"
          >
            <div className="grid lg:grid-cols-2">
              {/* Image/Visual side */}
              <div className="relative bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB] p-8 lg:p-12 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-[#D4AF37] mx-auto mb-6 flex items-center justify-center">
                    <span className="font-heading text-5xl font-bold text-[#1A237E]">25</span>
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">Years of Excellence</h3>
                  <p className="text-white/70">2001 - 2026</p>
                  
                  {/* Countdown */}
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
                    <span className="text-white/60 text-xs uppercase tracking-wider block">Countdown</span>
                    <span className="text-[#D4AF37] text-2xl font-bold">
                      {getDaysUntil("2026-01-25")} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 lg:p-12">
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
                  ✓ Registration Open
                </span>
                
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A237E] mb-4">
                  {featuredEvent.title}
                </h2>
                
                <p className="text-[#4B5563] mb-6 leading-relaxed">
                  {featuredEvent.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-[#4B5563]">
                    <FaCalendarAlt className="text-[#1A237E]" />
                    <span>{featuredEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4B5563]">
                    <FaClock className="text-[#1A237E]" />
                    <span>{featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4B5563]">
                    <FaMapMarkerAlt className="text-[#1A237E]" />
                    <span>{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4B5563]">
                    <FaUsers className="text-[#1A237E]" />
                    <span>All Alumni Welcome</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
                    Register Now
                    <FaArrowRight className="text-sm" />
                  </Link>
                  <Link to="/events/silver-jubilee" className="btn-outline flex items-center justify-center">
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-[#1A237E] mb-2">
              Upcoming Events
            </h2>
            <p className="text-[#4B5563]">Mark your calendars for these upcoming gatherings</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass-panel rounded-2xl p-6 hover:shadow-lg transition-shadow ${
                  event.featured ? "border-[#D4AF37]/30 ring-2 ring-[#D4AF37]/20" : ""
                }`}
              >
                {event.featured && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold mb-4">
                    Featured
                  </span>
                )}
                <span className="inline-block px-3 py-1 rounded-full bg-[#1A237E]/10 text-[#1A237E] text-xs font-semibold mb-4 ml-2">
                  {event.type}
                </span>
                
                <h3 className="font-heading text-xl font-semibold text-[#1A237E] mb-3">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-[#4B5563] mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#1A237E]/60" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#1A237E]/60" />
                    {event.venue}
                  </div>
                </div>

                <Link 
                  to={`/events/${event.id}`}
                  className="text-[#1A237E] font-semibold text-sm hover:text-[#3949AB] transition-colors inline-flex items-center gap-1"
                >
                  Learn More <FaArrowRight className="text-xs" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-[#1A237E] mb-2">
              Past Events
            </h2>
            <p className="text-[#4B5563]">Looking back at our memorable gatherings</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 rounded-2xl p-6 border border-gray-200"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold mb-4">
                  {event.type}
                </span>
                
                <h3 className="font-heading text-lg font-semibold text-[#1A237E]/80 mb-3">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    {event.venue}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-12 rounded-3xl"
          >
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A237E] mb-4">
              Don't Miss the Silver Jubilee!
            </h2>
            <p className="text-[#4B5563] mb-8 max-w-xl mx-auto">
              Register now and be part of the historic 25-year celebration. 
              Limited seats available!
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Register for Silver Jubilee
              <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EventsPage;
