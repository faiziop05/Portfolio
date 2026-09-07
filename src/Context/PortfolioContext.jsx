/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchExperience,
  fetchEducation,
} from "../services/portfolioService";
import {
  personalInfo as defaultProfile,
  featuredProjects as defaultProjects,
  experienceData as defaultExperience,
  educationData as defaultEducation,
} from "../data/portfolioData";

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState(defaultProjects);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState(defaultExperience);
  const [education, setEducation] = useState(defaultEducation);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [pProfile, pProjects, pSkills, pExp, pEdu] = await Promise.all([
        fetchProfile(),
        fetchProjects(),
        fetchSkills(),
        fetchExperience(),
        fetchEducation(),
      ]);

      if (pProfile) setProfile(pProfile);
      if (pProjects && pProjects.length > 0) setProjects(pProjects);
      if (pSkills) setSkills(pSkills);
      if (pExp && pExp.length > 0) setExperience(pExp);
      if (pEdu && pEdu.length > 0) setEducation(pEdu);
    } catch (err) {
      console.warn("Error refreshing portfolio context:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = {
    profile,
    projects,
    skills,
    experience,
    education,
    loading,
    refreshData: loadData,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
