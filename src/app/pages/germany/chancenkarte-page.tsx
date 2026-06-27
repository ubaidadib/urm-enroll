import { useEffect } from "react";
import { Link } from "react-router-dom";
import { m } from "motion/react";
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { TrustIndicators } from "../../components/germany/trust-indicators";
import { ChancenkarteTimeline } from "../../components/germany/chancenkarte-timeline";
import { GermanyProfessionCards } from "../../components/germany/germany-profession-cards";
import { GermanyFAQ } from "../../components/germany/germany-faq";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";
import { usePersonalization } from "@/hooks/usePersonalization";

export function ChancenkartePage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  const { recordSignal } = usePersonalization();

  useEffect(() => {
    recordSignal({ type: "page_view", page: "/chancenkarte" });
  }, [recordSignal]);

  return (
    <main dir={dir} className="bg-bg-primary">
      <SeoManager path="/chancenkarte" pageKey="chancenkarte" />

      <section className="relative isolate overflow-hidden page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] bg-bg-primary border-b border-border/50 transition-colors duration-500">
        <div className="absolute inset-0 -z-10 pointer-events-none">
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
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
            ]}
          />
          </div>

          <div className="page-hero-grid">
            <div className="page-hero-main">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent-primary/25 bg-accent-primary/6 shadow-sm page-hero-badge-gap">
                <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent-primary">
                  {t<string>("chancenkarte.hub.badge")}
                </span>
              </span>

              <m.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-4 sm:mt-5 lg:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold leading-[1.08] tracking-tight text-text-primary"
              >
                {t<string>("chancenkarte.hub.title")}
              </m.h1>
              <p className="mt-4 text-lg md:text-xl text-text-secondary">{t<string>("chancenkarte.hub.titleSub")}</p>
              <p className="mt-4 max-w-xl lg:max-w-none text-text-secondary leading-relaxed">
                {t<string>("chancenkarte.hub.description")}
              </p>

              <div className="mt-6 lg:mt-7 flex flex-wrap gap-3">
                <Link
                  to={localizedPath("/chancenkarte/eligibility")}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-gold-primary font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
                >
                  {t<string>("chancenkarte.hub.primaryCta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to={localizedPath("/contact")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border/50 bg-bg-surface text-text-primary hover:border-accent-tech/40 shadow-sm transition-all font-semibold"
                >
                  <MessageCircle className="w-4 h-4 text-accent-tech" />
                  {t<string>("chancenkarte.hub.secondaryCta")}
                </Link>
              </div>
            </div>

            <div className="page-hero-aside grid grid-cols-2 gap-3">
              {(["validity", "minPoints", "workAllowance", "familyJoin"] as const).map((k) => (
                <div
                  key={k}
                  className="p-5 rounded-2xl border border-border/50 bg-bg-surface/80 backdrop-blur-md shadow-sm hover:border-accent-primary/30 hover:shadow-md transition-all duration-200"
                >
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">
                    {t<string>(`chancenkarte.hub.quickFacts.${k}.label`)}
                  </p>
                  <p className="mt-1 text-xl font-black text-text-primary">
                    {t<string>(`chancenkarte.hub.quickFacts.${k}.value`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <TrustIndicators variant="light" />
          </div>
        </div>
      </section>

      {/* Explainer */}
      <section className="page-section-y px-[var(--content-gutter)] bg-bg-surface">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
              {t<string>("chancenkarte.hub.badge")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
              {t<string>("chancenkarte.hub.explainer.title")}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              {t<string>("chancenkarte.hub.explainer.body")}
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {t<readonly { title: string; body: string }[]>("chancenkarte.hub.pillars").map((p) => (
                <div key={p.title} className="p-4 rounded-2xl border border-border/50 bg-bg-surface">
                  <ShieldCheck className="w-4 h-4 text-accent-primary mb-2" />
                  <p className="text-sm font-bold text-text-primary">{p.title}</p>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ChancenkarteTimeline />
      <GermanyProfessionCards />
      <GermanyFAQ />
      <ChancenkarteFinalCta />
    </main>
  );
}
