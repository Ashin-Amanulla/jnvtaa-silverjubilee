import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaPaperPlane,
} from "react-icons/fa";
import { HiMail, HiLocationMarker, HiPhone } from "react-icons/hi";
import PageLayout from "../components/shared/PageLayout";

// Contact info
const contactInfo = [
  {
    icon: HiMail,
    label: "Email",
    value: "info@jnvtaa.in",
    href: "mailto:info@jnvtaa.in",
    description: "For general inquiries and support",
  },
  {
    icon: HiPhone,
    label: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    description: "Available on weekdays 10 AM - 6 PM",
  },
  {
    icon: HiLocationMarker,
    label: "Address",
    value: "JNV Campus, Trivandrum, Kerala",
    href: "#",
    description: "Registered office address",
  },
];

// Social links
const socialLinks = [
  { name: "Facebook", icon: FaFacebookF, href: "#", color: "bg-blue-600 hover:bg-blue-700" },
  { name: "Instagram", icon: FaInstagram, href: "#", color: "bg-pink-600 hover:bg-pink-700" },
  { name: "WhatsApp", icon: FaWhatsapp, href: "#", color: "bg-green-600 hover:bg-green-700" },
  { name: "YouTube", icon: FaYoutube, href: "#", color: "bg-red-600 hover:bg-red-700" },
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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

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
              <FaEnvelope className="text-[#D4AF37]" />
              <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Get in Touch
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Have questions about JNVTAA or the Silver Jubilee event? 
              We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A237E] mb-8">
                Reach Out to Us
              </h2>

              <div className="space-y-6 mb-10">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1A237E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A237E] transition-colors">
                      <info.icon className="text-xl text-[#1A237E] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <span className="text-xs text-[#9CA3AF] uppercase tracking-wider block mb-1">
                        {info.label}
                      </span>
                      <span className="text-[#1A237E] font-semibold block mb-1">
                        {info.value}
                      </span>
                      <span className="text-[#4B5563] text-sm">
                        {info.description}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-[#1A237E] mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center transition-all hover:scale-110`}
                      aria-label={social.name}
                    >
                      <social.icon className="text-white text-lg" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="font-heading text-2xl font-bold text-[#1A237E] mb-6">
                  Send us a Message
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                      <FaPaperPlane className="text-green-600 text-2xl" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-[#1A237E] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[#4B5563] mb-6">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-outline"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#4B5563] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/20 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#4B5563] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/20 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#4B5563] mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/20 outline-none transition-all"
                        placeholder="Silver Jubilee Inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#4B5563] mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/20 outline-none transition-all resize-none"
                        placeholder="Your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <FaPaperPlane className="text-sm" />
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

      {/* Map placeholder / CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 sm:p-12 text-center"
          >
            <FaMapMarkerAlt className="text-4xl text-[#1A237E] mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A237E] mb-4">
              Visit Us at JNV Campus
            </h2>
            <p className="text-[#4B5563] mb-6 max-w-xl mx-auto">
              The Silver Jubilee celebration will be held at our beloved JNV Trivandrum campus. 
              Come back to where it all began!
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Register for Silver Jubilee
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
