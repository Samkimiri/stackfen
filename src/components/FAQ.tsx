import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface FAQProps {
  eyebrow?: string;
}

const faqs = [
  {
    question: "How is a project priced?",
    answer:
      "Scoped per project based on what's actually being built — a fixed quote for a well-defined build, or a retainer for ongoing work. You'll always know the cost before work starts.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Depends heavily on scope, but most projects ship a working version in weeks, not months, then iterate from there — see \"How we work\" above for the stages.",
  },
  {
    question: "Who owns the code and the finished product?",
    answer: "You do. The code, the repository, and the deployed product are yours once the engagement is complete.",
  },
  {
    question: "Do you support the product after launch?",
    answer:
      "Yes — monitoring, fixes, and iteration are part of the process, not a separate ask. Ongoing support terms are agreed upfront.",
  },
  {
    question: "What if I only have an idea, not a spec?",
    answer:
      "That's normal, and it's what the Discover stage is for — turning a rough idea into something buildable before any code gets written.",
  },
];

export default function FAQ({ eyebrow = "07 · FAQ" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="border-t border-slate-200 px-6 py-24 dark:border-slate-900">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title="Frequently asked questions"
            description="Common questions before a first project starts."
          />
        </Reveal>

        <div className="mt-10 divide-y divide-slate-200 dark:divide-slate-800">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question} className="py-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="font-display text-base font-semibold text-slate-950 dark:text-slate-50">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="shrink-0 text-slate-400 dark:text-slate-600"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 pr-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
