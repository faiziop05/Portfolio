import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const About = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Profile
        const profileSnap = await getDoc(doc(db, "content", "profile"));
        if (profileSnap.exists()) setProfile(profileSnap.data());

        // Skills
        const skillsSnap = await getDocs(collection(db, "skills"));
        setSkills(skillsSnap.docs.map((d) => d.data()));

        // Experience
        const expQuery = query(
          collection(db, "experience"),
          orderBy("period", "desc"),
        );
        const expSnap = await getDocs(expQuery);
        setExperience(expSnap.docs.map((d) => d.data()));

        // Education
        const eduQuery = query(
          collection(db, "education"),
          orderBy("period", "desc"),
        );
        const eduSnap = await getDocs(eduQuery);
        setEducation(eduSnap.docs.map((d) => d.data()));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-slate-400">Loading profile...</div>
    );

  return (
    <div className="max-w-4xl mx-auto py-20">
      {/* Intro Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <h3 className="text-2xl text-primary font-medium mb-4">
            {profile?.title || "Developer"}
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
            {profile?.bio || "Welcome to my portfolio."}
          </p>
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition"
            >
              View Resume
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-lg opacity-50 animate-pulse"></div>
            <img
              src={profile?.photoUrl || "https://via.placeholder.com/300"}
              alt="Profile"
              className="relative w-full h-full object-cover rounded-full border-4 border-slate-800 shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20"
      >
        <h3 className="text-2xl font-bold mb-8 border-l-4 border-primary pl-4">
          Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 border border-slate-700 hover:border-primary transition cursor-default"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Experience Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20"
      >
        <h3 className="text-2xl font-bold mb-8 border-l-4 border-secondary pl-4">
          Experience
        </h3>
        <div className="space-y-8 border-l-2 border-slate-700 ml-3 pl-8 relative">
          {experience.map((exp, index) => (
            <div key={index} className="relative">
              <span className="absolute -left-[43px] top-1 h-5 w-5 rounded-full border-4 border-slate-900 bg-secondary"></span>
              <h4 className="text-xl font-bold text-white">{exp.role}</h4>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center text-slate-400 mb-2 mt-1">
                <span className="font-medium">{exp.company}</span>
                <span className="text-sm bg-slate-800 px-2 py-1 rounded w-fit mt-1 sm:mt-0">
                  {exp.period}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Education Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-2xl font-bold mb-8 border-l-4 border-primary pl-4">
          Education
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700"
            >
              <h4 className="text-lg font-bold text-white mb-1">
                {edu.degree}
              </h4>
              <p className="text-primary font-medium mb-2">{edu.school}</p>
              <span className="text-sm text-slate-500">{edu.period}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
