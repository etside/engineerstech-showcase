import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 modal-backdrop animate-fade-in overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl animate-slide-up my-4"
      >
        {/* Header */}
        <div className={`rounded-t-3xl p-8 bg-gradient-to-br ${project.bgGradient} relative overflow-hidden`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="text-5xl mb-4">{project.icon}</div>
          <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
            {project.category}
          </div>
          <h2 className="text-3xl font-black text-white mb-1">{project.name}</h2>
          <p className="text-white/85 font-medium">{project.tagline}</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">About</h3>
            <p className="text-foreground leading-relaxed">{project.longDescription}</p>
          </div>

          {/* Target Audience */}
          <div className="mb-6 p-4 rounded-xl bg-muted">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-foreground mb-1">Target Audience</div>
                <p className="text-sm text-muted-foreground">{project.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Key Features</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {project.features.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-foreground">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Preview */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Live Preview</h3>
            <div className="rounded-2xl overflow-hidden border border-border bg-muted aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <div className="text-4xl">{project.icon}</div>
                <p className="text-muted-foreground text-sm font-medium">
                  Click "Visit Live Site" to explore the platform
                </p>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Visit Live Site
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Visit Live Site
            </a>
            <a
              href={`/pitch_deck_${project.id}.pdf`}
              download
              className="btn-outline flex-1 justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Pitch Deck (PDF)
            </a>
            <button onClick={onClose} className="btn-outline px-4">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
