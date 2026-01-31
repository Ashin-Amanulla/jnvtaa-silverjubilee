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
import PageLayout from "../components/shared/PageLayout";
import { KineticText, MarqueeText } from "../components/artistic";

// Featured event (Inaugural - completed)
const featuredEvent = {
  id: "silver-jubilee-2026",
  title: "Silver Jubilee Inaugural",
  description: "The grand kick-off of our 25th Year Celebration happened on January 25, 2026! This was the first of many events planned throughout this special year. Stay tuned for upcoming programs.",
  date: "January 25, 2026",
  time: "Completed Successfully",
  venue: "JNV Campus, Trivandrum",
  featured: true,
  completed: true,
};

// Upcoming events for 2026 celebration year
const upcomingEvents = [
  {
    id: "batch-meetups-q2",
    title: "Batch-wise Meetups",
    date: "Q2 2026",
    venue: "Various Locations",
    type: "Reunion",
    description: "Batch-wise reunions organized by year representatives",
  },
  {
    id: "cultural-fest",
    title: "Alumni Cultural Fest",
    date: "August 2026",
    venue: "TBA",
    type: "Celebration",
    description: "Showcase of talent from alumni across batches",
  },
  {
    id: "grand-finale",
    title: "25th Year Grand Finale",
    date: "December 2026",
    venue: "JNV Campus",
    type: "Celebration",
    description: "Year-end celebration concluding our Silver Jubilee year",
  },
];

// Past events
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
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[10%] right-[5%] w-80 h-80 rounded-full border border-[var(--color-accent-coral)]/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container-asymmetric relative z-10 py-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
              <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
                Events & Gatherings
              </span>
            </motion.div>

            <div className="space-y-2 mb-8">
              <KineticText
                as="h1"
                variant="words"
                delay={0.3}
                className="font-display text-display text-[var(--color-text-primary)] leading-[0.9]"
              >
                EVENTS
              </KineticText>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed"
            >
              Reunions, workshops, and celebrations that bring our community together. 
              Join us in creating lasting memories.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED EVENT — Silver Jubilee
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-secondary)] relative overflow-hidden">
        {/* Background number */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute -right-20 top-1/2 -translate-y-1/2 font-display text-[30vw] text-[var(--color-text-primary)]/[0.03] leading-none">
            25
          </span>
        </div>

        <div className="container-asymmetric relative z-10">
          {/* Section Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-12"
          >
            <span className="accent-dot animate-pulse-glow" />
            <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
              Featured Event
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="inline-block px-4 py-2 bg-[#22c55e]/20 text-[#22c55e] font-display text-sm tracking-wider">
                ✓ COMPLETED SUCCESSFULLY
              </span>

              <h2 className="font-display text-heading text-[var(--color-text-primary)]">
                SILVER JUBILEE<br />
                <span className="text-gradient-sunset">INAUGURAL 2026</span>
              </h2>

              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-lg">
                {featuredEvent.description}
              </p>

              {/* Event Details */}
              <div className="space-y-4">
                {[
                  { icon: FaCalendarAlt, label: featuredEvent.date },
                  { icon: FaClock, label: featuredEvent.time },
                  { icon: FaMapMarkerAlt, label: featuredEvent.venue },
                  { icon: FaUsers, label: "500+ Alumni Attended" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="w-10 h-10 flex items-center justify-center border border-[var(--color-text-primary)]/20">
                      <item.icon className="text-[var(--color-accent-coral)]" />
                    </span>
                    <span className="text-[var(--color-text-secondary)] text-base">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/gallery">
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>VIEW EVENT GALLERY</span>
                    <FaArrowRight />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right — Countdown Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="card-brutal p-12 max-w-sm w-full text-center">
                <div className="w-32 h-32 rounded-full bg-[var(--color-accent-coral)] mx-auto mb-8 flex items-center justify-center">
                  <span className="font-display text-6xl text-[var(--color-bg-primary)]">25</span>
                </div>
                <h3 className="font-display text-2xl text-[var(--color-text-primary)] mb-2">
                  YEARS OF EXCELLENCE
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm mb-8">
                  2001 – 2026
                </p>
                
                <div className="bg-[var(--color-accent-coral)] p-6">
                  <span className="block text-xs text-[var(--color-bg-primary)]/70 uppercase tracking-wider mb-2">
                    Silver Jubilee Year
                  </span>
                  <span className="font-display text-2xl text-[var(--color-bg-primary)]">
                    CELEBRATING ALL OF 2026
                  </span>
                  <span className="block text-[var(--color-bg-primary)]/80 text-sm mt-2">
                    Multiple events & programs
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          PAST EVENTS
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-primary)]">
        <div className="container-asymmetric">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-gold)]" />
              <span className="text-[var(--color-accent-gold)] font-display text-sm tracking-[0.3em] uppercase">
                Looking Back
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-heading text-[var(--color-text-primary)] mb-4"
            >
              PAST EVENTS
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[var(--color-text-muted)] text-lg"
            >
              Looking back at our memorable gatherings
            </motion.p>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-brutal p-8 hover:-translate-y-2"
              >
                <span className="inline-block px-3 py-1 border border-[var(--color-text-primary)]/20 text-[var(--color-text-muted)] text-xs font-display tracking-wider mb-6">
                  {event.type.toUpperCase()}
                </span>
                
                <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-4">
                  {event.title.toUpperCase()}
                </h3>
                
                <div className="space-y-3 text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-[var(--color-accent-coral)]" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-[var(--color-accent-coral)]" />
                    <span className="text-sm">{event.venue}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-6 bg-[var(--color-accent-coral)] overflow-hidden">
        <MarqueeText
          className="font-display text-2xl md:text-3xl text-[var(--color-bg-primary)] py-2"
          speed={25}
          separator=" ★ "
        >
          2026 SILVER JUBILEE YEAR — YEAR-LONG CELEBRATION — MULTIPLE EVENTS — STAY CONNECTED
        </MarqueeText>
      </section>

      <section className="py-32 bg-[var(--color-bg-primary)]">
        <div className="container-asymmetric text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-heading text-[var(--color-text-primary)] mb-6">
              CELEBRATE WITH US<br />
              <span className="text-gradient-sunset">ALL YEAR LONG</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-xl leading-relaxed mb-10">
              2026 is our Silver Jubilee Year! Stay connected for updates on 
              upcoming batch meetups, programs, and the grand finale.
            </p>
            <Link to="/contact">
              <motion.button
                className="btn-primary text-lg px-12 py-5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>STAY IN TOUCH</span>
                <FaArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EventsPage;
