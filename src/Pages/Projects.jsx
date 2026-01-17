import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProjectModal from "../Components/ProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-16 text-center"
      >
        My Projects
      </motion.h2>

      {projects.length === 0 ? (
        <div className="text-center text-slate-400">
          <p className="text-xl">No projects found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer flex flex-col h-full"
            >
              {/* Image Area */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 w-full h-full"></div>
                {project.imageUrls?.[0] || project.imageUrl ? (
                  <img
                    src={project.imageUrls?.[0] || project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
                    No Preview
                  </div>
                )}

                {/* Floating Tags Overlay */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 z-20">
                  {project.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags?.length > 3 && (
                    <span className="text-[10px] bg-black/60 text-white px-2 py-1 rounded-md border border-white/10">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                    View Details
                  </span>
                </div>

                <p className="text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                  {project.description}
                </p>

                <div className="pt-4 mt-auto border-t border-slate-700/50 flex justify-between items-center text-sm font-medium">
                  <span className="text-primary group-hover:underline decoration-2 underline-offset-4">
                    Read More
                  </span>
                  {project.date && (
                    <span className="text-slate-500">
                      {new Date(project.date).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Projects;
