import { m, useReducedMotion } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { Handshake } from "lucide-react";
import { PARTNERS } from "@/data/partners";

export function GlobalPartnersMarquee() {
  const { t, dir } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const items = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section
      className="relative overflow-hidden section-gradient page-section-y"
      aria-label={t<string>("globalPartners.badge")}
    >
      {/* Subtle gold glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ width: 500, height: 200, background: "rgb(212,175,55)" }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Header */}
      <div className={`max-w-7xl mx-auto px-3 sm:px-6 3xl:px-8 w-full mb-10 sm:mb-14 text-center ${dir === "rtl" ? "rtl-text" : ""}`}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}
        >
          <Handshake className="w-4 h-4" style={{ color: "rgb(212,175,55)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgb(212,175,55)" }}>
            {t<string>("globalPartners.badge")}
          </span>
        </m.div>

        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-text-primary"
        >
          {t<string>("globalPartners.title")}
        </m.h2>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg max-w-2xl mx-auto leading-relaxed text-text-muted"
        >
          {t<string>("globalPartners.description")}
        </m.p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Edge fades */}
        <div
          className="absolute inset-y-0 left-0 w-24 md:w-40 z-10 pointer-events-none marquee-fade-left"
        />
        <div
          className="absolute inset-y-0 right-0 w-24 md:w-40 z-10 pointer-events-none marquee-fade-right"
        />

        <div className="overflow-hidden">
          <m.div
            animate={
              shouldReduceMotion ? { x: 0 } : { x: dir === "rtl" ? ["0%", "50%"] : ["0%", "-50%"] }
            }
            transition={shouldReduceMotion ? undefined : { duration: 35, repeat: Infinity, ease: "linear" }}
            className={`flex gap-4 w-fit ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            {items.map((partner, index) => (
              <div
                key={index}
                className="shrink-0 px-8 py-5 rounded-2xl flex flex-col items-center justify-center gap-1.5 min-w-[180px] transition-all duration-300 surface-glass-subtle"
              >
                <span className="text-xl font-bold tracking-tight text-text-primary">
                  {partner.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-center leading-tight text-text-disabled">
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
