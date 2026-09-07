import { useState, useEffect, useMemo } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { personalInfo } from "../../data/portfolioData";
import { usePortfolio } from "../../Context/PortfolioContext";
import {
  FaSave,
  FaCloudUploadAlt,
  FaPlus,
  FaTrash,
  FaTimes,
  FaLayerGroup,
  FaChartLine,
} from "react-icons/fa";

const ProfileTab = () => {
  const { skills, refreshData } = usePortfolio();
  const [profile, setProfile] = useState({
    name: personalInfo.name,
    title: personalInfo.title,
    roleSubtext: personalInfo.roleSubtext,
    bio: personalInfo.bio,
    availability: personalInfo.availability,
    location: personalInfo.location,
    email: personalInfo.email,
    github: personalInfo.github,
    linkedin: personalInfo.linkedin,
    resumeUrl: personalInfo.resumeUrl,
    photoUrl: "",
    metrics: [],
    coreEcosystem: [],
  });
  const [newTechInput, setNewTechInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "content", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile((prev) => ({
            ...prev,
            ...data,
            metrics: Array.isArray(data.metrics) ? data.metrics : [],
            coreEcosystem: Array.isArray(data.coreEcosystem)
              ? data.coreEcosystem
              : typeof data.coreEcosystem === "string"
              ? data.coreEcosystem
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          }));
        }
      } catch {
        // silent error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Available skills in database not yet in Core Technical Ecosystem
  const unselectedSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    const existing = new Set(
      (profile.coreEcosystem || []).map((s) => s.toLowerCase().trim())
    );
    const result = [];
    skills.forEach((cat) => {
      if (cat.skills && Array.isArray(cat.skills)) {
        cat.skills.forEach((s) => {
          if (s.name && !existing.has(s.name.toLowerCase().trim()) && !result.includes(s.name)) {
            result.push(s.name);
          }
        });
      } else if (cat.name && !existing.has(cat.name.toLowerCase().trim()) && !result.includes(cat.name)) {
        result.push(cat.name);
      }
    });
    return result;
  }, [skills, profile.coreEcosystem]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // --- Metrics handlers ---
  const handleAddMetric = () => {
    const updated = [
      ...(profile.metrics || []),
      { value: "", label: "", detail: "" },
    ];
    setProfile({ ...profile, metrics: updated });
  };

  const handleMetricChange = (index, field, value) => {
    const updated = [...(profile.metrics || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, metrics: updated });
  };

  const handleDeleteMetric = (index) => {
    const updated = (profile.metrics || []).filter((_, idx) => idx !== index);
    setProfile({ ...profile, metrics: updated });
  };

  // --- Core Technical Ecosystem handlers ---
  const handleAddEcosystemTech = (e) => {
    e?.preventDefault?.();
    if (!newTechInput.trim()) return;

    const items = newTechInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const current = [...(profile.coreEcosystem || [])];
    items.forEach((item) => {
      if (!current.some((c) => c.toLowerCase() === item.toLowerCase())) {
        current.push(item);
      }
    });

    setProfile({ ...profile, coreEcosystem: current });
    setNewTechInput("");
  };

  const handleQuickAddSkill = (skillName) => {
    const current = [...(profile.coreEcosystem || [])];
    if (!current.some((c) => c.toLowerCase() === skillName.toLowerCase())) {
      current.push(skillName);
      setProfile({ ...profile, coreEcosystem: current });
    }
  };

  const handleRemoveEcosystemTech = (techToRemove) => {
    const updated = (profile.coreEcosystem || []).filter(
      (tech) => tech !== techToRemove
    );
    setProfile({ ...profile, coreEcosystem: updated });
  };

  const handleClearEcosystem = () => {
    setProfile({ ...profile, coreEcosystem: [] });
  };

  // --- File Upload ---
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setProfile((prev) => ({ ...prev, [field]: url }));
        toast.success("Uploaded successfully!");
      }
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // --- Save Profile ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "content", "profile"), {
        ...profile,
        metrics: profile.metrics || [],
        coreEcosystem: profile.coreEcosystem || [],
        updatedAt: new Date().toISOString(),
      });
      if (refreshData) await refreshData();
      toast.success("Profile, metrics & ecosystem saved successfully!");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white font-display">Profile & Brand Identity</h3>
        <p className="text-xs text-slate-400 mt-1">
          Customize your bio, availability, performance metrics, and homepage technical ecosystem. Everything is synced live to your portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Core Identity */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            1. Core Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Primary Role Title
              </label>
              <input
                name="title"
                value={profile.title || ""}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Specializations Subtext
              </label>
              <input
                name="roleSubtext"
                value={profile.roleSubtext || ""}
                onChange={handleChange}
                placeholder="Distributed Systems • React / Next.js • Node.js • PostgreSQL"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Availability Badge Status
              </label>
              <input
                name="availability"
                value={profile.availability || ""}
                onChange={handleChange}
                placeholder="Available for Full-time Roles & Contracts"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              Professional Narrative / Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              rows="4"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* 2. Contact & Social Channels */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            2. Communication & Social Channels
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Primary Email
              </label>
              <input
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                GitHub Profile URL
              </label>
              <input
                name="github"
                value={profile.github || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                name="linkedin"
                value={profile.linkedin || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* 3. Media Uploads */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            3. Photo & Resume Documents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FaCloudUploadAlt className="text-indigo-400" /> Profile Photo (Upload or URL)
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="photoUrl"
                  value={profile.photoUrl || ""}
                  onChange={handleChange}
                  placeholder="https://... or choose file below"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "photoUrl")}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>
              {profile.photoUrl && (
                <img
                  src={profile.photoUrl}
                  alt="Avatar Preview"
                  className="h-16 w-16 rounded-xl object-cover mt-2 border border-slate-700 shadow-md"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FaCloudUploadAlt className="text-emerald-400" /> Resume / CV (Upload or URL)
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="resumeUrl"
                  value={profile.resumeUrl || ""}
                  onChange={handleChange}
                  placeholder="https://... or choose file below"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, "resumeUrl")}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                />
              </div>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 text-xs mt-2 inline-block font-mono underline"
                >
                  View Stored Resume Link ➔
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 4. PERFORMANCE PROOF METRICS (ADD / EDIT / DELETE) */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <FaChartLine /> 4. Performance Proof Metrics (Hero Section)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit, or remove metrics displayed on the home page hero. Leave empty if you do not want to show metrics.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMetric}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <FaPlus className="text-xs" /> Add Metric Card
            </button>
          </div>

          {(profile.metrics || []).length === 0 ? (
            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-300">
                No performance metrics added yet.
              </p>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Click &quot;Add Metric Card&quot; above to add stats like &quot;4+ Years Experience&quot; or &quot;20+ Systems Deployed&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(profile.metrics || []).map((metric, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-slate-850">
                    <span>Metric #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMetric(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Delete metric"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-0.5">
                      Stat Value (e.g. 4+, 20+)
                    </label>
                    <input
                      value={metric.value || ""}
                      onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                      placeholder="e.g. 4+"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-indigo-400 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-0.5">
                      Primary Label
                    </label>
                    <input
                      value={metric.label || ""}
                      onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                      placeholder="e.g. Years Experience"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-0.5">
                      Supporting Detail
                    </label>
                    <input
                      value={metric.detail || ""}
                      onChange={(e) => handleMetricChange(idx, "detail", e.target.value)}
                      placeholder="e.g. Production development"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. CORE TECHNICAL ECOSYSTEM (HOME HERO TECH STACK) */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <FaLayerGroup /> 5. Core Technical Ecosystem (Hero Chips)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Explicit technologies highlighted under the home page hero banner. Type individual or comma-separated items.
              </p>
            </div>
            {(profile.coreEcosystem || []).length > 0 && (
              <button
                type="button"
                onClick={handleClearEcosystem}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono self-start sm:self-auto hover:underline cursor-pointer"
              >
                Clear All Chips
              </button>
            )}
          </div>

          {/* Type to Add */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTechInput}
              onChange={(e) => setNewTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddEcosystemTech();
                }
              }}
              placeholder="Type tech name or comma-separated list (e.g. Vite, React, Node.js, Express.js, AWS, MongoDB, SQL)"
              className="flex-grow px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="button"
              onClick={handleAddEcosystemTech}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5"
            >
              <FaPlus className="text-xs" /> Add
            </button>
          </div>

          {/* Active Chips in Ecosystem */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-mono text-slate-400">
              Active Ecosystem Technologies ({(profile.coreEcosystem || []).length}):
            </div>

            {(profile.coreEcosystem || []).length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No ecosystem technologies added. Type technologies above or click quick-add suggestions below to feature them on the homepage.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(profile.coreEcosystem || []).map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEcosystemTech(tech)}
                      className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title={`Remove ${tech}`}
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick-add suggestions from published skills */}
          {unselectedSkills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-500">
                Click published skills to quick-add:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {unselectedSkills.map((skillName) => (
                  <button
                    type="button"
                    key={skillName}
                    onClick={() => handleQuickAddSkill(skillName)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    + {skillName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          <FaSave className="text-xs" />
          {loading ? "Saving Profile..." : "Save Profile, Metrics & Ecosystem"}
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;

