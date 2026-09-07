import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaTimes, FaSave } from "react-icons/fa";
import { usePortfolio } from "../../Context/PortfolioContext";

const emptyExp = {
  role: "",
  company: "",
  period: "",
  type: "Full-Time",
  description: "",
  achievementsText: "",
  techText: "",
};

const ExperienceTab = () => {
  const { refreshData } = usePortfolio();
  const [experiences, setExperiences] = useState([]);
  const [exp, setExp] = useState(emptyExp);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, "experience"), orderBy("period", "desc"));
      const querySnapshot = await getDocs(q);
      setExperiences(
        querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    } catch {
      try {
        const snap = await getDocs(collection(db, "experience"));
        setExperiences(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching experience:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setExp({ ...exp, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setExp({
      role: item.role || "",
      company: item.company || "",
      period: item.period || "",
      type: item.type || "Full-Time",
      description: item.description || "",
      achievementsText: item.achievements ? item.achievements.join("\n") : "",
      techText: item.tech ? item.tech.join(", ") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setExp(emptyExp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exp.role || !exp.company) {
      toast.error("Role and company are required.");
      return;
    }

    const achievements = exp.achievementsText
      ? exp.achievementsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const tech = exp.techText
      ? exp.techText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const payload = {
      role: exp.role,
      company: exp.company,
      period: exp.period,
      type: exp.type,
      description: exp.description,
      achievements,
      tech,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "experience", editingId), payload);
        toast.success("Experience updated!");
      } else {
        await addDoc(collection(db, "experience"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
        toast.success("Experience added!");
      }

      handleCancelEdit();
      await fetchExperiences();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error saving experience: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    try {
      await deleteDoc(doc(db, "experience", id));
      toast.success("Experience deleted");
      await fetchExperiences();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error deleting experience: " + error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editor Form */}
      <div className="bg-dark-850/80 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white">
              {editingId ? "Edit Career Milestone" : "Add Experience / Employment"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Document your software roles, measurable engineering outcomes, and stack.
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Role Title *
              </label>
              <input
                name="role"
                value={exp.role}
                onChange={handleChange}
                required
                placeholder="e.g. Full-Stack Software Engineer"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Company / Organization *
              </label>
              <input
                name="company"
                value={exp.company}
                onChange={handleChange}
                required
                placeholder="e.g. Tech Systems Corp"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Period / Timeline
              </label>
              <input
                name="period"
                value={exp.period}
                onChange={handleChange}
                placeholder="e.g. 2023 - Present"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Employment Type
              </label>
              <input
                name="type"
                value={exp.type}
                onChange={handleChange}
                placeholder="e.g. Full-Time, Contract, Consulting"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Technologies Used (Comma Separated)
              </label>
              <input
                name="techText"
                value={exp.techText}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL, Docker, Redis"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
              Role Narrative Summary
            </label>
            <textarea
              name="description"
              value={exp.description}
              onChange={handleChange}
              rows="3"
              placeholder="High-level engineering responsibilities, systems owned, team dynamics..."
              className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
              Key Outcomes & Quantifiable Achievements (1 per line)
            </label>
            <textarea
              name="achievementsText"
              value={exp.achievementsText}
              onChange={handleChange}
              rows="3"
              placeholder="Delivered 10+ production microservices with 99.9% uptime.&#10;Reduced client bundle size by 35% using dynamic imports."
              className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-primary/20"
          >
            <FaSave className="text-xs" />
            {editingId ? "Update Experience" : "Add Experience to Roadmap"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-dark-850/80 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">
            Career Milestones ({experiences.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Live in Firestore</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-4">Loading experience...</p>
        ) : experiences.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No experiences in Firestore. Use the form above or click &quot;Sync Starter Data&quot; to populate.
          </p>
        ) : (
          <div className="space-y-3">
            {experiences.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  editingId === item.id
                    ? "bg-primary/10 border-primary"
                    : "bg-dark-900/80 border-white/5 hover:border-white/20"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{item.role}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.company} &bull; <span className="font-mono text-primary-light">{item.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-primary text-slate-300 hover:text-white text-xs transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs transition-colors"
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

export default ExperienceTab;
