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

const emptyEdu = {
  degree: "",
  school: "",
  period: "",
  focus: "",
};

const EducationTab = () => {
  const { refreshData } = usePortfolio();
  const [education, setEducation] = useState([]);
  const [edu, setEdu] = useState(emptyEdu);
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
        querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    } catch {
      try {
        const snap = await getDocs(collection(db, "education"));
        setEducation(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching education:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEdu({ ...edu, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEdu({
      degree: item.degree || "",
      school: item.school || "",
      period: item.period || "",
      focus: item.focus || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEdu(emptyEdu);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!edu.degree || !edu.school) {
      toast.error("Degree and institution are required.");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "education", editingId), {
          ...edu,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Education record updated!");
      } else {
        await addDoc(collection(db, "education"), {
          ...edu,
          createdAt: new Date().toISOString(),
        });
        toast.success("Education record added!");
      }

      handleCancelEdit();
      await fetchEducation();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error saving education: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education entry?")) return;
    try {
      await deleteDoc(doc(db, "education", id));
      toast.success("Education record removed");
      await fetchEducation();
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Error deleting education: " + error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editor Form */}
      <div className="bg-dark-850/80 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white">
              {editingId ? "Edit Education Record" : "Add Education & Degree"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Degree credentials, coursework, and technical certifications.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Degree / Qualification *
              </label>
              <input
                name="degree"
                value={edu.degree}
                onChange={handleChange}
                required
                placeholder="e.g. Bachelor of Science in Computer Science"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Institution / University *
              </label>
              <input
                name="school"
                value={edu.school}
                onChange={handleChange}
                required
                placeholder="e.g. University Faculty of Computing"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Period / Years
              </label>
              <input
                name="period"
                value={edu.period}
                onChange={handleChange}
                placeholder="e.g. 2019 - 2023"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                Focus Area / Coursework
              </label>
              <input
                name="focus"
                value={edu.focus}
                onChange={handleChange}
                placeholder="e.g. Data Structures & Algorithms, Distributed Systems, Software Architecture"
                className="w-full px-3.5 py-2 bg-dark-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-primary/20"
          >
            <FaSave className="text-xs" />
            {editingId ? "Update Education" : "Save Education Record"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-dark-850/80 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">
            Education Credentials ({education.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Live in Firestore</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-4">Loading education...</p>
        ) : education.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No education records in Firestore. Use the form above or click &quot;Sync Starter Data&quot; to populate.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {education.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex justify-between items-start transition-all ${
                  editingId === item.id
                    ? "bg-primary/10 border-primary"
                    : "bg-dark-900/80 border-white/5 hover:border-white/20"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{item.degree}</h4>
                  <div className="text-xs text-primary-light mt-0.5">{item.school}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">{item.period}</div>
                  {item.focus && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.focus}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-white rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-rose-400 hover:text-white rounded"
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

export default EducationTab;
