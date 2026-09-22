import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useSiteData } from "../context/SiteDataContext";
import type { Partner } from "../types";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface PartnersProps {
  eyebrow?: string;
}

// Enough tiles in one lap of the marquee that it never looks sparse on a
// wide screen, however few partners are actually listed.
const MIN_MARQUEE_TILES = 8;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function PartnerTile({ partner }: { partner: Partner }): ReactNode {
  const tile = (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-600/40 hover:shadow-lg hover:shadow-amber-600/5 dark:border-slate-800 dark:bg-slate-900/50">
      {partner.logo ? (
        // White backing so transparent/dark-text logos stay legible in dark mode.
        <div className="flex h-24 w-full items-center justify-center rounded-xl bg-white p-3">
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 font-display text-sm font-bold text-amber-700 dark:text-amber-400">
          {initials(partner.name)}
        </div>
      )}
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{partner.name}</p>
    </div>
  );

  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      {tile}
    </a>
  ) : (
    <div className="group h-full">{tile}</div>
  );
}

// Hidden entirely while empty — never fills the gap with placeholder orgs.
export default function Partners({ eyebrow = "04 · Partners" }: PartnersProps) {
  const { partners } = useSiteData();
  const reduceMotion = useReducedMotion();

  if (partners.length === 0) return null;

  // Reduced motion (or accessibility/testing tools that force it) gets a
  // plain static grid instead of the scrolling marquee.
  if (reduceMotion) {
    return (
      <section id="partners" className="border-t border-slate-200 px-6 py-24 dark:border-slate-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title="Partners" description="Organizations we build and work with." />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {partners.map((partner, index) => (
              <Reveal key={partner.id} delay={index * 0.06}>
                <PartnerTile partner={partner} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const repeats = Math.max(2, Math.ceil(MIN_MARQUEE_TILES / partners.length));
  const lap = Array.from({ length: repeats }, () => partners).flat();
  // Rendered twice back-to-back — the CSS animation moves exactly -50%,
  // landing precisely back on the start of the second copy, so the loop
  // point is invisible no matter how many partners exist.
  const track = [...lap, ...lap];

  return (
    <section id="partners" className="border-t border-slate-200 py-24 dark:border-slate-900">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title="Partners" description="Organizations we build and work with." />
        </Reveal>
      </div>

      <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-6">
          {track.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="w-48 shrink-0">
              <PartnerTile partner={partner} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
