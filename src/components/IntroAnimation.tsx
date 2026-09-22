import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

// Scattered around the brand reveal, each twinkling on its own offset
// timing so it reads as organic glitter rather than one synced blink.
const SPARKLES = [
  { top: "8%", left: "12%", size: 14, delay: 0 },
  { top: "18%", left: "85%", size: 10, delay: 0.6 },
  { top: "78%", left: "20%", size: 12, delay: 1.1 },
  { top: "70%", left: "88%", size: 16, delay: 0.3 },
  { top: "45%", left: "3%", size: 9, delay: 1.6 },
];

const MS_PER_CHAR = 34;
const PAUSE_AFTER_TYPING_MS = 900;
const BRAND_HOLD_MS = 2400;
const FOUNDER_HOLD_MS = 3000;
const WELCOME_HOLD_MS = 2200;

const WHO_ARE_WE_LINE = "$ who are we";

// Plain strings, parsed for light "syntax" coloring in renderTypedLine below
// ("$ " = prompt, "✓" = success, "STATUS" = final status).
const LINES = [
  WHO_ARE_WE_LINE,
  "Stackfen — Software Engineering Company",
  "",
  "$ stackfen --init",
  "✓ Loading fintech expertise...",
  "✓ Loading AI / LLM integrations...",
  "✓ Compiling trust...",
  "✓ Deploying your next product...",
  "",
  "$ stackfen --status",
  "STATUS: READY.",
];

const FULL_SCRIPT = LINES.join("\n");

type Phase = "typing" | "brand" | "founder" | "welcome" | "done";
const PHASES: Phase[] = ["typing", "brand", "founder", "welcome"];

const blurReveal = {
  initial: { opacity: 0, y: 24, scale: 0.97, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, scale: 0.98, filter: "blur(8px)" },
};

// Springs read as snappier and more "designed" than duration-based tweens —
// used for the phase-to-phase transitions (brand/founder/welcome), while the
// terminal keeps a plain tween since it's driven by the typing effect.
const springTransition = { type: "spring" as const, stiffness: 140, damping: 18, mass: 0.9 };

interface IntroAnimationProps {
  onComplete: () => void;
}

