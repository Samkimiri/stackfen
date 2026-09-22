import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, ImageOff } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";
import { accentClasses } from "../lib/accent";
import { trackPageView } from "../lib/trackView";
import { GithubIcon } from "./icons";
import BrowserFrame from "./BrowserFrame";
import Footer from "./Footer";
import Reveal from "./Reveal";

// Built entirely from the same Project fields the card/modal already use
// (name, tagline, description, tags, links, screenshot) — no invented
// "results" or metrics beyond what's actually known and already published.
export default function ProjectCaseStudy() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useSiteData();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    trackPageView(`/projects/${id}`);
  }, [id]);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400">Couldn&apos;t find that project.</p>
        <Link to="/#projects" className="text-amber-700 hover:underline dark:text-amber-400">
          Back to projects
        </Link>
      </div>
    );
  }

  const accent = accentClasses[project.accent];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-900">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft size={16} />
            Back to projects
          </Link>
        </div>
      </header>

      <main className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-slate-50">
                {project.name}
              </h1>
              {project.tagline && (
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-sm font-medium ${accent.border} ${accent.bg} ${accent.text}`}
                >
                  {project.tagline}
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-800">
              <BrowserFrame url={project.liveUrl}>
                {project.screenshot ? (
                  <img
                    src={project.screenshot}
                    alt={`${project.name} screenshot`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-600">
                    <ImageOff size={16} />
                    [SCREENSHOT]
                  </span>
                )}
              </BrowserFrame>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            <Reveal delay={0.1} className="sm:col-span-2">
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Overview
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>

              <div className="mt-8 flex items-center gap-4 text-sm font-medium">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2.5 text-slate-950 transition-colors hover:bg-amber-500"
                  >
                    Visit live site <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="rounded-full border border-slate-200 px-5 py-2.5 text-slate-400 dark:border-slate-800 dark:text-slate-600">
                    [LIVE LINK]
                  </span>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-5 py-2.5 text-slate-700 transition-colors hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"
                  >
                    <GithubIcon size={14} /> Source
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Built with
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
