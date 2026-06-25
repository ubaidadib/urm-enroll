import { m, useReducedMotion } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { Handshake } from "lucide-react";
import { PARTNERS } from "@/data/partners";

export function GlobalPartnersMarquee() {
  const { t, dir } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  // Duplicate for seamless infinite loop
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <section
      className="relative overflow-hidden bg-linear-to-b from-bg-secondary to-bg-primary py-20 dark:from-bg-primary dark:to-bg-secondary"
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
          backgroundImage: "linear-gradient(rgba(var(--grid),0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--grid),0.2) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Header */}
      <div className={`max-w-7xl mx-auto px-6 mb-14 text-center ${dir === "rtl" ? "rtl-text" : ""}`}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/8 px-4 py-2"
        >
          <Handshake className="h-4 w-4 text-accent-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-accent-primary">
            {t<string>("globalPartners.badge")}
          </span>
        </m.div>

        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
        >
          {t<string>("globalPartners.title")}
        </m.h2>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary"
        >
          {t<string>("globalPartners.description")}
        </m.p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Edge fades */}
        <div
          className="absolute inset-y-0 left-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgb(var(--bg-primary)), transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgb(var(--bg-primary)), transparent)" }}
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
                className="shrink-0 px-8 py-5 rounded-2xl flex flex-col items-center justify-center gap-1.5 min-w-[180px] transition-all duration-300"
                style={{
                  background: "rgb(var(--bg-surface) / 0.86)",
                  border: "1.5px solid rgb(var(--border-default) / 0.75)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgb(var(--border-default) / 0.75)")}
              >
                <span className="text-xl font-bold tracking-tight text-text-primary">
                  {partner.name}
                </span>
                <span className="text-center text-[10px] font-semibold uppercase leading-tight tracking-wider text-text-muted">
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
