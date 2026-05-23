import { m } from "motion/react";
import { Globe2, Sparkles } from "lucide-react";
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
    <section className="relative min-h-[65vh] bg-bg-primary px-4 py-24 sm:px-6 lg:px-10">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-brand-gold-500/8 blur-[140px]" />
        <div className="absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-brand-steel-400/6 blur-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-softnav-50/3 to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
        {/* Main content */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow */}
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-brand-sand-100/40 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-brand-gold-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-primary">
              Global Program Discovery
            </span>
          </m.div>

          {/* Main headline */}
          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-3xl font-display text-[clamp(2.8rem,7vw,5.2rem)] font-black leading-[0.95] tracking-[-0.03em] text-text-primary"
          >
            Your future starts{" "}
            <span className="bg-gradient-to-r from-brand-gold-500 to-brand-steel-600 bg-clip-text text-transparent">
              globally
            </span>
          </m.h1>

          {/* Subheading */}
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="max-w-2xl text-lg leading-relaxed text-text-secondary"
          >
            Discover programs designed for your ambitions. Find careers with purpose, salary potential, visa pathways,
            and the global mobility that defines the next generation of professionals.
          </m.p>

          {/* Trust indicators */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="flex flex-wrap gap-6 pt-2"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-navy-900/10 p-2">
                <Globe2 className="h-5 w-5 text-brand-navy-900" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{totalCountries}</p>
                <p className="text-xs text-text-muted">countries available</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-gold-500/10 p-2">
                <span className="text-sm font-bold text-brand-gold-600">{topMatchPercentage}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Smart Match</p>
                <p className="text-xs text-text-muted">AI-powered matching</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-steel-500/10 p-2">
                <span className="text-sm font-bold text-brand-steel-600">{(totalPrograms / 1000).toFixed(1)}k+</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Programs</p>
                <p className="text-xs text-text-muted">from top institutions</p>
              </div>
            </div>
          </m.div>
        </div>

        {/* Right side visual accent */}
        <m.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.24, duration: 0.7 }}
          className="hidden lg:col-span-5 lg:block"
        >
          <div className="relative">
            {/* Premium glass card with stats */}
            <div className="rounded-3xl border border-border bg-white/50 backdrop-blur-xl p-6 dark:bg-brand-softnav-900/40 dark:border-border/50">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                Discovery insights
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-brand-gold-100/50 dark:bg-brand-gold-900/20 px-4 py-3">
                  <span className="text-sm font-semibold text-text-primary">Premium Scholarships</span>
                  <span className="text-sm font-bold text-brand-gold-600">1,200+</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-brand-steel-100/50 dark:bg-brand-steel-900/20 px-4 py-3">
                  <span className="text-sm font-semibold text-text-primary">Visa-Friendly</span>
                  <span className="text-sm font-bold text-brand-steel-600">890+</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-brand-softnav-100/50 dark:bg-brand-softnav-900/30 px-4 py-3">
                  <span className="text-sm font-semibold text-text-primary">High Employability</span>
                  <span className="text-sm font-bold text-brand-softnav-600">2,400+</span>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-brand-gold-500/10 blur-3xl" />
          </div>
        </m.div>
      </div>
    </section>
  );
}
