import { m } from "motion/react";
import { CheckCircle2, XCircle, Shield, Zap, Users, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ComparisonRow {
  feature: string;
  urm: boolean | string;
  competitor1: boolean | string;
  competitor2: boolean | string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AgencyComparison() {
  const { t, dir } = useLanguage();

  const features = t<ComparisonRow[]>("agencyComparison.features");
  const highlights = t<{ icon: string; title: string; description: string }[]>("agencyComparison.highlights");

  const iconMap: Record<string, React.ElementType> = {
    shield: Shield,
    zap: Zap,
    users: Users,
    globe: Globe,
  };

  function renderCell(value: boolean | string) {
    if (typeof value === "boolean") {
      return value ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
      ) : (
        <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
      );
    }
    return <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{value}</span>;
  }

  return (
    <section
      dir={dir}
      className="relative py-20 px-6 overflow-hidden bg-bg-primary transition-colors duration-500"
      aria-label={t<string>("agencyComparison.ariaLabel")}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-accent-primary/5 blur-[140px]" />
        <div className="absolute -bottom-48 -right-48 w-150 h-150 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-bg-surface border border-border shadow-sm text-text-primary text-xs font-bold uppercase tracking-widest mb-4"
            <Shield className="w-4 h-4 text-accent-tech" />
            {t<string>("agencyComparison.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
            {t<string>("agencyComparison.title")}
          </h2>
          <p className="mt-3 text-text-secondary text-base max-w-2xl mx-auto">
            {t<string>("agencyComparison.subtitle")}
          </p>
        </m.div>

        {/* Comparison Table */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-x-auto rounded-2xl border border-border bg-bg-surface/80 backdrop-blur-sm shadow-xl"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/30">
                <th className="text-start px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {t<string>("agencyComparison.table.feature")}
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-bold">
                    {t<string>("agencyComparison.table.urm")}
                  </span>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                  {t<string>("agencyComparison.table.competitor1")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                  {t<string>("agencyComparison.table.competitor2")}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(features) && features.map((row, i) => (
                <tr key={i} className={`border-b border-border/20 ${i % 2 === 0 ? "bg-bg-secondary/50" : ""}`}>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">{row.feature}</td>
                  <td className="px-6 py-4 text-center">{renderCell(row.urm)}</td>
                  <td className="px-6 py-4 text-center">{renderCell(row.competitor1)}</td>
                  <td className="px-6 py-4 text-center">{renderCell(row.competitor2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </m.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {Array.isArray(highlights) && highlights.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Shield;
            return (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="p-5 rounded-2xl border border-border/60 bg-bg-surface/60 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-accent-primary" />
                </div>
                <h3 className="text-sm font-bold text-text-primary mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
