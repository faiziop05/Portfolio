import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../Context/PortfolioContext";
import ProjectModal from "../Components/ProjectModal";
import {
  FaSearch,
  FaExternalLinkAlt,
  FaGithub,
  FaCogs,
  FaLayerGroup,
} from "react-icons/fa";

const categories = [
  "All Systems",
  "Full Stack",
  "Real-Time & AI",
  "Microservices & APIs",
  "Frontend Architecture",
];

const Projects = () => {
  const { projects: projectsList } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState("All Systems");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projectsList.filter((project) => {
    const matchesCategory =
      selectedCategory === "All Systems" || project.category === selectedCategory;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.summary?.toLowerCase().includes(query) ||
      project.tags?.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider">
          <FaLayerGroup /> Production Systems & Apps
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Featured Projects & Architecture
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Case studies showcasing system design trade-offs, backend workflows, resilient database schemas, and frontend engineering across real applications.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white font-semibold shadow-md"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 border border-slate-700/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tech or name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedProject(project)}
              className="bg-slate-900 rounded-2xl overflow-hidden cursor-pointer flex flex-col group border border-slate-800 relative hover:border-slate-700 shadow-xl transition-all"
            >
              {/* Media Area */}
              <div className="relative h-56 overflow-hidden bg-slate-950">
                {project.imageUrls?.[0] || project.imageUrl ? (
                  <img
                    src={project.imageUrls?.[0] || project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                    No Preview Available
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-200 border border-slate-700 text-[11px] font-mono font-semibold">
                    {project.category || "Full Stack"}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-700 text-[10px] font-mono font-semibold">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                </div>

                <p className="text-slate-400 text-xs md:text-sm line-clamp-3 leading-relaxed flex-grow">
                  {project.summary || project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/70 text-[11px] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-indigo-400 group-hover:underline flex items-center gap-1.5">
                    <FaCogs className="text-slate-500 text-xs" /> System Architecture ➔
                  </span>

                  <div className="flex items-center gap-3 text-slate-400">
                    {project.githubUrl && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.githubUrl, "_blank");
                        }}
                        className="hover:text-white p-1"
                        title="GitHub Code"
                      >
                        <FaGithub />
                      </span>
                    )}
                    {project.liveUrl && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.liveUrl, "_blank");
                        }}
                        className="hover:text-white p-1"
                        title="Live App"
                      >
                        <FaExternalLinkAlt className="text-[11px]" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
          <p className="text-lg text-slate-300 font-semibold">No systems found matching your criteria.</p>
          <p className="text-sm text-slate-500">
            Try adjusting your search query or selecting &quot;All Systems&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Systems");
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg mt-2 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Projects;

