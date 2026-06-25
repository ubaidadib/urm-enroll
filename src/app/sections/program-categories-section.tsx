import { m } from "motion/react";
import { Link } from "react-router-dom";
import { UNIVERSITIES } from "@/data/universities";
import { Wrench, HeartPulse, Briefcase, Palette, FlaskConical, Scale, Cpu, ArrowRight } from "lucide-react";

const CATEGORY_CONFIG = [
  {
    key: "engineering",
    label: "Engineering",
    icon: Wrench,
    gradient: "from-[rgba(212,175,55,0.25)] to-[rgba(212,175,55,0.05)]",
    iconColor: "rgb(212,175,55)",
    accentBorder: "rgba(212,175,55,0.35)",
    description: "Build the future with tech & systems",
  },
  {
    key: "medicine",
    label: "Medicine & Health",
    icon: HeartPulse,
    gradient: "from-[rgba(34,197,94,0.2)] to-[rgba(34,197,94,0.04)]",
    iconColor: "rgb(74,222,128)",
    accentBorder: "rgba(74,222,128,0.3)",
    description: "Care for people, advance science",
  },
  {
    key: "business",
    label: "Business",
    icon: Briefcase,
    gradient: "from-[rgba(0,184,217,0.2)] to-[rgba(0,184,217,0.04)]",
    iconColor: "rgb(0,184,217)",
    accentBorder: "rgba(0,184,217,0.3)",
    description: "Lead markets & shape economies",
  },
  {
    key: "arts",
    label: "Arts & Design",
    icon: Palette,
    gradient: "from-[rgba(244,114,182,0.2)] to-[rgba(244,114,182,0.04)]",
    iconColor: "rgb(244,114,182)",
    accentBorder: "rgba(244,114,182,0.3)",
    description: "Create culture & visual worlds",
  },
  {
    key: "computer-science",
    label: "Computer Science",
    icon: Cpu,
    gradient: "from-[rgba(139,92,246,0.2)] to-[rgba(139,92,246,0.04)]",
    iconColor: "rgb(167,139,250)",
    accentBorder: "rgba(167,139,250,0.3)",
    description: "Code, AI, data & digital systems",
  },
  {
    key: "science",
    label: "Natural Sciences",
    icon: FlaskConical,
    gradient: "from-[rgba(251,146,60,0.2)] to-[rgba(251,146,60,0.04)]",
    iconColor: "rgb(251,146,60)",
    accentBorder: "rgba(251,146,60,0.3)",
    description: "Explore the physical world",
  },
  {
    key: "law",
    label: "Law",
    icon: Scale,
    gradient: "from-[rgba(148,163,184,0.15)] to-[rgba(148,163,184,0.03)]",
    iconColor: "rgb(148,163,184)",
    accentBorder: "rgba(148,163,184,0.25)",
    description: "Justice, policy & human rights",
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
  return (
    <section
      className="relative py-24 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgb(var(--bg-primary)) 0%, rgb(var(--bg-secondary)) 100%)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--grid),0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--grid),0.2) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-accent-tech">
            Discover Paths
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2
              className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
            >
              Explore by Field of Study
            </h2>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70 shrink-0"
              style={{ color: "rgb(212,175,55)" }}
            >
              All programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </m.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORY_CONFIG.map((category, index) => {
            const count = countProgramsByField(category.key);
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
                  className="group relative flex h-[160px] flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5"
                  style={{
                    background: "rgb(var(--bg-surface) / 0.86)",
                    border: "1.5px solid rgba(212,224,239,0.07)",
                    boxShadow: "0 4px 16px rgba(6, 16, 36, 0.12)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = category.accentBorder;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 28px rgba(0,0,0,0.3), 0 0 20px ${category.iconColor.replace('rgb(', 'rgba(').replace(')', ',0.08)')}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,224,239,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${category.gradient}`}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-auto">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                        style={{
                          background: `${category.iconColor.replace('rgb(', 'rgba(').replace(')', ',0.12)')}`,
                          border: `1px solid ${category.iconColor.replace('rgb(', 'rgba(').replace(')', ',0.2)')}`,
                        }}
                      >
                        <Icon className="w-5 h-5 transition-colors duration-300" style={{ color: category.iconColor }} />
                      </div>
                      <ArrowRight
                        className="w-4 h-4 opacity-30 group-hover:opacity-80 translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                        style={{ color: category.iconColor }}
                      />
                    </div>

                    <div className="mt-4">
                      <h3
                        className="text-[0.9rem] font-bold leading-tight transition-colors duration-300"
                        style={{ color: "rgb(var(--text-primary))" }}
                      >
                        {category.label}
                      </h3>
                      <p
                        className="mt-1 text-[11px] transition-colors duration-300"
                        style={{ color: "rgb(var(--text-muted))" }}
                      >
                        {count > 0 ? `${count.toLocaleString()} programs` : category.description}
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
