import { m } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Compass } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useLocalizedPath } from "./useLocalizedPath";
import { TrustIndicators } from "./trust-indicators";

export function GermanyCareersHero() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  const isRtl = dir === "rtl";

  return (
    <section
      dir={dir}
      className="relative isolate overflow-hidden page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] bg-bg-primary border-b border-border/50 transition-colors duration-500"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[42rem] h-[42rem] bg-accent-primary/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[36rem] h-[36rem] bg-accent-tech/6 rounded-full blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent-primary/20 to-transparent" />
      </div>

      <div className="relative page-hero-inner">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent-primary/25 bg-accent-primary/6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-primary-text" />
          <span className="text-xs font-bold uppercase tracking-widest text-accent-primary-text">
            {t<string>("germany.hero.badge")}
          </span>
        </m.div>

        <div className="page-hero-grid mt-6 lg:mt-6">
          <div className="page-hero-main">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-primary-text mb-3">
              {t<string>("germany.hero.eyebrow")}
            </p>
            <m.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold leading-[1.08] tracking-tight text-text-primary"
            >
              {t<string>("germany.hero.title")}{" "}
              <span className="text-accent-primary-text">
                {t<string>("germany.hero.titleHighlight")}
              </span>
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 lg:mt-4 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed"
            >
              {t<string>("germany.hero.description")}
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`mt-6 lg:mt-7 flex flex-wrap items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <Link
                to={localizedPath("/chancenkarte/eligibility")}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-gold-primary font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              >
                {t<string>("germany.hero.primaryCta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to={localizedPath("/contact")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border/60 bg-bg-surface/80 text-text-primary hover:border-accent-primary/40 hover:bg-bg-surface shadow-sm transition-all duration-200 font-semibold"
              >
                <Compass className="w-4 h-4 text-accent-primary-text" />
                {t<string>("germany.hero.secondaryCta")}
              </Link>
            </m.div>
          </div>

          <m.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="page-hero-aside grid grid-cols-1 gap-3"
          >
            <HeroStat label={t<string>("germany.hero.stat1Label")} value={t<string>("germany.hero.stat1Value")} index={0} />
            <HeroStat label={t<string>("germany.hero.stat2Label")} value={t<string>("germany.hero.stat2Value")} index={1} />
            <HeroStat label={t<string>("germany.hero.stat3Label")} value={t<string>("germany.hero.stat3Value")} index={2} />
            <div className="p-4 rounded-2xl border border-accent-primary/20 bg-accent-primary/5 backdrop-blur-md shadow-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-accent-primary-text shrink-0" />
              <p className="text-xs leading-relaxed text-text-secondary">
                {t<string>("germany.trustBar.title")} · BAMF-aligned · Anabin · GDPR
              </p>
            </div>
          </m.div>
        </div>

        <div className="mt-8 lg:mt-10">
          <TrustIndicators variant="light" />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <m.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.07 }}
      className="group p-4 rounded-2xl border border-border/50 bg-bg-surface/80 backdrop-blur-md shadow-sm hover:border-accent-primary/30 hover:shadow-md transition-all duration-200"
    >
      <p className="text-[10px] uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-accent-primary-text tabular-nums">{value}</p>
    </m.div>
  );
}
