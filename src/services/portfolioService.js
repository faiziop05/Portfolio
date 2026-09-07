import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  personalInfo,
  featuredProjects,
  skillsData,
  experienceData,
  educationData,
} from "../data/portfolioData";

// Fetch Profile
export const fetchProfile = async () => {
  try {
    const docRef = doc(db, "content", "profile");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...personalInfo,
        ...data,
        metrics: Array.isArray(data.metrics) ? data.metrics : [],
        coreEcosystem: Array.isArray(data.coreEcosystem)
          ? data.coreEcosystem
          : (typeof data.coreEcosystem === "string"
              ? data.coreEcosystem.split(",").map((s) => s.trim()).filter(Boolean)
              : []),
      };
    }
  } catch (err) {
    console.warn("Could not fetch remote profile, using fallback:", err);
  }
  return personalInfo;
};

// Fetch Projects
export const fetchProjects = async () => {
  try {
    const q = query(collection(db, "projects"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    // If empty query without order, try fallback query
    const rawSnap = await getDocs(collection(db, "projects"));
    if (!rawSnap.empty) {
      return rawSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn("Could not fetch remote projects, using fallback:", err);
  }
  return featuredProjects;
};

// Fetch Skills - 100% dynamic from Firestore
export const fetchSkills = async () => {
  try {
    const snap = await getDocs(collection(db, "skills"));
    if (!snap.empty) {
      const flatSkills = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const groupedMap = {};
      const defaultPalette = [
        "from-blue-500 to-cyan-400",
        "from-emerald-500 to-teal-400",
        "from-indigo-500 to-purple-500",
        "from-amber-500 to-rose-500",
        "from-fuchsia-500 to-pink-500",
        "from-sky-500 to-blue-600",
      ];

      flatSkills.forEach((s) => {
        const cat = (s.category || "Core Competencies").trim();
        if (!groupedMap[cat]) {
          const colorIdx = Object.keys(groupedMap).length % defaultPalette.length;
          groupedMap[cat] = {
            category: cat,
            color: defaultPalette[colorIdx],
            skills: [],
          };
        }
        groupedMap[cat].skills.push(s);
      });

      return Object.values(groupedMap);
    }
  } catch (err) {
    console.warn("Could not fetch remote skills:", err);
  }
  return [];
};

// Fetch Experience
export const fetchExperience = async () => {
  try {
    const q = query(collection(db, "experience"), orderBy("period", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    const rawSnap = await getDocs(collection(db, "experience"));
    if (!rawSnap.empty) {
      return rawSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn("Could not fetch remote experience, using fallback:", err);
  }
  return experienceData;
};

// Fetch Education
export const fetchEducation = async () => {
  try {
    const q = query(collection(db, "education"), orderBy("period", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    const rawSnap = await getDocs(collection(db, "education"));
    if (!rawSnap.empty) {
      return rawSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn("Could not fetch remote education, using fallback:", err);
  }
  return educationData;
};

// One-Click Firestore Seeder: Seeds starter data so Admin can immediately view and edit everything!
export const seedFirestoreData = async () => {
  // 1. Seed Profile
  await setDoc(doc(db, "content", "profile"), {
    name: personalInfo.name,
    title: personalInfo.title,
    roleSubtext: personalInfo.roleSubtext,
    bio: personalInfo.bio,
    location: personalInfo.location,
    email: personalInfo.email,
    github: personalInfo.github,
    linkedin: personalInfo.linkedin,
    resumeUrl: personalInfo.resumeUrl,
    availability: personalInfo.availability,
    metrics: [
      { label: "Years Experience", value: "4+", detail: "Production development" },
      { label: "Systems Deployed", value: "20+", detail: "Full-stack apps & services" },
    ],
    coreEcosystem: [
      "React", "Node.js", "Express.js", "MongoDB", "SQL", "Firebase", "AWS"
    ],
    updatedAt: new Date().toISOString(),
  });

  // 2. Seed Projects
  for (const proj of featuredProjects) {
    await addDoc(collection(db, "projects"), {
      title: proj.title,
      category: proj.category,
      featured: proj.featured || false,
      summary: proj.summary,
      description: proj.description,
      imageUrls: typeof proj.imageUrls?.[0] === "string" && proj.imageUrls[0].startsWith("http")
        ? proj.imageUrls
        : [],
      tags: proj.tags || [],
      liveUrl: proj.liveUrl || "",
      githubUrl: proj.githubUrl || "",
      date: proj.date || new Date().toISOString().split("T")[0],
      architecture: proj.architecture || {
        client: "",
        api: "",
        database: "",
        highlights: [],
      },
      challenges: proj.challenges || [],
      createdAt: new Date().toISOString(),
    });
  }

  // 3. Seed Skills
  for (const group of skillsData) {
    for (const skill of group.skills) {
      await addDoc(collection(db, "skills"), {
        name: skill.name,
        category: group.category,
        level: skill.level || "Advanced",
        years: skill.years || "3 yrs",
        createdAt: new Date().toISOString(),
      });
    }
  }

  // 4. Seed Experience
  for (const exp of experienceData) {
    await addDoc(collection(db, "experience"), {
      role: exp.role,
      company: exp.company,
      period: exp.period,
      type: exp.type || "Full-Time",
      description: exp.description,
      achievements: exp.achievements || [],
      tech: exp.tech || [],
      createdAt: new Date().toISOString(),
    });
  }

  // 5. Seed Education
  for (const edu of educationData) {
    await addDoc(collection(db, "education"), {
      degree: edu.degree,
      school: edu.school,
      period: edu.period,
      focus: edu.focus || "",
      createdAt: new Date().toISOString(),
    });
  }

  return true;
};
