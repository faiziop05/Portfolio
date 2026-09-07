import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import CommandMenu from "./CommandMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { usePortfolio } from "../Context/PortfolioContext";

const Layout = ({ children }) => {
  const { profile } = usePortfolio();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "FH";

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 relative overflow-x-hidden flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        onOpenCommandMenu={() => setIsCommandOpen(true)}
      />

      {/* Global Spotlight Search Modal */}
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={setIsCommandOpen}
      />

      {/* Main Page Content */}
      <main className="relative z-10 flex-grow pt-24 pb-16">
        {children}
      </main>

      {/* Modern Engineering Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#070b14]">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Identity */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-display font-bold text-white text-sm shadow-md">
                  {initials}
                </div>
                <span className="font-display font-bold text-white text-lg">
                  {profile?.name || "Faizan Hanif"}
                </span>
              </div>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                Full-Stack Software Engineer building high-performance web platforms, scalable backend services, and responsive user interfaces.
              </p>
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href={profile?.github || "https://github.com/faiziop05"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href={profile?.linkedin || "https://linkedin.com/in/faizanhanif"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={`mailto:${profile?.email || "faizanhanif577@gmail.com"}`}
                  className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link to="/" className="hover:text-indigo-400 transition-colors">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="hover:text-indigo-400 transition-colors">
                    Projects & Case Studies
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-indigo-400 transition-colors">
                    Skills & Experience
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsCommandOpen(true)}
                    className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                  >
                    Command Palette (⌘K)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Status */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold mb-4">
                Status
              </h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{profile?.availability || "Available for Opportunities"}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Based in {profile?.location || "Remote"}.
                </p>
                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-block px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition-all"
                  >
                    Get in Touch ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} {profile?.name || "Faizan Hanif"}. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Crafted with React, Node & Tailwind</span>
              <Link to="/admin" className="hover:text-slate-400 transition-colors text-[11px]">
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Notifications */}
      <ToastContainer
        theme="dark"
        position="bottom-right"
        toastClassName="!bg-slate-900 !border !border-slate-800 !text-slate-200 !rounded-xl !shadow-2xl"
      />
    </div>
  );
};

export default Layout;
