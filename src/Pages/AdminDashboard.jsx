import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileTab from "../Components/Admin/ProfileTab";
import SkillsTab from "../Components/Admin/SkillsTab";
import ProjectsTab from "../Components/Admin/ProjectsTab";
import ExperienceTab from "../Components/Admin/ExperienceTab";
import EducationTab from "../Components/Admin/EducationTab";
import { seedFirestoreData } from "../services/portfolioService";
import {
  FaUser,
  FaTools,
  FaFolderOpen,
  FaBriefcase,
  FaGraduationCap,
  FaSignOutAlt,
  FaDatabase,
  FaEye,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSeeding, setIsSeeding] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSeedDatabase = async () => {
    if (
      !window.confirm(
        "This will upload all starter full-stack case studies, skills taxonomy, profile, and experience into your Firebase Firestore so you can edit and manage them. Proceed?"
      )
    ) {
      return;
    }

    setIsSeeding(true);
    try {
      await seedFirestoreData();
      toast.success("Firestore populated with production starter data! Reloading...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed database: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile & Identity", icon: FaUser },
    { id: "projects", label: "Projects & Architectures", icon: FaFolderOpen },
    { id: "skills", label: "Skills Taxonomy", icon: FaTools },
    { id: "experience", label: "Career & Experience", icon: FaBriefcase },
    { id: "education", label: "Education & Credentials", icon: FaGraduationCap },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-indigo-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Authenticated Admin Session
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Portfolio Content Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload, modify, and publish your live skills, architectural case studies, and engineering metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <FaEye className="text-xs" /> View Live Site
          </Link>

          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
            title="Populates Firestore with all complete full-stack portfolio records so you can manage them."
          >
            <FaDatabase className="text-xs" />
            {isSeeding ? "Syncing..." : "⚡ Sync Starter Data"}
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 hover:text-white border border-rose-800/60 text-xs font-semibold transition-all cursor-pointer"
          >
            <FaSignOutAlt className="text-xs" /> Logout
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1.5 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="text-sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "experience" && <ExperienceTab />}
          {activeTab === "education" && <EducationTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

