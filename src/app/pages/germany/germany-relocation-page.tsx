import { Link } from "react-router-dom";
import { m } from "motion/react";
import { ArrowRight, Plane } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { ChancenkarteTimeline } from "../../components/germany/chancenkarte-timeline";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function GermanyRelocationPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  return (
    <main dir={dir} className="bg-bg-primary">
      <SeoManager path="/germany-relocation" pageKey="germanyRelocation" />
      <section className="relative page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] overflow-hidden bg-bg-primary border-b border-border/50 transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-primary/6 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-tech/6 rounded-full blur-[130px]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        </div>
        <div className="page-hero-inner">
          <div className="page-hero-crumb-gap">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: "Germany Relocation", href: localizedPath("/germany-relocation") },
            ]}
          />
          </div>
          <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent-primary/25 bg-accent-primary/6 shadow-sm text-xs font-bold uppercase tracking-widest text-accent-primary-text page-hero-badge-gap">
            <Plane className="w-3.5 h-3.5 text-accent-primary-text" />
            {t<string>("germany.relocation.hero.badge")}
          </span>
          <h1 className="mt-4 sm:mt-5 lg:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold tracking-tight leading-[1.08] text-text-primary">
            {t<string>("germany.relocation.hero.title")}
          </h1>
          <p className="mt-4 lg:mt-4 max-w-3xl lg:max-w-none text-xl text-text-secondary leading-relaxed">
            {t<string>("germany.relocation.hero.description")}
          </p>
          <div className="mt-6 lg:mt-7">
            <Link
              to={localizedPath("/chancenkarte/eligibility")}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-gold-primary font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              {t<string>("germany.relocation.hero.cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-[var(--content-gutter)]">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t<readonly { title: string; body: string }[]>("germany.relocation.services").map((s, i) => (
            <m.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-border/50 bg-bg-surface"
            >
              <p className="text-sm font-bold text-text-primary">{s.title}</p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{s.body}</p>
            </m.div>
          ))}
        </div>
      </section>

      <ChancenkarteTimeline />
      <ChancenkarteFinalCta />
    </main>
  );
}
