import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUsers,
  FaNewspaper,
  FaHandshake,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiSparkles, HiChevronRight } from "react-icons/hi";
import PageLayout from "../components/shared/PageLayout";

// Mission statement data
const missionPoints = [
  {
    icon: FaUsers,
    title: "Connect Alumni",
    description: "Building bridges between generations of Navodayans",
  },
  {
    icon: FaHandshake,
    title: "Support Community",
    description: "Giving back to the institution that shaped us",
  },
  {
    icon: HiSparkles,
    title: "Celebrate Excellence",
    description: "Recognizing achievements of our alumni network",
  },
];

// Sample news data
const latestNews = [
  {
    id: 1,
    title: "Silver Jubilee 2026 Registrations Now Open!",
    excerpt: "Join us for the grand 25-year celebration of JNV Trivandrum alumni.",
    date: "January 5, 2026",
    category: "Event",
  },
  {
    id: 2,
    title: "JNVTAA Committee Meeting Held",
    excerpt: "Key decisions made for the upcoming Silver Jubilee celebrations.",
    date: "December 20, 2025",
    category: "Association",
  },
  {
    id: 3,
    title: "Call for Volunteers",
    excerpt: "Be part of organizing team for Silver Jubilee 2026.",
    date: "December 15, 2025",
    category: "Announcement",
  },
];

// Calculate countdown
const getCountdown = () => {
  const eventDate = new Date("2026-01-25T09:00:00");
  const now = new Date();
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const AssociationHome = () => {
  const daysLeft = getCountdown();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF4E6] via-[#FFF8E7] to-[#FDF4E6]" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#1A237E]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#1A237E]/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#1A237E] animate-pulse" />
              <span className="text-[#1A237E] text-sm font-semibold tracking-wide">
                JNV Trivandrum Alumni Association
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#1A237E] leading-tight"
            >
              Nurturing Bonds,
              <br />
              <span className="text-gradient-gold">Building Futures</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body text-lg sm:text-xl text-[#4B5563] max-w-2xl mx-auto mb-12"
            >
              Connecting Navodayans across generations. Celebrating our shared heritage and 
              building a vibrant community of achievers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/about" className="btn-outline flex items-center justify-center gap-2">
                Learn About Us
                <FaArrowRight className="text-sm" />
              </Link>
              <Link to="/events" className="btn-outline flex items-center justify-center gap-2">
                View Events
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Event - Silver Jubilee */}
      <section className="py-16 bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <HiSparkles className="text-[#D4AF37]" />
                <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                  Featured Event
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Silver Jubilee 2026
              </h2>
              
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                25 years of memories, friendships, and excellence. Join us for the grand reunion 
                celebrating a quarter century of Navodayan spirit.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <FaCalendarAlt className="text-[#D4AF37]" />
                  <span>January 25, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <FaMapMarkerAlt className="text-[#D4AF37]" />
                  <span>JNV Campus, Trivandrum</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="px-8 py-3 rounded-full bg-[#D4AF37] text-[#1A237E] font-semibold hover:bg-[#E5C048] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Register Now
                  <FaArrowRight className="text-sm" />
                </Link>
                <Link 
                  to="/events/silver-jubilee" 
                  className="px-8 py-3 rounded-full bg-white/10 text-white border border-white/30 font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  View Details
                </Link>
              </div>
            </motion.div>

            {/* Countdown Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center max-w-sm w-full">
                <div className="w-24 h-24 rounded-full bg-[#D4AF37] mx-auto mb-6 flex items-center justify-center">
                  <span className="font-heading text-4xl font-bold text-[#1A237E]">25</span>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Years of Excellence</h3>
                <p className="text-white/60 text-sm mb-6">Time flies, memories stay forever</p>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <span className="text-white/60 text-xs uppercase tracking-wider block mb-1">Event Countdown</span>
                  <span className="font-heading text-3xl font-bold text-[#D4AF37]">
                    {daysLeft} Days
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A237E] mb-4">
              Our Mission
            </h2>
            <p className="text-[#4B5563] max-w-2xl mx-auto">
              JNVTAA is dedicated to connecting alumni, fostering community, and celebrating 
              the Navodayan spirit that unites us all.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {missionPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-8 rounded-2xl text-center hover:border-[#1A237E]/30 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#1A237E]/10 mx-auto mb-6 flex items-center justify-center group-hover:bg-[#1A237E] transition-colors">
                  <point.icon className="text-2xl text-[#1A237E] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#1A237E] mb-3">
                  {point.title}
                </h3>
                <p className="text-[#4B5563]">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/about" className="btn-outline inline-flex items-center gap-2">
              Learn More About Us
              <HiChevronRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
          >
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A237E] mb-2">
                Latest News
              </h2>
              <p className="text-[#4B5563]">Stay updated with JNVTAA happenings</p>
            </div>
            <Link to="/news" className="btn-outline inline-flex items-center gap-2">
              View All News
              <HiChevronRight />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <motion.article
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FDF4E6] rounded-2xl p-6 hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#1A237E]/10 text-[#1A237E] text-xs font-semibold">
                    {news.category}
                  </span>
                  <span className="text-[#9CA3AF] text-xs">{news.date}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A237E] mb-2 group-hover:text-[#3949AB] transition-colors">
                  {news.title}
                </h3>
                <p className="text-[#4B5563] text-sm">{news.excerpt}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A237E] mb-4">
              Explore JNVTAA
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaUsers, title: "About Us", description: "Learn about our association", path: "/about" },
              { icon: FaCalendarAlt, title: "Events", description: "Upcoming gatherings", path: "/events" },
              { icon: FaNewspaper, title: "News", description: "Latest updates", path: "/news" },
              { icon: FaHandshake, title: "Contact", description: "Get in touch", path: "/contact" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={item.path}
                  className="block glass-panel p-6 rounded-2xl text-center hover:border-[#1A237E]/30 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#1A237E]/10 mx-auto mb-4 flex items-center justify-center group-hover:bg-[#1A237E] transition-colors">
                    <item.icon className="text-xl text-[#1A237E] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-[#1A237E] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[#4B5563] text-sm">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AssociationHome;
