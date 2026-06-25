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
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager path="/chancenkarte" pageKey="chancenkarte" />

      <section className="relative isolate overflow-hidden page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
        <div className="absolute inset-0 -z-10 pointer-events-none">
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
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
            ]}
          />
          </div>

          <div className="page-hero-grid">
            <div className="page-hero-main">
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm page-hero-badge-gap">
                <Sparkles className="w-4 h-4 text-accent-tech" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                  {t<string>("chancenkarte.hub.badge")}
                </span>
              </span>

              <m.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-4 sm:mt-5 lg:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white"
              >
                {t<string>("chancenkarte.hub.title")}
              </m.h1>
              <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-400">{t<string>("chancenkarte.hub.titleSub")}</p>
              <p className="mt-4 max-w-xl lg:max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
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
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-accent-tech/40 shadow-sm transition-all font-semibold"
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
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:border-accent-tech/30 transition-all"
                >
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">
                    {t<string>(`chancenkarte.hub.quickFacts.${k}.label`)}
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
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
      <section className="page-section-y px-[var(--content-gutter)] bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
              {t<string>("chancenkarte.hub.badge")}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t<string>("chancenkarte.hub.explainer.title")}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg">
              {t<string>("chancenkarte.hub.explainer.body")}
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {t<readonly { title: string; body: string }[]>("chancenkarte.hub.pillars").map((p) => (
                <div key={p.title} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <ShieldCheck className="w-4 h-4 text-accent-primary mb-2" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.body}</p>
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
