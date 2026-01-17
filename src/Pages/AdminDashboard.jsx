import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ProfileTab from "../Components/Admin/ProfileTab";
import SkillsTab from "../Components/Admin/SkillsTab";
import ProjectsTab from "../Components/Admin/ProjectsTab";
import ExperienceTab from "../Components/Admin/ExperienceTab";
import EducationTab from "../Components/Admin/EducationTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/50 rounded hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id ? "bg-primary text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[500px]">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "experience" && <ExperienceTab />}
          {activeTab === "education" && <EducationTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
