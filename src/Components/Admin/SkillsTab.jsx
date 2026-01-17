import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "Frontend" });
  const [loading, setLoading] = useState(true);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      await addDoc(collection(db, "skills"), newSkill);
      setNewSkill({ name: "", category: "Frontend" });
      toast.success("Skill added!");
      fetchSkills();
    } catch (error) {
      toast.error("Error adding skill");
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
      {/* Ad Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4">Add Skill</h3>
        <form onSubmit={handleAdd} className="flex gap-4">
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
            className="bg-primary px-6 py-2 rounded font-bold text-white hover:bg-indigo-600 transition"
          >
            Add
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
                className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700"
              >
                <div>
                  <span className="font-bold block">{skill.name}</span>
                  <span className="text-xs text-slate-400 uppercase">
                    {skill.category}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsTab;
