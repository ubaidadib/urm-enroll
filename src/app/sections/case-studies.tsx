import { m } from "motion/react";
import { 
  BarChart3, 
  Target, 
  Zap, 
  ArrowUpRight, 
  ShieldCheck, 
  Briefcase 
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

// Visual configuration for card icons and gradients
const CASE_VISUALS = [
  { icon: Target, gradient: "from-blue-500/20 to-transparent", color: "text-blue-500" },
  { icon: BarChart3, gradient: "from-emerald-500/20 to-transparent", color: "text-emerald-500" },
  { icon: Zap, gradient: "from-accent-primary/20 to-transparent", color: "text-accent-primary" },
];

interface CaseStudyItem {
  title: string;
  summary: string;
  impact: string;
}

export function CaseStudies() {
  const { t, dir } = useLanguage();
  
  // Data retrieval from translation.ts
  const caseStudies = t<CaseStudyItem[]>("caseStudies.items") || [];

  return (
    <section
      id="case-studies"
      className="relative py-32 px-6 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-150 h-150 bg-accent-tech/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-150 h-150 bg-accent-success/5 rounded-full blur-[120px]" />
        
        {/* Subtle dot pattern consistent with other luxury sections */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#808080_1px,transparent_0)] bg-size-[40px_40px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- Section Header --- */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mb-20 ${dir === "rtl" ? "text-right" : "text-left"}`}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-accent-tech" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              {t<string>("caseStudies.badge")}
            </span>
          </div>
          
          <h2 id="case-studies-title" className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            {t<string>("caseStudies.title")}
          </h2>
          
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            {t<string>("caseStudies.description")}
          </p>
        </m.div>

        {/* --- Case Studies Bento Grid --- */}
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => {
            const visual = CASE_VISUALS[index % CASE_VISUALS.length] || CASE_VISUALS[0];
            if (!visual) return null;
            const Icon = visual.icon;

            return (
              <m.div
                key={study.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="group relative h-full"
              >
                {/* Main Card */}
                <div className={`relative h-full flex flex-col p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 glass-card-light hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] hover:border-accent-tech/30 transition-all duration-500 overflow-hidden ${dir === "rtl" ? "text-right" : "text-left"}`}>
                  
                  {/* Subtle Top-Right Arrow for external feel */}
                  <div className={`absolute top-8 ${dir === "rtl" ? "left-8" : "right-8"} opacity-20 group-hover:opacity-100 group-hover:text-accent-tech transition-all`}>
                    <ArrowUpRight className="w-6 h-6" />
                  </div>

                  {/* Icon Container */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-inner transition-transform duration-500 group-hover:scale-110`}>
                    <Icon className={`w-7 h-7 ${visual.color}`} strokeWidth={1.5} />
                  </div>

                  {/* Header */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        {t<string>("caseStudies.anonymized")}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                      {study.title}
                    </h3>
                  </div>

                  {/* Body Text */}
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 flex-grow">
                    {study.summary}
                  </p>

                  {/* Impact Footer (Heavy Contrast) */}
                  <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                      {t<string>("caseStudies.coreOutcome")}
                    </div>
                    <div className={`text-xl font-black ${visual.color} tracking-tight`}>
                      {study.impact}
                    </div>
                  </div>

                  {/* Card Background Glow */}
                  <div className={`absolute inset-0 bg-linear-to-br ${visual.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </m.div>
            );
          })}
        </div>

        {/* --- Bottom Trust Bar --- */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:opacity-100 transition-all duration-700"
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
            <Briefcase className="w-4 h-4" /> {t<string>("caseStudies.trustVerified")}
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
            <Target className="w-4 h-4" /> {t<string>("caseStudies.trustAudited")}
          </div>
        </m.div>

      </div>
    </section>
  );
}