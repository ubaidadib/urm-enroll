import { m } from "motion/react";
import { Link } from "react-router-dom";
import { UNIVERSITIES } from "@/data/universities";
import { Wrench, HeartPulse, Briefcase, Palette, FlaskConical, Scale, Cpu, ArrowRight } from "lucide-react";

const CATEGORY_CONFIG = [
  {
    key: "engineering",
    label: "Engineering",
    icon: Wrench,
    accent: "from-[#0b1530] to-[#d4af37]",
    bg: "bg-slate-900",
    description: "Build the future with tech & systems",
  },
  {
    key: "medicine",
    label: "Medicine & Health",
    icon: HeartPulse,
    accent: "from-emerald-700 to-teal-500",
    bg: "bg-emerald-900",
    description: "Care for people, advance science",
  },
  {
    key: "business",
    label: "Business",
    icon: Briefcase,
    accent: "from-[#13295f] to-[#b48b1f]",
    bg: "bg-brand-navy-800",
    description: "Lead markets & shape economies",
  },
  {
    key: "arts",
    label: "Arts & Design",
    icon: Palette,
    accent: "from-rose-700 to-pink-500",
    bg: "bg-rose-900",
    description: "Create culture & visual worlds",
  },
  {
    key: "computer-science",
    label: "Computer Science",
    icon: Cpu,
    accent: "from-cyan-700 to-sky-500",
    bg: "bg-cyan-900",
    description: "Code, AI, data & digital systems",
  },
  {
    key: "science",
    label: "Natural Sciences",
    icon: FlaskConical,
    accent: "from-[#d4af37] to-[#0b1530]",
    bg: "bg-amber-900",
    description: "Explore the physical world",
  },
  {
    key: "law",
    label: "Law",
    icon: Scale,
    accent: "from-slate-700 to-slate-500",
    bg: "bg-slate-800",
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
    <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-accent-primary mb-3">
            Discover Paths
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore by Field of Study
            </h2>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-tech hover:text-accent-primary transition-colors shrink-0"
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
                transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/programs?field=${category.key}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 h-[160px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/30 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-linear-to-br ${category.accent} rounded-2xl`} />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-auto">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-white/70 translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <div className="mt-4">
                      <h3 className="text-[0.9rem] font-bold text-slate-900 dark:text-white group-hover:text-white transition-colors duration-300 leading-tight">
                        {category.label}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-white/80 transition-colors duration-300">
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
