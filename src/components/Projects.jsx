import React, { useEffect, useState } from "react";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { projects } from "../constants";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!selectedProject) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="w-full py-16 px-5 bg-[#111] flex flex-col items-center">
      <div className="w-full max-w-5xl mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#ffee10]">Featured Projects</h2>
        <p className="mt-3 max-w-2xl text-gray-300 text-sm md:text-base leading-relaxed">
          Four projects I can actually talk about in detail, from the repos and without dressing them up.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article
            key={project.name}
            className="relative group bg-[#181818] rounded-lg shadow-lg overflow-hidden border border-[#ffee10]/20 transition duration-300 hover:-translate-y-1 hover:border-[#ffee10]/60"
          >
            <button
              type="button"
              onClick={() => setSelectedProject(project)}
              className="w-full h-full text-left"
              aria-label={`Open ${project.name} details`}
            >
              <div className="h-44 w-full bg-[#202020] border-b border-white/5 flex items-center justify-center overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.name} preview`}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-[#ffee10]/40 bg-[#111] text-[#ffee10] flex items-center justify-center text-2xl font-bold tracking-wide">
                    {project.accent}
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{project.subtitle}</p>
                  <h3 className="text-xl font-semibold text-[#ffee10] mt-2">{project.name}</h3>
                </div>

                <p className="text-gray-200 text-sm leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="bg-[#ffee10] text-black px-2 py-1 rounded text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>

                <span className="text-[#ffee10] text-sm font-semibold pt-2">Open details</span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#151515] border border-[#ffee10]/25 rounded-lg p-6 md:p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/10 text-gray-300 hover:text-[#ffee10] hover:border-[#ffee10]/50 flex items-center justify-center transition"
              aria-label="Close project details"
            >
              <FiX size={18} />
            </button>

            {selectedProject.image && (
              <div className="-mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-6 h-48 md:h-60 overflow-hidden rounded-t-lg border-b border-white/10">
                <img
                  src={selectedProject.image}
                  alt={`${selectedProject.name} preview`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="pr-10">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{selectedProject.subtitle}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-[#ffee10] mt-2">{selectedProject.name}</h3>
              <p className="text-gray-200 mt-4 leading-relaxed">{selectedProject.description}</p>
            </div>

            <ul className="mt-6 space-y-3">
              {selectedProject.details.map((detail) => (
                <li key={detail} className="text-sm md:text-base text-gray-300 leading-relaxed flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ffee10] shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-6">
              {selectedProject.technologies.map((tech) => (
                <span key={tech} className="bg-[#ffee10] text-black px-2 py-1 rounded text-xs font-semibold">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffee10] text-black rounded font-semibold hover:bg-yellow-300 transition"
              >
                <FiGithub size={17} />
                GitHub
              </a>
              {selectedProject.live && (
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#ffee10]/50 text-[#ffee10] rounded font-semibold hover:bg-[#ffee10]/10 transition"
                >
                  <FiExternalLink size={17} />
                  Live app
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
