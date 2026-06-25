import { m } from "motion/react";
import { Link } from "react-router-dom";
import { FileSearch, School, FileCheck2, PlaneTakeoff, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

const STEPS = [
  {
    number: "01",
    key: "discover",
    icon: FileSearch,
    accentColor: "rgb(212,175,55)",
    accentBg: "rgba(212,175,55,0.1)",
    accentBorder: "rgba(212,175,55,0.25)",
  },
  {
    number: "02",
    key: "shortlist",
    icon: School,
    accentColor: "rgb(0,184,217)",
    accentBg: "rgba(0,184,217,0.1)",
    accentBorder: "rgba(0,184,217,0.25)",
  },
  {
    number: "03",
    key: "prepare",
    icon: FileCheck2,
    accentColor: "rgb(167,139,250)",
    accentBg: "rgba(167,139,250,0.1)",
    accentBorder: "rgba(167,139,250,0.25)",
  },
  {
    number: "04",
    key: "journey",
    icon: PlaneTakeoff,
    accentColor: "rgb(74,222,128)",
    accentBg: "rgba(74,222,128,0.1)",
    accentBorder: "rgba(74,222,128,0.25)",
  },
] as const;

export function HomeHowItWorks() {
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
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-[160px] opacity-10 pointer-events-none"
        style={{ width: 700, height: 300, background: "rgb(212,175,55)" }}
      />

      <div className="content-shell mx-auto px-[var(--content-gutter)] w-full relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "rgb(0,184,217)" }}>
            {t<string>("home.howItWorks.badge")}
          </p>
          <h2 className="text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-bold text-text-primary">
            {t<string>("home.howItWorks.title")}
          </h2>
        </m.div>

        {/* Desktop — horizontal timeline */}
        <div className="hidden lg:block relative mb-12">
          {/* Connector line */}
          <div
            className="absolute top-10 mx-auto pointer-events-none"
            style={{
              left: "12.5%",
              right: "12.5%",
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.3) 15%, rgba(212,175,55,0.3) 85%, transparent 100%)",
            }}
          />
          {/* Animated gold fill */}
          <m.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1.4, ease: "easeOut" }}
            className="absolute top-10 pointer-events-none"
            style={{
              left: "12.5%",
              right: "12.5%",
              height: "1px",
              background: "linear-gradient(90deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.2) 100%)",
              transformOrigin: "left",
            }}
          />

          <div className="grid grid-cols-4 gap-6 3xl:gap-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <m.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative text-center"
                >
                  {/* Icon circle */}
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center z-10 relative transition-all duration-300 hover:scale-105"
                    style={{
                      background: step.accentBg,
                      border: `2px solid ${step.accentBorder}`,
                      boxShadow: `0 0 0 6px rgb(var(--bg-primary)), 0 0 0 7px ${step.accentBorder}`,
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color: step.accentColor }} />
                  </div>

                  <p
                    className="text-xs font-bold tracking-widest mb-2"
                    style={{ color: step.accentColor }}
                  >
                    {t<string>("home.howItWorks.stepLabel").replace("{{number}}", step.number)}
                  </p>
                  <h3 className="text-lg font-bold mb-2 text-text-primary">
                    {t<string>(`home.howItWorks.steps.${step.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-disabled">
                    {t<string>(`home.howItWorks.steps.${step.key}.description`)}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>

        {/* Mobile — vertical cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden mb-12">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <m.div
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <div className="rounded-2xl p-6 h-full transition-all duration-300 surface-card">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: step.accentBg, border: `1px solid ${step.accentBorder}` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: step.accentColor }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest mb-1" style={{ color: step.accentColor }}>
                        {t<string>("home.howItWorks.stepLabel").replace("{{number}}", step.number)}
                      </p>
                      <h3 className="text-base font-bold mb-1 text-text-primary">
                        {t<string>(`home.howItWorks.steps.${step.key}.title`)}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-disabled">
                        {t<string>(`home.howItWorks.steps.${step.key}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.03] hover:shadow-xl btn-gold-primary"
          >
            {t<string>("globalCta.student.primary.low")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
