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
      className="relative isolate overflow-hidden pt-32 pb-24 px-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-tech/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-success/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-accent-tech" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
            {t<string>("germany.hero.badge")}
          </span>
        </m.div>

        <div className="grid lg:grid-cols-12 gap-10 items-center mt-8">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-tech">
              {t<string>("germany.hero.eyebrow")}
            </p>
            <m.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white"
            >
              {t<string>("germany.hero.title")}{" "}
              <span className="bg-linear-to-r from-accent-primary to-accent-tech bg-clip-text text-transparent">
                {t<string>("germany.hero.titleHighlight")}
              </span>
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              {t<string>("germany.hero.description")}
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`mt-8 flex flex-wrap items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <Link
                to={localizedPath("/chancenkarte/eligibility")}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                {t<string>("germany.hero.primaryCta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to={localizedPath("/contact")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-accent-tech/40 shadow-sm transition-all font-semibold"
              >
                <Compass className="w-4 h-4 text-accent-tech" />
                {t<string>("germany.hero.secondaryCta")}
              </Link>
            </m.div>
          </div>

          <m.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 grid grid-cols-1 gap-3"
          >
            <HeroStat label={t<string>("germany.hero.stat1Label")} value={t<string>("germany.hero.stat1Value")} />
            <HeroStat label={t<string>("germany.hero.stat2Label")} value={t<string>("germany.hero.stat2Value")} />
            <HeroStat label={t<string>("germany.hero.stat3Label")} value={t<string>("germany.hero.stat3Value")} />
            <div className="mt-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-accent-tech shrink-0" />
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {t<string>("germany.trustBar.title")} · BAMF-aligned · Anabin · GDPR
              </p>
            </div>
          </m.div>
        </div>

        <div className="mt-12">
          <TrustIndicators variant="light" />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:border-accent-tech/30 transition-all">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
