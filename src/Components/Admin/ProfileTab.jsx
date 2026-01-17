import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Storage import removed
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../../utils/cloudinary";

const ProfileTab = () => {
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "", // This was 'about' before
    resumeUrl: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "content", "profile"); // Central profile doc
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        // silent error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Resume might need "raw" or "auto" resource type in Cloudinary usually,
      // but image/upload endpoint often handles PDFs as images or requires different endpoint.
      // For simplicity, we assume standard image upload config works or user selects images.
      // Note: Free cloudinary accounts might block PDF on image endpoint or treat as pages.
      // We will try standard upload.
      const url = await uploadToCloudinary(file);
      if (url) {
        setProfile((prev) => ({ ...prev, [field]: url }));
        toast.success("Uploaded successfully!");
      }
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "content", "profile"), profile);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold mb-6">Edit Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Job Title
            </label>
            <input
              name="title"
              value={profile.title}
              onChange={handleChange}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Profile Photo
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, "photoUrl")}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-600"
              />
            </div>
            {profile.photoUrl && (
              <img
                src={profile.photoUrl}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover mt-2 border-2 border-primary"
              />
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Resume / CV (Image/PDF)
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, "resumeUrl")}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-600"
              />
            </div>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm mt-2 block"
              >
                View Current Resume
              </a>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-primary py-3 rounded font-bold text-white hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;
