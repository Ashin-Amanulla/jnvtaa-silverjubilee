import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaArrowUp,
  FaArrowRight,
} from "react-icons/fa";

const socialLinks = [
  { name: "Instagram", icon: FaInstagram, href: "https://instagram.com/jnvtaa" },
  { name: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/919876543210" },
  { name: "YouTube", icon: FaYoutube, href: "https://youtube.com/@jnvtaa" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0a0a0a] mt-16 pt-16">
      {/* Top Accent Border */}
      <div className="h-1 bg-gradient-to-r from-[#FF6B6B] via-[#FFD93D] to-[#00D4FF]" />

      {/* Main Footer Content */}
      <div className="container-asymmetric py-20">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Left Column — Brand & Description */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-flex items-center gap-4 group">
                <img
                  src="/logo.png"
                  alt="JNVTA Logo"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#FF6B6B]"
                />
                <div>
                  <h3 className="font-display text-2xl text-white group-hover:text-[#FF6B6B] transition-colors">
                    JNV TRIVANDRUM
                  </h3>
                  <span className="text-sm tracking-[0.2em] uppercase text-[#FF6B6B]">
                    Alumni Association
                  </span>
                </div>
              </Link>
            </motion.div>

            <p className="text-[#a0a0a0] text-base leading-relaxed max-w-md">
              Celebrating 25 years of excellence, memories, and the unbreakable 
              bonds forged in the halls of Jawahar Navodaya Vidyalaya Trivandrum.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-[#666666] text-sm font-display tracking-wider">FOLLOW US</span>
              <span className="w-8 h-[1px] bg-[#333333]" />
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 flex items-center justify-center border border-[#333333] hover:border-[#FF6B6B] hover:bg-[#FF6B6B] text-[#888888] hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Middle Column — Quick Links */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-display text-lg text-white mb-8 tracking-wider">
                EXPLORE
              </h4>
              <ul className="space-y-5">
                {[
                  { name: "About Us", path: "/about" },
                  { name: "Events", path: "/events" },
                  { name: "Gallery", path: "/gallery" },
                  { name: "News & Updates", path: "/news" },
                  { name: "Contact", path: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-[#888888] hover:text-white transition-colors inline-flex items-center gap-3 group text-base"
                    >
                      <span className="w-0 group-hover:w-4 h-[2px] bg-[#FF6B6B] transition-all duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Column — Contact Info */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-display text-lg text-white mb-8 tracking-wider">
                GET IN TOUCH
              </h4>
              <ul className="space-y-6">
                <li>
                  <a
                    href="mailto:info@jnvtaa.in"
                    className="flex items-center gap-4 text-[#888888] hover:text-white transition-colors group"
                  >
                    <span className="w-12 h-12 flex items-center justify-center border border-[#333333] group-hover:border-[#FF6B6B] group-hover:bg-[#FF6B6B] transition-all">
                      <FaEnvelope className="text-lg" />
                    </span>
                    <div>
                      <span className="block text-xs text-[#555555] uppercase tracking-wider mb-1">Email</span>
                      <span className="text-base text-[#cccccc] group-hover:text-white">info@jnvtaa.in</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-4 text-[#888888] hover:text-white transition-colors group"
                  >
                    <span className="w-12 h-12 flex items-center justify-center border border-[#333333] group-hover:border-[#FF6B6B] group-hover:bg-[#FF6B6B] transition-all">
                      <FaPhone className="text-lg" />
                    </span>
                    <div>
                      <span className="block text-xs text-[#555555] uppercase tracking-wider mb-1">Phone</span>
                      <span className="text-base text-[#cccccc] group-hover:text-white">+91 98765 43210</span>
                    </div>
                  </a>
                </li>
                <li className="flex items-center gap-4 text-[#888888]">
                  <span className="w-12 h-12 flex items-center justify-center border border-[#333333]">
                    <FaMapMarkerAlt className="text-lg text-[#FF6B6B]" />
                  </span>
                  <div>
                    <span className="block text-xs text-[#555555] uppercase tracking-wider mb-1">Venue</span>
                    <span className="text-base text-[#cccccc]">JNV Campus, Trivandrum, Kerala</span>
                  </div>
                </li>
              </ul>

              {/* Newsletter Signup */}
              <div className="mt-10">
                <div className="bg-[#1a1a1a] border border-[#333333] p-6">
                  <h5 className="font-display text-sm text-white tracking-wider mb-3">STAY CONNECTED</h5>
                  <p className="text-sm text-[#888888] mb-4">Get updates on events and alumni news</p>
                  <Link to="/contact">
                    <motion.button
                      className="btn-primary w-full justify-center text-sm py-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>JOIN OUR COMMUNITY</span>
                      <FaArrowRight />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1a1a1a]">
        <div className="container-asymmetric py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#666666]">
              © 2026 JNV Trivandrum Alumni Association. Made with passion by Alumni, for Alumni.
            </p>

            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 text-[#666666] hover:text-[#FF6B6B] transition-colors font-display text-sm tracking-wider"
            >
              <span>BACK TO TOP</span>
              <span className="w-12 h-12 flex items-center justify-center border border-[#333333] hover:border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-all">
                <FaArrowUp />
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
