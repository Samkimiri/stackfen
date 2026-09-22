import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Process from "./components/Process";
import TechStack from "./components/TechStack";
import About from "./components/About";
import Partners from "./components/Partners";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import { SiteDataProvider } from "./context/SiteDataContext";
import { trackPageView } from "./lib/trackView";

// Routes most visitors never touch (admin tooling, the personal
// portfolio/resume) are code-split out of the main bundle so a first-time
// visitor to "/" only downloads what the home page actually needs.
const AdminApp = lazy(() => import("./admin/AdminApp"));
const Resume = lazy(() => import("./components/Resume"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const ProjectCaseStudy = lazy(() => import("./components/ProjectCaseStudy"));
const NotFound = lazy(() => import("./components/NotFound"));
const Privacy = lazy(() => import("./components/Privacy"));
const Terms = lazy(() => import("./components/Terms"));
// Only rendered once per session (see hasSeenIntro below) — split out so
// repeat-session visitors never pay to parse/eval it at all.
const IntroAnimation = lazy(() => import("./components/IntroAnimation"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-400 dark:bg-slate-950 dark:text-slate-600">
      Loading…
    </div>
  );
}

const INTRO_SESSION_KEY = "stackfen-intro-seen";

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return true; // sessionStorage unavailable (private mode, etc.) — skip rather than risk a loop.
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    // Nothing to do — worst case the intro replays on the next load.
  }
}

function MainSite() {
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());

  useEffect(() => {
    trackPageView("/");
  }, []);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  function handleIntroComplete() {
    markIntroSeen();
    setShowIntro(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {showIntro && (
        <Suspense fallback={null}>
          <IntroAnimation onComplete={handleIntroComplete} />
        </Suspense>
      )}
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process eyebrow="02 · How We Work" />
        <TechStack />
        <About eyebrow="03 · About" />
        <Projects eyebrow="04 · Projects" />
        <Partners eyebrow="05 · Partners" />
        <Testimonials eyebrow="06 · Testimonials" />
        <FAQ eyebrow="07 · FAQ" />
        <Contact eyebrow="08 · Contact" />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/projects/:id" element={<ProjectCaseStudy />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Analytics />
    </SiteDataProvider>
  );
}
