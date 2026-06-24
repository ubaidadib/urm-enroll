import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { SuccessStoryCard } from "../../components/germany/success-story-card";
import { GERMANY_TESTIMONIALS } from "@/data/germany/germanyTestimonials";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function ChancenkarteSuccessStoriesPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  return (
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager path="/chancenkarte/success-stories" pageKey="chancenkarteSuccessStories" />
      <section className="page-hero-offset pb-10 sm:pb-12 px-[var(--content-gutter)]">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
              { label: t<string>("chancenkarte.successStories.breadcrumb"), href: localizedPath("/chancenkarte/success-stories") },
            ]}
          />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
            {t<string>("chancenkarte.successStories.badge")}
          </p>
          <h1 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t<string>("chancenkarte.successStories.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t<string>("chancenkarte.successStories.description")}
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          {GERMANY_TESTIMONIALS.map((tt, i) => (
            <SuccessStoryCard key={tt.id} testimonial={tt} index={i} />
          ))}
        </div>
      </section>

      <ChancenkarteFinalCta />
    </main>
  );
}
