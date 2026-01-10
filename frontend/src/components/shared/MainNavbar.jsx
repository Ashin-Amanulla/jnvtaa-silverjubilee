import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";

const MainNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setEventsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { 
      name: "Events", 
      path: "/events",
      hasDropdown: true,
      subItems: [
        { name: "All Events", path: "/events" },
        { name: "🎉 Silver Jubilee 2026", path: "/events/silver-jubilee", featured: true },
      ]
    },
    { name: "News", path: "/news" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
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
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover relative z-10"
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
                <div key={link.name} className="relative">
                  {link.hasDropdown ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setEventsOpen(true)}
                      onMouseLeave={() => setEventsOpen(false)}
                    >
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                          isActive(link.path) 
                            ? "text-[#1A237E] bg-white" 
                            : "text-slate-700 hover:text-[#1A237E] hover:bg-white"
                        }`}
                      >
                        {link.name}
                        <HiChevronDown className={`transition-transform ${eventsOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {/* Dropdown */}
                      <AnimatePresence>
                        {eventsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                          >
                            {link.subItems.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-4 py-3 text-sm transition-colors ${
                                  item.featured 
                                    ? "bg-gradient-to-r from-[#1A237E] to-[#3949AB] text-white hover:from-[#3949AB] hover:to-[#1A237E]" 
                                    : "text-slate-700 hover:bg-[#FDF4E6] hover:text-[#1A237E]"
                                }`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive(link.path) 
                          ? "text-[#1A237E] bg-white" 
                          : "text-slate-700 hover:text-[#1A237E] hover:bg-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            <Link to="/register" className="ml-4">
               <button className="px-6 py-2.5 rounded-full bg-[#1A237E] text-white text-sm font-semibold shadow-md hover:bg-[#3949AB] hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                 Register for Silver Jubilee
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
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setEventsOpen(!eventsOpen)}
                        className="w-full flex items-center justify-between text-slate-700 hover:text-[#1A237E] font-medium text-lg px-2 py-2"
                      >
                        {link.name}
                        <HiChevronDown className={`transition-transform ${eventsOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {eventsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1"
                          >
                            {link.subItems.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-3 py-2 rounded-lg text-base ${
                                  item.featured 
                                    ? "bg-[#1A237E] text-white" 
                                    : "text-slate-600 hover:bg-[#FDF4E6]"
                                }`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block text-lg px-2 py-2 rounded-lg transition-colors ${
                        isActive(link.path)
                          ? "text-[#1A237E] bg-[#FDF4E6] font-semibold"
                          : "text-slate-700 hover:text-[#1A237E] font-medium"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <Link to="/register">
                  <button className="w-full btn-primary text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                    Register for Silver Jubilee
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

export default MainNavbar;
