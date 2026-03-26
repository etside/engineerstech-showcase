import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectModal from "./ProjectModal";
import type { Project } from "@/data/projects";

export default function ProductsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="products" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <div className="tag-label mb-3">Featured Products</div>
          <h2 className="section-title mb-4">Our Six Independent Platforms</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From beauty marketplaces to AI-powered investment tools — each product solves a real problem for real people.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card-base p-6 flex flex-col group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Icon + category */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${project.bgGradient}`}
                >
                  {project.icon}
                </div>
                <span className="badge-blue text-xs">{project.category}</span>
              </div>

              {/* Name + tagline */}
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm font-semibold mb-3" style={{ color: project.color }}>
                {project.tagline}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">
                {project.description}
              </p>

              {/* Features preview */}
              <ul className="space-y-1.5 mb-6">
                {project.features.slice(0, 3).map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <button
                  className="btn-primary flex-1 justify-center text-sm py-2.5"
                  onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                >
                  Learn More
                </button>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-sm py-2.5 px-4"
                  onClick={(e) => e.stopPropagation()}
                  title="Live Site"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
