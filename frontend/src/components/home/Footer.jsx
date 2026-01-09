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
    value: "JNV Campus, Thrissur, Kerala",
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
      className="relative bg-gradient-to-b from-[#3D2512] to-[#2A1810] text-[#FDF5E6]"
    >
      {/* Decorative top border */}
      <div className="h-2 bg-gradient-to-r from-[#8B4513] via-[#B8860B] to-[#8B4513]" />

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
              <img
                src="/images/logo.jpeg"
                alt="JNVTA Logo"
                className="w-14 h-14 rounded-full border-2 border-[#B8860B] object-cover"
              />
              <div>
                <h3 className="font-heading text-xl font-bold text-[#FDF5E6]">
                  JNVTA
                </h3>
                <p className="text-xs text-[#DAA520]">Silver Jubilee 2026</p>
              </div>
            </div>
            <p className="font-body text-[#F4E8D1]/80 text-sm leading-relaxed mb-6">
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
                  className={`w-10 h-10 rounded-full bg-[#5D3A1A] flex items-center justify-center transition-all ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="text-[#FDF5E6]" />
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
            <h4 className="font-heading text-lg font-semibold text-[#DAA520] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="font-body text-[#F4E8D1]/80 hover:text-[#DAA520] transition-colors inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/register"
                  className="font-body text-[#DAA520] hover:text-[#FDF5E6] transition-colors inline-flex items-center gap-2 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
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
            <h4 className="font-heading text-lg font-semibold text-[#DAA520] mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((info) => (
                <li key={info.label}>
                  <a
                    href={info.href}
                    className="flex items-start gap-3 font-body text-[#F4E8D1]/80 hover:text-[#DAA520] transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#5D3A1A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#B8860B] transition-colors">
                      <info.icon className="text-sm" />
                    </span>
                    <div>
                      <span className="text-xs text-[#B8860B] block">
                        {info.label}
                      </span>
                      <span className="text-sm">{info.value}</span>
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
            <h4 className="font-heading text-lg font-semibold text-[#DAA520] mb-6">
              Join Us
            </h4>
            <p className="font-body text-[#F4E8D1]/80 text-sm mb-6">
              Don't miss this once-in-a-lifetime reunion. Register today and
              reconnect with your classmates!
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-vintage w-full sm:w-auto text-center"
              >
                Register Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#5D3A1A]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-[#F4E8D1]/60 text-center sm:text-left">
              © 2026 JNVTA Silver Jubilee Reunion. Made with{" "}
              <FaHeart className="inline text-[#800020] mx-1" /> by Alumni, for
              Alumni.
            </p>
            
            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-[#DAA520] hover:text-[#FDF5E6] transition-colors font-body text-sm"
            >
              <span>Back to Top</span>
              <span className="w-8 h-8 rounded-full bg-[#5D3A1A] flex items-center justify-center">
                <HiChevronUp className="text-lg" />
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#B8860B]/20 m-4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#B8860B]/20 m-4 pointer-events-none" />
    </footer>
  );
};

export default Footer;
