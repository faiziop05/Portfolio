import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaSearch, FaGithub, FaLinkedin } from "react-icons/fa";
import { usePortfolio } from "../Context/PortfolioContext";

const Navbar = ({ onOpenCommandMenu }) => {
  const { profile } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "FH";

  const links = [
    { name: "Overview", path: "/" },
    { name: "Projects & Systems", path: "/projects" },
    { name: "Architecture & Bio", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0f1d] border-b border-slate-800 py-3 shadow-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Brand Logo & Live Status */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-display font-bold text-white text-sm shadow-md">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white tracking-tight text-base group-hover:text-indigo-400 transition-colors">
                {profile?.name || "Faizan Hanif"}
              </span>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {profile?.availability ? "Available for roles" : "Full-Stack Engineer"}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-900 p-1.5 rounded-full border border-slate-800">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Controls (Cmd+K, GitHub, Contact) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Cmd + K Search Trigger */}
          <button
            onClick={() => onOpenCommandMenu?.(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 text-xs transition-all hover:border-slate-600 cursor-pointer"
            title="Search or Jump to section (Cmd + K)"
          >
            <FaSearch className="text-[11px]" />
            <span className="hidden xl:inline text-slate-300">Search</span>
            <kbd className="font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Social Icons */}
          <a
            href={profile?.github || "https://github.com/faiziop05"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 hover:text-white text-xs transition-all"
            title="GitHub Profile"
          >
            <FaGithub className="text-sm" />
          </a>

          {/* Contact Me CTA */}
          <Link
            to="/contact"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-105"
          >
            Let&apos;s Talk
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => onOpenCommandMenu?.(true)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            aria-label="Open Search"
          >
            <FaSearch className="text-sm" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xl text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-slate-800"
          >
            <div className="flex flex-col space-y-3 px-6 py-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium py-2 border-b border-slate-850 transition-colors ${
                    location.pathname === link.path ? "text-indigo-400 font-bold" : "text-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <a
                    href={profile?.github || "https://github.com/faiziop05"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-850 text-white border border-slate-750"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={profile?.linkedin || "https://linkedin.com/in/faizanhanif"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-850 text-white border border-slate-750"
                  >
                    <FaLinkedin />
                  </a>
                </div>

                <Link
                  to="/contact"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Contact Me
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

