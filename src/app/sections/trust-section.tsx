import { useEffect } from "react";
import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { Shield, Globe2, CheckCircle, ExternalLink, Award, Lock } from "lucide-react";

const TRUST_ITEMS = [
  {
    id: "gdpr",
    icon: Shield,
    iconColor: "rgb(0,184,217)",
    borderColor: "rgba(0,184,217,0.18)",
    glowColor: "rgba(0,184,217,0.08)",
    title: "GDPR Compliant",
    description:
      "Your data is protected under the highest European privacy standards with end-to-end encryption.",
    badge: "Certified Protection",
  },
  {
    id: "global",
    icon: Globe2,
    iconColor: "rgb(212,175,55)",
    borderColor: "rgba(212,175,55,0.18)",
    glowColor: "rgba(212,175,55,0.08)",
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
    <section
      className="relative py-24 px-6 overflow-hidden section-gradient"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ width: 600, height: 400, background: "rgb(212,175,55)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "rgb(0,184,217)" }}>
            Trusted Worldwide
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-text-primary">
            {t<string>("trust.title")}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-text-muted">
            {t<string>("trust.subtitle")}
          </p>
        </m.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ICEF hero card */}
          <m.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="group relative flex flex-col"
          >
            <div className="relative rounded-2xl p-7 flex flex-col gap-6 h-full transition-all duration-300 surface-card-elevated">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(0,184,217,0.15) 100%)",
                      border: "1px solid rgba(212,175,55,0.3)",
                    }}
                  >
                    <Award className="w-7 h-7" style={{ color: "rgb(212,175,55)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgb(212,175,55)" }}>
                      Gold Standard
                    </p>
                    <h3 className="text-xl font-bold text-text-primary">
                      ICEF IAS Accredited
                    </h3>
                  </div>
                </div>
                <span
                  className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(212,175,55,0.15)", color: "rgb(212,175,55)", border: "1px solid rgba(212,175,55,0.3)" }}
                >
                  #6507
                </span>
              </div>

              <p className="leading-relaxed text-text-muted">
                Globally recognized quality standard for international student recruitment agencies — a mark of credibility trusted by universities and students across 120+ countries.
              </p>

              {/* Badge embed */}
              <div className="rounded-xl p-4 flex items-center justify-center min-h-[80px] surface-inset">
                <span id="iasBadge" data-account-id="6507" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-center gap-2" style={{ color: "rgb(212,175,55)" }}>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">IAS Member #6507</span>
                </div>
                <a
                  href="https://www.icef.com/agency/001bG00000AsuZ0QAJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "rgb(0,184,217)" }}
                >
                  View certificate
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </m.div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="flex-1"
                >
                  <div className="relative rounded-2xl p-6 h-full transition-all duration-300 surface-card border-accent-tech/20 hover:border-accent-tech/40">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: item.glowColor, border: `1px solid ${item.borderColor}` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold mb-1.5 text-text-primary">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-3 text-text-muted">
                          {item.description}
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: item.iconColor }}>
                          <CheckCircle className="w-3.5 h-3.5" />
                          {item.badge}
                        </div>
                      </div>
                    </div>
                  </div>
                </m.div>
              );
            })}

            {/* Extra trust signal */}
            <m.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.54, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl p-6 transition-all duration-300 surface-card border-border/70">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(79,107,138,0.1)", border: "1px solid rgba(79,107,138,0.2)" }}
                  >
                    <Lock className="w-5 h-5" style={{ color: "rgb(79,107,138)" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1.5 text-text-primary">
                      UK-Incorporated Entity
                    </h3>
                    <p className="text-sm leading-relaxed mb-3 text-text-muted">
                      URM ENROLL LTD is a registered UK company operating under strict financial and regulatory oversight.
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgb(79,107,138)" }}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Companies House Registered
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
