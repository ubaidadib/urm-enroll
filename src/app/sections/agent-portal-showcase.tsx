import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  ShieldCheck,
  Layers,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Globe2,
  Zap,
} from "lucide-react";
import { openPartnershipModal } from "@/lib/partnership-modal";

/* ─── Static Data ────────────────────────────────────────────────────────── */

type LangKey = "en" | "ar" | "de";

interface Tier {
  name: { en: string; ar: string; de: string };
  volume: { en: string; ar: string; de: string };
  commission: string;
  color: string;
  features: { en: string[]; ar: string[]; de: string[] };
  highlighted?: boolean;
}

const COMMISSION_TIERS: Tier[] = [
  {
    name: { en: "Starter", ar: "مبتدئ", de: "Starter" },
    volume: { en: "1–10 students / yr", ar: "١–١٠ طلاب / سنة", de: "1–10 Studenten / Jahr" },
    commission: "8%",
    color: "#647795",
    features: {
      en: ["Basic dashboard", "Email support", "Monthly reports"],
      ar: ["لوحة تحكم أساسية", "دعم بريد إلكتروني", "تقارير شهرية"],
      de: ["Basis-Dashboard", "E-Mail-Support", "Monatsberichte"],
    },
  },
  {
    name: { en: "Professional", ar: "احترافي", de: "Professional" },
    volume: { en: "11–50 students / yr", ar: "١١–٥٠ طالب / سنة", de: "11–50 Studenten / Jahr" },
    commission: "12%",
    color: "#3b82f6",
    highlighted: true,
    features: {
      en: ["Full analytics suite", "Priority support", "Co-branded materials", "API access"],
      ar: ["تحليلات كاملة", "دعم ذو أولوية", "مواد مشتركة العلامة", "وصول API"],
      de: ["Volle Analysesuite", "Prioritäts-Support", "Co-Branding-Material", "API-Zugang"],
    },
  },
  {
    name: { en: "Enterprise", ar: "مؤسسي", de: "Enterprise" },
    volume: { en: "50+ students / yr", ar: "+٥٠ طالب / سنة", de: "50+ Studenten / Jahr" },
    commission: "18%",
    color: "#4F6B8A",
    features: {
      en: ["White-label portal", "Dedicated manager", "Real-time pipeline", "Custom SLA", "Compliance audit"],
      ar: ["بوابة بعلامتك", "مدير مخصص", "خط أنابيب مباشر", "SLA مخصص", "تدقيق امتثال"],
      de: ["White-Label-Portal", "Dedizierter Manager", "Echtzeit-Pipeline", "Individuelles SLA", "Compliance-Audit"],
    },
  },
];

const PIPELINE_STATS = [
  { key: "activeLeads", value: "2,340", icon: Users, color: "#3b82f6" },
  { key: "conversionRate", value: "67%", icon: TrendingUp, color: "#10b981" },
  { key: "avgPlacement", value: "42 days", icon: BarChart3, color: "#f59e0b" },
  { key: "complianceScore", value: "98.5%", icon: ShieldCheck, color: "#4F6B8A" },
];

