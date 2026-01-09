import React from "react";
import { motion } from "framer-motion";

// Import all home page sections
import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Countdown from "../components/home/Countdown";
import TheJourney from "../components/home/TheJourney";
import EventDetails from "../components/home/EventDetails";
import Gallery from "../components/home/Gallery";
import Sponsors from "../components/home/Sponsors";
import FAQ from "../components/home/FAQ";
import Footer from "../components/home/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-body selection:bg-[#D4AF37]/30 selection:text-[#1A237E]">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Countdown Timer */}
        <Countdown />

        {/* The Journey Timeline */}
        <TheJourney />

        {/* Event Details */}
        <EventDetails />

        {/* Photo Gallery */}
        <Gallery />

        {/* Sponsors Section */}
        <Sponsors />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer with Contact */}
      <Footer />
    </div>
  );
};

export default HomePage;
