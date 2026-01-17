import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const ExperienceTab = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    period: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, "experience"), orderBy("period", "desc")); // Simplified ordering
      const querySnapshot = await getDocs(q);
      setExperiences(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    try {
      await addDoc(collection(db, "experience"), {
        ...newExp,
        createdAt: Date.now(),
      });
      setNewExp({ role: "", company: "", period: "", description: "" });
      toast.success("Experience added!");
      fetchExperiences();
    } catch (error) {
      toast.error("Error adding experience");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await deleteDoc(doc(db, "experience", id));
      toast.success("Experience deleted");
      fetchExperiences();
    } catch (error) {
      toast.error("Error deleting experience");
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4">Add Experience</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Role (e.g. Senior Dev)"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
            <input
              placeholder="Company"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              className="p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Period (e.g. 2020 - Present)"
              value={newExp.period}
              onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
              className="p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
          </div>
          <textarea
            placeholder="Description"
            rows="3"
            value={newExp.description}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
          ></textarea>

          <button
            type="submit"
            className="bg-primary px-6 py-2 rounded font-bold text-white hover:bg-indigo-600 transition"
          >
            Add Position
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4">Work History</h3>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-900 p-4 rounded border border-slate-700 relative group"
            >
              <button
                onClick={() => handleDelete(exp.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                <FaTrash />
              </button>
              <h4 className="font-bold text-lg text-primary">{exp.role}</h4>
              <p className="text-white font-medium">
                {exp.company}{" "}
                <span className="text-slate-400 text-sm">| {exp.period}</span>
              </p>
              <p className="text-slate-400 mt-2 text-sm whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTab;
