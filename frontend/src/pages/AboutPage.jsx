import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaArrowRight,
} from "react-icons/fa";
import PageLayout from "../components/shared/PageLayout";
import { KineticText, MarqueeText } from "../components/artistic";

// Committee members - Office Bearers
const committeeMembers = [
  { name: "Gowtham Krishna", role: "President", batch: "Batch 10" },
  { name: "Ashin Amanulla", role: "Secretary", batch: "Batch 5" },
  { name: "Abhinand B", role: "Vice President", batch: "Batch 17" },
  { name: "Apsima I V", role: "Joint Secretary", batch: "Batch 9" },
  { name: "Sanjay J S", role: "Joint Treasurer", batch: "Batch 6" },
  { name: "Abhyuday", role: "Treasurer", batch: "Batch 17" },
];

// Timeline milestones
const milestones = [
  { year: "2001", title: "School Established", description: "JNV Trivandrum was established, beginning a new chapter in education for the region." },
  { year: "2008", title: "First Batch Graduates", description: "The pioneering batch of students completes Class 12, becoming the first alumni of JNV Trivandrum." },
  { year: "2009", title: "First Alumni Meet", description: "The first ever alumni gathering takes place, planting the seeds for a formal association." },
  { year: "2019", title: "JNVTAA Formalized", description: "JNV Trivandrum Alumni Association officially structured with a dedicated committee." },
  { year: "2026", title: "Silver Jubilee Celebration", description: "Grand reunion marking 25 years since the school's establishment in 2001." },
];

const AboutPage = () => {
  return (
    <PageLayout showPopup={false}>
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[20%] right-[5%] w-96 h-96 rounded-full border border-[var(--color-accent-coral)]/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[10%] w-64 h-64 rounded-full bg-[var(--color-accent-cyan)]/10 blur-3xl"
          />
        </div>

        <div className="container-asymmetric relative z-10 py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
              <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
                Our Story
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-2 mb-8">
              <KineticText
                as="h1"
                variant="words"
                delay={0.3}
                className="font-display text-display text-[var(--color-text-primary)] leading-[0.9]"
              >
                ABOUT
              </KineticText>
              <KineticText
                as="h1"
                variant="words"
                delay={0.5}
                className="font-display text-display text-gradient-sunset leading-[0.9]"
              >
                JNVTAA
              </KineticText>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed"
            >
              The Jawahar Navodaya Vidyalaya Trivandrum Alumni Association — connecting 
              generations of Navodayans through shared values and lasting bonds.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================
          MISSION & VISION SECTION
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-secondary)]">
        <div className="container-asymmetric">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-brutal p-10"
            >
              <span className="text-[var(--color-accent-coral)] font-display text-7xl block mb-6">01</span>
              <h2 className="font-display text-3xl text-[var(--color-text-primary)] mb-6">
                OUR MISSION
              </h2>
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed mb-8">
                To foster a vibrant community of JNV Trivandrum alumni that supports personal 
                and professional growth, gives back to our alma mater, and celebrates the 
                Navodayan spirit.
              </p>
              <ul className="space-y-4">
                {[
                  "Connect alumni across batches and geographies",
                  "Support current students and institution",
                  "Organize meaningful events and reunions",
                  "Create networking opportunities",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-[var(--color-text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-coral)] mt-2 flex-shrink-0" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card-brutal p-10 lg:mt-16"
            >
              <span className="text-[var(--color-accent-cyan)] font-display text-7xl block mb-6">02</span>
              <h2 className="font-display text-3xl text-[var(--color-text-primary)] mb-6">
                OUR VISION
              </h2>
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed mb-8">
                To be the most connected and impactful alumni association, creating a lasting 
                legacy of excellence, service, and camaraderie for generations of Navodayans.
              </p>
              <div className="bg-[var(--color-bg-primary)] p-6 border border-[var(--color-text-primary)]/20">
                <h4 className="font-display text-sm tracking-[0.2em] text-[var(--color-accent-gold)] mb-4">
                  CORE VALUES
                </h4>
                <div className="flex flex-wrap gap-3">
                  {["Excellence", "Unity", "Service", "Integrity", "Growth"].map((value) => (
                    <span 
                      key={value}
                      className="px-4 py-2 border border-[var(--color-text-primary)]/30 text-[var(--color-text-primary)] text-sm font-display tracking-wider"
                    >
                      {value.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          TIMELINE SECTION
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-primary)] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[30vw] text-[var(--color-text-primary)]/[0.02] leading-none">
            25
          </span>
        </div>

        <div className="container-asymmetric relative z-10">
          {/* Section Header */}
          <div className="max-w-2xl mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-gold)]" />
              <span className="text-[var(--color-accent-gold)] font-display text-sm tracking-[0.3em] uppercase">
                Our Journey
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-heading text-[var(--color-text-primary)]"
            >
              MILESTONES
            </motion.h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden lg:block absolute left-24 top-0 bottom-0 w-[2px] bg-[var(--color-text-primary)]/10" />

            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-12"
                >
                  {/* Year */}
                  <div className="hidden lg:flex items-center gap-6 min-w-[120px]">
                    <span className="font-display text-4xl text-[var(--color-accent-coral)]">
                      {milestone.year}
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[var(--color-accent-coral)] border-4 border-[var(--color-bg-primary)] z-10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className="lg:hidden font-display text-2xl text-[var(--color-accent-coral)] block mb-2">
                      {milestone.year}
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-text-primary)] mb-3">
                      {milestone.title.toUpperCase()}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-xl">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          COMMITTEE SECTION — Dark Theme
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-primary)]">
        <div className="container-asymmetric">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center gap-3 mb-6"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
              <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
                Leadership
              </span>
              <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-heading text-[var(--color-text-primary)] mb-6"
            >
              OUR OFFICE BEARERS
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[var(--color-text-muted)] text-lg leading-relaxed"
            >
              Meet the dedicated team working to make JNVTAA thrive
            </motion.p>
          </div>

          {/* Committee Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {committeeMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--color-bg-secondary)] p-8 border border-[var(--color-text-primary)]/10 hover:border-[var(--color-accent-coral)] transition-all duration-300 text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-[var(--color-accent-coral)]/10 border-2 border-[var(--color-accent-coral)]/30 mx-auto mb-6 flex items-center justify-center group-hover:bg-[var(--color-accent-coral)] group-hover:border-[var(--color-accent-coral)] transition-colors">
                  <FaGraduationCap className="text-4xl text-[var(--color-accent-coral)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-2xl text-[var(--color-text-primary)] mb-2">
                  {member.name.toUpperCase()}
                </h3>
                <p className="text-[var(--color-accent-coral)] font-display text-sm tracking-wider mb-2">
                  {member.role.toUpperCase()}
                </p>
                <p className="text-[var(--color-text-muted)] text-sm">{member.batch}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PageLayout>
  );
};

export default AboutPage;
