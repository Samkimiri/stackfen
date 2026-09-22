import { useState, type ChangeEvent } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { saveSiteContent } from "../lib/siteContent";
import { uploadProjectScreenshot } from "../lib/storage";
import { generateProjectScreenshot } from "../lib/generateImage";
import { fetchLinkPreview } from "../lib/linkPreview";
import type { Project } from "../types";
import { cardClasses, inputClasses, labelClasses, SaveBar, IconButton } from "./shared";

const accents: Project["accent"][] = ["emerald", "sky", "amber", "violet"];

function newProject(): Project {
  return {
    id: `project-${Date.now()}`,
    name: "",
    tagline: "",
    description: "",
    tags: [],
    liveUrl: null,
    repoUrl: null,
    screenshot: null,
    accent: "emerald",
  };
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/^www\./, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
}

export default function ProjectsEditor() {
  const { projects, refresh } = useSiteData();
  const [form, setForm] = useState<Project[]>(projects);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadState, setUploadState] = useState<Record<string, { uploading: boolean; error: string | null }>>({});
  const [aiPrompt, setAiPrompt] = useState<Record<string, string>>({});
  const [aiState, setAiState] = useState<Record<string, { generating: boolean; error: string | null }>>({});
  const [linkUrl, setLinkUrl] = useState("");
  const [linkState, setLinkState] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  });

  function update(index: number, project: Project) {
    const next = [...form];
    next[index] = project;
    setForm(next);
    setSaved(false);
  }

  function addProject() {
    setForm([...form, newProject()]);
  }

  async function handleAddFromLink() {
    const url = linkUrl.trim();
    if (!url) return;

    setLinkState({ loading: true, error: null });
    const { preview, error } = await fetchLinkPreview(url);
    setLinkState({ loading: false, error });
    if (!preview) return;

    const hostname = (() => {
      try {
        return new URL(preview.liveUrl).hostname;
      } catch {
        return "project";
      }
    })();

    const project: Project = {
      id: `${slugify(hostname)}-${Date.now().toString(36)}`,
      name: preview.name || hostname,
      tagline: "",
      description: preview.description,
      tags: [],
      liveUrl: preview.liveUrl,
      repoUrl: null,
      screenshot: preview.screenshot,
      accent: "emerald",
    };

    setForm([...form, project]);
    setLinkUrl("");
    setSaved(false);
  }

  function removeProject(index: number, project: Project) {
    const ok = window.confirm(
      `Delete "${project.name || "this project"}"? It'll be gone from the site once you save — this can't be undone.`,
    );
    if (!ok) return;
    setForm(form.filter((_, i) => i !== index));
    setSaved(false);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= form.length) return;
    const next = [...form];
    [next[index], next[target]] = [next[target], next[index]];
    setForm(next);
    setSaved(false);
  }

  async function handleFileChange(index: number, project: Project, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadState((prev) => ({ ...prev, [project.id]: { uploading: true, error: null } }));

    const { url, error } = await uploadProjectScreenshot(project.id, file);

    setUploadState((prev) => ({ ...prev, [project.id]: { uploading: false, error } }));

    if (url) update(index, { ...project, screenshot: url });
  }

  async function handleGenerate(index: number, project: Project) {
    const prompt = aiPrompt[project.id]?.trim();
    if (!prompt) return;

    setAiState((prev) => ({ ...prev, [project.id]: { generating: true, error: null } }));

    const { url, error } = await generateProjectScreenshot(project.id, prompt);

    setAiState((prev) => ({ ...prev, [project.id]: { generating: false, error } }));

    if (url) update(index, { ...project, screenshot: url });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const { error } = await saveSiteContent("projects", form);
    setSaving(false);
    if (error) {
      setError(error);
      return;
    }
    setSaved(true);
    refresh();
  }

  return (
    <div className="space-y-6">
      {form.map((project, index) => (
        <div key={project.id} className={cardClasses}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-sm font-semibold text-neutral-950 dark:text-neutral-50">
              {project.name || "Untitled project"}
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded-full border border-neutral-300 px-2 py-1 text-xs text-neutral-500 disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-400"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === form.length - 1}
                className="rounded-full border border-neutral-300 px-2 py-1 text-xs text-neutral-500 disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-400"
              >
                ↓
              </button>
              <IconButton label="Delete" onClick={() => removeProject(index, project)} />
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Name</label>
              <input className={inputClasses} value={project.name} onChange={(e) => update(index, { ...project, name: e.target.value })} />
            </div>
            <div>
              <label className={labelClasses}>Tagline (badge, optional)</label>
              <input
                className={inputClasses}
                value={project.tagline ?? ""}
                onChange={(e) => update(index, { ...project, tagline: e.target.value || undefined })}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className={labelClasses}>Description</label>
            <textarea
              className={inputClasses}
              rows={3}
              value={project.description}
              onChange={(e) => update(index, { ...project, description: e.target.value })}
            />
          </div>

          <div className="mt-3">
            <label className={labelClasses}>Tags (comma-separated)</label>
            <input
              className={inputClasses}
              value={project.tags.join(", ")}
              onChange={(e) =>
                update(index, { ...project, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
              }
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Live URL</label>
              <input
                className={inputClasses}
                value={project.liveUrl ?? ""}
                onChange={(e) => update(index, { ...project, liveUrl: e.target.value || null })}
              />
            </div>
            <div>
              <label className={labelClasses}>Repo URL</label>
              <input
                className={inputClasses}
                value={project.repoUrl ?? ""}
                onChange={(e) => update(index, { ...project, repoUrl: e.target.value || null })}
              />
            </div>
            <div>
              <label className={labelClasses}>Screenshot</label>
              <div className="flex items-center gap-2">
                {project.screenshot && (
                  <img
                    src={project.screenshot}
                    alt=""
                    className="h-9 w-16 shrink-0 rounded object-cover"
                  />
                )}
                <input
                  className={inputClasses}
                  placeholder="Paste a URL, or upload →"
                  value={project.screenshot ?? ""}
                  onChange={(e) => update(index, { ...project, screenshot: e.target.value || null })}
                />
                <label className="shrink-0 cursor-pointer rounded-full border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400">
                  {uploadState[project.id]?.uploading ? "Uploading…" : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadState[project.id]?.uploading}
                    onChange={(e) => handleFileChange(index, project, e)}
                  />
                </label>
              </div>
              {uploadState[project.id]?.error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{uploadState[project.id]?.error}</p>
              )}

              <div className="mt-2 flex items-center gap-2">
                <input
                  className={inputClasses}
                  placeholder="Describe an image to generate…"
                  value={aiPrompt[project.id] ?? ""}
                  onChange={(e) => setAiPrompt((prev) => ({ ...prev, [project.id]: e.target.value }))}
                  disabled={aiState[project.id]?.generating}
                />
                <button
                  type="button"
                  onClick={() => handleGenerate(index, project)}
                  disabled={aiState[project.id]?.generating || !aiPrompt[project.id]?.trim()}
                  className="shrink-0 rounded-full border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400"
                >
                  {aiState[project.id]?.generating ? "Generating…" : "Generate with AI"}
                </button>
              </div>
              {aiState[project.id]?.error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{aiState[project.id]?.error}</p>
              )}
            </div>
            <div>
              <label className={labelClasses}>Accent color</label>
              <select
                className={inputClasses}
                value={project.accent}
                onChange={(e) => update(index, { ...project, accent: e.target.value as Project["accent"] })}
              >
                {accents.map((accent) => (
                  <option key={accent} value={accent}>
                    {accent}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <div className={cardClasses}>
        <label className={labelClasses}>Add project from a link</label>
        <div className="flex items-center gap-2">
          <input
            className={inputClasses}
            placeholder="https://your-project.vercel.app"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            disabled={linkState.loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFromLink();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddFromLink}
            disabled={linkState.loading || !linkUrl.trim()}
            className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-neutral-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {linkState.loading ? "Fetching…" : "Add from link"}
          </button>
        </div>
        {linkState.error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{linkState.error}</p>}
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
          Pulls the name, description, and preview image straight from the page below — review, add tags, and save.
        </p>
      </div>

      <button
        type="button"
        onClick={addProject}
        className="rounded-full border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-600 hover:border-emerald-500 hover:text-emerald-600 dark:border-neutral-700 dark:text-neutral-400"
      >
        + Add blank project
      </button>

      <SaveBar onSave={handleSave} saving={saving} error={error} saved={saved} />
    </div>
  );
}
