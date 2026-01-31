import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";
import PageLayout from "../components/shared/PageLayout";
import { KineticText } from "../components/artistic";

// Contact info
const contactInfo = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "info@jnvtaa.in",
    href: "mailto:info@jnvtaa.in",
    description: "For general inquiries and support",
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    description: "Available on weekdays 10 AM - 6 PM",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Address",
    value: "JNV Campus, Trivandrum, Kerala",
    href: "#",
    description: "Registered office address",
  },
];

// Social links
const socialLinks = [
  { name: "Instagram", icon: FaInstagram, href: "#" },
  { name: "WhatsApp", icon: FaWhatsapp, href: "#" },
  { name: "YouTube", icon: FaYoutube, href: "#" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <PageLayout showPopup={false}>
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full border border-[var(--color-accent-gold)]/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
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
              <span className="w-12 h-[2px] bg-[var(--color-accent-gold)]" />
              <span className="text-[var(--color-accent-gold)] font-display text-sm tracking-[0.3em] uppercase">
                Get in Touch
              </span>
            </motion.div>

            <div className="space-y-2 mb-8">
              <KineticText
                as="h1"
                variant="words"
                delay={0.3}
                className="font-display text-display text-[var(--color-text-primary)] leading-[0.9]"
              >
                CONTACT
              </KineticText>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed"
            >
              Have questions about JNVTAA or the Silver Jubilee event? 
              We'd love to hear from you.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================
          CONTACT CONTENT
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-secondary)]">
        <div className="container-asymmetric">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl text-[var(--color-text-primary)] mb-10">
                REACH OUT TO US
              </h2>

              <div className="space-y-6 mb-12">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-5 p-6 bg-[var(--color-bg-primary)] border border-[var(--color-text-primary)]/10 hover:border-[var(--color-accent-coral)] transition-all group"
                  >
                    <span className="w-14 h-14 flex items-center justify-center border border-[var(--color-text-primary)]/20 group-hover:border-[var(--color-accent-coral)] group-hover:bg-[var(--color-accent-coral)] transition-all">
                      <info.icon className="text-xl text-[var(--color-accent-coral)] group-hover:text-[var(--color-bg-primary)]" />
                    </span>
                    <div>
                      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                        {info.label}
                      </span>
                      <span className="text-[var(--color-text-primary)] font-display text-lg block mb-1">
                        {info.value}
                      </span>
                      <span className="text-[var(--color-text-muted)] text-sm">
                        {info.description}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-display text-sm tracking-[0.2em] text-[var(--color-accent-coral)] mb-6">
                  FOLLOW US
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 flex items-center justify-center border border-[var(--color-text-primary)]/20 hover:border-[var(--color-accent-coral)] hover:bg-[var(--color-accent-coral)] text-[var(--color-text-muted)] hover:text-[var(--color-bg-primary)] transition-all"
                      aria-label={social.name}
                    >
                      <social.icon className="text-xl" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-brutal p-10">
                <h2 className="font-display text-2xl text-[var(--color-text-primary)] mb-8">
                  SEND US A MESSAGE
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-[#22c55e] mx-auto mb-6 flex items-center justify-center">
                      <FaPaperPlane className="text-white text-3xl" />
                    </div>
                    <h3 className="font-display text-2xl text-[var(--color-text-primary)] mb-3">
                      MESSAGE SENT!
                    </h3>
                    <p className="text-[var(--color-text-muted)] mb-8">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-outline"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-display tracking-wider text-[var(--color-text-muted)] mb-2">
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-artistic"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-display tracking-wider text-[var(--color-text-muted)] mb-2">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-artistic"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-display tracking-wider text-[var(--color-text-muted)] mb-2">
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input-artistic"
                        placeholder="Silver Jubilee Inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-display tracking-wider text-[var(--color-text-muted)] mb-2">
                        MESSAGE
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="input-artistic resize-none"
                        placeholder="Your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary justify-center disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          SENDING...
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <FaPaperPlane />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-primary)]">
        <div className="container-asymmetric text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <FaMapMarkerAlt className="text-5xl text-[var(--color-accent-coral)] mx-auto mb-6" />
            <h2 className="font-display text-heading text-[var(--color-text-primary)] mb-6">
              CELEBRATING<br />
              <span className="text-gradient-sunset">25 YEARS</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-xl leading-relaxed mb-10">
              2026 marks our Silver Jubilee Year! Join us for year-long celebrations, 
              batch meetups, and special programs throughout the year.
            </p>
            <Link to="/events">
              <motion.button
                className="btn-primary text-lg px-12 py-5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>VIEW UPCOMING EVENTS</span>
                <FaArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
