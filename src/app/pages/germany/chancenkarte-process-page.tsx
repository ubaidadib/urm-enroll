import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { ChancenkarteTimeline } from "../../components/germany/chancenkarte-timeline";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function ChancenkarteProcessPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  return (
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager path="/chancenkarte/process" pageKey="chancenkarteProcess" />
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
              { label: t<string>("chancenkarte.process.breadcrumb"), href: localizedPath("/chancenkarte/process") },
            ]}
          />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("chancenkarte.process.badge")}
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t<string>("chancenkarte.process.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t<string>("chancenkarte.process.description")}
          </p>
        </div>
      </section>
      <ChancenkarteTimeline />
      <ChancenkarteFinalCta />
    </main>
  );
}
