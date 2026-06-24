import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { GermanyProfessionCards } from "../../components/germany/germany-profession-cards";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function GermanyJobsPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  return (
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager path="/germany-jobs" pageKey="germanyJobs" />
      <section className="relative page-hero-offset pb-12 sm:pb-20 px-[var(--content-gutter)] overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-tech/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-success/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: "Germany Jobs", href: localizedPath("/germany-jobs") },
            ]}
          />
          <span className="inline-flex items-center gap-3 mt-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
            <Briefcase className="w-4 h-4 text-accent-tech" />
            {t<string>("germany.jobs.hero.badge")}
          </span>
          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            {t<string>("germany.jobs.hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t<string>("germany.jobs.hero.description")}
          </p>
          <div className="mt-8">
            <Link
              to={localizedPath("/chancenkarte/eligibility")}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-gold-primary font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              {t<string>("germany.jobs.hero.cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-[var(--content-gutter)] bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <MapPin className="w-5 h-5 text-accent-tech" />
            <h2 className="text-xl font-bold">Berlin · Munich · Hamburg · Stuttgart · Frankfurt</h2>
          </div>
          <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
            {t<string>("germany.jobs.fitDescription")}
          </p>
        </div>
      </section>

      <GermanyProfessionCards />
      <ChancenkarteFinalCta />
    </main>
  );
}
