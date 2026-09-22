import { Link } from "react-router-dom";
import { ExternalLink, ImageOff } from "lucide-react";
import type { Project } from "../types";
import { accentClasses } from "../lib/accent";
import { GithubIcon } from "./icons";
import BrowserFrame from "./BrowserFrame";
import SpotlightCard from "./SpotlightCard";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const accent = accentClasses[project.accent];

  return (
    <SpotlightCard className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-amber-600/40 hover:shadow-xl hover:shadow-amber-600/5 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-amber-600/30">
      <button type="button" onClick={() => onOpen(project)} className="block aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        <BrowserFrame url={project.liveUrl}>
          {project.screenshot ? (
            <img
              src={project.screenshot}
              alt={`${project.name} screenshot`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-600">
              <ImageOff size={16} />
              [SCREENSHOT]
            </span>
          )}
        </BrowserFrame>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-slate-50">
            {project.name}
          </h3>
          {project.tagline && (
            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${accent.border} ${accent.bg} ${accent.text}`}>
              {project.tagline}
            </span>
          )}
        </div>

        <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm font-medium">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-700 transition-colors hover:text-amber-600 dark:text-amber-400"
            >
              Live site <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-slate-400 dark:text-slate-600">[LIVE LINK]</span>
          )}

          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <GithubIcon size={14} /> Source
            </a>
          ) : (
            <span className="text-slate-400 dark:text-slate-600">[GITHUB LINK]</span>
          )}

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="text-slate-500 underline-offset-2 transition-colors hover:text-slate-800 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
            >
              Details
            </button>
            <Link
              to={`/projects/${project.id}`}
              className="text-amber-700 underline-offset-2 transition-colors hover:underline dark:text-amber-400"
            >
              Case study
            </Link>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
