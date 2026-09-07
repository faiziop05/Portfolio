import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaShieldAlt,
  FaDatabase,
  FaLayerGroup,
} from "react-icons/fa";
import { usePortfolio } from "../Context/PortfolioContext";
import { engineeringPhilosophy } from "../data/portfolioData";
import ProjectModal from "../Components/ProjectModal";

const philosophyIcons = {
  bolt: FaBolt,
  shield: FaShieldAlt,
  database: FaDatabase,
};

const Home = () => {
  const { profile, projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState(null);

  // Featured projects
  const displayProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const featured = projects.filter((p) => p.featured);
    return featured.length > 0 ? featured.slice(0, 3) : projects.slice(0, 3);
  }, [projects]);

  const metrics = profile?.metrics || [];

  // Core Technical Ecosystem explicitly added by Admin (or fallback to dynamic skills from Admin)
  const coreEcosystem = useMemo(() => {
    if (
      profile?.coreEcosystem &&
      Array.isArray(profile.coreEcosystem) &&
      profile.coreEcosystem.length > 0
    ) {
      return profile.coreEcosystem;
    }
    if (
      typeof profile?.coreEcosystem === "string" &&
      profile.coreEcosystem.trim().length > 0
    ) {
      return profile.coreEcosystem
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [profile?.coreEcosystem]);

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-4 md:px-8 pt-6 md:pt-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Availability Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{profile?.availability || "Available for Opportunities"}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-white leading-[1.1]">
              Hi, I&apos;m <span className="text-white">{profile?.name || "Faizan Hanif"}</span>.
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-indigo-400">
              {profile?.title || "Full-Stack Software Engineer"}
            </p>
            {profile?.roleSubtext && (
              <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-xl mx-auto pt-1">
                {profile.roleSubtext}
              </p>
            )}
          </motion.div>

          {/* Subtitle Bio */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {profile?.bio}
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Explore Systems & Case Studies <FaArrowRight className="text-xs" />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition-all hover:border-slate-600 active:scale-95"
            >
              Skills Matrix & Bio
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
            >
              Get in Touch ➔
            </Link>
          </motion.div>

          {/* Key Proof Metrics (Dynamically added from Admin) */}
          {metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`grid gap-3 pt-6 ${
                metrics.length === 1
                  ? "grid-cols-1 max-w-xs mx-auto"
                  : metrics.length === 2
                  ? "grid-cols-2 max-w-md mx-auto"
                  : metrics.length === 3
                  ? "grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto"
                  : "grid-cols-2 md:grid-cols-4"
              }`}
            >
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">{metric.label}</div>
                  {metric.detail && (
                    <div className="text-[11px] text-slate-400 mt-0.5">{metric.detail}</div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Core Technical Ecosystem (Dynamically added from Admin) */}
          {coreEcosystem.length > 0 && (
            <div className="pt-6">
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-mono mb-3">
                Core Technical Ecosystem
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                {coreEcosystem.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-slate-800/90 border border-slate-700 text-slate-200 text-xs rounded-full font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. FEATURED SYSTEMS & PRODUCTION CASE STUDIES */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
              <FaLayerGroup /> Production Systems
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Architectural Case Studies
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl">
              Engineered for throughput, data consistency, and user satisfaction. Click any project to inspect system design trade-offs and code.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors self-start md:self-auto"
          >
            View All Projects <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedProject(project)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden cursor-pointer flex flex-col group transition-all"
            >
              {/* Media Preview Area */}
              <div className="relative h-52 overflow-hidden bg-slate-950">
                <img
                  src={project.imageUrls?.[0] || project.imageUrl || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700 text-[11px] font-mono font-semibold">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-700 text-[10px] font-mono font-semibold">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-6 flex flex-col flex-grow space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm line-clamp-2 leading-relaxed flex-grow">
                  {project.summary || project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags?.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 text-[11px] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags?.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-indigo-400 group-hover:underline flex items-center gap-1">
                    Inspect Architecture ➔
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Production</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. ENGINEERING PHILOSOPHY */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            Engineering Principles
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            How I Approach Software Systems
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Clean boundaries, observable metrics, and production reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engineeringPhilosophy.map((phil, idx) => {
            const Icon = philosophyIcons[phil.icon] || FaBolt;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 text-base mb-4">
                  <Icon />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{phil.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {phil.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CALL TO ACTION & CONNECT */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-14 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-mono font-semibold">
              Ready to collaborate
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Let&apos;s Build Exceptional Full-Stack Products.
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Whether you need a dedicated senior engineer to architect your backend or build a responsive modern web application, I&apos;m ready to bring your vision to production.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
              >
                Send a Message
              </Link>
              <a
                href={`mailto:${profile?.email || "faizan@example.com"}`}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
              >
                Email Direct ({profile?.email || "faizan@example.com"})
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project Case Study Dialog */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Home;