const PORTAL_FEATURES = [
  { key: "realTimePipeline", icon: Layers },
  { key: "complianceDash", icon: ShieldCheck },
  { key: "commissionTracker", icon: TrendingUp },
  { key: "multiRegion", icon: Globe2 },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

export function AgentPortalShowcase() {
  const { t, language, dir } = useLanguage();
  const lang = (language as LangKey) || "en";
  const isRtl = dir === "rtl";

  return (
    <section
      className="page-section-y bg-bg-primary relative overflow-hidden transition-colors duration-500"
      aria-labelledby="agent-portal-heading"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[700px] h-[700px] bg-blue-400/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/4 w-125 h-125 bg-accent-tech/4 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 ${isRtl ? "rtl-text" : ""}`}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border/50 rounded-full mb-6 shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              {t<string>("agentPortal.badge")}
            </span>
          </m.div>

          <m.h2
            id="agent-portal-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-text-primary mb-6 tracking-tight"
          >
            {t<string>("agentPortal.title")}
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            {t<string>("agentPortal.description")}
          </m.p>
        </div>

        {/* ── 1. Commission Tiers ── */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mb-24"
        >
          <h3 className="text-center text-[11px] font-black uppercase tracking-widest text-text-muted mb-10">
            {t<string>("agentPortal.tiers.title")}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {COMMISSION_TIERS.map((tier, index) => (
              <m.div
                key={tier.commission}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className={`relative rounded-3xl border overflow-hidden transition-all ${
                  tier.highlighted
                    ? "bg-bg-surface border-blue-200 dark:border-blue-500/20 shadow-xl ring-1 ring-blue-100 dark:ring-blue-500/10"
                    : "bg-bg-surface border-border/50 shadow-sm hover:shadow-md"
                }`}
              >
                {tier.highlighted && (
                  <div className="h-1 w-full" style={{ backgroundColor: tier.color }} />
                )}

                <div className="p-8">
                  {/* Tier name + badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-black text-text-primary">
                        {tier.name[lang]}
                      </h4>
                      <p className="text-xs font-semibold text-text-muted mt-0.5">
                        {tier.volume[lang]}
                      </p>
                    </div>
                    {tier.highlighted && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                        {t<string>("agentPortal.tiers.popular")}
                      </span>
                    )}
                  </div>

                  {/* Commission rate */}
                  <div className="mb-6">
                    <span
                      className="text-5xl font-black tracking-tight"
                      style={{ color: tier.color }}
                    >
                      {tier.commission}
                    </span>
                    <span className="text-sm font-bold text-text-muted ml-2">
                      {t<string>("agentPortal.tiers.perPlacement")}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {tier.features[lang].map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0"
                          style={{ color: tier.color }}
                        />
                        <span className="text-sm text-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* ── 2. Dashboard Preview ── */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-24"
        >
          <h3 className="text-center text-[11px] font-black uppercase tracking-widest text-text-muted mb-10">
            {t<string>("agentPortal.dashboard.title")}
          </h3>

          {/* Mock dashboard card */}
          <div className="rounded-3xl bg-bg-surface border border-border/50 shadow-xl overflow-hidden">
            {/* Dashboard top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  {t<string>("agentPortal.dashboard.live")}
                </span>
              </div>
              <span className="text-[11px] font-bold text-text-muted">
                agents-portal.enrollurm.com
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/30">
              {PIPELINE_STATS.map(({ key, value, icon: Icon, color }) => (
                <div key={key} className="p-6 text-center">
                  <Icon className="w-5 h-5 mx-auto mb-3" style={{ color }} />
                  <div className="text-2xl font-black text-text-primary mb-1 tabular-nums">
                    {value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    {t<string>(`agentPortal.dashboard.stats.${key}`)}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated pipeline rows */}
            <div className="border-t border-border/30 px-6 py-5">
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">
                {t<string>("agentPortal.dashboard.recentLabel")}
              </div>
              <div className="space-y-2.5">
                {[
                  { status: "bg-emerald-500", label: { en: "Ahmed R. — Germany — Accepted", ar: "أحمد ر. — ألمانيا — مقبول", de: "Ahmed R. — Deutschland — Angenommen" } },
                  { status: "bg-blue-500", label: { en: "Sara M. — UK — In Review", ar: "سارة م. — المملكة المتحدة — قيد المراجعة", de: "Sara M. — UK — In Prüfung" } },
                  { status: "bg-amber-500", label: { en: "Omar K. — Canada — Documents Pending", ar: "عمر ك. — كندا — مستندات معلقة", de: "Omar K. — Kanada — Dokumente ausstehend" } },
                ].map((row) => (
                  <div
                    key={row.label.en}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary dark:bg-white/3 border border-border/30 dark:border-white/5"
                  >
                    <div className={`w-2 h-2 rounded-full ${row.status} shrink-0`} />
                    <span className="text-sm font-medium text-text-primary">
                      {row.label[lang]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </m.div>

        {/* ── 3. Portal Features ── */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-20"
        >
          <h3 className="text-center text-[11px] font-black uppercase tracking-widest text-text-muted mb-10">
            {t<string>("agentPortal.features.title")}
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PORTAL_FEATURES.map(({ key, icon: Icon }, index) => (
              <m.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.07 }}
                className="p-6 rounded-2xl bg-bg-surface border border-border/50 hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-blue-500" />
                </div>
                <h4 className="text-sm font-black text-text-primary mb-1.5">
                  {t<string>(`agentPortal.features.items.${key}.title`)}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {t<string>(`agentPortal.features.items.${key}.description`)}
                </p>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* ── CTA ── */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            type="button"
            onClick={openPartnershipModal}
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl btn-gold-primary text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <Zap className="w-4 h-4 text-blue-400 dark:text-blue-600" />
            <span>{t<string>("agentPortal.cta")}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
          </button>
          <p className="mt-4 text-xs font-semibold text-text-muted flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t<string>("agentPortal.ctaSub")}
          </p>
        </m.div>
      </div>
    </section>
  );
}
