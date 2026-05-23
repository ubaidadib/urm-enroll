import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { GermanyFAQ } from "../../components/germany/germany-faq";
import { CHANCENKARTE_FAQ_IDS } from "@/data/germany/chancenkarteFaq";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function ChancenkarteFaqPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();

  // FAQPage structured data — passed to SeoManager
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CHANCENKARTE_FAQ_IDS.map((id) => ({
      "@type": "Question",
      name: t<string>(`chancenkarte.faq.entries.${id}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t<string>(`chancenkarte.faq.entries.${id}.answer`),
      },
    })),
  };

  return (
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager path="/chancenkarte/faq" pageKey="chancenkarteFaq" structuredData={faqSchema} />
      <section className="pt-28 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
              { label: t<string>("chancenkarte.faq.breadcrumb"), href: localizedPath("/chancenkarte/faq") },
            ]}
          />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("chancenkarte.faq.badge")}
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t<string>("chancenkarte.faq.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t<string>("chancenkarte.faq.description")}
          </p>
        </div>
      </section>
      <GermanyFAQ />
      <ChancenkarteFinalCta />
    </main>
  );
}