// Renders a line of the typed script with light "syntax" coloring — prompts
// in amber, success checks in emerald, everything else neutral — rather
// than a flat single-color terminal, which reads more like a designed
// product moment than a generic green-on-black hacker trope.
function renderTypedLine(line: string, key: number) {
  // The opening question gets real visual weight — it's the whole premise
  // of the intro, not just another terminal command.
  if (WHO_ARE_WE_LINE.startsWith(line) && line.length > 2) {
    return (
      <div key={key} className="mb-1 text-base font-bold tracking-tight text-slate-50 sm:text-lg">
        <span className="text-amber-400">$</span> {line.slice(2)}
      </div>
    );
  }
  if (line.startsWith("$ ")) {
    return (
      <div key={key}>
        <span className="text-amber-400">$</span> <span className="text-slate-100">{line.slice(2)}</span>
      </div>
    );
  }
  if (line.startsWith("✓")) {
    return (
      <div key={key} className="text-emerald-400">
        {line}
      </div>
    );
  }
  if (line.startsWith("STATUS")) {
    return (
      <div key={key} className="font-semibold text-amber-400">
        {line}
      </div>
    );
  }
  return (
    <div key={key} className="text-slate-400">
      {line || " "}
    </div>
  );
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const { profile } = useSiteData();
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTyped(FULL_SCRIPT.slice(0, index));
      if (index >= FULL_SCRIPT.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("brand"), PAUSE_AFTER_TYPING_MS);
      }
    }, MS_PER_CHAR);

    return () => clearInterval(interval);
    // Runs once on mount — intentionally not re-keyed on reduceMotion changes mid-animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "brand") {
      const timeout = setTimeout(() => setPhase("founder"), BRAND_HOLD_MS);
      return () => clearTimeout(timeout);
    }
    if (phase === "founder") {
      const timeout = setTimeout(() => setPhase("welcome"), FOUNDER_HOLD_MS);
      return () => clearTimeout(timeout);
    }
    if (phase === "welcome") {
      const timeout = setTimeout(() => setPhase("done"), WELCOME_HOLD_MS);
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "done") onComplete();
  }, [phase, onComplete]);

  if (reduceMotion) return null;

  const phaseIndex = PHASES.indexOf(phase);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950 px-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Subtle grid + film grain give the flat dark surface some
              tactile depth instead of reading as a solid color fill. */}
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 text-white/[0.025] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
          />
          <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 mix-blend-overlay" />

          {/* Ambient aurora — three drifting, differently-timed blobs (same
              visual language as the Hero's orbs) so the intro feels like part
              of the same brand rather than a bolted-on splash screen. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-amber-600/25 blur-[120px]"
            animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-[-10%] left-[-8%] h-[360px] w-[360px] rounded-full bg-amber-500/10 blur-[110px]"
            animate={{ y: [0, -20, 0], x: [0, 14, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/5 blur-[130px]"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <button
            type="button"
            onClick={onComplete}
            className="absolute right-6 top-6 z-10 text-xs font-medium text-slate-500 transition-colors hover:text-slate-300"
          >
            Skip intro →
          </button>

          {/* Progress bar — a slim gradient fill rather than dots, closer to
              a modern app's load/onboarding indicator. */}
          <div className="absolute bottom-8 left-1/2 z-10 h-[3px] w-40 -translate-x-1/2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
              animate={{ width: `${((phaseIndex + 1) / PHASES.length) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            />
          </div>

          <AnimatePresence mode="wait">
            {phase === "typing" && (
              <motion.div
                key="terminal"
                {...blurReveal}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-800/40 px-4 py-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                    stackfen — zsh
                  </span>
                </div>
                <div className="min-h-[220px] p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
                  {typed.split("\n").map((line, i) => renderTypedLine(line, i))}
                  <span className="inline-block h-4 w-[7px] translate-y-0.5 animate-pulse bg-amber-400" />
                </div>
              </motion.div>
            )}

            {phase === "brand" && (
              <motion.div key="brand" {...blurReveal} transition={springTransition} className="relative z-10 text-center">
                {SPARKLES.map((s, i) => (
                  <motion.span
                    key={i}
                    className="pointer-events-none absolute text-amber-300"
                    style={{ top: s.top, left: s.left }}
                    animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
                  >
                    <Sparkle size={s.size} fill="currentColor" />
                  </motion.span>
                ))}

                <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                  Introducing
                </p>
                <img src="/logo-icon.png" alt="" className="mx-auto mb-4 h-14 w-14 rounded-xl shadow-lg" />
                <div className="relative inline-block">
                  <h1 className="bg-gradient-to-br from-slate-50 to-slate-400 bg-clip-text font-display text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
                    STACKFEN
                  </h1>
                  <h1
                    aria-hidden
                    className="animate-shimmer absolute inset-0 bg-clip-text font-display text-5xl font-bold tracking-tight text-transparent sm:text-7xl"
                  >
                    STACKFEN
                  </h1>
                </div>
                <p className="mt-4 text-base text-slate-400 sm:text-lg">
                  Your go-to software engineering company.
                </p>
              </motion.div>
            )}

            {phase === "founder" && (
              <motion.div
                key="founder"
                {...blurReveal}
                transition={springTransition}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 -z-10 scale-110 rounded-[2rem] bg-amber-500/20 blur-2xl" />
                  <img
                    src="/founder-photo.webp"
                    alt=""
                    className="h-64 w-64 rounded-[2rem] border border-amber-500/30 object-cover shadow-2xl sm:h-80 sm:w-80"
                  />
                </div>
                <p className="mt-6 font-display text-2xl font-bold text-slate-50 sm:text-3xl">{profile.name}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Founder</p>
              </motion.div>
            )}

            {phase === "welcome" && (
              <motion.div
                key="welcome"
                {...blurReveal}
                transition={springTransition}
                className="relative z-10 text-center"
              >
                <h2 className="font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-6xl">
                  Welcome to <span className="text-amber-400">Stackfen</span>.
                </h2>
                <p className="mt-4 text-base text-slate-400 sm:text-lg">Let&apos;s build something exceptional.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
