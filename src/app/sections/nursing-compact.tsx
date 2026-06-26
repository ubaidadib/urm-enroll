import { m } from "motion/react";
import { Link } from "react-router-dom";
import {
  HeartPulse, ArrowRight, ShieldCheck,
  Clock, Euro, Users, TrendingUp, ChevronRight, CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

const STAT_ICONS = [Users, Clock, Euro, TrendingUp];
const STAT_COLORS = ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6"];

export function NursingCompact() {
  const { t, dir } = useLanguage();
  const tx = (key: string, _fb: string) => t<string>(key);

  const stats = (t("workforce.compact.stats") as { label: string; value: string }[]) || [];
  const steps = (t("workforce.compact.steps") as string[]) || [];

  return (
    <section
      dir={dir}
      className="relative page-section-y bg-bg-primary overflow-hidden transition-colors duration-500"
    >
      {/* Ambient — very light, no visible borders */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[800px] h-[800px] rounded-full bg-emerald-50 dark:bg-emerald-500/5 blur-[160px]" />
        <div className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full bg-teal-50 dark:bg-teal-500/4 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-[var(--content-gutter)]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Narrative ── */}
          <div>
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-8"
            >
              <HeartPulse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.15em] uppercase text-emerald-700 dark:text-emerald-400">
                {tx("workforce.badge", "Healthcare Professionals")}
              </span>
            </m.div>

            {/* Headline */}
            <m.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 }}
              className="font-black text-text-primary leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)" }}
            >
              {tx("workforce.compact.headline1", "Germany needs")}<br />
              <span className="text-emerald-500">
                {tx("workforce.compact.headline2", "Qualified Nurses.")}
              </span>
            </m.h2>

            {/* Description */}
            <m.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.13 }}
              className="text-lg text-text-muted leading-relaxed max-w-lg mb-10"
            >
              {tx(
                "workforce.description",
                "A fully regulated, government-compliant pathway for nursing professionals to live and work in Germany — from language training to employment."
              )}
            </m.p>

            {/* Pathway steps grid */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 mb-8 sm:mb-10"
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary dark:bg-white/4 border border-border/30 dark:border-white/6"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">{i + 1}</span>
                  </div>
                  <span className="text-xs font-semibold text-text-secondary leading-tight">
                    {step}
                  </span>
                </div>
              ))}
            </m.div>

            {/* CTAs */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.23 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/nursing-assessment"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/40 transition-all"
              >
                <span>{tx("workforce.cta", "Start Nursing Pathway")}</span>
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${dir === "rtl" ? "rotate-180" : ""}`} />
              </Link>

              <Link
                to="/nursing#eligibility"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-bg-secondary dark:bg-white/6 hover:bg-bg-secondary/80 dark:hover:bg-white/10 text-text-primary dark:text-white text-sm font-bold transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{tx("workforce.ctaSecondary", "Check Eligibility")}</span>
              </Link>
            </m.div>
          </div>

          {/* ── RIGHT: Stats card ── */}
          <m.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Soft outer glow — visible only as a very light halo */}
            <div className="absolute -inset-6 bg-emerald-100/60 dark:bg-emerald-500/8 rounded-[3rem] blur-3xl" />

            <div className="relative rounded-3xl glass-card-light overflow-hidden">

              {/* Thin emerald top accent */}
              <div className="h-1 w-full bg-linear-to-r from-emerald-400 to-teal-400" />

              {/* Card header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-border/30 dark:border-white/6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-200 dark:shadow-emerald-900/40">
                    DE
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {tx("workforce.card.target", "Target Market")}
                    </div>
                    <div className="text-sm font-black text-text-primary">
                      {tx("workforce.card.country", "Germany")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    {tx("workforce.card.live", "Active")}
                  </span>
                </div>
              </div>

              {/* Stat rows */}
              <div className="p-6 space-y-3">
                {stats.map((stat, i) => {
                  const Icon = STAT_ICONS[i] ?? Users;
                  const color = STAT_COLORS[i] ?? "#3b82f6";
                  return (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-bg-secondary dark:bg-white/4 border border-border/30 dark:border-white/5 hover:border-border/50 dark:hover:border-white/10 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="text-sm font-semibold text-text-secondary">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-lg font-black text-text-primary">
                      {stat.value}
                    </span>
                  </m.div>
                  );
                })}
              </div>

              {/* Card footer */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-100 dark:border-emerald-500/15">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    {tx("workforce.card.approved", "Government Approved Program")}
                  </span>
                </div>
              </div>

            </div>
          </m.div>

        </div>

        {/* ── Trust strip ── */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-14 flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-bg-secondary dark:bg-white/4 border border-border/40 dark:border-white/6"
        >
          <div className="flex flex-wrap items-center gap-8">
            {[
              { icon: ShieldCheck,  text: tx("workforce.trust.recognition", "Officially Recognised in Germany"), color: "#10b981" },
              { icon: CheckCircle2, text: tx("workforce.trust.regulated",   "Fully Regulated Pathway"),           color: "#3b82f6" },
              { icon: TrendingUp,   text: tx("workforce.trust.success",     "94% Placement Rate"),                color: "#f59e0b" },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                <span className="text-xs font-semibold text-text-muted">{text}</span>
              </div>
            ))}
          </div>

          <Link
            to="/nursing"
            className="group flex items-center gap-1.5 text-sm font-black text-emerald-600 dark:text-emerald-400 hover:opacity-70 transition-opacity shrink-0"
          >
            <span>{tx("workforce.compact.learnMore", "Explore Germany nursing pathways")}</span>
            <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${dir === "rtl" ? "rotate-180" : ""}`} />
          </Link>
        </m.div>

      </div>
    </section>
  );
}