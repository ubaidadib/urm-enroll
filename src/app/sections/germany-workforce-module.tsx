import { useState } from "react";
import { Link } from "react-router-dom";
import { m, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  CheckCircle2, 
  FileBadge, 
  Languages, 
  HeartPulse, 
  ShieldCheck,
  TrendingUp,
  Clock,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Globe2,
  Building2,
  GraduationCap,
  ChevronRight,
  Stethoscope
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

// --- Visual Configurations ---
const TRACK_VISUALS = [
  { 
    icon: Languages, 
    color: "text-orange-500", 
    bg: "bg-orange-500/10", 
    border: "border-orange-500/20", 
    gradient: "from-orange-500/20 to-transparent" 
  },
  { 
    icon: FileBadge, 
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20", 
    gradient: "from-blue-500/20 to-transparent" 
  },
  { 
    icon: Briefcase,
    color: "text-accent-tech",
    bg: "bg-accent-tech/10",
    border: "border-accent-tech/20",
    gradient: "from-accent-tech/20 to-transparent"
  },
  { 
    icon: CheckCircle2, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20", 
    gradient: "from-emerald-500/20 to-transparent" 
  },
];

const OPPORTUNITY_ICONS = [HeartPulse, ShieldCheck, Stethoscope, Users];

const DEFAULT_TRACK_VISUAL = {
  icon: Briefcase,
  color: "text-text-muted",
  bg: "bg-slate-500/10",
  border: "border-slate-500/20",
  gradient: "from-slate-500/20 to-transparent",
};

interface WorkforceTrack {
  label: string;
  description: string;
}

interface WorkforceOpportunity {
  title: string;
  metric: string;
  description: string;
}

interface WorkforceMetric {
  value: string;
  label: string;
  note: string;
}

export function GermanyWorkforceModule() {
  const { t, dir } = useLanguage();
  const [activeOpportunity, setActiveOpportunity] = useState(0);

  // --- Data Retrieval (Type-Safe) ---
  const tracksRaw = t<WorkforceTrack[]>("workforce.tracks") || [];
  const opportunitiesRaw = t<WorkforceOpportunity[]>("workforce.opportunities") || [];
  const metricsRaw = t<WorkforceMetric[]>("workforce.metrics") || [];
  const complianceItems = (t("workforce.complianceItems") as string[]) || [];

  return (
    <section
      id="germany-workforce"
      className="relative page-section-y px-[var(--content-gutter)] overflow-hidden bg-bg-primary transition-colors duration-500"
    >
      {/* --- 1. Architectural Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-tech/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-success/5 rounded-full blur-[120px]" />
        
        {/* Tech Grid Pattern (CSS Only - Safe) */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        
        {/* Floating 3D Elements */}
        <m.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-10 lg:right-40 opacity-10"
        >
          <Building2 className="w-64 h-64 text-text-primary" strokeWidth={0.5} />
        </m.div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- 2. Executive Header --- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 mb-16 lg:mb-14 items-end">
          <div className={`${dir === "rtl" ? "lg:order-2 text-right" : ""}`}>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-bg-surface border border-border rounded-full mb-6 lg:mb-5 shadow-sm"
            >
              <Globe2 className="w-4 h-4 text-accent-tech" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-widest">
                {t<string>("workforce.badge")}
              </span>
            </m.div>

            <m.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-5 lg:mb-4 leading-[1.1] tracking-tight"
            >
              {t<string>("workforce.title")}
            </m.h2>
            
            <m.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-text-secondary leading-relaxed max-w-xl"
            >
              {t<string>("workforce.description")}
            </m.p>
          </div>

          {/* Metrics Strip */}
          <div className={`${dir === "rtl" ? "lg:order-1" : ""}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metricsRaw.map((metric, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="p-6 rounded-2xl surface-card group text-center sm:text-left"
                >
                  <div className="text-3xl font-black text-text-primary mb-1 group-hover:text-accent-tech transition-colors">
                    {metric.value}
                  </div>
                  <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                    {metric.label}
                  </div>
                  <div className="text-[10px] text-text-muted font-medium bg-bg-secondary px-2 py-1 rounded-md w-fit mx-auto sm:mx-0">
                    {metric.note}
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. The "Process Highway" --- */}
        <div className="mb-32">
          <div className={`flex items-center justify-between mb-12 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
              <Award className="w-6 h-6 text-accent-success" />
              {t<string>("workforce.tracksTitle")}
            </h3>
            <div className="hidden md:block h-px flex-1 bg-border/40 mx-8" />
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-bg-secondary -translate-y-1/2 hidden md:block rounded-full" />
            
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 relative ${dir === 'rtl' ? 'rtl-grid' : ''}`}>
              {tracksRaw.map((track, index) => {
                const visual = TRACK_VISUALS[index % TRACK_VISUALS.length] ?? DEFAULT_TRACK_VISUAL;
                const Icon = visual.icon;

                return (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative group"
                  >
                    <div className="relative h-full p-8 rounded-[2rem] surface-card hover:shadow-lg transition-all overflow-hidden">
                      <div className={`absolute inset-0 bg-linear-to-br ${visual.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="absolute top-0 right-0 text-[100px] font-black leading-none opacity-5 text-text-primary select-none">
                          {index + 1}
                        </div>

                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${visual.bg} border ${visual.border} group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className={`w-8 h-8 ${visual.color}`} strokeWidth={1.5} />
                        </div>

                        <h4 className="text-lg font-bold text-text-primary mb-2">
                          {track.label}
                        </h4>
                        
                        <p className="text-sm text-text-muted dark:text-text-muted leading-relaxed">
                          {track.description}
                        </p>
                        
                        <div className={`w-12 h-1 rounded-full ${visual.bg} mt-4`} />
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- 4. Interactive Opportunities --- */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-4">
            <h3 className={`text-xl font-bold text-text-primary mb-6 px-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t<string>("workforce.opportunitiesTitle")}
            </h3>
            
            {opportunitiesRaw.map((opp, idx) => {
              const Icon = OPPORTUNITY_ICONS[idx % OPPORTUNITY_ICONS.length];
              const isActive = activeOpportunity === idx;
              
              if (!Icon) return null;
              
              return (
                <button
                  key={idx}
                  onClick={() => setActiveOpportunity(idx)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border-2 group ${
                    isActive
                      ? "bg-accent-primary/10 border-accent-primary/40 shadow-lg scale-[1.02] z-10"
                      : "bg-bg-surface border-border hover:border-border-strong"
                  }`}
                >
                  <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <div className={`p-3 rounded-xl transition-colors ${isActive ? "bg-accent-primary/20 text-accent-primary" : "bg-bg-secondary text-text-muted"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-text-primary">
                        {opp.title}
                      </div>
                      <div className={`text-xs font-medium uppercase tracking-wider mt-1 ${isActive ? "text-text-muted" : "text-text-disabled"}`}>
                        {opp.metric}
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className={`w-5 h-5 text-accent-primary ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <m.div
                key={activeOpportunity}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative h-full min-h-125 rounded-[2.5rem] surface-card-elevated overflow-hidden p-10 flex flex-col justify-center"
              >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-linear-to-br from-accent-primary/15 to-accent-tech/10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-success/20 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(var(--border-default),0.35)_1px,transparent_0)] bg-size-[32px_32px] opacity-40 dark:opacity-50" />

                <div className={`relative z-10 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className={`w-16 h-16 rounded-2xl bg-accent-success/10 backdrop-blur-md border border-accent-success/25 flex items-center justify-center mb-8 ${dir === 'rtl' ? 'ml-auto' : ''}`}>
                    <Sparkles className="w-8 h-8 text-accent-success" />
                  </div>

                  <h3 className="text-4xl font-bold mb-6 text-text-primary">
                    {opportunitiesRaw[activeOpportunity]?.title}
                  </h3>
                  
                  <p className="text-xl text-text-muted leading-relaxed mb-10 max-w-2xl">
                    {opportunitiesRaw[activeOpportunity]?.description}
                  </p>

                  {/* Compliance Items Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10">
                    {complianceItems.slice(0, 2).map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        <span className="text-sm font-medium text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`flex flex-wrap gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Link to="/nursing-assessment" className="px-8 py-4 btn-gold-primary rounded-xl font-bold transition-colors flex items-center gap-2 group">
                      {t<string>("workforce.cta")}
                      <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    <div className="px-8 py-4 rounded-xl border border-success/30 bg-success/5 hover:bg-success/10 transition-colors flex items-center gap-2 cursor-default">
                      <ShieldCheck className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">{t<string>("workforce.guaranteedPlacement")}</span>
                    </div>
                  </div>
                </div>
              </m.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}