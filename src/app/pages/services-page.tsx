import { m } from "motion/react";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/language-context";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { ServicesGrid } from "../sections/services-grid";
import { StudentJourneySteps } from "../sections/student-journey-steps";
import { SeoManager } from "../seo/seo-manager";
import { Sparkles, TrendingUp, Globe2, Zap } from "lucide-react";
import { trackPageView } from "@/utils/tracking";
import { GlobalCTA } from "../components/cta/global-cta-system";
import { useBehavioralTriggers } from "@/hooks/useBehavioralTriggers";
import { usePersonalization } from "@/hooks/usePersonalization";

export function ServicesPage() {
  const { t, dir } = useLanguage();

  useEffect(() => { trackPageView({ page: "services" }); }, []);

  const { activeSignal, registerInteraction } = useBehavioralTriggers({ page: "services" });
  const { recordSignal } = usePersonalization();
  useEffect(() => { recordSignal({ type: "page_view", page: "/services" }); }, [recordSignal]);
  const postGridIntent = activeSignal !== "none" ? "high" as const : "medium" as const;

  const heroStats = [
    { label: t<string>("services.stats.successRateLabel"), value: t<string>("services.stats.successRateValue"), icon: TrendingUp, color: "text-accent-success", bg: "bg-accent-success/10", border: "border-accent-success/20" },
    { label: t<string>("services.stats.partnersLabel"), value: t<string>("services.stats.partnersValue"), icon: Globe2, color: "text-accent-tech", bg: "bg-accent-tech/10", border: "border-accent-tech/20" },
    { label: t<string>("services.stats.speedLabel"), value: t<string>("services.stats.speedValue"), icon: Zap, color: "text-accent-primary", bg: "bg-accent-primary/10", border: "border-accent-primary/20" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <SeoManager
        title={t<string>("seo.sections.services.title")}
        description={t<string>("seo.sections.services.description")}
        path="/services"
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: t<string>("seo.sections.services.title"), path: "/services" },
        ]}
      />

      {/* --- Hero Section --- */}
      <div className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
          <div className="absolute top-0 right-0 w-150 h-150 bg-accent-tech/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-150 h-150 bg-accent-success/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10">
            <Breadcrumbs
              items={[
                { label: t<string>("common.home"), href: "/" },
                { label: t<string>("header.nav.services"), href: "/services" },
              ]}
            />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className={`lg:col-span-7 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8"
              >
                <Sparkles className="w-4 h-4 text-accent-tech" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                  {t<string>("services.badge")}
                </span>
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]"
              >
                {t<string>("services.title")}
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
              >
                {t<string>("services.description")}
              </m.p>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="grid gap-4">
                {heroStats.map((stat, i) => (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className={`flex items-center gap-5 p-5 rounded-2xl bg-white/60 dark:bg-[#0d1829]/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(8,21,48,0.06)] hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] hover:border-accent-tech/30 hover:translate-x-1 transition-all duration-300 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} border ${stat.border}`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div onClick={registerInteraction}>
        <ServicesGrid />
      </div>
      {/* Behavioral-intent CTA after services grid */}
      <div className="max-w-5xl mx-auto page-gutter py-8">
        <GlobalCTA
          type="primary"
          context="student"
          intentLevel={postGridIntent}
          variant="banner"
        />
      </div>
      <div onClick={registerInteraction}>
        <StudentJourneySteps />
      </div>
      {/* High-intent CTA after journey steps */}
      <div className="max-w-5xl mx-auto page-gutter py-8">
        <GlobalCTA
          type="primary"
          context="student"
          intentLevel="high"
          variant="banner"
        />
      </div>
    </main>
  );
}