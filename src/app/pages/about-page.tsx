import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { AboutOverview } from "../sections/about-overview";
import { FounderVision } from "../sections/founder-vision";
import { CompanyTimeline } from "../sections/company-timeline";
import { CaseStudies } from "../sections/case-studies";
import { GlobalPartnersMarquee } from "../sections/global-partners-marquee";
import { SeoManager } from "../seo/seo-manager";
import { Users, Building2, ShieldCheck, Globe2, TrendingUp } from "lucide-react";

export function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <SeoManager
        title={t<string>("seo.sections.founder.title")}
        description={t<string>("seo.sections.founder.description")}
        path="/about"
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: t<string>("seo.sections.founder.title"), path: "/about" },
        ]}
      />

      {/* --- Section 1: Hero --- */}
      <div className="relative pt-32 pb-20 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-150 h-150 bg-accent-success/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-accent-tech/8 rounded-full blur-[150px]" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="mb-10">
            <Breadcrumbs
              items={[
                { label: t<string>("common.home"), href: "/" },
                { label: t<string>("header.nav.about"), href: "/about" },
              ]}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="max-w-2xl">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-full mb-8"
              >
                <Users className="w-4 h-4 text-accent-tech" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                  {t<string>("about.badge")}
                </span>
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight"
              >
                {t<string>("about.title")}
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg"
              >
                {t<string>("about.description")}
              </m.p>

              {/* Trust Metrics */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: "50+", label: t<string>("socialProof.stats.directNote"), icon: ShieldCheck, color: "text-accent-success" },
                  { value: "1,400+", label: t<string>("socialProof.stats.platformNote"), icon: Globe2, color: "text-accent-tech" },
                  { value: "94%", label: t<string>("socialProof.stats.visa"), icon: TrendingUp, color: "text-accent-primary" },
                ].map(({ value, label, icon: Icon, color }, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white/60 dark:bg-[#0d1829]/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-[0_2px_8px_rgba(8,21,48,0.06)] hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] hover:border-accent-tech/30 transition-all duration-300"
                  >
                    <Icon className={`w-4 h-4 mb-2 ${color}`} />
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5 line-clamp-2">{label}</div>
                  </div>
                ))}
              </m.div>
            </div>

            {/* Right Visual Element */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-linear-to-br from-accent-tech/20 to-accent-success/20 rounded-full blur-[80px]" />

                <div className="relative w-full h-full rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-2xl p-10 flex items-center justify-center overflow-hidden">
                   <div className="text-slate-200 dark:text-slate-800">
                      <Building2 className="w-64 h-64 opacity-40" />
                   </div>

                   {[
                      { top: '30%', left: '50%', delay: 0.6 },
                      { top: '50%', left: '30%', delay: 0.7 },
                      { top: '50%', left: '70%', delay: 0.8 },
                    ].map((pin, i) => (
                      <m.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: pin.delay, type: "spring" }}
                        className="absolute w-6 h-6 bg-accent-tech rounded-full border-4 border-white dark:border-slate-950 shadow-lg"
                        style={{ top: pin.top, left: pin.left }}
                      />
                    ))}
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </div>

      {/* --- Section 2: The Mission & Pillars (Grid Only) --- */}
      <div className="-mt-12">
        <AboutOverview />
      </div>
      
      {/* --- Section 3: The Leadership (Editorial Style) --- */}
      <FounderVision />
      
      {/* --- Section 4: The Journey (Timeline) --- */}
      <CompanyTimeline />
      
      {/* --- Section 5: The Impact (Data Grid) --- */}
      <CaseStudies />

      {/* --- Section 6: Global Trust Partners --- */}
      <GlobalPartnersMarquee />

    </main>
  );
}