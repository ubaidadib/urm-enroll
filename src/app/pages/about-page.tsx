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
    <main className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-500">
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
      <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-border/60 bg-linear-to-b from-bg-primary to-bg-secondary">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-[37.5rem] w-[37.5rem] rounded-full blur-[150px] opacity-10 bg-accent-tech/15" />
          <div className="absolute bottom-1/4 right-1/4 h-[31.25rem] w-[31.25rem] rounded-full blur-[150px] opacity-8 bg-accent-primary/15" />
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(var(--grid),0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--grid),0.18)_1px,transparent_1px)] bg-[size:72px_72px]" />
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
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8"
                style={{ background: "rgb(var(--bg-surface) / 0.8)", border: "1px solid rgb(var(--accent-tech) / 0.22)" }}
              >
                <Users className="w-4 h-4 text-accent-tech" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent-tech">
                  {t<string>("about.badge")}
                </span>
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-text-primary"
              >
                {t<string>("about.title")}
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl mb-10 leading-relaxed max-w-lg text-text-muted"
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
                    className="p-5 rounded-2xl transition-all duration-300 bg-bg-surface/85 border border-border/70 shadow-sm hover:border-accent-primary/30"
                  >
                    <Icon className={`w-4 h-4 mb-2 ${color}`} />
                    <div className="text-2xl font-bold text-accent-primary">{value}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide mt-0.5 line-clamp-2 text-text-muted">{label}</div>
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

                 <div className="relative w-full h-full rounded-[3rem] backdrop-blur-md shadow-2xl p-10 flex items-center justify-center overflow-hidden bg-bg-surface/70 border border-border/70">
                   <div className="text-accent-primary/20">
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
                        className="absolute w-6 h-6 rounded-full shadow-lg"
                        style={{ background: "rgb(var(--accent-primary))", border: "4px solid rgb(var(--bg-primary))", top: pin.top, left: pin.left }}
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