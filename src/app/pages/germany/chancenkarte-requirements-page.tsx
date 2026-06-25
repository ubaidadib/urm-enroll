import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { DocumentChecklist } from "../../components/germany/document-checklist";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function ChancenkarteRequirementsPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  return (
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager path="/chancenkarte/requirements" pageKey="chancenkarteRequirements" />
      <section className="page-hero-offset page-hero-pb-compact px-[var(--content-gutter)]">
        <div className="page-hero-inner">
          <div className="page-hero-crumb-gap">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
              { label: t<string>("chancenkarte.requirements.breadcrumb"), href: localizedPath("/chancenkarte/requirements") },
            ]}
          />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("chancenkarte.requirements.badge")}
          </p>
          <h1 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t<string>("chancenkarte.requirements.title")}
          </h1>
          <p className="mt-4 max-w-2xl lg:max-w-3xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t<string>("chancenkarte.requirements.description")}
          </p>
        </div>
      </section>
      <DocumentChecklist />
      <ChancenkarteFinalCta />
    </main>
  );
}
