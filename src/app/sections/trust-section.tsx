import { useEffect } from "react";
import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { Shield, Award, Globe2, CheckCircle, ExternalLink, BadgeCheck } from "lucide-react";

const TRUST_ITEMS = [
  {
    id: "gdpr",
    icon: Shield,
    accentClass: "text-[var(--color-accent-primary)]",
    glowClass: "bg-[color-mix(in_srgb,var(--color-accent-primary)_12%,transparent)]",
    borderClass: "border-[color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)]",
    title: "GDPR Compliant",
    description:
      "Your data is protected under the highest European privacy standards with end-to-end encryption.",
    badge: "Certified Protection",
  },
  {
    id: "global",
    icon: Globe2,
    accentClass: "text-[var(--color-accent-tech)]",
    glowClass: "bg-[color-mix(in_srgb,var(--color-accent-tech)_12%,transparent)]",
    borderClass: "border-[color-mix(in_srgb,var(--color-accent-tech)_20%,transparent)]",
    title: "Global Network",
    description:
      "Operating in 12+ countries with local expertise, multilingual support, and regional insights.",
    badge: "Worldwide Presence",
  },
] as const;

export function TrustSection() {
  const { t } = useLanguage();

  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://www-cdn.icef.com/scripts/iasbadgeid.js"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www-cdn.icef.com/scripts/iasbadgeid.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full blur-[120px] opacity-30"
        style={{ background: "var(--color-accent-tech)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
        style={{ background: "var(--color-accent-primary)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5
              bg-[color-mix(in_srgb,var(--color-accent-tech)_8%,transparent)]
              border-[color-mix(in_srgb,var(--color-accent-tech)_25%,transparent)]"
          >
            <BadgeCheck className="w-4 h-4 text-[var(--color-accent-tech)]" />
            <span className="text-sm font-semibold text-[var(--color-accent-tech)]">
              Trusted Worldwide
            </span>
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight"
          >
            {t("trust.title")}
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            {t("trust.subtitle")}
          </m.p>
        </m.div>

        {/* Bento grid: ICEF hero left, two stacked cards right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ICEF — hero card */}
          <m.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="group relative flex flex-col"
          >
            {/* glow halo */}
            <div
              className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-accent-tech) 30%, transparent), color-mix(in srgb, var(--color-accent-primary) 20%, transparent))",
              }}
            />
            <div className="glass-card-medium relative rounded-2xl p-6 flex flex-col gap-6 h-full border border-[color-mix(in_srgb,var(--color-accent-tech)_18%,transparent)] group-hover:border-[color-mix(in_srgb,var(--color-accent-tech)_35%,transparent)] transition-colors duration-300">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-accent-tech), var(--color-accent-primary))",
                      boxShadow: "0 8px 24px color-mix(in srgb, var(--color-accent-tech) 30%, transparent)",
                    }}
                  >
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-tech)] mb-0.5">
                      Gold Standard
                    </p>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                      ICEF IAS Accredited
                    </h3>
                  </div>
                </div>
                <span
                  className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-accent-tech), var(--color-accent-primary))",
                  }}
                >
                  #6507
                </span>
              </div>

              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Globally recognized quality standard for international student recruitment agencies — a mark of credibility trusted by universities and students across 120+ countries.
              </p>

              {/* Badge embed */}
              <div
                className="rounded-xl p-4 flex items-center justify-center min-h-[80px]"
                style={{
                  background: "color-mix(in srgb, var(--color-bg-secondary) 80%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-accent-tech) 15%, transparent)",
                }}
              >
                <span id="iasBadge" data-account-id="6507" />
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-center gap-2 text-[var(--color-accent-primary)]">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">IAS Member #6507</span>
                </div>
                <a
                  href="https://www.icef.com/agency/001bG00000AsuZ0QAJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-tech)] hover:underline underline-offset-2 transition-opacity duration-200 hover:opacity-80"
                >
                  View certificate
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </m.div>

          {/* Right column: GDPR + Global stacked */}
          <div className="flex flex-col gap-5">
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="group relative flex-1"
                >
                  <div className={`glass-card-light relative rounded-2xl p-6 h-full border ${item.borderClass} group-hover:border-opacity-40 transition-colors duration-300`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.glowClass}`}>
                        <Icon className={`w-5 h-5 ${item.accentClass}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                          {item.description}
                        </p>
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.accentClass}`}>
                          <CheckCircle className="w-3.5 h-3.5" />
                          {item.badge}
                        </div>
                      </div>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}