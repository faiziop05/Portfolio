import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "content", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (e) {
        console.error("Error fetching profile", e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">
          Welcome to my portfolio
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight">
          {profile?.name || "Creative Developer"}
          <br />
          <span className="text-2xl md:text-4xl text-slate-500 font-normal block mt-2">
            {profile?.title || "& Designer"}
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {profile?.bio
            ? profile.bio.substring(0, 150) + "..."
            : "I build influential visual web experiences with a focus on premium aesthetics and performance."}
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/projects"
            className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-indigo-600 transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
          >
            View Work
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-700 transition-all hover:scale-105 border border-slate-700"
          >
            Contact Me
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
