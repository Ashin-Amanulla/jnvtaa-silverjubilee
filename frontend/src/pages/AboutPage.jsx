import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaHandshake,
  FaHeart,
  FaGraduationCap,
  FaHistory,
  FaArrowRight,
} from "react-icons/fa";
import { HiSparkles, HiLightBulb, HiEye } from "react-icons/hi";
import PageLayout from "../components/shared/PageLayout";

// Committee members
const committeeMembers = [
  { name: "Shyam", role: "President", batch: "11th Batch" },
  { name: "Avinash Nazeer", role: "Secretary", batch: "11th Batch" },
  { name: "Manu J", role: "Treasurer", batch: "3rd Batch" },
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
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB]" />
        
        {/* Decorative circles */}
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
              <FaHistory className="text-[#D4AF37]" />
              <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Our Story
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              About JNVTAA
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              The Jawahar Navodaya Vidyalaya Trivandrum Alumni Association - connecting 
              generations of Navodayans through shared values and lasting bonds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-2xl"
            >
              <div className="w-14 h-14 rounded-xl bg-[#1A237E] flex items-center justify-center mb-6">
                <HiLightBulb className="text-2xl text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-[#1A237E] mb-4">
                Our Mission
              </h2>
              <p className="text-[#4B5563] leading-relaxed mb-4">
                To foster a vibrant community of JNV Trivandrum alumni that supports personal 
                and professional growth, gives back to our alma mater, and celebrates the 
                Navodayan spirit.
              </p>
              <ul className="space-y-3">
                {[
                  "Connect alumni across batches and geographies",
                  "Support current students and institution",
                  "Organize meaningful events and reunions",
                  "Create networking opportunities",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[#4B5563]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-2xl"
            >
              <div className="w-14 h-14 rounded-xl bg-[#D4AF37] flex items-center justify-center mb-6">
                <HiEye className="text-2xl text-[#1A237E]" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-[#1A237E] mb-4">
                Our Vision
              </h2>
              <p className="text-[#4B5563] leading-relaxed mb-4">
                To be the most connected and impactful alumni association, creating a lasting 
                legacy of excellence, service, and camaraderie for generations of Navodayans.
              </p>
              <div className="bg-[#1A237E]/5 rounded-xl p-6">
                <h4 className="font-semibold text-[#1A237E] mb-2">Core Values</h4>
                <div className="flex flex-wrap gap-2">
                  {["Excellence", "Unity", "Service", "Integrity", "Growth"].map((value) => (
                    <span 
                      key={value}
                      className="px-3 py-1 rounded-full bg-white text-[#1A237E] text-sm font-medium border border-[#1A237E]/10"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A237E] mb-4">
              Our Journey
            </h2>
            <p className="text-[#4B5563] max-w-2xl mx-auto">
              Key milestones in the history of JNV Trivandrum and JNVTAA
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#1A237E]/20" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`glass-panel p-6 rounded-2xl inline-block ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                      <span className="text-[#D4AF37] font-bold text-lg">{milestone.year}</span>
                      <h3 className="font-heading text-xl font-semibold text-[#1A237E] mt-1 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-[#4B5563] text-sm">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-[#1A237E] border-4 border-[#FDF4E6] z-10" />
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section className="py-20 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A237E] mb-4">
              Our Committee
            </h2>
            <p className="text-[#4B5563] max-w-2xl mx-auto">
              Meet the dedicated team working to make JNVTAA thrive
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-6 rounded-2xl text-center group hover:border-[#1A237E]/30 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-[#1A237E]/10 mx-auto mb-4 flex items-center justify-center group-hover:bg-[#1A237E] transition-colors">
                  <FaGraduationCap className="text-3xl text-[#1A237E] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A237E]">
                  {member.name}
                </h3>
                <p className="text-[#D4AF37] font-medium text-sm">{member.role}</p>
                <p className="text-[#4B5563] text-xs mt-1">{member.batch}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HiSparkles className="text-4xl text-[#D4AF37] mx-auto mb-6" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Join Us at Silver Jubilee 2026
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Be part of the grand celebration marking 25 years of excellence. 
              Reconnect with old friends and create new memories.
            </p>
            <Link 
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#D4AF37] text-[#1A237E] font-semibold hover:bg-[#E5C048] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Register Now
              <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutPage;
