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
import { FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "Frontend" });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const categories = ["Frontend", "Backend", "Tools", "Design", "Other"];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      setSkills(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setNewSkill({
      name: skill.name || "",
      category: skill.category || "Frontend",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewSkill({ name: "", category: "Frontend" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, "skills", editingId), newSkill);
        toast.success("Skill updated!");
      } else {
        await addDoc(collection(db, "skills"), newSkill);
        toast.success("Skill added!");
      }

      handleCancelEdit();
      fetchSkills();
    } catch (error) {
      toast.error("Error saving skill");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await deleteDoc(doc(db, "skills", id));
      toast.success("Skill deleted");
      fetchSkills(); // Refresh
    } catch (error) {
      toast.error("Error deleting skill");
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {editingId ? "Edit Skill" : "Add Skill"}
          </h3>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            placeholder="Skill Name (e.g. React)"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded text-white"
          />
          <select
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value })
            }
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`px-6 py-2 rounded font-bold text-white transition ${editingId ? "bg-secondary hover:bg-emerald-600" : "bg-primary hover:bg-indigo-600"}`}
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4">Current Skills</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`flex justify-between items-center bg-slate-900 p-3 rounded border transition ${editingId === skill.id ? "border-primary ring-1 ring-primary" : "border-slate-700"}`}
              >
                <div>
                  <span className="font-bold block">{skill.name}</span>
                  <span className="text-xs text-slate-400 uppercase">
                    {skill.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-slate-400 hover:text-white"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-400 hover:text-red-300"
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

export default SkillsTab;
