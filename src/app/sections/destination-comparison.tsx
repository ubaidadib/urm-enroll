import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import {
  BarChart3,
  GraduationCap,
  Clock,
  Shield,
  DollarSign,
  Languages,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DESTINATIONS, TIER_META, type LangKey, type I18nString } from "@/data/destinations";

// ─── Comparison-specific display shortening ──────────────────────────────────

const SHORT_TIER: Record<number, I18nString> = {
  1: { en: "Core", ar: "أساسي", de: "Kern" },
  2: { en: "Growth", ar: "نمو", de: "Wachstum" },
  3: { en: "Fast-Track", ar: "سريع", de: "Schnell" },
};

const SHORT_TUITION: Record<string, string> = {
  Germany: "€0–3k", Italy: "€0–4k", Spain: "€1–6k", France: "€3–15k",
  Malta: "€5–12k", Cyprus: "€4–10k", Canada: "CAD 15–35k",
  "United States": "$25–55k", Turkey: "$1–8k", Georgia: "$3–8k",
  Hungary: "€3–16k", Latvia: "€2–8k",
};

const SHORT_COMPLIANCE: Record<string, I18nString> = {
  Germany: { en: "APS + Recognition", ar: "APS + الاعتراف", de: "APS + Anerkennung" },
  Italy: { en: "Dichiarazione di Valore", ar: "Dichiarazione di Valore", de: "Dichiarazione di Valore" },
  Spain: { en: "Homologación", ar: "Homologación", de: "Homologación" },
  France: { en: "Campus France", ar: "Campus France", de: "Campus France" },
  Malta: { en: "Identity Malta", ar: "Identity Malta", de: "Identity Malta" },
  Cyprus: { en: "Immigration Permit", ar: "تصريح الهجرة", de: "Einwanderungsgenehmigung" },
  Canada: { en: "PAL + Study Permit", ar: "PAL + تصريح دراسة", de: "PAL + Studienerlaubnis" },
  "United States": { en: "SEVIS + I-20", ar: "SEVIS + I-20", de: "SEVIS + I-20" },
  Turkey: { en: "Residence Permit", ar: "تصريح إقامة", de: "Aufenthaltserlaubnis" },
  Georgia: { en: "Residence on Arrival", ar: "إقامة عند الوصول", de: "Aufenthalt bei Ankunft" },
  Hungary: { en: "D-Visa + Residence", ar: "تأشيرة D + إقامة", de: "D-Visum + Aufenthalt" },
  Latvia: { en: "D-Visa + Residence", ar: "تأشيرة D + إقامة", de: "D-Visum + Aufenthalt" },
};

const COMPARISON_DATA = DESTINATIONS.map((d) => ({
  code: d.code,
  tier: d.tier,
  tierLabel: SHORT_TIER[d.tier] ?? TIER_META[d.tier].label,
  name: d.name,
  accent: d.accentSolid,
  universities: `${d.universities}+`,
  directPartners: d.directAgreements,
  visaTimeline: d.visaTimeline,
  successRate: d.successRate,
  tuition: SHORT_TUITION[d.code] ?? d.avgTuitionFee,
  languages: d.languageLevels,
  compliance: SHORT_COMPLIANCE[d.code] ?? d.complianceCheckpoint,
  featured: d.highlight,
}));

function SuccessBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <m.div
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-black text-slate-700 dark:text-slate-300 tabular-nums w-9 text-right">
        {value}%
      </span>
    </div>
  );
}

export function DestinationComparison() {
  const { t, language, dir } = useLanguage();
  const lang = (language as LangKey) || "en";
  const isRtl = dir === "rtl";

  return (
    <section
      className="py-28 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-500"
      aria-labelledby="comparison-heading"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-accent-tech/3 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 ${isRtl ? "rtl-text" : ""}`}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full mb-6"
          >
            <BarChart3 className="w-4 h-4 text-accent-tech" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              {t<string>("destinationComparison.badge")}
            </span>
          </m.div>

          <m.h2
            id="comparison-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            {t<string>("destinationComparison.title")}
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            {t<string>("destinationComparison.description")}
          </m.p>
        </div>

        {/* Comparison Table (responsive) */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="overflow-x-auto rounded-2xl"
        >
          <table className="w-full min-w-[800px] border-separate border-spacing-0" role="table">
            <thead>
              <tr>
                <th className="text-left p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-tl-2xl sticky left-0 z-10 backdrop-blur-sm">
                  {t<string>("destinationComparison.columns.country")}
                </th>
                {[
                  { key: "universities", icon: GraduationCap },
                  { key: "visa", icon: Clock },
                  { key: "success", icon: Shield },
                  { key: "tuition", icon: DollarSign },
                  { key: "language", icon: Languages },
                  { key: "compliance", icon: CheckCircle2 },
                ].map(({ key, icon: Icon }, i, arr) => (
                  <th
                    key={key}
                    className={`p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800/50 ${
                      i === arr.length - 1 ? "rounded-tr-2xl" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t<string>(`destinationComparison.columns.${key}`)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((dest, index) => (
                <m.tr
                  key={dest.code}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group hover:bg-slate-50/80 dark:hover:bg-white/3 transition-colors"
                >
                  {/* Country name */}
                  <td className="p-4 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50/80 dark:group-hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: dest.accent }}
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {dest.name[lang]}
                        </span>
                        <span className="ml-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {dest.tierLabel[lang]}
                        </span>
                        {dest.featured && (
                          <span className="ml-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                            {t<string>("destinationComparison.featured")}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Universities */}
                  <td className="p-4 text-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{dest.universities}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {dest.directPartners} {t<string>("destinationComparison.direct")}
                    </div>
                  </td>

                  {/* Visa Timeline */}
                  <td className="p-4 text-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{dest.visaTimeline}</span>
                  </td>

                  {/* Success Rate */}
                  <td className="p-4 min-w-[140px]">
                    <SuccessBar value={dest.successRate} accent={dest.accent} />
                  </td>

                  {/* Tuition */}
                  <td className="p-4 text-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{dest.tuition}</span>
                  </td>

                  {/* Language */}
                  <td className="p-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {dest.languages.map((lvl) => (
                        <span
                          key={lvl}
                          className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Compliance */}
                  <td className="p-4 text-center">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {dest.compliance[lang]}
                    </span>
                  </td>
                </m.tr>
              ))}
            </tbody>
          </table>

          {/* Bottom divider line */}
          <div className="h-px bg-slate-100 dark:bg-slate-800 mt-1 rounded-full" />
        </m.div>

        {/* CTA */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/quiz"
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl btn-gold-primary text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <span>{t<string>("destinationComparison.cta")}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
          </Link>
        </m.div>
      </div>
    </section>
  );
}
