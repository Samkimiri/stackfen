import { useSiteData } from "../context/SiteDataContext";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface PartnersProps {
  eyebrow?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Hidden entirely while empty — never fills the gap with placeholder orgs.
export default function Partners({ eyebrow = "03 · Partners" }: PartnersProps) {
  const { partners } = useSiteData();

  if (partners.length === 0) return null;

  return (
    <section id="partners" className="border-t border-slate-200 px-6 py-24 dark:border-slate-900">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title="Partners" description="Organizations we build and work with." />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {partners.map((partner, index) => {
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

            return (
              <Reveal key={partner.id} delay={index * 0.06}>
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full"
                  >
                    {tile}
                  </a>
                ) : (
                  <div className="group h-full">{tile}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
