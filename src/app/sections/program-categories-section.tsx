import { m } from "motion/react";
import { Link } from "react-router-dom";
import { UNIVERSITIES } from "@/data/universities";
import { Wrench, HeartPulse, Briefcase, Palette, FlaskConical, Scale, Cpu, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

const CATEGORY_CONFIG = [
  {
    key: "engineering",
    icon: Wrench,
    gradient: "from-[rgba(212,175,55,0.25)] to-[rgba(212,175,55,0.05)]",
    iconColor: "rgb(212,175,55)",
    accentBorder: "rgba(212,175,55,0.35)",
  },
  {
    key: "medicine",
    icon: HeartPulse,
    gradient: "from-[rgba(34,197,94,0.2)] to-[rgba(34,197,94,0.04)]",
    iconColor: "rgb(74,222,128)",
    accentBorder: "rgba(74,222,128,0.3)",
  },
  {
    key: "business",
    icon: Briefcase,
    gradient: "from-[rgba(0,184,217,0.2)] to-[rgba(0,184,217,0.04)]",
    iconColor: "rgb(0,184,217)",
    accentBorder: "rgba(0,184,217,0.3)",
  },
  {
    key: "arts",
    icon: Palette,
    gradient: "from-[rgba(244,114,182,0.2)] to-[rgba(244,114,182,0.04)]",
    iconColor: "rgb(244,114,182)",
    accentBorder: "rgba(244,114,182,0.3)",
  },
  {
    key: "computer-science",
    icon: Cpu,
    gradient: "from-[rgba(139,92,246,0.2)] to-[rgba(139,92,246,0.04)]",
    iconColor: "rgb(167,139,250)",
    accentBorder: "rgba(167,139,250,0.3)",
  },
  {
    key: "science",
    icon: FlaskConical,
    gradient: "from-[rgba(251,146,60,0.2)] to-[rgba(251,146,60,0.04)]",
    iconColor: "rgb(251,146,60)",
    accentBorder: "rgba(251,146,60,0.3)",
  },
  {
    key: "law",
    icon: Scale,
    gradient: "from-[rgba(148,163,184,0.15)] to-[rgba(148,163,184,0.03)]",
    iconColor: "rgb(148,163,184)",
    accentBorder: "rgba(148,163,184,0.25)",
  },
] as const;

function countProgramsByField(fieldKey: string): number {
  const lowerKey = fieldKey.toLowerCase();
  return UNIVERSITIES.reduce((count, uni) => {
    return (
      count +
      (Array.isArray(uni.programs) ? uni.programs : []).filter((program) => {
        const pf = String(program.field || "").toLowerCase();
        return pf === lowerKey || pf.includes(lowerKey) || lowerKey.includes(pf);
      }).length
    );
  }, 0);
}

export function ProgramCategoriesSection() {
  const { t } = useLanguage();

  return (
    <section
      className="relative page-section-y overflow-hidden section-gradient"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="content-shell mx-auto px-[var(--content-gutter)] w-full relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 3xl:mb-18"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5" style={{ border: "1px solid rgba(0,184,217,0.28)", background: "rgba(0,184,217,0.07)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "rgb(0,184,217)" }} />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgb(0,184,217)" }}>
              {t<string>("home.categories.badge")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2
              className="text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-bold tracking-tight text-text-primary"
            >
              {t<string>("home.categories.title")}
            </h2>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:opacity-80 hover:gap-3 shrink-0"
              style={{ color: "rgb(212,175,55)" }}
            >
              {t<string>("home.categories.viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </m.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-7 gap-4 3xl:gap-5">
          {CATEGORY_CONFIG.map((category, index) => {
            const count = countProgramsByField(category.key);
            const label = t<string>(`home.categories.fields.${category.key}.label`);
            const description = t<string>(`home.categories.fields.${category.key}.description`);
            const Icon = category.icon;
            return (
              <m.div
                key={category.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/programs?field=${category.key}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl p-6 3xl:p-7 h-[180px] 3xl:h-[210px] 4xl:h-[230px] block transition-all duration-300 hover:-translate-y-2 surface-card hover:shadow-[0_24px_60px_rgba(11,21,48,0.18)]"
                >
                  {/* Top colour accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, ${category.iconColor}, transparent)` }}
                  />

                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${category.gradient}`}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-auto">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `${category.iconColor.replace('rgb(', 'rgba(').replace(')', ',0.13)')}`,
                          border: `1px solid ${category.iconColor.replace('rgb(', 'rgba(').replace(')', ',0.22)')}`,
                          boxShadow: `0 4px 16px ${category.iconColor.replace('rgb(', 'rgba(').replace(')', ',0.14)')}`,
                        }}
                      >
                        <Icon className="w-5 h-5 transition-colors duration-300" style={{ color: category.iconColor }} />
                      </div>
                      <ArrowRight
                        className="w-4 h-4 opacity-0 group-hover:opacity-80 group-hover:translate-x-1 transition-all duration-300"
                        style={{ color: category.iconColor }}
                      />
                    </div>

                    <div className="mt-auto pt-4">
                      <h3
                        className="text-[0.95rem] 3xl:text-[1.05rem] font-bold leading-tight transition-colors duration-300 text-text-primary"
                      >
                        {label}
                      </h3>
                      <p
                        className="mt-1.5 text-[11px] transition-colors duration-300 text-text-disabled leading-snug"
                      >
                        {count > 0 ? t<string>("home.categories.programCount").replace("{{count}}", count.toLocaleString()) : description}
                      </p>
                    </div>
                  </div>
                </Link>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
