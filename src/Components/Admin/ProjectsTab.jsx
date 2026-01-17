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
import { uploadToCloudinary } from "../../utils/cloudinary";

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    title: "",
    description: "",
    longDescription: "",
    imageUrls: [],
    tags: [],
    liveUrl: "",
    githubUrl: "",
    date: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    );
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setProject({
      title: proj.title || "",
      description: proj.description || "",
      longDescription: proj.longDescription || "",
      imageUrls: proj.imageUrls || (proj.imageUrl ? [proj.imageUrl] : []),
      tags: proj.tags || [],
      liveUrl: proj.liveUrl || "",
      githubUrl: proj.githubUrl || "",
      date: proj.date || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setProject({
      title: "",
      description: "",
      longDescription: "",
      imageUrls: [],
      tags: [],
      liveUrl: "",
      githubUrl: "",
      date: "",
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newUrls = [];

    for (const file of files) {
      const url = await uploadToCloudinary(file);
      if (url) newUrls.push(url);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        toast.success("Project added!");
      }

      handleCancelEdit(); // Reset form
      fetchProjects();
    } catch (e) {
      console.error(e);
      toast.error("Error saving project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Project deleted");
      fetchProjects();
    } catch (e) {
      toast.error("Error deleting project");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {editingId ? "Edit Project" : "Add New Project"}
          </h3>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
            >
              <FaTimes /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="title"
              value={project.title}
              onChange={handleChange}
              placeholder="Project Title"
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
              required
            />
            <input
              type="date"
              name="date"
              value={project.date}
              onChange={handleChange}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white text-slate-400"
            />
          </div>

          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            placeholder="Short Description (for card)"
            rows="2"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
            required
          ></textarea>

          <textarea
            name="longDescription"
            value={project.longDescription}
            onChange={handleChange}
            placeholder="Detailed Description (for modal)"
            rows="4"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
          ></textarea>

          {/* Tags Input */}
          <div className="p-4 bg-slate-900 rounded border border-slate-700">
            <label className="block text-sm text-slate-400 mb-2">
              Tech Stack Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                placeholder="Add tag (e.g. React) + Enter"
                className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-indigo-600 px-4 rounded text-white text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-700 text-xs px-2 py-1 rounded flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-400 hover:text-white"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Multi Image Upload */}
          <div className="p-4 bg-slate-900 rounded border border-slate-700">
            <label className="block text-sm text-slate-400 mb-2">
              Project Images (First is cover)
            </label>
            <div className="flex gap-4 items-center mb-4">
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="text-sm text-slate-400"
              />
              {uploading && (
                <span className="text-primary text-sm animate-pulse">
                  Uploading...
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {project.imageUrls?.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt="Preview"
                    className="h-20 w-full object-cover rounded border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-bl opacity-0 group-hover:opacity-100 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="liveUrl"
              value={project.liveUrl}
              onChange={handleChange}
              placeholder="Live Demo URL"
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
            <input
              name="githubUrl"
              value={project.githubUrl}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-3 rounded font-bold text-white transition ${editingId ? "bg-secondary hover:bg-emerald-600" : "bg-primary hover:bg-indigo-600"}`}
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Project"
                : "Add Project"}
          </button>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4">Existing Projects</h3>
        <div className="grid gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className={`flex justify-between items-start bg-slate-900 p-4 rounded border transition ${editingId === p.id ? "border-primary ring-1 ring-primary" : "border-slate-700"}`}
            >
              <div className="flex gap-4">
                {(p.imageUrls?.[0] || p.imageUrl) && (
                  <img
                    src={p.imageUrls?.[0] || p.imageUrl}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-bold text-lg">{p.title}</h4>
                  <p className="text-sm text-slate-400 truncate w-64">
                    {p.description}
                  </p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {p.tags?.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-slate-800 px-1 rounded border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-slate-400 hover:text-white p-2"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTab;
