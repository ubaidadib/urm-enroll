import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import {
  MessageSquareText,
  GraduationCap,
  FileCheck,
  Plane,
  Home,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const STEP_VISUALS = [
  { icon: MessageSquareText, color: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/20" },
  { icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
  { icon: FileCheck, color: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/20" },
  { icon: Plane, color: "text-accent-tech", bg: "bg-accent-tech/10", ring: "ring-accent-tech/20" },
  { icon: Home, color: "text-rose-500", bg: "bg-rose-500/10", ring: "ring-rose-500/20" },
  { icon: Rocket, color: "text-teal-500", bg: "bg-teal-500/10", ring: "ring-teal-500/20" },
] as const;

export function StudentJourneySteps() {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const steps = (t("studentJourney.steps") as Array<{ title: string; description: string }>) || [];

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgb(5,10,24) 0%, rgb(8,14,28) 100%)" }}
      aria-labelledby="journey-heading"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-accent-tech/3 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 ${isRtl ? "rtl-text" : ""}`}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}
          >
            <Rocket className="w-4 h-4" style={{ color: "rgb(212,175,55)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgb(212,175,55)" }}>
              {t<string>("studentJourney.badge")}
            </span>
          </m.div>

          <m.h2
            id="journey-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: "rgb(248,250,252)" }}
          >
            {t<string>("studentJourney.title")}
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "rgb(145,177,210)" }}
          >
            {t<string>("studentJourney.description")}
          </m.p>
        </div>

        {/* Journey Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => {
            const visual = STEP_VISUALS[index % STEP_VISUALS.length] ?? STEP_VISUALS[0]!;
            const Icon = visual.icon;
            const stepNumber = String(index + 1).padStart(2, "0");

            return (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="group relative p-6 rounded-2xl transition-all duration-300"
                style={{ background: "rgba(15,28,52,0.7)", border: "1.5px solid rgba(212,175,55,0.1)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.1)")}
              >
                {/* Step number */}
                <div className={`absolute top-6 ${isRtl ? "left-6" : "right-6"} text-6xl font-black select-none`} style={{ color: "rgba(212,175,55,0.06)" }}>
                  {stepNumber}
                </div>

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl ${visual.bg} ring-1 ${visual.ring} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${visual.color}`} strokeWidth={1.75} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: "rgb(248,250,252)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgb(145,177,210)" }}>
                  {step.description}
                </p>

                {/* Connector dot (visible on lg for non-last items) */}
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 ${isRtl ? "-left-4" : "-right-4"} w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 z-20`} />
                )}
              </m.div>
            );
          })}
        </div>

        {/* CTA */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/contact"
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 ${isRtl ? "flex-row-reverse" : ""}`}
            style={{ background: "rgb(212,175,55)", color: "rgb(8,14,28)", boxShadow: "0 4px 20px rgba(212,175,55,0.25)" }}
          >
            <span>{t<string>("studentJourney.cta")}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
          </Link>
        </m.div>
      </div>
    </section>
  );
}
