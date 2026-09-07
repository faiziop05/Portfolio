import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCogs,
  FaLightbulb,
  FaServer,
  FaDatabase,
  FaLaptopCode,
} from "react-icons/fa";

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    project?.imageUrls && project.imageUrls.length > 0
      ? project.imageUrls
      : project?.imageUrl
      ? [project.imageUrl]
      : [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === "ArrowLeft" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, images.length]);

  if (!project) return null;

  const nextImage = (e) => {
    e?.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950 hover:bg-rose-600 rounded-full text-slate-300 hover:text-white border border-slate-750 transition-colors shadow-lg cursor-pointer"
            aria-label="Close case study"
          >
            <FaTimes className="text-sm" />
          </button>

          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider border border-slate-700">
                  {project.category || "Full Stack Case Study"}
                </span>
                {project.date && (
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(project.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {project.title}
              </h2>
            </div>

            {/* Quick Demo & Github links */}
            <div className="flex items-center gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-105"
                >
                  <FaExternalLinkAlt className="text-[10px]" /> Live Application
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                >
                  <FaGithub /> Repository
                </a>
              )}
            </div>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
            {/* Gallery Area */}
            {images.length > 0 && (
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[260px] md:min-h-[380px] group">
                <img
                  src={images[currentImageIndex]}
                  alt={project.title}
                  className="w-full max-h-[450px] object-contain"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 p-3 bg-slate-950/80 hover:bg-indigo-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 p-3 bg-slate-950/80 hover:bg-indigo-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FaChevronRight />
                    </button>
                    <div className="absolute bottom-3 flex gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-full border border-slate-800">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? "w-6 bg-indigo-500" : "w-2 bg-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Overview & Tech Stack */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Project Overview</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {project.longDescription || project.description || project.summary}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags &&
                  project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            {/* Architectural Breakdown Grid */}
            {project.architecture && (
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
                  <FaCogs /> Full-Stack System Architecture
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase text-[11px]">
                      <FaLaptopCode /> Client Layer
                    </div>
                    <div className="text-slate-300 font-sans text-xs">
                      {project.architecture.client}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase text-[11px]">
                      <FaServer /> API & Services
                    </div>
                    <div className="text-slate-300 font-sans text-xs">
                      {project.architecture.api}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[11px]">
                      <FaDatabase /> Data & Caching
                    </div>
                    <div className="text-slate-300 font-sans text-xs">
                      {project.architecture.database}
                    </div>
                  </div>
                </div>

                {project.architecture.highlights && (
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                    {project.architecture.highlights.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-slate-900 text-emerald-400 text-xs font-mono border border-slate-800"
                      >
                        ✔ {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Engineering Challenges & Solutions */}
            {project.challenges && project.challenges.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
                  <FaLightbulb /> Engineering Challenges & Solutions
                </div>

                <div className="space-y-3">
                  {project.challenges.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-sm"
                    >
                      <div className="text-rose-300 font-medium">
                        <span className="font-mono text-xs font-bold uppercase bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-800/60 mr-2">
                          Constraint
                        </span>
                        {item.problem}
                      </div>
                      <div className="text-emerald-300">
                        <span className="font-mono text-xs font-bold uppercase bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/60 mr-2">
                          Resolution
                        </span>
                        {item.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;

