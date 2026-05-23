import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { CHANCENKARTE_FAQ_IDS } from "@/data/germany/chancenkarteFaq";

export function GermanyFAQ() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(CHANCENKARTE_FAQ_IDS[0]);

  return (
    <section className="py-20 px-6 bg-background-elevated">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("chancenkarte.faq.badge")}
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            {t<string>("chancenkarte.faq.title")}
          </h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
            {t<string>("chancenkarte.faq.description")}
          </p>
        </div>

        <div className="space-y-3">
          {CHANCENKARTE_FAQ_IDS.map((id) => {
            const isOpen = openId === id;
            return (
              <div
                key={id}
                className="rounded-2xl border border-border bg-background-surface overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start hover:bg-background-hover transition-colors"
                >
                  <span className="text-sm md:text-base font-semibold text-text-primary">
                    {t<string>(`chancenkarte.faq.entries.${id}.question`)}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                        {t<string>(`chancenkarte.faq.entries.${id}.answer`)}
                      </p>
                    </m.div>
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
