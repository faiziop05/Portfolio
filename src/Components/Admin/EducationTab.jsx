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

const EducationTab = () => {
  const [education, setEducation] = useState([]);
  const [newEdu, setNewEdu] = useState({
    degree: "",
    school: "",
    period: "",
    description: "", // Optional
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const q = query(collection(db, "education"), orderBy("period", "desc"));
      const querySnapshot = await getDocs(q);
      setEducation(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    } catch (error) {
      console.error("Error fetching education:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu) => {
    setEditingId(edu.id);
    setNewEdu({
      degree: edu.degree || "",
      school: edu.school || "",
      period: edu.period || "",
      description: edu.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewEdu({ degree: "", school: "", period: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.school) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, "education", editingId), newEdu);
        toast.success("Education updated!");
      } else {
        await addDoc(collection(db, "education"), {
          ...newEdu,
          createdAt: Date.now(),
        });
        toast.success("Education added!");
      }

      handleCancelEdit();
      fetchEducation();
    } catch (error) {
      toast.error("Error saving education");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this?")) return;
    try {
      await deleteDoc(doc(db, "education", id));
      toast.success("Deleted");
      fetchEducation();
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {editingId ? "Edit Education" : "Add Education"}
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
              placeholder="Degree (e.g. BS Computer Science)"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              className="p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
            <input
              placeholder="School / University"
              value={newEdu.school}
              onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
              className="p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Period (e.g. 2016 - 2020)"
              value={newEdu.period}
              onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })}
              className="p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
          </div>

          <button
            type="submit"
            className={`px-6 py-2 rounded font-bold text-white transition ${editingId ? "bg-secondary hover:bg-emerald-600" : "bg-primary hover:bg-indigo-600"}`}
          >
            {editingId ? "Update Education" : "Add Education"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4">Education History</h3>
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className={`bg-slate-900 p-4 rounded border transition relative group ${editingId === edu.id ? "border-primary ring-1 ring-primary" : "border-slate-700"}`}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(edu)}
                  className="text-slate-500 hover:text-white"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="text-slate-500 hover:text-red-500"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>

              <h4 className="font-bold text-lg text-primary">{edu.degree}</h4>
              <p className="text-white font-medium">
                {edu.school}{" "}
                <span className="text-slate-400 text-sm">| {edu.period}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationTab;
