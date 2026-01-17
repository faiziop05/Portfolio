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
import { FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const ExperienceTab = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    period: "",
    description: "",
  });
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
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setNewExp({
      role: exp.role || "",
      company: exp.company || "",
      period: exp.period || "",
      description: exp.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewExp({ role: "", company: "", period: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, "experience", editingId), newExp);
        toast.success("Experience updated!");
      } else {
        await addDoc(collection(db, "experience"), {
          ...newExp,
          createdAt: Date.now(),
        });
        toast.success("Experience added!");
      }

      handleCancelEdit();
      fetchExperiences();
    } catch (error) {
      toast.error("Error saving experience");
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {editingId ? "Edit Experience" : "Add Experience"}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className={`px-6 py-2 rounded font-bold text-white transition ${editingId ? "bg-secondary hover:bg-emerald-600" : "bg-primary hover:bg-indigo-600"}`}
          >
            {editingId ? "Update Position" : "Add Position"}
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
              className={`bg-slate-900 p-4 rounded border transition relative group ${editingId === exp.id ? "border-primary ring-1 ring-primary" : "border-slate-700"}`}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-slate-500 hover:text-white"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-slate-500 hover:text-red-500"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>

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
