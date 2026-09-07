import { motion } from "framer-motion";
import { usePortfolio } from "../Context/PortfolioContext";
import {
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaFileDownload,
  FaCheckCircle,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  const { profile, skills, experience, education } = usePortfolio();

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-24 max-w-6xl">
      {/* 1. ARCHITECTURAL BIO & PROFILE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Narrative */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider">
            Engineering Profile & Mindset
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Full-Stack Systems with Pragmatic Craft.
          </h1>

          <h2 className="text-lg sm:text-xl font-medium text-slate-300">
            {profile.title} &bull;{" "}
            <span className="text-indigo-400 font-mono text-base">
              {profile.roleSubtext || "React • Node.js • PostgreSQL • Redis"}
            </span>
          </h2>

          <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              I am <strong className="text-white">{profile.name}</strong>, a Full-Stack Software Engineer who bridges the gap between fluid interactive user experiences and resilient distributed server backends.
            </p>
            <p className="text-slate-400">
              My engineering philosophy revolves around simplicity, performance by default, and reliable data integrity. Whether handling concurrent race conditions in high-volume e-commerce checkout pipelines, building real-time WebSocket clusters, or profiling Core Web Vitals, I enjoy building software that endures.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md transition-all hover:scale-105"
            >
              <FaEnvelope /> Get In Touch
            </Link>

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                <FaFileDownload className="text-indigo-400" /> Curriculum Vitae (PDF)
              </a>
            )}
          </div>
        </motion.div>

        {/* Right Column: Visual Avatar & Stats Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 flex flex-col items-center"
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-3xl p-1 bg-slate-800 border border-slate-700 shadow-2xl">
            <div className="w-full h-full bg-slate-950 rounded-[22px] overflow-hidden relative">
              <img
                src={profile.photoUrl || profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
            </div>

            {/* Floating Status Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-xs font-mono text-slate-200 shadow-xl flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Full-Stack Engineering</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. CATEGORIZED SKILLS TAXONOMY */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
            Technical Stack
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Engineering Competencies
          </h2>
          <p className="text-slate-400 text-sm">
            Technologies and tools actively used in production environments.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-14 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
            <p className="text-sm font-semibold text-slate-300">
              No technical skills published yet.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Type and publish your skills live from the Admin Portal.
            </p>
            <Link
              to="/admin"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all mt-1"
            >
              Open Admin Portal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((category, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 text-base">
                    <FaCode />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.category}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {category.skills?.length} {category.skills?.length === 1 ? "competency" : "competencies"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {category.skills?.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between"
                    >
                      <span className="text-xs font-medium text-slate-200 truncate pr-1">
                        {skill.name}
                      </span>
                      {skill.level && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 flex-shrink-0">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. EXPERIENCE & CAREER ROADMAP */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
            Career Milestones
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Engineering Experience
          </h2>
          <p className="text-slate-400 text-sm">
            Chronological track record of high-impact shipping.
          </p>
        </div>

        <div className="space-y-6">
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaBriefcase className="text-indigo-400 text-base" /> {exp.role}
                  </h3>
                  <div className="text-slate-400 text-sm font-medium mt-1">
                    {exp.company}{" "}
                    {exp.type && (
                      <span className="text-xs font-mono text-slate-500">
                        &bull; {exp.type}
                      </span>
                    )}
                  </div>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-300 font-semibold">
                  {exp.period}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {exp.description}
              </p>

              {exp.achievements && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Key Outcomes:
                  </div>
                  <ul className="space-y-1.5">
                    {exp.achievements.map((item, aIdx) => (
                      <li key={aIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <FaCheckCircle className="text-emerald-400 text-xs mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exp.tech && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                  {exp.tech.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. EDUCATION & CERTIFICATIONS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            Academic Background
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Education & Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                  <FaGraduationCap className="text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                  <div className="text-xs text-indigo-400 font-medium">{edu.school}</div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500">{edu.period}</div>
              {edu.focus && (
                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                  <strong className="text-slate-300 font-medium">Focus:</strong> {edu.focus}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

