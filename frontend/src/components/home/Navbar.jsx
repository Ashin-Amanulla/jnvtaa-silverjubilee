import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "#home" },
    { name: "Event Details", path: "#event-details" },
    { name: "Timeline", path: "#journey" },
    { name: "Gallery", path: "#gallery" },
    { name: "Sponsors", path: "#sponsors" },
    { name: "FAQ", path: "#faq" },
  ];

  const handleLinkClick = (e, path) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo.png"
                alt="JNVTA Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full  object-cover relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-heading font-bold text-xl sm:text-2xl leading-none ${
                  isScrolled ? "text-[#1A237E]" : "text-[#1A237E]"
              }`}>
                JNV Trivandrum
              </span>
              <span className="text-[0.65rem] sm:text-xs tracking-widest uppercase text-[#D4AF37] font-semibold">
                Alumni Association
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <div className={`px-2 py-1.5 rounded-full flex items-center gap-1 transition-all duration-300 ${
                isScrolled ? "bg-gray-100/50" : "bg-white/30 backdrop-blur-md border border-white/40 shadow-sm"
            }`}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-[#1A237E] hover:bg-white transition-all duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <Link to="/register" className="ml-4">
               <button className="px-6 py-2.5 rounded-full bg-[#1A237E] text-white text-sm font-semibold shadow-md hover:bg-[#3949AB] hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                 Register Now
               </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#1A237E] p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className="block text-slate-700 hover:text-[#1A237E] font-medium text-lg px-2 py-1"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full btn-primary text-center">
                    Register Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
