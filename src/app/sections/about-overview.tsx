import { m } from "motion/react";
import { Building2, Network, CheckCircle2, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

export function AboutOverview() {
  const { t, dir } = useLanguage();
  const enrollPoints = (t("about.enroll.points") as string[]) || [];
  const nexusPoints = (t("about.nexus.points") as string[]) || [];

  return (
    <section
      id="about-overview"
      className="relative overflow-hidden section-gradient page-section-y"
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-150 h-150 bg-accent-success/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-accent-tech/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] relative z-10">
        
        {/* --- The Two Pillars Grid --- */}
        <div className={`grid lg:grid-cols-2 gap-8 ${dir === "rtl" ? "rtl-text-right" : ""}`}>
          
          {/* Pillar 1: Enroll (Recruitment) */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative h-full"
          >
            <div className="relative h-full p-6 sm:p-8 rounded-[2.5rem] transition-all duration-300 overflow-hidden flex flex-col surface-glass-subtle border-emerald-500/15">
              <div className="absolute inset-0 bg-linear-to-br from-accent-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Building2 className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold leading-none mb-2 text-text-primary">
                      {t<string>("about.enroll.title")}
                    </h3>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                      {t<string>("about.enrollSubtitle")}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed mb-8 min-h-[4rem] text-text-muted">
                  {t<string>("about.enroll.body")}
                </p>
                
                <ul className="space-y-4 mt-auto">
                  {enrollPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 rounded-full bg-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="font-medium text-sm" style={{ color: "rgb(212,224,239)" }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </m.div>

          {/* Pillar 2: Nexus (Tech) */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="group relative h-full"
          >
            <div className="relative h-full p-6 sm:p-8 rounded-[2.5rem] transition-all duration-300 overflow-hidden flex flex-col surface-glass-subtle border-indigo-500/20">
              <div className="absolute inset-0 bg-linear-to-br from-accent-tech/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Network className="w-8 h-8 text-indigo-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold leading-none mb-2 text-text-primary">
                      {t<string>("about.nexus.title")}
                    </h3>
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                      {t<string>("about.nexus.subtitle")}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed mb-8 min-h-[4rem] text-text-muted">
                  {t<string>("about.nexus.body")}
                </p>
                
                <ul className="space-y-4 mt-auto">
                  {nexusPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 rounded-full bg-indigo-500/20">
                        <Zap className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="font-medium text-sm" style={{ color: "rgb(212,224,239)" }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
}