import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  // Use array if exists, fallback to single image, or empty array
  const images =
    project.imageUrls && project.imageUrls.length > 0
      ? project.imageUrls
      : project.imageUrl
        ? [project.imageUrl]
        : [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()} // Prevent close on modal click
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition"
          >
            <FaTimes />
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative group min-h-[300px]">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={project.title}
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 p-3 bg-black/50 hover:bg-primary/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 p-3 bg-black/50 hover:bg-primary/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaChevronRight />
                    </button>
                    <div className="absolute bottom-4 flex gap-2">
                      {images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 w-2 rounded-full transition-colors ${idx === currentImageIndex ? "bg-primary" : "bg-white/30"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-slate-500">No Images</div>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-2/5 p-8 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {project.title}
            </h2>

            {project.date && (
              <span className="text-sm text-slate-400 mb-4 block">
                Completed:{" "}
                {new Date(project.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags &&
                project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-800 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 mb-8">
              <p className="whitespace-pre-wrap">
                {project.longDescription || project.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-indigo-600 text-white py-3 rounded-lg font-bold transition"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition border border-slate-700"
                >
                  <FaGithub /> View Code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
