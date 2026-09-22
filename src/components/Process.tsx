import { Compass, Hammer, PenTool, Rocket } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface ProcessProps {
  eyebrow?: string;
}

const steps = [
  {
    icon: Compass,
    title: "Discover",
    description: "Understand the real problem, constraints, and who's actually going to use this — before any code.",
  },
  {
    icon: PenTool,
    title: "Design",
    description: "Map the data model and system architecture so the hard decisions get made early, not discovered late.",
  },
  {
    icon: Hammer,
    title: "Build",
    description: "Ship in small, working increments — real features you can see and use, not a big-bang release.",
  },
  {
    icon: Rocket,
    title: "Ship & Support",
    description: "Deploy to real users, then stay on for monitoring, fixes, and the next iteration.",
  },
];

export default function Process({ eyebrow = "02 · How We Work" }: ProcessProps) {
  return (
    <section id="process" className="border-t border-slate-200 px-6 py-24 dark:border-slate-900">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title="How we work"
            description="The same four stages, every engagement — no surprises about what happens next."
          />
        </Reveal>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-4 sm:gap-6">
          {/* Connecting line — desktop only, sits behind the numbered nodes. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 sm:block dark:bg-slate-800"
          />

          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1}>
              <div className="relative flex flex-col items-start sm:items-center sm:text-center">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-600/40 bg-white text-amber-700 shadow-sm dark:border-amber-500/30 dark:bg-slate-950 dark:text-amber-400">
                  <step.icon size={20} />
                </div>
                <p className="mt-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-slate-950 dark:text-slate-50">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
