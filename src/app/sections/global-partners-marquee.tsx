import { m, useReducedMotion } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { Handshake } from "lucide-react";
import { PARTNERS } from "@/data/partners";

export function GlobalPartnersMarquee() {
  const { t, dir } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  // Quadruple for seamless loop across wide viewports
  const items = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section
      className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-500 border-y border-slate-100 dark:border-slate-800"
      aria-label={t<string>("globalPartners.badge")}
    >
      {/* Header */}
      <div className={`max-w-7xl mx-auto px-6 mb-14 text-center ${dir === "rtl" ? "rtl-text" : ""}`}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full mb-6"
        >
          <Handshake className="w-4 h-4 text-accent-tech" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {t<string>("globalPartners.badge")}
          </span>
        </m.div>

        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
        >
          {t<string>("globalPartners.title")}
        </m.h2>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          {t<string>("globalPartners.description")}
        </m.p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Edge fade masks */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-linear-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <m.div
            animate={
              shouldReduceMotion
                ? { x: 0 }
                : { x: dir === "rtl" ? ["0%", "50%"] : ["0%", "-50%"] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 35, repeat: Infinity, ease: "linear" }
            }
            className={`flex gap-6 w-fit ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            {items.map((partner, index) => (
              <div
                key={index}
                className="shrink-0 px-10 py-6 rounded-2xl glass-card-light flex flex-col items-center justify-center gap-2 min-w-[190px] hover:border-accent-tech/30 transition-colors duration-300"
              >
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                  {partner.name}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center leading-tight">
                  {t<string>(`globalPartners.categories.${partner.category}`)}
                </span>
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
}
