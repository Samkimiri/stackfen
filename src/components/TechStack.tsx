import { NodeIcon, ReactIcon, SupabaseIcon, TailwindIcon, TypeScriptIcon, VercelIcon } from "./icons";
import Reveal from "./Reveal";

const stack = [
  { icon: ReactIcon, label: "React" },
  { icon: TypeScriptIcon, label: "TypeScript" },
  { icon: NodeIcon, label: "Node.js" },
  { icon: SupabaseIcon, label: "Supabase" },
  { icon: TailwindIcon, label: "Tailwind CSS" },
  { icon: VercelIcon, label: "Vercel" },
];

// A slim, unnumbered strip — deliberately lighter-weight than the numbered
// sections around it, since it's a supporting detail, not a pitch.
export default function TechStack() {
  return (
    <div className="border-t border-slate-200 px-6 py-12 dark:border-slate-900">
      <Reveal className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
          Built with
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {stack.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-slate-400 transition-colors hover:text-amber-600 dark:text-slate-600 dark:hover:text-amber-400"
            >
              <Icon size={22} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
