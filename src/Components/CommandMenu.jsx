import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTerminal,
  FaFolderOpen,
  FaTools,
  FaBriefcase,
  FaEnvelope,
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaCopy,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { usePortfolio } from "../Context/PortfolioContext";

const CommandMenu = ({ isOpen, onClose, onOpenTerminal }) => {
  const { profile } = usePortfolio();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "projects",
      title: "Explore Full-Stack Projects",
      subtitle: "Production case studies, architecture, demos",
      icon: <FaFolderOpen className="text-primary-light" />,
      action: () => {
        navigate("/projects");
        onClose(false);
      },
    },
    {
      id: "terminal",
      title: "Open Interactive CLI Terminal",
      subtitle: "Execute developer commands & easter eggs",
      icon: <FaTerminal className="text-accent-emerald" />,
      action: () => {
        onClose(false);
        if (onOpenTerminal) onOpenTerminal();
        else {
          navigate("/");
          setTimeout(() => {
            document.getElementById("terminal-section")?.scrollIntoView({ behavior: "smooth" });
          }, 200);
        }
      },
    },
    {
      id: "skills",
      title: "View Technical Skills Matrix",
      subtitle: "Frontend, Backend, Databases, Cloud & DevOps",
      icon: <FaTools className="text-accent-cyan" />,
      action: () => {
        navigate("/about");
        onClose(false);
      },
    },
    {
      id: "experience",
      title: "Career Milestones & Experience",
      subtitle: "Timeline of engineering contributions",
      icon: <FaBriefcase className="text-secondary-light" />,
      action: () => {
        navigate("/about");
        onClose(false);
      },
    },
    {
      id: "contact",
      title: "Get In Touch",
      subtitle: "Send a message or proposal",
      icon: <FaEnvelope className="text-accent-amber" />,
      action: () => {
        navigate("/contact");
        onClose(false);
      },
    },
    {
      id: "copy-email",
      title: "Copy Email Address",
      subtitle: profile?.email || "faizanhanif577@gmail.com",
      icon: <FaCopy className="text-primary-light" />,
      action: () => {
        const email = profile?.email || "faizanhanif577@gmail.com";
        navigator.clipboard.writeText(email);
        toast.success("Email copied to clipboard!");
        onClose(false);
      },
    },
    {
      id: "github",
      title: "Open GitHub Profile",
      subtitle: profile?.github || "https://github.com/faiziop05",
      icon: <FaGithub className="text-slate-300" />,
      action: () => {
        window.open(profile?.github || "https://github.com/faiziop05", "_blank");
        onClose(false);
      },
    },
  ];

  const filteredActions = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose(false)}
          className="fixed inset-0 bg-black/75"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header & Search Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
            <FaSearch className="text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sections, projects, commands... (Esc to close)"
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => onClose(false)}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm group-hover:scale-105 transition-transform text-indigo-400">
                      {action.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {action.title}
                      </div>
                      <div className="text-xs text-slate-400">{action.subtitle}</div>
                    </div>
                  </div>
                  <FaExternalLinkAlt className="text-xs text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </button>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                No matching actions found.
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Navigate with keyboard or click</span>
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono text-[10px]">ESC</span>
              <span>to exit</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandMenu;
