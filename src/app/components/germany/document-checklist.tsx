import { m } from "motion/react";
import { CheckCircle2, FileText } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import {
  CHANCENKARTE_REQUIREMENTS,
  REQUIREMENT_GROUPS,
} from "@/data/germany/germanyRequirements";

export function DocumentChecklist() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-6 bg-background-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("chancenkarte.requirements.badge")}
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            {t<string>("chancenkarte.requirements.title")}
          </h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
            {t<string>("chancenkarte.requirements.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {REQUIREMENT_GROUPS.map((groupId) => {
            const items = CHANCENKARTE_REQUIREMENTS.filter((r) => r.group === groupId);
            return (
              <m.div
                key={groupId}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35 }}
                className="p-6 rounded-2xl border border-border bg-background-surface"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <span className="w-9 h-9 rounded-lg bg-accent-primary/10 text-accent-primary-text flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-text-primary">
                    {t<string>(`chancenkarte.requirements.groups.${groupId}`)}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          item.mandatory ? "text-emerald-500" : "text-text-muted"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-text-primary">
                          {t<string>(`chancenkarte.requirements.items.${item.id}.label`)}
                        </p>
                        <span
                          className={`mt-0.5 inline-block text-[10px] uppercase tracking-widest font-semibold ${
                            item.mandatory ? "text-emerald-600 dark:text-emerald-400" : "text-text-muted"
                          }`}
                        >
                          {item.mandatory
                            ? t<string>("chancenkarte.requirements.mandatoryLabel")
                            : t<string>("chancenkarte.requirements.optionalLabel")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
