import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaEdit,
  FaTimes,
  FaPlus,
  FaSave,
  FaCogs,
  FaLightbulb,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { usePortfolio } from "../../Context/PortfolioContext";

const categories = [
  "Full Stack",
  "Real-Time & AI",
  "Microservices & APIs",
  "Frontend Architecture",
];

const emptyProject = {
  title: "",
  category: "Full Stack",
  featured: false,
  summary: "",
  description: "",
  imageUrls: [],
  tags: [],
  liveUrl: "",
  githubUrl: "",
  date: new Date().toISOString().split("T")[0],
  architecture: {
    client: "",
    api: "",
    database: "",
    highlights: [],
  },
  challenges: [{ problem: "", solution: "" }],
};

const ProjectsTab = () => {
  const { refreshData } = usePortfolio();
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(emptyProject);
  const [tagInput, setTagInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjects(
        querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArchChange = (field, value) => {
    setProject((prev) => ({
      ...prev,
      architecture: {
        ...(prev.architecture || {}),
        [field]: value,
      },
    }));
  };

  const handleChallengeChange = (index, field, value) => {
    const list = [...(project.challenges || [{ problem: "", solution: "" }])];
    list[index] = { ...list[index], [field]: value };
    setProject((prev) => ({ ...prev, challenges: list }));
  };

  const addChallenge = () => {
    setProject((prev) => ({
      ...prev,
      challenges: [...(prev.challenges || []), { problem: "", solution: "" }],
    }));
  };

  const removeChallenge = (index) => {
    setProject((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setProject({
      title: proj.title || "",
      category: proj.category || "Full Stack",
      featured: proj.featured || false,
      summary: proj.summary || "",
      description: proj.description || "",
      imageUrls: proj.imageUrls || (proj.imageUrl ? [proj.imageUrl] : []),
      tags: proj.tags || [],
      liveUrl: proj.liveUrl || "",
      githubUrl: proj.githubUrl || "",
      date: proj.date || "",
      architecture: proj.architecture || {
        client: "",
        api: "",
        database: "",
        highlights: [],
      },
      challenges: proj.challenges && proj.challenges.length > 0
        ? proj.challenges
        : [{ problem: "", solution: "" }],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setProject(emptyProject);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newUrls = [];

    for (const file of files) {
      try {
        const url = await uploadToCloudinary(file);
        if (url) newUrls.push(url);
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
      }
    }

    if (newUrls.length > 0) {
      setProject((prev) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...newUrls],
      }));
      toast.success(`${newUrls.length} images uploaded!`);
    }
    setUploading(false);
  };

  const addImageUrlDirectly = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setProject((prev) => ({
      ...prev,
      imageUrls: [...(prev.imageUrls || []), imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  const removeImage = (indexToRemove) => {
    setProject((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    if (!project.tags.includes(tagInput.trim())) {
      setProject((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddHighlight = (e) => {
    e.preventDefault();
    if (!highlightInput.trim()) return;
    const current = project.architecture?.highlights || [];
    if (!current.includes(highlightInput.trim())) {
      setProject((prev) => ({
        ...prev,
        architecture: {
          ...prev.architecture,
          highlights: [...current, highlightInput.trim()],
        },
      }));
    }
    setHighlightInput("");
  };

  const removeHighlight = (idx) => {
    setProject((prev) => ({
      ...prev,
      architecture: {
        ...prev.architecture,
        highlights: prev.architecture.highlights.filter((_, i) => i !== idx),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project.title) {
      toast.error("Please provide a project title.");
      return;
    }

    setLoading(true);
    try {
      const projectData = {
        ...project,
        imageUrl: project.imageUrls[0] || "",
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
        toast.success("Project updated!");
      } else {
        projectData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "projects"), projectData);
        toast.success("Project published!");
      }

      handleCancelEdit();
      await fetchProjects();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error saving project: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Project removed.");
      await fetchProjects();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error deleting project: " + error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editor Form */}
      <div className="bg-dark-850/80 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white">
              {editingId ? "Edit Architectural Case Study" : "Add Production Project"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add real systems, architectures, constraints, and demo URLs.
            </p>
          </div>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05]"
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title, Category, Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Project Title *
              </label>
              <input
                name="title"
                value={project.title}
                onChange={handleChange}
                required
                placeholder="e.g. OmniStore - Distributed E-Commerce Engine"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={project.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-sans"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                <input
                  type="checkbox"
                  name="featured"
                  checked={project.featured}
                  onChange={handleChange}
                  className="rounded bg-dark-900 border-white/20 text-primary focus:ring-0"
                />
                <span>Flagship (Home)</span>
              </label>
            </div>
          </div>

          {/* Summaries */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Short Card Summary (1-2 sentences) *
              </label>
              <input
                name="summary"
                value={project.summary}
                onChange={handleChange}
                required
                placeholder="Brief high-level summary displayed on preview cards..."
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Comprehensive Case Study Description
              </label>
              <textarea
                name="description"
                value={project.description}
                onChange={handleChange}
                rows="3"
                placeholder="Full system narrative, architectural decisions, and production metrics..."
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-sans resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Links & Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Live Application URL
              </label>
              <input
                name="liveUrl"
                value={project.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                name="githubUrl"
                value={project.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Completion Date
              </label>
              <input
                type="date"
                name="date"
                value={project.date}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-sans"
              />
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="p-4 bg-dark-900/60 rounded-xl border border-white/5 space-y-2">
            <label className="block text-xs font-mono font-medium text-slate-300">
              Tech Stack Tags
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. React, Node.js, Redis, Docker"
                className="flex-grow px-3 py-1.5 bg-dark-950 border border-white/10 rounded-lg text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-1.5 bg-white/[0.08] hover:bg-primary text-white text-xs font-semibold rounded-lg"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded bg-dark-800 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-rose-400 hover:text-white"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Uploads */}
          <div className="p-4 bg-dark-900/60 rounded-xl border border-white/5 space-y-3">
            <label className="block text-xs font-mono font-medium text-slate-300 flex items-center gap-2">
              <FaCloudUploadAlt className="text-primary-light" /> Project Images (First image is card cover)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white cursor-pointer"
              />
              <div className="flex gap-2 w-full sm:w-auto flex-grow">
                <input
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste image URL directly..."
                  className="px-3 py-1.5 bg-dark-950 border border-white/10 rounded-lg text-xs text-white flex-grow"
                />
                <button
                  type="button"
                  onClick={addImageUrlDirectly}
                  className="px-3 py-1.5 bg-white/[0.08] hover:bg-primary text-white text-xs font-semibold rounded-lg"
                >
                  Add URL
                </button>
              </div>
            </div>

            {uploading && (
              <span className="text-xs text-primary-light font-mono animate-pulse block">
                Uploading to Cloudinary...
              </span>
            )}

            {/* Gallery Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {project.imageUrls?.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 bg-dark-950 h-20">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded p-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Full-Stack Architecture Breakdown */}
          <div className="p-4 bg-dark-900/80 rounded-xl border border-primary/20 space-y-3">
            <div className="flex items-center gap-2 text-primary-light font-mono text-xs font-bold uppercase tracking-wider">
              <FaCogs /> Full-Stack System Architecture Layers
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Client Architecture
                </label>
                <input
                  value={project.architecture?.client || ""}
                  onChange={(e) => handleArchChange("client", e.target.value)}
                  placeholder="e.g. React 18 with Zustand state..."
                  className="w-full px-3 py-1.5 bg-dark-950 border border-white/10 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  API & Microservices Layer
                </label>
                <input
                  value={project.architecture?.api || ""}
                  onChange={(e) => handleArchChange("api", e.target.value)}
                  placeholder="e.g. Node/Express with Redis rate limiting..."
                  className="w-full px-3 py-1.5 bg-dark-950 border border-white/10 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Data & Caching Storage
                </label>
                <input
                  value={project.architecture?.database || ""}
                  onChange={(e) => handleArchChange("database", e.target.value)}
                  placeholder="e.g. PostgreSQL with Redis in-memory cache..."
                  className="w-full px-3 py-1.5 bg-dark-950 border border-white/10 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="pt-2">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Architecture Metric Highlights
              </label>
              <div className="flex gap-2">
                <input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="e.g. <80ms p95 latency, Zero oversell"
                  className="flex-grow px-3 py-1.5 bg-dark-950 border border-white/10 rounded-lg text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-1.5 bg-white/[0.08] hover:bg-primary text-white text-xs font-semibold rounded-lg"
                >
                  Add Highlight
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(project.architecture?.highlights || []).map((hl, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 text-xs font-mono flex items-center gap-1.5"
                  >
                    ✔ {hl}
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="text-rose-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Engineering Challenges & Solutions */}
          <div className="p-4 bg-dark-900/80 rounded-xl border border-accent-amber/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent-amber font-mono text-xs font-bold uppercase tracking-wider">
                <FaLightbulb /> Engineering Challenges Solved (Problem ➔ Solution)
              </div>
              <button
                type="button"
                onClick={addChallenge}
                className="inline-flex items-center gap-1 text-xs text-accent-amber hover:underline"
              >
                <FaPlus className="text-[10px]" /> Add Challenge
              </button>
            </div>

            <div className="space-y-3">
              {(project.challenges || []).map((ch, idx) => (
                <div key={idx} className="p-3 bg-dark-950 rounded-lg border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                      Challenge #{idx + 1}
                    </span>
                    {project.challenges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChallenge(idx)}
                        className="text-rose-400 text-xs hover:text-rose-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    value={ch.problem || ""}
                    onChange={(e) => handleChallengeChange(idx, "problem", e.target.value)}
                    placeholder="Constraint / Problem (e.g. Concurrent checkout collisions during flash sales...)"
                    className="w-full px-3 py-1.5 bg-dark-900 border border-white/10 rounded text-xs text-rose-300"
                  />
                  <input
                    value={ch.solution || ""}
                    onChange={(e) => handleChallengeChange(idx, "solution", e.target.value)}
                    placeholder="Engineering Resolution (e.g. Implemented distributed locking with Redis TTL...)"
                    className="w-full px-3 py-1.5 bg-dark-900 border border-white/10 rounded text-xs text-emerald-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-xs shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <FaSave className="text-xs" />
            {loading ? "Publishing Project..." : editingId ? "Update System Case Study" : "Publish Project to Portfolio"}
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-dark-850/80 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">
            Current Published Systems ({projects.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Live in Firestore</span>
        </div>

        {projects.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No projects in Firestore yet. Use the form above or click &quot;Sync Starter Data&quot; at the top to populate.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  editingId === p.id
                    ? "bg-primary/10 border-primary shadow-md"
                    : "bg-dark-900/70 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {(p.imageUrls?.[0] || p.imageUrl) ? (
                    <img
                      src={p.imageUrls?.[0] || p.imageUrl}
                      alt={p.title}
                      className="w-16 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-dark-950 border border-white/10 flex items-center justify-center text-[10px] font-mono text-slate-600 flex-shrink-0">
                      No Media
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light text-[10px] font-mono font-semibold uppercase">
                        {p.category || "Full Stack"}
                      </span>
                      {p.featured && (
                        <span className="px-1.5 py-0.5 rounded bg-accent-amber/20 text-accent-amber text-[9px] font-mono font-bold">
                          FLAGSHIP
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{p.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.summary || p.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-primary text-slate-300 hover:text-white text-xs transition-colors"
                    title="Edit Case Study"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs transition-colors"
                    title="Delete Case Study"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;
