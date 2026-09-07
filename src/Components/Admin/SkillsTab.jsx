import { useState, useEffect, useMemo } from "react";
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
import { FaTrash, FaEdit, FaTimes, FaPlus, FaCheck, FaTools } from "react-icons/fa";
import { usePortfolio } from "../../Context/PortfolioContext";

const defaultCategories = [
  "Frontend",
  "Backend",
  "Databases",
  "DevOps & Cloud",
  "Programming Languages",
  "Tools & Architecture",
];

const SkillsTab = () => {
  const { refreshData } = usePortfolio();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form inputs
  const [skillNames, setSkillNames] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [level, setLevel] = useState("Advanced");
  const [years, setYears] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      setSkills(
        querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  // Distinct categories from existing skills + defaults
  const existingCategories = useMemo(() => {
    const cats = new Set(defaultCategories);
    skills.forEach((s) => {
      if (s.category) cats.add(s.category.trim());
    });
    return Array.from(cats);
  }, [skills]);

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setSkillNames(skill.name || "");
    setCategory(skill.category || "Frontend");
    setLevel(skill.level || "Advanced");
    setYears(skill.years || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSkillNames("");
    setYears("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillNames.trim()) {
      toast.error("Please type a skill name.");
      return;
    }

    const trimmedCat = category.trim() || "General Engineering";

    try {
      if (editingId) {
        // Edit single skill
        await updateDoc(doc(db, "skills", editingId), {
          name: skillNames.trim(),
          category: trimmedCat,
          level: level.trim() || "Advanced",
          years: years.trim() || "",
          updatedAt: new Date().toISOString(),
        });
        toast.success("Skill updated!");
      } else {
        // Support adding single or comma-separated multiple skills at once by typing!
        const items = skillNames
          .split(/[,|\n]/)
          .map((s) => s.trim())
          .filter(Boolean);

        if (items.length === 0) {
          toast.error("Please type at least one valid skill name.");
          return;
        }

        for (const item of items) {
          await addDoc(collection(db, "skills"), {
            name: item,
            category: trimmedCat,
            level: level.trim() || "Advanced",
            years: years.trim() || "",
            createdAt: new Date().toISOString(),
          });
        }

        toast.success(
          items.length === 1
            ? `Skill "${items[0]}" added to ${trimmedCat}!`
            : `${items.length} skills added to ${trimmedCat}!`
        );
      }

      handleCancelEdit();
      await fetchSkills();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error saving skill: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this skill?")) return;
    try {
      await deleteDoc(doc(db, "skills", id));
      toast.success("Skill removed.");
      await fetchSkills();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error deleting skill: " + error.message);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (filterCategory === "All") return true;
    return s.category === filterCategory;
  });

  return (
    <div className="space-y-8">
      {/* Typing Form */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FaPlus className="text-indigo-400 text-sm" />
              {editingId ? "Edit Skill" : "Type & Add Skills to Your Portfolio"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Type skills individually or comma-separated (e.g. <span className="text-indigo-400 font-mono">React, Next.js, Node.js, Redis</span>). Everything typed here is published live to your website.
            </p>
          </div>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Name Input */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              Type Skill Name(s) *
            </label>
            <input
              placeholder="e.g. React 18, TypeScript, Docker, Redis (or comma-separated list to add multiple)"
              value={skillNames}
              onChange={(e) => setSkillNames(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tip: Separate with commas to batch-add multiple skills in one click.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Category Input (Type custom or pick) */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Category (Type or choose)
              </label>
              <input
                list="category-suggestions"
                placeholder="e.g. Frontend, Backend, AI..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <datalist id="category-suggestions">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>

              {/* Quick-pick category pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {existingCategories.slice(0, 5).map((catName) => (
                  <button
                    type="button"
                    key={catName}
                    onClick={() => setCategory(catName)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      category === catName
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>
            </div>

            {/* Proficiency Level */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Proficiency Level (Optional)
              </label>
              <input
                placeholder="e.g. Expert, Advanced, Proficient"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Years Experience */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Experience Duration (Optional)
              </label>
              <input
                placeholder="e.g. 4 yrs, 2+ yrs"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-accent-cyan hover:from-primary-light hover:to-cyan-400 text-white font-semibold rounded-xl text-xs shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <FaCheck className="text-xs" />
              {editingId ? "Save Changes to Skill" : "Publish Skill(s) to Live Portfolio"}
            </button>
          </div>
        </form>
      </div>

      {/* Skills Matrix List */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FaTools className="text-indigo-400 text-sm" />
              Live Published Skills ({skills.length})
            </h3>
            <p className="text-xs text-slate-400">
              Only skills added here by you appear on your website.
            </p>
          </div>

          {/* Category Filter Pills */}
          {existingCategories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setFilterCategory("All")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  filterCategory === "All"
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
                }`}
              >
                All ({skills.length})
              </button>
              {existingCategories.map((c) => {
                const count = skills.filter((s) => s.category === c).length;
                if (count === 0) return null;
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setFilterCategory(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                      filterCategory === c
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
                    }`}
                  >
                    {c} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading skills from Firestore...</p>
        ) : filteredSkills.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              {skills.length === 0
                ? "No skills added yet."
                : `No skills found in category "${filterCategory}".`}
            </p>
            <p className="text-xs text-slate-500">
              Type your skills in the form above to add them live to your portfolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                  editingId === skill.id
                    ? "bg-slate-800 border-indigo-500 shadow-md"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-xs text-white block truncate">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                    <span className="text-indigo-400 font-mono truncate">{skill.category}</span>
                    {skill.level && <span>&bull; {skill.level}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit skill"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/60 transition-colors cursor-pointer"
                    title="Delete skill"
                  >
                    <FaTrash className="text-xs" />
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

export default SkillsTab;
