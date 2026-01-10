import React from "react";
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
  FaHeart,
} from "react-icons/fa";
import { HiChevronUp } from "react-icons/hi";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Event Details", href: "#event-details" },
  { name: "Gallery", href: "#gallery" },
  { name: "Sponsors", href: "#sponsors" },
  { name: "FAQ", href: "#faq" },
];

const socialLinks = [
  { name: "Facebook", icon: FaFacebookF, href: "#", color: "hover:bg-blue-600" },
  { name: "Instagram", icon: FaInstagram, href: "#", color: "hover:bg-pink-600" },
  { name: "WhatsApp", icon: FaWhatsapp, href: "#", color: "hover:bg-green-600" },
  { name: "YouTube", icon: FaYoutube, href: "#", color: "hover:bg-red-600" },
];

const contactInfo = [
  {
    icon: FaPhone,
    label: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "jnvta.reunion@gmail.com",
    href: "mailto:jnvta.reunion@gmail.com",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Venue",
    value: "JNV Campus, Trivandrum, Kerala",
    href: "#",
  },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  return (
    <footer
      id="contact"
      className="relative bg-[#1a202c] text-[#FDF4E6] border-t border-[#FDF4E6]/5"
    >
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-30"></div>
                <img
                  src="/logo.png"
                  alt="JNVTA Logo"
                  className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-[#FDF4E6]">
                  JNV Trivandrum
                </h3>
                <p className="text-xs text-[#D4AF37] uppercase tracking-wider">Alumni Association</p>
              </div>
            </div>
            <p className="font-body text-gray-400 text-sm leading-relaxed mb-6">
              Celebrating 25 years of excellence, memories, and the unbreakable
              bonds forged in the halls of Jawahar Navodaya Vidyalaya.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="text-gray-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-heading text-lg font-semibold text-[#FDF4E6] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="font-body text-gray-400 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#D4AF37] transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/register"
                  className="font-body text-[#DAA520] hover:text-[#FDF4E6] transition-colors inline-flex items-center gap-2 font-medium group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] group-hover:bg-[#FDF4E6] transition-colors" />
                  Register Now
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-heading text-lg font-semibold text-[#FDF4E6] mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((info) => (
                <li key={info.label}>
                  <a
                    href={info.href}
                    className="flex items-start gap-3 font-body text-gray-400 hover:text-[#FDF4E6] transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37] group-hover:text-black transition-all border border-white/10 group-hover:border-[#D4AF37]">
                      <info.icon className="text-sm" />
                    </span>
                    <div>
                      <span className="text-xs text-gray-500 block uppercase tracking-wide mb-0.5">
                        {info.label}
                      </span>
                      <span className="text-sm font-medium">{info.value}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-heading text-lg font-semibold text-[#FDF4E6] mb-6">
              Join Us
            </h4>
            <p className="font-body text-gray-400 text-sm mb-6 leading-relaxed">
              Don't miss this once-in-a-lifetime reunion. Register today and
              reconnect with your classmates!
            </p>
            <Link to="/register">
              <button className="btn-primary w-full sm:w-auto text-center px-6 py-2.5 text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                Register Now
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#FDF4E6]/5 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-gray-500 text-center sm:text-left">
              © 2026 JNVTA Silver Jubilee Reunion. Made with{" "}
              <FaHeart className="inline text-red-500 mx-1" /> by Alumni, for
              Alumni.
            </p>
            
            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors font-body text-sm group"
            >
              <span>Back to Top</span>
              <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#D4AF37] transition-colors">
                <HiChevronUp className="text-lg" />
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
