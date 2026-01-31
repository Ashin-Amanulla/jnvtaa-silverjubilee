import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";

const MainNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "News", path: "/news" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[var(--color-bg-primary)]/95 backdrop-blur-xl py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container-asymmetric">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="/logo.png"
                  alt="JNVTA Logo"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-accent-coral)] relative z-10"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display text-xl tracking-wider text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-coral)] transition-colors">
                  JNV TRIVANDRUM
                </span>
                <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[var(--color-accent-coral)]">
                  Alumni Association
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group"
                >
                  <span
                    className={`font-display text-sm tracking-wider transition-colors ${
                      isActive(link.path)
                        ? "text-[var(--color-accent-coral)]"
                        : "text-[var(--color-text-primary)] hover:text-[var(--color-accent-coral)]"
                    }`}
                  >
                    {link.name.toUpperCase()}
                  </span>
                  {/* Underline indicator */}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-[var(--color-accent-coral)]"
                    initial={{ width: 0 }}
                    animate={{ width: isActive(link.path) ? "100%" : 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}

              {/* CTA Button */}
              <Link to="/events">
                <motion.button
                  className="btn-primary btn-pill text-sm py-3 px-6"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>25TH YEAR</span>
                  <FaArrowRight className="text-xs" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center text-[var(--color-text-primary)] border border-[var(--color-text-primary)]/20 hover:border-[var(--color-accent-coral)] hover:text-[var(--color-accent-coral)] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--color-bg-primary)] lg:hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full border border-[var(--color-accent-coral)]/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-[20%] left-[10%] w-48 h-48 rounded-full bg-[var(--color-accent-cyan)]/5 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>

            <div className="relative h-full flex flex-col justify-center px-8 pt-24">
              {/* Nav Links */}
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className="group block py-3"
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-[var(--color-text-muted)] font-display text-sm">
                          0{index + 1}
                        </span>
                        <span
                          className={`font-display text-4xl sm:text-5xl tracking-wide transition-colors ${
                            isActive(link.path)
                              ? "text-[var(--color-accent-coral)]"
                              : "text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-coral)]"
                          }`}
                        >
                          {link.name.toUpperCase()}
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <Link to="/events">
                  <button className="btn-primary w-full justify-center">
                    <span>VIEW 25TH YEAR EVENTS</span>
                    <FaArrowRight />
                  </button>
                </Link>
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-[var(--color-text-muted)] text-sm"
              >
                <span className="font-display tracking-wider">
                  JNVTAA © 2026
                </span>
                <span className="font-display tracking-wider">
                  SILVER JUBILEE
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainNavbar;
