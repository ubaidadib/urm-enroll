import { m } from "motion/react";
import { Globe2, Sparkles, GraduationCap, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface ProgramsHeroProps {
  totalPrograms: number;
  totalCountries: number;
  topMatchPercentage: number;
}

export function ProgramsHero({
  totalPrograms,
  totalCountries,
  topMatchPercentage,
}: ProgramsHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative page-hero-offset page-hero-pb bg-bg-primary px-4 sm:px-6 lg:px-[var(--content-gutter)] overflow-hidden border-b border-border/50">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-accent-primary/7 blur-[140px]" />
        <div className="absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-accent-tech/6 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent-primary/20 to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left — text */}
        <div className="lg:col-span-7 space-y-5">
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-accent-primary/25 bg-accent-primary/6 px-4 py-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-accent-primary">
              {t<string>("programs.listing.hero.eyebrow")}
            </span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-3xl font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] leading-[1.08] tracking-tight text-text-primary lg:max-w-none"
          >
            {t<string>("programs.listing.hero.headline")}{" "}
            <span className="text-accent-primary">
              {t<string>("programs.listing.hero.headlineAccent")}
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="max-w-2xl lg:max-w-none text-base sm:text-lg leading-relaxed text-text-secondary"
          >
            {t<string>("programs.listing.hero.subtitleExtended")}
          </m.p>

          {/* Quick stats row */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="flex flex-wrap gap-4 pt-1"
          >
            {[
              {
                icon: Globe2,
                value: String(totalCountries),
                label: t<string>("programs.listing.hero.stats.countriesAvailable"),
                color: "text-accent-tech",
                bg: "bg-accent-tech/8 border-accent-tech/15",
              },
              {
                icon: Zap,
                value: `${topMatchPercentage}%`,
                label: t<string>("programs.listing.hero.stats.smartMatch"),
                color: "text-accent-primary",
                bg: "bg-accent-primary/8 border-accent-primary/15",
              },
              {
                icon: GraduationCap,
                value: `${(totalPrograms / 1000).toFixed(1)}k+`,
                label: t<string>("programs.listing.hero.stats.programs"),
                color: "text-accent-success",
                bg: "bg-accent-success/8 border-accent-success/15",
              },
            ].map(({ icon: Icon, value, label, color, bg }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className={`rounded-lg border p-2 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-black text-text-primary tabular-nums">{value}</p>
                  <p className="text-xs text-text-muted">{label}</p>
                </div>
              </div>
            ))}
          </m.div>
        </div>

        {/* Right — insights card */}
        <m.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.24, duration: 0.7 }}
          className="hidden lg:col-span-5 lg:block"
        >
          <div className="relative">
            <div className="rounded-3xl border border-border/60 bg-bg-surface/80 backdrop-blur-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  {t<string>("programs.listing.hero.insights.title")}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: t<string>("programs.listing.hero.insights.premiumScholarships"),
                    value: "1,200+",
                    color: "text-accent-primary",
                    bg: "bg-accent-primary/8 border-accent-primary/15",
                  },
                  {
                    label: t<string>("programs.listing.hero.insights.visaFriendly"),
                    value: "890+",
                    color: "text-accent-tech",
                    bg: "bg-accent-tech/8 border-accent-tech/15",
                  },
                  {
                    label: t<string>("programs.listing.hero.insights.highEmployability"),
                    value: "2,400+",
                    color: "text-accent-success",
                    bg: "bg-accent-success/8 border-accent-success/15",
                  },
                ].map(({ label, value, color, bg }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${bg} transition-all duration-200`}
                  >
                    <span className="text-sm font-semibold text-text-primary">{label}</span>
                    <span className={`text-sm font-black tabular-nums ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-accent-primary/10 blur-3xl pointer-events-none" />
          </div>
        </m.div>
      </div>
    </section>
  );
}
