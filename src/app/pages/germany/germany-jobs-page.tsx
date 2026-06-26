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
    <main dir={dir} className="bg-bg-primary">
      <SeoManager path="/germany-jobs" pageKey="germanyJobs" />
      <section className="relative page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] overflow-hidden bg-bg-primary border-b border-border/50 transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-tech/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-success/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        </div>
        <div className="page-hero-inner">
          <div className="page-hero-crumb-gap">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: "Germany Jobs", href: localizedPath("/germany-jobs") },
            ]}
          />
          </div>
          <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border/50 bg-bg-surface shadow-sm text-xs font-bold uppercase tracking-widest text-text-primary page-hero-badge-gap">
            <Briefcase className="w-4 h-4 text-accent-tech" />
            {t<string>("germany.jobs.hero.badge")}
          </span>
          <h1 className="mt-4 sm:mt-5 lg:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold tracking-tight leading-[1.1] text-text-primary">
            {t<string>("germany.jobs.hero.title")}
          </h1>
          <p className="mt-4 lg:mt-4 max-w-3xl lg:max-w-none text-xl text-text-secondary leading-relaxed">
            {t<string>("germany.jobs.hero.description")}
          </p>
          <div className="mt-6 lg:mt-7">
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

      <section className="py-10 sm:py-14 px-[var(--content-gutter)] bg-bg-surface">
        <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl border border-border/50 bg-bg-surface/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3 text-text-primary">
            <MapPin className="w-5 h-5 text-accent-tech" />
            <h2 className="text-xl font-bold">Berlin · Munich · Hamburg · Stuttgart · Frankfurt</h2>
          </div>
          <p className="mt-3 text-text-secondary leading-relaxed">
            {t<string>("germany.jobs.fitDescription")}
          </p>
        </div>
      </section>

      <GermanyProfessionCards />
      <ChancenkarteFinalCta />
    </main>
  );
}
