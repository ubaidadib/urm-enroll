import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { CHANCENKARTE_PROCESS } from "@/data/germany/germanyProcess";

export function ChancenkarteTimeline() {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-6 bg-background-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("chancenkarte.process.badge")}
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            {t<string>("chancenkarte.process.title")}
          </h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
            {t<string>("chancenkarte.process.description")}
          </p>
        </div>

        <ol className="relative grid gap-6 md:gap-4">
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 md:left-1/2 w-px bg-gradient-to-b from-accent-primary/40 via-border to-transparent"
          />

          {CHANCENKARTE_PROCESS.map((step, idx) => {
            const Icon = step.icon;
            const sideRight = idx % 2 === 1;
            return (
              <m.li
                key={step.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-10 md:items-center ${
                  sideRight ? "" : "md:[direction:ltr]"
                }`}
              >
                <span
                  className="absolute left-1.5 md:left-1/2 -translate-x-1/2 top-2 w-9 h-9 rounded-xl bg-accent-primary/10 text-accent-primary-text flex items-center justify-center shadow-md ring-1 ring-accent-primary/30"
                  aria-hidden="true"
                >
                  <Icon className="w-4 h-4" />
                </span>

                <div
                  className={`p-5 md:p-6 rounded-2xl bg-background-surface border border-border shadow-sm ${
                    sideRight ? "md:col-start-2" : "md:col-start-1"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                    {t<string>("chancenkarte.process.durationLabel")} ·{" "}
                    {step.durationWeeks[0] === step.durationWeeks[1]
                      ? step.durationWeeks[0]
                      : `${step.durationWeeks[0]}–${step.durationWeeks[1]}`}{" "}
                    {t<string>("chancenkarte.process.weeksUnit")}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-text-primary">
                    {t<string>(`chancenkarte.process.steps.${step.id}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    {t<string>(`chancenkarte.process.steps.${step.id}.body`)}
                  </p>
                </div>
              </m.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
