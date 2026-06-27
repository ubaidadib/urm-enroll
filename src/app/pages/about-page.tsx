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
    <main className="min-h-screen section-gradient">
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
      <div className="relative page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] overflow-hidden" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[37.5rem] h-[37.5rem] rounded-full blur-[150px] opacity-10" style={{ background: "rgb(0,184,217)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[31.25rem] h-[31.25rem] rounded-full blur-[150px] opacity-[0.08]" style={{ background: "rgb(212,175,55)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        </div>

        <div className="page-hero-inner">

          <div className="page-hero-crumb-gap">
            <Breadcrumbs
              items={[
                { label: t<string>("common.home"), href: "/" },
                { label: t<string>("header.nav.about"), href: "/about" },
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
                style={{ background: "rgba(0,184,217,0.08)", border: "1px solid rgba(0,184,217,0.25)" }}
              >
                <Users className="w-4 h-4" style={{ color: "rgb(0,184,217)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgb(0,184,217)" }}>
                  {t<string>("about.badge")}
                </span>
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold mb-4 sm:mb-5 lg:mb-5 leading-[1.08] tracking-tight text-text-primary"
              >
                {t<string>("about.title")}
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-base sm:text-lg md:text-xl mb-5 lg:mb-6 leading-relaxed text-text-muted"
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
                  { value: "94%", label: t<string>("socialProof.stats.visa"), icon: TrendingUp, color: "text-accent-primary-text" },
                ].map(({ value, label, icon: Icon, color }, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl surface-glass-subtle transition-all duration-300"
                  >
                    <Icon className={`w-4 h-4 mb-2 ${color}`} />
                    <div className="text-2xl font-bold" style={{ color: "rgb(212,175,55)" }}>{value}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide mt-0.5 line-clamp-2 text-text-disabled">{label}</div>
                  </div>
                ))}
              </m.div>
            </div>

            {/* Right Visual Element */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="page-hero-aside relative hidden lg:block"
            >
              <div className="relative aspect-[4/3] max-h-[280px] w-full max-w-sm ml-auto">
                <div className="absolute inset-0 bg-linear-to-br from-accent-tech/20 to-accent-success/20 rounded-full blur-[60px]" />

                <div className="relative w-full h-full rounded-[2rem] backdrop-blur-md shadow-2xl p-8 flex items-center justify-center overflow-hidden surface-glass-subtle">
                   <div style={{ color: "rgba(212,175,55,0.12)" }}>
                      <Building2 className="w-40 h-40 opacity-40" />
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
                        className="absolute w-6 h-6 rounded-full shadow-lg bg-accent-primary border-4 border-bg-primary"
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
      <AboutOverview />
      
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