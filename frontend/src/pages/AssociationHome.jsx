import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchAllImages } from "../api/galleryApi";
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaImages, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import { KineticText, MarqueeText, ParallaxSection } from "../components/artistic";
import PageLayout from "../components/shared/PageLayout";

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
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await fetchAllImages();
        if (data.success && data.data.allImages.length > 0) {
          const shuffled = data.data.allImages.sort(() => 0.5 - Math.random());
          setHeroImages(shuffled.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load hero images:", error);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <PageLayout>
      {/* ============================================
          HERO SECTION — Kinetic Typography
          ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-bg-primary)] texture-grain">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {heroImages.length > 0 ? (
              <motion.img
                key={currentImageIndex}
                src={heroImages[currentImageIndex].url}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.45, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Hero Background"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-mesh" />
            )}
          </AnimatePresence>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)]/80 via-[var(--color-bg-primary)]/60 to-[var(--color-bg-primary)]" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating coral circle */}
          <motion.div
            className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full border border-[var(--color-accent-coral)]/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          {/* Floating cyan circle */}
          <motion.div
            className="absolute bottom-[20%] left-[5%] w-48 h-48 rounded-full bg-[var(--color-accent-cyan)]/10 blur-3xl"
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          {/* Vertical accent line */}
          <motion.div
            className="absolute right-[15%] top-[10%] w-[1px] h-[30vh] bg-gradient-to-b from-transparent via-[var(--color-accent-coral)] to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>

        {/* Main Content */}
        <div className="container-asymmetric relative z-10 py-32 lg:py-40">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Column — Typography */}
            <div className="lg:col-span-8 space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-3"
              >
                <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
                <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
                  JNV Trivandrum Alumni
                </span>
              </motion.div>

              {/* Main Headline — Kinetic */}
              <div className="space-y-2">
                <KineticText
                  as="h1"
                  variant="letters"
                  delay={0.3}
                  staggerChildren={0.02}
                  className="font-display text-hero text-[var(--color-text-primary)] leading-[0.85]"
                >
                  NURTURING
                </KineticText>
                <KineticText
                  as="h1"
                  variant="letters"
                  delay={0.6}
                  staggerChildren={0.02}
                  className="font-display text-hero text-outline leading-[0.85]"
                >
                  BONDS
                </KineticText>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-xl leading-relaxed"
              >
                Connecting Navodayans across generations. Celebrating our shared 
                heritage and building a vibrant community of achievers.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link to="/events">
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>View Events</span>
                    <FaArrowRight />
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    className="btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    About Us
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Right Column — Vertical Text & Accent */}
            <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-vertical"
              >
                <span className="font-display text-6xl text-[var(--color-text-primary)]/20 tracking-widest">
                  25TH YEAR CELEBRATION
                </span>
              </motion.div>
            </div>

            {/* Mobile 25th Year Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="lg:hidden mt-8 inline-flex items-center gap-3 bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/30 px-6 py-3"
            >
              <span className="font-display text-2xl text-[var(--color-accent-coral)]">25</span>
              <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider">Years of Excellence</span>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator — Enhanced with glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-coral)] font-display">
            Scroll
          </span>
          <motion.div
            className="w-[2px] h-14 bg-gradient-to-b from-[var(--color-accent-coral)] to-transparent rounded-full"
            animate={{ scaleY: [0, 1, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: "top", boxShadow: "0 0 20px rgba(255, 107, 107, 0.5)" }}
          />
        </motion.div>
      </section>

      {/* ============================================
          MARQUEE SECTION — Infinite Scroll Text
          ============================================ */}
      <section className="py-6 bg-[var(--color-accent-coral)] overflow-hidden">
        <MarqueeText
          className="font-display text-3xl md:text-4xl text-[var(--color-bg-primary)] py-2"
          speed={25}
          separator=" ★ "
        >
          CELEBRATING 25 YEARS — 2026 SILVER JUBILEE YEAR — JNVTAA — YEAR-LONG CELEBRATION
        </MarqueeText>
      </section>

      {/* ============================================
          FEATURED EVENT — Silver Jubilee
          ============================================ */}
      <section className="relative py-32 bg-[var(--color-bg-secondary)] overflow-hidden">
        {/* Background number */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.span
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 0.06, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute -right-20 top-1/2 -translate-y-1/2 font-display text-[40vw] text-[var(--color-text-primary)] leading-none"
          >
            25
          </motion.span>
        </div>

        <div className="container-asymmetric relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3"
              >
                <span className="accent-dot animate-pulse-glow" />
                <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
                  Featured Event
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-display text-[var(--color-text-primary)]"
              >
                SILVER<br />
                <span className="text-gradient-sunset">JUBILEE</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-[var(--color-text-muted)] text-lg max-w-md leading-relaxed"
              >
                2026 marks 25 glorious years of JNV Trivandrum! We're celebrating this 
                milestone throughout the year with various programs and events.
              </motion.p>

              {/* Celebration Declaration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/30 p-6"
              >
                <span className="block text-xs text-[var(--color-accent-coral)] uppercase tracking-[0.2em] mb-2">Declaration</span>
                <p className="text-[var(--color-text-primary)] font-display text-xl">
                  2026 IS THE YEAR OF CELEBRATION
                </p>
                <p className="text-[var(--color-text-muted)] text-sm mt-2">
                  Multiple events, meetups, and programs throughout the year
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link to="/events">
                  <button className="btn-primary">
                    <span>View Upcoming Events</span>
                    <FaArrowRight />
                  </button>
                </Link>
                <Link to="/gallery">
                  <button className="btn-outline">
                    View Gallery
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right — Countdown Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
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
                  <span className="font-display text-3xl text-[var(--color-bg-primary)]">
                    CELEBRATING NOW
                  </span>
                  <span className="block text-[var(--color-bg-primary)]/80 text-sm mt-2">
                    Year-long programs & events
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          MISSION SECTION — Staggered Cards
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-primary)] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial-coral opacity-50" />
        
        <div className="container-asymmetric relative z-10">
          {/* Section Header */}
          <div className="max-w-2xl mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-cyan)]" />
              <span className="text-[var(--color-accent-cyan)] font-display text-sm tracking-[0.3em] uppercase">
                Our Purpose
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-heading text-[var(--color-text-primary)] mb-6"
            >
              BUILDING A<br />
              <span className="text-gradient-ocean">LASTING LEGACY</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[var(--color-text-muted)] text-lg"
            >
              JNVTAA is dedicated to connecting alumni, fostering community, 
              and celebrating the Navodayan spirit that unites us all.
            </motion.p>
          </div>

          {/* Staggered Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Connect Alumni",
                description: "Building bridges between generations of Navodayans across the globe.",
                accent: "var(--color-accent-coral)",
              },
              {
                number: "02",
                title: "Support Community",
                description: "Giving back to the institution that shaped our future.",
                accent: "var(--color-accent-cyan)",
              },
              {
                number: "03",
                title: "Celebrate Excellence",
                description: "Recognizing achievements of our vibrant alumni network.",
                accent: "var(--color-accent-gold)",
              },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`card-brutal p-8 ${index === 1 ? "md:mt-12" : ""} ${index === 2 ? "md:mt-24" : ""}`}
              >
                <span 
                  className="font-display text-6xl block mb-6"
                  style={{ color: item.accent }}
                >
                  {item.number}
                </span>
                <h3 className="font-display text-2xl text-[var(--color-text-primary)] mb-4">
                  {item.title.toUpperCase()}
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          EXPLORE SECTION — Quick Links
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-secondary)]">
        <div className="container-asymmetric">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center gap-3 mb-6"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
              <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
                Quick Links
              </span>
              <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-heading text-[var(--color-text-primary)] mb-6"
            >
              EXPLORE JNVTAA
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[var(--color-text-muted)] text-lg leading-relaxed"
            >
              Discover more about our alumni association, upcoming events, 
              cherished memories, and ways to connect.
            </motion.p>
          </div>

          {/* Links Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "About", description: "Learn about our story, mission, and the dedicated committee behind JNVTAA.", path: "/about", icon: FaInfoCircle, color: "#00D4FF" },
              { title: "Events", description: "Stay updated on upcoming reunions, meetups, and special celebrations.", path: "/events", icon: FaCalendarAlt, color: "#FF6B6B" },
              { title: "Gallery", description: "Browse through captured memories from past events and school days.", path: "/gallery", icon: FaImages, color: "#FFD93D" },
              { title: "Contact", description: "Reach out to us for queries, suggestions, or to get involved.", path: "/contact", icon: FaEnvelope, color: "#A855F7" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.path}>
                  <motion.div
                    className="group bg-[var(--color-bg-primary)] p-8 h-full border border-[var(--color-text-primary)]/10 hover:border-[var(--color-accent-coral)] hover:shadow-2xl hover:shadow-[var(--color-accent-coral)]/10 transition-all duration-300 relative overflow-hidden"
                    whileHover={{ y: -8 }}
                  >
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon className="text-2xl" style={{ color: item.color }} />
                    </div>
                    <span className="font-display text-sm tracking-[0.2em] block mb-3" style={{ color: item.color }}>
                      0{index + 1}
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-text-primary)] mb-4 group-hover:text-[var(--color-accent-coral)] transition-colors">
                      {item.title.toUpperCase()}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-base leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-[var(--color-accent-coral)] font-display text-sm tracking-wide group-hover:gap-4 transition-all">
                      <span>EXPLORE</span>
                      <FaArrowRight />
                    </div>
                    {/* Decorative corner accent */}
                    <div 
                      className="absolute -bottom-2 -right-2 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, transparent 50%, ${item.color}20 50%)` }}
                    />
                  </motion.div>
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
