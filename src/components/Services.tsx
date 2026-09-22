import { Coins, Database, GitBranch, Globe, LucideIcon, ShieldCheck, Smartphone, Sparkles, Webhook } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  // A real shipped project this service was actually used on — grounds the
  // claim instead of leaving it abstract. Omitted where no clean 1:1 example
  // exists yet, rather than forcing a stretch.
  builtFor?: string;
  // Project id (see src/data/projects.ts) so "Built for X" can link straight
  // to that project's case study — omitted along with builtFor when unset.
  builtForId?: string;
  // The two services the brand actually differentiates on get a larger
  // bento tile; everything else is a standard 1x1 tile filling the gaps.
  featured?: boolean;
}

const services: Service[] = [
  {
    icon: Coins,
    title: "Fintech & Payments Engineering",
    description:
      "M-Pesa integration, payment tracking, and financial dashboards built for real transaction volume and audit requirements, not just a sandbox flow. This is the core of what Stackfen builds.",
    builtFor: "PayTrack",
    builtForId: "paytrack",
    featured: true,
  },
  {
    icon: Sparkles,
    title: "AI & LLM Integration",
    description:
      "Multi-agent AI systems and third-party model integration — wiring AI capability into a product without it feeling bolted on.",
    builtFor: "Imara Finance AI",
    builtForId: "imara-finance-ai",
    featured: true,
  },
  {
    icon: Globe,
    title: "Web Application Development",
    description:
      "Fullstack web apps built end-to-end — React on the front end, Node.js and PostgreSQL/Supabase on the back — shipped to real users, not left as demos.",
    builtFor: "Renziy",
    builtForId: "renziy",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native-feel apps with React Native and Expo, including offline-first architecture for real-world conditions like weak signal or limited data.",
    builtFor: "Amani",
    builtForId: "amani",
  },
  {
    icon: Webhook,
    title: "API & Third-Party Integrations",
    description:
      "REST APIs, webhook handling, and third-party service integration — the connective tissue that lets a product talk to the rest of the world reliably.",
  },
  {
    icon: Database,
    title: "Database & Backend Architecture",
    description:
      "Relational schema design, row-level security, and backend infrastructure built to hold up under real data, not just pass a demo.",
  },
  {
    icon: ShieldCheck,
    title: "Security Hardening",
    description:
      "Webhook signature verification, rate limiting, and security headers — the guardrails that keep a product trustworthy under real traffic.",
  },
  {
    icon: GitBranch,
    title: "DevOps & Deployment Automation",
    description: "CI/CD pipelines and automated deployment workflows, so shipping a change is routine, not risky.",
  },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-slate-200 px-6 py-24 dark:border-slate-900">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="01 · Services"
            title="Services"
            description="Work spans fintech, education, and creative industries — including engagements with Imara Capital, Sam Creative Design School, and Sam Creative Graphics."
          />
        </Reveal>

        {/* Bento layout: the two featured tiles claim a 2x2 / 2x1 footprint
            on desktop, and grid-flow-dense lets the remaining 1x1 tiles fill
            in around them automatically — no manual placement needed. On
            mobile/tablet the spans just clamp to the available columns, so
            featured tiles simply read as full-width highlight cards. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal
              key={service.title}
              delay={index * 0.06}
              className={service.featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : undefined}
            >
              <SpotlightCard className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-600/40 hover:shadow-lg hover:shadow-amber-600/5 dark:border-slate-800 dark:bg-slate-900/50">
                <div className={`flex h-full flex-col ${service.featured ? "p-8" : "p-6"}`}>
                  <span className="absolute right-5 top-5 font-display text-xs font-semibold text-slate-300 dark:text-slate-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div
                    className={`inline-flex shrink-0 rounded-xl bg-amber-500/10 ${service.featured ? "p-3.5" : "p-2.5"}`}
                  >
                    <service.icon size={service.featured ? 26 : 20} className="text-amber-700 dark:text-amber-400" />
                  </div>
                  <h3
                    className={`mt-4 font-display font-semibold text-slate-950 dark:text-slate-50 ${
                      service.featured ? "text-xl" : "text-base"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-2 leading-relaxed text-slate-600 dark:text-slate-400 ${
                      service.featured ? "text-sm sm:text-base" : "text-sm"
                    }`}
                  >
                    {service.description}
                  </p>
                  <div className="flex-1" />
                  {service.builtFor &&
                    (service.builtForId ? (
                      <Link
                        to={`/projects/${service.builtForId}`}
                        className="mt-4 inline-flex w-fit items-center text-xs font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
                      >
                        Built for {service.builtFor} →
                      </Link>
                    ) : (
                      <p className="mt-4 text-xs font-medium text-amber-700 dark:text-amber-400">
                        Built for {service.builtFor}
                      </p>
                    ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
