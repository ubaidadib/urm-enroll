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
    <main dir={dir} className="bg-bg-primary">
      <SeoManager path="/chancenkarte/success-stories" pageKey="chancenkarteSuccessStories" />
      <section className="relative page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] overflow-hidden bg-bg-primary border-b border-border/50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-accent-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-accent-tech/5 rounded-full blur-[120px]" />
        </div>
        <div className="page-hero-inner">
          <div className="page-hero-crumb-gap">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
              { label: t<string>("chancenkarte.successStories.breadcrumb"), href: localizedPath("/chancenkarte/success-stories") },
            ]}
          />
          </div>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent-primary/25 bg-accent-primary/6 shadow-sm page-hero-badge-gap">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-primary-text">
              {t<string>("chancenkarte.successStories.badge")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold text-text-primary tracking-tight leading-[1.08]">
            {t<string>("chancenkarte.successStories.title")}
          </h1>
          <p className="mt-4 max-w-2xl lg:max-w-3xl text-text-secondary leading-relaxed">
            {t<string>("chancenkarte.successStories.description")}
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-bg-surface">
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
