import { useEffect } from "react";
import { m } from "motion/react";
import { HeartPulse, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { GermanyWorkforceModule } from "../sections/germany-workforce-module";
import { WorkforceCalculator } from "../sections/workforce-calculator";
import { SeoManager } from "../seo/seo-manager";
import { usePersonalization } from "@/hooks/usePersonalization";

export function NursingPage() {
  const { t, dir } = useLanguage();
  const { recordSignal } = usePersonalization();

  useEffect(() => {
    recordSignal({ type: "page_view", page: "/nursing" });
  }, [recordSignal]);

  const complianceItems = (t("workforce.complianceItems") as string[]) || [];

  return (
    <main dir={dir} className="min-h-screen section-gradient">
      <SeoManager
        title={t<string>("seo.sections.workforce.title")}
        description={t<string>("seo.sections.workforce.description")}
        path="/nursing"
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: t<string>("seo.sections.workforce.title"), path: "/nursing" },
        ]}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* HERO                                                    */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="relative page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] overflow-hidden" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-150 h-150 rounded-full blur-[150px] opacity-10" style={{ background: "rgb(244,63,94)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-125 h-125 rounded-full blur-[150px] opacity-8" style={{ background: "rgb(0,184,217)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        </div>

        <div className="page-hero-inner">
          <div className="page-hero-crumb-gap">
            <Breadcrumbs
              items={[
                { label: t<string>("common.home"), href: "/" },
                { label: t<string>("seo.sections.workforce.title"), href: "/nursing" },
              ]}
            />
          </div>

          <div className="page-hero-grid">
            <div className="page-hero-main">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full page-hero-badge-gap"
                style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)" }}
              >
                <HeartPulse className="w-4 h-4" style={{ color: "rgb(244,63,94)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgb(244,63,94)" }}>
                  {t<string>("workforce.badge")}
                </span>
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold mb-4 sm:mb-5 lg:mb-5 leading-[1.08] tracking-tight text-text-primary"
              >
                {t<string>("workforce.title")}
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl mb-5 lg:mb-6 leading-relaxed text-text-muted"
              >
                {t<string>("workforce.description")}
              </m.p>
            </div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="page-hero-aside flex flex-col gap-3"
            >
              {complianceItems.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/20 text-sm font-medium text-rose-700 dark:text-rose-400"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  {item}
                </span>
              ))}
            </m.div>
          </div>
        </div>
      </div>

      <GermanyWorkforceModule />

      <section id="workforce-calculator" className="pt-8 md:pt-10">
        <WorkforceCalculator />
      </section>
    </main>
  );
}
