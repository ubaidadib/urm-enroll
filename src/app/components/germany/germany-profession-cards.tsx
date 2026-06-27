import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { GERMANY_PROFESSIONS } from "@/data/germany/germanyProfessions";

export function GermanyProfessionCards() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-6 bg-background-primary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("germany.professions.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            {t<string>("germany.professions.title")}
          </h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
            {t<string>("germany.professions.description")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GERMANY_PROFESSIONS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <m.article
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group relative p-6 rounded-2xl border border-border bg-background-surface hover:border-accent-primary/40 hover:shadow-[0_18px_44px_-22px_rgba(11,21,48,0.25)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-accent-primary/10 text-accent-primary-text flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-bold text-text-primary">
                    {t<string>(`germany.professions.items.${p.id}.label`)}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {t<string>(`germany.professions.items.${p.id}.body`)}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-text-muted uppercase tracking-widest">
                      {t<string>("germany.professions.salaryLabel")}
                    </p>
                    <p className="text-sm font-bold text-text-primary mt-0.5">
                      €{p.avgSalaryEur.toLocaleString("de-DE")}
                    </p>
                  </div>
                  <ShortageBadge level={p.shortageIndex} />
                </div>
              </m.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShortageBadge({ level }: { level: "high" | "very_high" | "critical" }) {
  const { t } = useLanguage();
  const styles: Record<typeof level, string> = {
    high: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    very_high: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
    critical: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${styles[level]}`}>
      {t<string>(`germany.professions.shortage.${level}`)}
    </span>
  );
}
