import { Link } from "react-router-dom";
import { m } from "motion/react";
import { ArrowRight, ShieldCheck, GraduationCap, Users } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

const AVATARS = ["NA", "MK", "YP", "AF", "LT"];

export function HomeFinalCtaBanner() {
  const { t } = useLanguage();

  const proofItems = [
    { icon: GraduationCap, text: t<string>("home.finalCta.socialProof") },
    { icon: Users, text: t<string>("home.finalCta.proofUniversities") },
    { icon: ShieldCheck, text: t<string>("home.finalCta.proofCountries") },
  ];

  return (
    <section
      className="relative page-section-y overflow-hidden section-gradient"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="content-shell mx-auto px-[var(--content-gutter)] w-full relative z-10">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16 surface-card-elevated"
        >
          {/* Blobs */}
          <div
            className="absolute -top-24 -right-24 rounded-full blur-3xl pointer-events-none"
            style={{ width: 320, height: 320, background: "rgba(212,175,55,0.1)" }}
          />
          <div
            className="absolute -bottom-24 -left-16 rounded-full blur-3xl pointer-events-none"
            style={{ width: 280, height: 280, background: "rgba(0,184,217,0.08)" }}
          />

          <div className="relative z-10 grid lg:grid-cols-[1fr_300px] 3xl:grid-cols-[1fr_420px] 4xl:grid-cols-[1fr_520px] gap-12 3xl:gap-16 items-center">
            {/* Left */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-5"
                style={{ color: "rgb(0,184,217)" }}
              >
                {t<string>("home.finalCta.badge")}
              </p>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 3xl:text-6xl font-bold tracking-tight leading-[1.08] mb-5 text-text-primary"
              >
                {t<string>("home.finalCta.titleLead")}{" "}
                <span style={{ color: "rgb(212,175,55)" }}>{t<string>("home.finalCta.titleHighlight")}</span>
              </h2>

              <p className="text-lg leading-relaxed mb-9 text-text-muted">
                {t<string>("home.finalCta.description")}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.03] hover:shadow-xl btn-gold-primary"
                >
                  {t<string>("home.finalCta.primaryCta")}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.01] btn-outline-subtle"
                >
                  {t<string>("home.finalCta.secondaryCta")}
                </Link>
              </div>
            </div>

            {/* Right — social proof card */}
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="rounded-2xl p-6 surface-glass-subtle"
            >
              {/* Avatar stack */}
              <div className="flex items-center mb-4">
                {AVATARS.map((avatar, index) => (
                  <span
                    key={avatar}
                    className="w-9 h-9 rounded-full border-2 border-bg-primary flex items-center justify-center text-xs font-bold text-accent-tech"
                    style={{
                      marginInlineStart: index === 0 ? 0 : -10,
                      background: "rgba(var(--accent-tech), 0.15)",
                    }}
                  >
                    {avatar}
                  </span>
                ))}
                <span className="ms-3 text-sm font-medium text-text-primary">
                  {t<string>("home.finalCta.othersCount")}
                </span>
              </div>

              {/* Proof items */}
              <div className="space-y-3">
                {proofItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 rounded-xl p-3 surface-inset"
                    >
                      <Icon className="w-4 h-4 shrink-0" style={{ color: "rgb(212,175,55)" }} />
                      <span className="text-xs text-text-muted">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
