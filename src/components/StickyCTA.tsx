import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Appears once the visitor scrolls past the Hero (so it never competes with
// the Hero's own CTAs) and hides again once the Contact section itself is on
// screen (so it never overlaps the real contact form/CTAs there).
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEnd = document.getElementById("services");
    const contact = document.getElementById("contact");
    if (!heroEnd || !contact) return;

    let pastHero = false;
    let atContact = false;

    function update() {
      setVisible(pastHero && !atContact);
    }

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        update();
      },
      { threshold: 0 },
    );
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        atContact = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );

    heroObserver.observe(heroEnd);
    contactObserver.observe(contact);

    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-amber-600/30 transition-colors hover:bg-amber-500"
        >
          Start a Project
          <ArrowRight size={16} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
